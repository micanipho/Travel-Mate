// Script to seed the database with sample data
const fs = require('fs')
const path = require('path')
const { query, transaction } = require('../config/database')

/**
 * Execute a SQL file
 * @param {string} filePath - Path to the SQL file
 * @returns {Promise<void>}
 */
const executeSqlFile = async (filePath) => {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8')

    const cleanContent = sqlContent.replace(/--.*$/gm, '').trim()
    if (!cleanContent) {
      console.log(`Skipping empty file: ${path.basename(filePath)}`)
      return
    }

    console.log(`Executing: ${path.basename(filePath)}`)
    await query(sqlContent)
    console.log(`✓ Successfully executed: ${path.basename(filePath)}`)
  } catch (error) {
    console.error(`✗ Error executing ${path.basename(filePath)}:`, error.message)
    throw error
  }
}

/**
 * Get all seed files in order
 * @returns {string[]} Array of seed file paths
 */
const getSeedFiles = () => {
  const seedsDir = path.join(__dirname, '../seeds')

  if (!fs.existsSync(seedsDir)) {
    throw new Error(`Seeds directory not found: ${seedsDir}`)
  }

  const files = fs.readdirSync(seedsDir)
    .filter(file => file.endsWith('.sql'))
    .sort() // This ensures files are executed in order (001_, 002_, etc.)
    .map(file => path.join(seedsDir, file))

  return files
}

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...\n')

  try {
    const seedFiles = getSeedFiles()

    if (seedFiles.length === 0) {
      console.log('No seed files found.')
      return
    }

    console.log(`Found ${seedFiles.length} seed files:`)
    seedFiles.forEach(file => {
      console.log(`  - ${path.basename(file)}`)
    })
    console.log('')

    await transaction(async (client) => {
      for (const seedFile of seedFiles) {
        await executeSqlFile(seedFile)
      }
    })

    console.log('\n🎉 Database seeding completed successfully!')

    await displaySeedingSummary()
  } catch (error) {
    console.error('\n💥 Database seeding failed:', error.message)
    throw error
  }
}

/**
 * Display a summary of seeded data
 */
const displaySeedingSummary = async () => {
  try {
    console.log('\n📊 Seeding Summary:')

    // Count users
    const usersResult = await query('SELECT COUNT(*) as count FROM users')
    console.log(`  Users: ${usersResult.rows[0].count}`)

    // Count destinations
    const destinationsResult = await query('SELECT COUNT(*) as count FROM monitored_destinations')
    console.log(`  Destinations: ${destinationsResult.rows[0].count}`)

    // Count alerts
    const alertsResult = await query('SELECT COUNT(*) as count FROM alerts')
    console.log(`  Alerts: ${alertsResult.rows[0].count}`)

    // Show alert breakdown by status
    const alertStatusResult = await query(`
      SELECT status, COUNT(*) as count
      FROM alerts
      GROUP BY status
      ORDER BY status
    `)

    if (alertStatusResult.rows.length > 0) {
      console.log('  Alert Status:')
      alertStatusResult.rows.forEach(row => {
        console.log(`    ${row.status}: ${row.count}`)
      })
    }

    // Show destination breakdown by risk level
    const riskLevelResult = await query(`
      SELECT risk_level, COUNT(*) as count
      FROM monitored_destinations
      GROUP BY risk_level
      ORDER BY risk_level
    `)

    if (riskLevelResult.rows.length > 0) {
      console.log('  Destinations by Risk Level:')
      riskLevelResult.rows.forEach(row => {
        console.log(`    Level ${row.risk_level}: ${row.count}`)
      })
    }
  } catch (error) {
    console.warn('Could not display seeding summary:', error.message)
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Database seeding failed:', error)
      process.exit(1)
    })
}

module.exports = seedDatabase
