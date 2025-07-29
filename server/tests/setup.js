// Test setup file
// This file runs before all tests

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only'
process.env.DB_NAME = 'travel_mate_test'
process.env.DB_HOST = process.env.DB_HOST || 'localhost'
process.env.DB_PORT = process.env.DB_PORT || 5432
process.env.DB_USER = process.env.DB_USER || 'postgres'
process.env.DB_PASSWORD = process.env.DB_PASSWORD || ''

// Test database configuration
const testDbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '', // Ensure password is always a string
  max: 5, // Smaller pool for tests
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000
}

// Create test database pool
let testPool = null

// Global test utilities
global.testUtils = {
  // Test data factories
  createTestUser: (overrides = {}) => ({
    email: 'test@example.com',
    password: 'TestPassword123',
    firstName: 'John',
    lastName: 'Doe',
    notificationEnabled: true,
    preferredLanguage: 'en',
    ...overrides
  }),

  createTestDestination: (overrides = {}) => ({
    location: 'Test Location',
    riskLevel: 3,
    latitude: -26.2041,
    longitude: 28.0473,
    ...overrides
  }),

  createTestAlert: (overrides = {}) => ({
    title: 'Test Alert',
    message: 'This is a test alert message',
    priority: 'medium',
    status: 'unread',
    ...overrides
  }),

  // Mock HTTP request/response objects
  createMockReq: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    user: null,
    headers: {},
    ...overrides
  }),

  createMockRes: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    }
    return res
  },

  // Database utilities
  getTestPool: () => testPool,

  // Clean up test data
  cleanupTestData: async () => {
    if (!testPool) return

    try {
      // Clean up in reverse order of dependencies
      await testPool.query('DELETE FROM alerts WHERE title LIKE \'%test%\' OR title LIKE \'%Test%\'')
      await testPool.query('DELETE FROM monitored_destinations WHERE location LIKE \'%test%\' OR location LIKE \'%Test%\'')
      await testPool.query('DELETE FROM users WHERE email LIKE \'%test%\' OR email LIKE \'%example.com\'')
      console.log('Test data cleaned up successfully')
    } catch (error) {
      console.warn('Warning: Could not clean up test data:', error.message)
    }
  },

  // Force close all connections
  forceCleanup: async () => {
    if (testPool) {
      try {
        await testPool.end()
        testPool = null
      } catch (error) {
        console.warn('Warning during force cleanup:', error.message)
      }
    }
  }
}

