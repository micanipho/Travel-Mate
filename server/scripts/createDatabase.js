
const { Client } = require('pg');
require('dotenv').config();


const checkDatabaseExists = async (client, dbName) => {
  const result = await client.query(
    /* sql */'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );
  return result.rows.length > 0;
};

const createDatabase = async () => {
  const dbName = process.env.DB_NAME || 'travel_mate';

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    await handleDatabaseCreation(client, dbName);

  } catch (error) {
    console.error('Database operation failed:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
};

async function handleDatabaseCreation(client, dbName) {
  const exists = await checkDatabaseExists(client, dbName);

  if (exists) {
    console.log(`Database '${dbName}' already exists`);
  } else {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database '${dbName}' created successfully`);
  }
}

if (require.main === module) {
  createDatabase()
      .then(() => {
      console.log('Database creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database creation failed:', error);
      process.exit(1);
    });
}

module.exports = createDatabase;
