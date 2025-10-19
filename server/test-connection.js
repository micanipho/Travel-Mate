// Quick test script to verify Supabase connection
require('dotenv').config({ path: __dirname + '/.env' });
const { Pool } = require('pg');

console.log('Testing Supabase connection...');
console.log('Connection string (masked):', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connection successful!');

    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('Database:', result.rows[0].current_database);
    console.log('User:', result.rows[0].current_user);
    console.log('Version:', result.rows[0].version.split(' ')[0]);

    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nPlease verify in your Supabase dashboard:');
    console.error('1. Go to Project Settings → Database');
    console.error('2. Copy the "Connection string" (URI format)');
    console.error('3. Choose "Connection pooling" mode');
    console.error('4. Replace [YOUR-PASSWORD] with your actual database password');
    console.error('5. URL-encode special characters in password:');
    console.error('   @ becomes %40');
    console.error('   : becomes %3A');
    console.error('   / becomes %2F');
    console.error('   etc.');
    await pool.end();
    process.exit(1);
  }
}

testConnection();
