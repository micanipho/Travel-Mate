const { Pool } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Supabase database configuration
// Supports both direct connection and pooler connection
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  // Force IPv4 to avoid IPv6 connectivity issues
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 10000, // How long to wait for a connection (increased for cloud)
  // Force IPv4 by setting the family option
  ...(process.env.DATABASE_URL && {
    connectionString: process.env.DATABASE_URL,
    // Parse connection string and force IPv4
    options: '-c statement_timeout=10000'
  })
}

// Override DNS resolution to prefer IPv4
const dns = require('dns')
dns.setDefaultResultOrder('ipv4first')

// Create connection pool for Supabase
const pool = new Pool(dbConfig)

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// Database connection function
const connectDB = async () => {
  try {
    const client = await pool.connect()
    console.log('Supabase PostgreSQL connected successfully')
    const result = await client.query('SELECT version()')
    console.log('Database version:', result.rows[0].version)
    client.release()
    return true
  } catch (error) {
    console.error('Database connection error:', error.message)
    throw error
  }
}

// Health check function
const healthCheck = async () => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    return result.rows.length > 0
  } catch (error) {
    console.error('Database health check failed:', error.message)
    return false
  }
}

// Query function with error handling
const query = async (text, params) => {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start

    if (process.env.LOG_LEVEL === 'debug') {
      console.log('Executed query', { text, duration, rows: result.rowCount })
    }

    return result
  } catch (error) {
    console.error('Database query error:', error.message)
    throw error
  }
}

// Transaction helper function
const transaction = async (callback) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Transaction error:', error.message)
    throw error
  } finally {
    client.release()
  }
}

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end()
    console.log('Database pool closed successfully')
  } catch (error) {
    console.error('Error closing database pool:', error.message)
    throw error
  }
}

module.exports = {
  pool,
  connectDB,
  healthCheck,
  query,
  transaction,
  closePool
}
