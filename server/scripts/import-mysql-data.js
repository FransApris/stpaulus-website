import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

// Load environment variables
config()

// MySQL configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
  multipleStatements: true
}

// Input file for imported data
const IMPORT_FILE = path.join(process.cwd(), 'server/database/sqlite-data-export.sql')

console.log('Starting MySQL data import...')

async function importData() {
  let connection

  try {
    // Connect to MySQL
    connection = await mysql.createConnection(mysqlConfig)
    console.log('Connected to MySQL database')

    // Read export file
    if (!fs.existsSync(IMPORT_FILE)) {
      throw new Error(`Import file not found: ${IMPORT_FILE}`)
    }

    const sqlContent = fs.readFileSync(IMPORT_FILE, 'utf8')
    console.log(`Read ${sqlContent.length} characters from export file`)

    // Split into individual statements (by semicolon, but be careful with content)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`Found ${statements.length} SQL statements to execute`)

    // Execute statements in batches
    const batchSize = 100
    let executedCount = 0

    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize)
      const batchSql = batch.join(';') + ';'

      try {
        await connection.execute(batchSql)
        executedCount += batch.length
        console.log(`Executed ${executedCount}/${statements.length} statements`)
      } catch (error) {
        console.error(`Error executing batch ${Math.floor(i/batchSize) + 1}:`, error.message)
        console.error('Failed SQL:', batchSql.substring(0, 500) + '...')
        // Continue with next batch instead of stopping
      }
    }

    console.log('\nData import completed successfully!')

  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('MySQL connection closed')
    }
  }
}

// Run the import
importData()
