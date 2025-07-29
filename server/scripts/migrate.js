// Script to run database migrations
const fs = require('fs');
const path = require('path');
const { query, transaction } = require('../config/database');

const createMigrationsTable = async () => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) UNIQUE NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await query(createTableSQL);
        console.log('Migration tracking table ready');
    } catch (error) {
        console.error('Failed to create migrations table:', error.message);
        throw error;
    }
};

const getMigrationFiles = () => {
    const migrationsDir = path.join(__dirname, '../migrations');

    try {
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // This ensures 001_, 002_, 003_ order

        console.log(`Found ${files.length} migration files:`, files);
        return files;
    } catch (error) {
        console.error('Failed to read migrations directory:', error.message);
        throw error;
    }
};

const getExecutedMigrations = async () => {
    try {
        const result = await query('SELECT filename FROM schema_migrations ORDER BY executed_at');
        const executedFiles = result.rows.map(row => row.filename);
        console.log(`${executedFiles.length} migrations already executed:`, executedFiles);
        return executedFiles;
    } catch (error) {
        console.error('Failed to get executed migrations:', error.message);
        throw error;
    }
};

const executeMigration = async (filename) => {
    const migrationPath = path.join(__dirname, '../migrations', filename);

    try {
        // Read the SQL file
        const sqlContent = fs.readFileSync(migrationPath, 'utf8');
        console.log(`Executing migration: ${filename}`);

        // Execute migration in a transaction
        await transaction(async (client) => {
            // Execute the migration SQL
            await client.query(sqlContent);

            // Record the migration as completed
            await client.query(
                'INSERT INTO schema_migrations (filename) VALUES ($1)',
                [filename]
            );
        });

        console.log(`✅ Migration ${filename} completed successfully`);
    } catch (error) {
        console.error(`❌ Migration ${filename} failed:`, error.message);
        throw error;
    }
};

const runMigrations = async () => {
    try {
        console.log('Starting database migrations...');

        await createMigrationsTable();

        const migrationFiles = getMigrationFiles();

        if (migrationFiles.length === 0) {
            console.log('No migration files found');
            return;
        }

        const executedMigrations = await getExecutedMigrations();

        const pendingMigrations = migrationFiles.filter(
            file => !executedMigrations.includes(file)
        );

        if (pendingMigrations.length === 0) {
            console.log('All migrations are up to date');
            return;
        }

        console.log(`Found ${pendingMigrations.length} pending migrations:`, pendingMigrations);

        for (const migration of pendingMigrations) {
            await executeMigration(migration);
        }

        console.log(`🎉 Successfully executed ${pendingMigrations.length} migrations`);

    } catch (error) {
        console.error('Migration process failed:', error.message);
        throw error;
    }
};

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations;
