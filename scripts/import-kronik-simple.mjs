#!/usr/bin/env node
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

console.log('========================================')
console.log('  Kronik System Database Migration')
console.log('========================================')
console.log('')

try {
  // Prompt for database credentials
  console.log('Please enter your MySQL credentials:')
  console.log('(Press Enter to use default values)')
  console.log('')

  const host = await question('MySQL Host [localhost]: ') || 'localhost'
  const port = await question('MySQL Port [3306]: ') || '3306'
  const user = await question('MySQL User [root]: ') || 'root'
  const password = await question('MySQL Password (if any): ')
  const database = await question('Database Name [stpaulus_cms_db]: ') || 'stpaulus_cms_db'

  console.log('')
  console.log('Connecting to database...')

  const dbConfig = {
    host,
    port: parseInt(port),
    user,
    password: password || undefined, // Don't send empty string
    database,
    multipleStatements: true
  }

  const connection = await mysql.createConnection(dbConfig)
  console.log('✓ Connected successfully')
  console.log('')

  // Read SQL migration file
  const sqlFile = join(__dirname, '..', 'migrations', '020_create_kronik_system_fixed.sql')
  console.log('Reading migration file...')
  
  const sqlContent = readFileSync(sqlFile, 'utf8')
  console.log(`✓ File loaded (${sqlContent.length} bytes)`)
  console.log('')

  // Execute migration
  console.log('Executing migration...')
  await connection.query(sqlContent)
  console.log('✓ Migration executed')
  console.log('')

  // Verify tables
  console.log('Verifying tables...')
  const [tables] = await connection.query("SHOW TABLES LIKE 'kronik_%'")
  
  if (tables.length > 0) {
    console.log(`✓ Found ${tables.length} kronik tables:`)
    tables.forEach((row) => {
      const tableName = Object.values(row)[0]
      console.log(`  - ${tableName}`)
    })
  }
  console.log('')

  // Check data
  const [categories] = await connection.query('SELECT COUNT(*) as count FROM kronik_categories')
  const [sections] = await connection.query('SELECT COUNT(*) as count FROM kronik_sections')

  console.log('📊 Data Summary:')
  console.log(`  Categories: ${categories[0].count}`)
  console.log(`  Sections: ${sections[0].count}`)
  console.log('')

  await connection.end()

  console.log('✅ Migration completed successfully!')
  console.log('')
  console.log('Next steps:')
  console.log('  1. Restart your Nuxt dev server (Ctrl+C then npm run dev)')
  console.log('  2. Test the kronik system features')
  console.log('')

} catch (error) {
  console.error('')
  console.error('❌ Migration failed!')
  console.error('')
  console.error('Error:', error.message)
  console.error('')
  
  if (error.code === 'EACCES' || error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('💡 Access denied. Please check:')
    console.error('   - MySQL username and password are correct')
    console.error('   - User has permission to access the database')
  } else if (error.code === 'ECONNREFUSED') {
    console.error('💡 Connection refused. Please check:')
    console.error('   - MySQL server is running')
    console.error('   - Port 3306 is correct')
  } else if (error.code === 'ENOENT') {
    console.error('💡 Migration file not found')
  }
  
  process.exit(1)
} finally {
  rl.close()
}
