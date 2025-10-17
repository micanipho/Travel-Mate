// Test setup file
// This file runs before all tests

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only'

// Support both Supabase connection string and individual credentials
// For Supabase, use a test schema or test environment
if (process.env.TEST_DATABASE_URL) {
  // Use Supabase test environment
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
} else {
  // Fallback to local test database config
  process.env.DB_NAME = 'travel_mate_test'
  process.env.DB_HOST = process.env.DB_HOST || 'localhost'
  process.env.DB_PORT = process.env.DB_PORT || 5432
  process.env.DB_USER = process.env.DB_USER || 'postgres'
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || ''
}

// Test database configuration
const testDbConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000
} : {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  max: 5,
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
      clearCookie: jest.fn().mockReturnThis()
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
  // Skip complex setup for Supabase (database already exists)
  if (process.env.DATABASE_URL) {
    console.log('Using Supabase for tests - skipping local database creation')
    testPool = new Pool(testDbConfig)

    try {
      const client = await testPool.connect()
      console.log('Connected to Supabase test database')
      client.release()
      return true
    } catch (error) {
      console.error('Failed to connect to Supabase:', error.message)
      console.log('Set TEST_DATABASE_URL in .env for Supabase testing')
      return false
    }
  }

  // Local PostgreSQL setup (legacy)
  let adminPool = null

  // Skip database setup if no credentials provided
  if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.log('No database credentials provided - skipping database setup')
    return false
  }

  try {
    // Create connection to default postgres database first
    adminPool = new Pool({
      ...testDbConfig,
      database: 'postgres',
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 1000,
      max: 1
    })

    const timeoutPromise = new Promise((_resolve, reject) => {
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

    await adminPool.end()

    // Connect to test database
    testPool = new Pool(testDbConfig)
    const testClient = await testPool.connect()

    // Run migrations
    await runTestMigrations(testClient)

    testClient.release()
    console.log('Test database setup complete')
    return true
  } catch (error) {
    console.warn('Database setup failed:', error.message)
    console.log('Skipping database-dependent tests')

    if (adminPool) {
      try { await adminPool.end() } catch (e) { /* ignore */ }
    }
    return false
  }
}

const runTestMigrations = async (client) => {
  const migrationsDir = path.join(__dirname, '../migrations')

  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    for (const file of files) {
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      await client.query(sql)
      console.log(`Executed migration: ${file}`)
    }
  } catch (error) {
    console.warn('Migration error:', error.message)
  }
}

// Run setup before all tests
beforeAll(async () => {
  await setupTestDatabase()
}, 30000) // 30 second timeout for setup

// Clean up after all tests
afterAll(async () => {
  await global.testUtils.cleanupTestData()
  await global.testUtils.forceCleanup()
}, 10000)

module.exports = { testDbConfig }
