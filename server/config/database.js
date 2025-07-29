const { Pool } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'travel_mate',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000 // How long to wait for a connection
}

// Create connection pool
const pool = new Pool(dbConfig)

// Database connection function
const connectDB = async () => {
  try {
    const client = await pool.connect()
    console.log('PostgreSQL connected successfully')
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
    console.log('Executed query', { text, duration, rows: result.rowCount })
    return result
  } catch (error) {
    console.error('Database query error:', error.message)
    throw error
  }
}

// Transaction function
const transaction = async (callback) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end()
    console.log('Database pool closed')
  } catch (error) {
    console.error('Error closing database pool:', error.message)
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