// Database setup functions
const setupTestDatabase = async () => {
  let adminPool = null
  let testClient = null

  // Skip database setup if no credentials provided
  if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    return false
  }

  try {
    // Create connection to default postgres database first with timeout
    adminPool = new Pool({
      ...testDbConfig,
      database: 'postgres', // Connect to default database
      connectionTimeoutMillis: 2000, // 2 second timeout
      idleTimeoutMillis: 1000,
      max: 1 // Only one connection for setup
    })

    // Add timeout wrapper for database operations
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 3000)
    })

    // Check if test database exists, create if not
    const dbCheckResult = await Promise.race([
      adminPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [process.env.DB_NAME]),
      timeoutPromise
    ])

    if (dbCheckResult.rows.length === 0) {
      console.log(`Creating test database: ${process.env.DB_NAME}`)
      await Promise.race([
        adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`),
        timeoutPromise
      ])
    }

    // Close admin pool properly
    await adminPool.end()
    adminPool = null

    // Now connect to the test database with timeout
    testPool = new Pool({
      ...testDbConfig,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 1000,
      max: 2 // Small pool for tests
    })

    // Test the connection with timeout
    testClient = await Promise.race([
      testPool.connect(),
      timeoutPromise
    ])

    await Promise.race([
      testClient.query('SELECT NOW()'),
      timeoutPromise
    ])

    testClient.release()
    testClient = null

    console.log('Test database connection established')
    return true
  } catch (error) {
    // Only log database errors in verbose mode
    if (process.env.VERBOSE_TESTS) {
      console.error('Failed to setup test database:', error.message)
    }

    // Cleanup all connections
    if (testClient) {
      try {
        testClient.release()
      } catch (e) { /* ignore */ }
    }

    if (adminPool) {
      try {
        await adminPool.end()
      } catch (e) { /* ignore */ }
    }

    if (testPool) {
      try {
        await testPool.end()
        testPool = null
      } catch (e) { /* ignore */ }
    }

    return false
  }
}

const runMigrations = async () => {
  if (!testPool) {
    console.warn('No test database connection available for migrations')
    return false
  }

  try {
    const migrationsDir = path.join(__dirname, '../migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    console.log(`Running ${migrationFiles.length} migrations...`)

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file)
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

      console.log(`Running migration: ${file}`)
      await testPool.query(migrationSQL)
    }

    console.log('All migrations completed successfully')
    return true
  } catch (error) {
    console.error('Migration failed:', error.message)
    return false
  }
}

// Seed test data
const seedTestData = async () => {
  if (!testPool) return false

  try {
    // Insert some basic test data that can be used across tests
    console.log('Seeding test data...')

    // Create a test user for integration tests
    const testUserExists = await testPool.query(
      'SELECT id FROM users WHERE email = $1',
      ['integration.test@example.com']
    )

    if (testUserExists.rows.length === 0) {
      await testPool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, notification_enabled, preferred_language)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'integration.test@example.com',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO9G', // hashed 'password123'
        'Integration',
        'Test',
        true,
        'en'
      ])
    }

    console.log('Test data seeded successfully')
    return true
  } catch (error) {
    console.error('Failed to seed test data:', error.message)
    return false
  }
}

// Test setup hooks
beforeAll(async () => {
  console.log('🧪 Setting up test environment...')

  try {
    // Setup test database
    const dbSetup = await setupTestDatabase()
    if (dbSetup) {
      // Run migrations
      const migrationsSuccess = await runMigrations()
      if (migrationsSuccess) {
        // Seed test data
        await seedTestData()
        console.log('✅ Test environment setup complete with database')
      } else {
        if (process.env.VERBOSE_TESTS) {
          console.warn('⚠️ Migrations failed, running tests with mocked database only')
        }
      }
    } else {
      if (process.env.VERBOSE_TESTS) {
        console.warn('⚠️ Database setup failed, running tests with mocked database only')
      }
    }
  } catch (error) {
    if (process.env.VERBOSE_TESTS) {
      console.warn('⚠️ Test database setup error:', error.message)
      console.warn('⚠️ Running tests with mocked database only')
    }
  }

  console.log('✅ Test environment initialized')
}, 30000) // 30 second timeout for setup

afterAll(async () => {
  console.log('🧹 Cleaning up test environment...')

  try {
    // Clean up test data
    await global.testUtils.cleanupTestData()

    // Close database connections with timeout
    if (testPool) {
      const closePromise = testPool.end()
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000))

      await Promise.race([closePromise, timeoutPromise])
      testPool = null
      console.log('Test database connection closed')
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }

    console.log('✅ Test environment cleanup complete')

    // Force exit after a short delay
    setTimeout(() => {
      process.exit(0)
    }, 100)

  } catch (error) {
    console.warn('Warning during cleanup:', error.message)
    // Force exit even on error
    setTimeout(() => {
      process.exit(0)
    }, 100)
  }
}, 5000) // 5 second timeout for cleanup

// Global error handlers for tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

// Set longer timeout for all tests
jest.setTimeout(10000)

// Configure Jest to handle async operations properly
if (typeof afterEach !== 'undefined') {
  afterEach(async () => {
    // Clear any pending timers
    jest.clearAllTimers()

    // Wait for any pending promises to resolve
    await new Promise(resolve => setImmediate(resolve))
  })
}

if (process.env.VERBOSE_TESTS) {
  console.log('🚀 Test environment initialized')
  console.log(`📊 Database: ${process.env.DB_NAME}`)
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not Set'}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
}
