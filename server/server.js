const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const crypto = require('crypto')
require('dotenv').config()

const { connectDB, healthCheck } = require('./config/database')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const destinationRoutes = require('./routes/destinations')
const alertRoutes = require('./routes/alerts')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3000

// Generate request ID for better tracing (Node.js v22+ crypto performance)
const generateRequestId = () => crypto.randomUUID()

// Request ID middleware for better debugging
app.use((req, res, next) => {
  req.id = generateRequestId()
  res.setHeader('X-Request-ID', req.id)
  next()
})

// Security middleware (Enhanced for Node.js v22+)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// General middleware (Optimized for Node.js v22+)
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false
    return compression.filter(req, res)
  }
}))

// Enhanced logging with request ID
app.use(morgan(':method :url :status :res[content-length] - :response-time ms [:req[x-request-id]]'))

app.use(express.json({
  limit: process.env.MAX_FILE_SIZE || '10mb',
  strict: true
}))
app.use(express.urlencoded({
  extended: true,
  limit: process.env.MAX_FILE_SIZE || '10mb'
}))

// Enhanced health check endpoint with Node.js v22+ features
app.get('/api/health', async (req, res) => {
  try {
    const startTime = process.hrtime.bigint()
    const dbStatus = await healthCheck()
    const endTime = process.hrtime.bigint()
    const dbResponseTime = Number(endTime - startTime) / 1000000 // Convert to milliseconds

    const memoryUsage = process.memoryUsage()

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      requestId: req.id,
      database: {
        status: dbStatus ? 'Connected' : 'Disconnected',
        responseTime: `${dbResponseTime.toFixed(2)}ms`
      },
      system: {
        nodeVersion: process.version,
        uptime: `${Math.floor(process.uptime())}s`,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        }
      },
      version: '1.0.0'
    })
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      requestId: req.id,
      database: 'Error',
      error: error.message
    })
  }
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/destinations', destinationRoutes)
app.use('/api/alerts', alertRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
})

// Error handling middleware
app.use(errorHandler)

// Enhanced server startup with Node.js v22+ features
const startServer = async () => {
  try {
    // Initialize database connection
    await connectDB()
    console.log('✅ Database connected successfully')

    const server = app.listen(PORT, () => {
      console.log(`🚀 Travel Mate Backend Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
      console.log(`📊 Node.js version: ${process.version}`)
      console.log(`💾 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`)
    })

    // Enhanced server configuration for Node.js v22+
    server.keepAliveTimeout = 65000
    server.headersTimeout = 66000

    return server
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Enhanced graceful shutdown for Node.js v22+
let server

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`)

  if (server) {
    server.close((err) => {
      if (err) {
        console.error('❌ Error during server shutdown:', err)
        process.exit(1)
      }
      console.log('✅ Server closed successfully')
      process.exit(0)
    })

    // Force close after 30 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout')
      process.exit(1)
    }, 30000)
  } else {
    process.exit(0)
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions and unhandled rejections (Node.js v22+ enhanced)
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  gracefulShutdown('UNCAUGHT_EXCEPTION')
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown('UNHANDLED_REJECTION')
})

// Start the server
startServer().then((serverInstance) => {
  server = serverInstance
})

module.exports = app
