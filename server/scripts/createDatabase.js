// This script is deprecated when using Supabase
// Supabase databases are created automatically when you create a project
// Keep this file for reference only if migrating from local PostgreSQL

console.log('⚠️  This script is not needed when using Supabase')
console.log('Your Supabase database is already created and ready to use.')
console.log('')
console.log('To set up your database:')
console.log('1. Create a Supabase account at https://supabase.com')
console.log('2. Create a new project')
console.log('3. Get your connection string from Project Settings → Database')
console.log('4. Add it to server/.env as DATABASE_URL')
console.log('5. Run: npm run db:migrate')
console.log('')
console.log('For detailed instructions, see SUPABASE_SETUP.md')
console.log('')
process.exit(0)

// Legacy code below - kept for reference
/*
const { Client } = require('pg')
require('dotenv').config()

const checkDatabaseExists = async (client, dbName) => {
  const result = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  )
  return result.rows.length > 0
}

const createDatabase = async () => {
  const dbName = process.env.DB_NAME || 'travel_mate'

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  })

  try {
    await client.connect()
    console.log('Connected to PostgreSQL server')

    await handleDatabaseCreation(client, dbName)
  } catch (error) {
    console.error('Database operation failed:', error.message)
    throw error
  } finally {
    await client.end()
    console.log('Database connection closed')
  }
}

async function handleDatabaseCreation (client, dbName) {
  const exists = await checkDatabaseExists(client, dbName)

  if (exists) {
    console.log(`Database '${dbName}' already exists`)
  } else {
    await client.query(`CREATE DATABASE "${dbName}"`)
    console.log(`Database '${dbName}' created successfully`)
  }
}

if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('Database creation completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('Failed to create database:', error)
      process.exit(1)
    })
}

module.exports = { createDatabase }
*/
