// Import kronik system SQL migration using Node.js and existing DB connection
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('========================================')
console.log('  Kronik System Database Migration')
console.log('========================================')
console.log('')

// Database config from environment (same as Nuxt config)
const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
    multipleStatements: true
}

console.log('📊 Database Config:')
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`)
console.log(`   User: ${dbConfig.user}`)
console.log(`   Database: ${dbConfig.database}`)
console.log('')

try {
    // Read SQL migration file
    const sqlFile = join(__dirname, '..', 'migrations', '020_create_kronik_system_fixed.sql')
    console.log('📄 Reading migration file...')
    console.log(`   ${sqlFile}`)

    const sqlContent = readFileSync(sqlFile, 'utf8')
    console.log(`   ✓ File loaded (${sqlContent.length} bytes)`)
    console.log('')

    // Connect to database
    console.log('🔌 Connecting to database...')
    const connection = await mysql.createConnection(dbConfig)
    console.log('   ✓ Connected successfully')
    console.log('')

    // Execute migration
    console.log('⚙️  Executing migration...')
    await connection.query(sqlContent)
    console.log('   ✓ Migration executed successfully')
    console.log('')

    // Verify tables created
    console.log('🔍 Verifying tables...')
    const [tables] = await connection.query("SHOW TABLES LIKE 'kronik_%'")

    if (tables.length > 0) {
        console.log(`   ✓ Found ${tables.length} kronik tables:`)
        tables.forEach((row) => {
            const tableName = Object.values(row)[0]
            console.log(`     - ${tableName}`)
        })
    } else {
        console.log('   ⚠️  No kronik tables found!')
    }
    console.log('')

    // Check data
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM kronik_categories')
    const [sections] = await connection.query('SELECT COUNT(*) as count FROM kronik_sections')

    console.log('📊 Data Summary:')
    console.log(`   Categories: ${categories[0].count}`)
    console.log(`   Sections: ${sections[0].count}`)
    console.log('')

    await connection.end()

    console.log('✅ Migration completed successfully!')
    console.log('')
    console.log('You can now use the Kronik management feature!')
    console.log('Refresh your browser and try again.')

} catch (error) {
    console.error('')
    console.error('❌ Migration failed!')
    console.error('')
    console.error('Error:', error.message)

    if (error.code === 'ENOENT') {
        console.error('')
        console.error('💡 The migration file was not found.')
        console.error('   Expected location: migrations/020_create_kronik_system_fixed.sql')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('')
        console.error('💡 Database access denied. Please check your credentials.')
        console.error('   Set environment variables or update the script.')
    } else if (error.errno) {
        console.error('')
        console.error(`💡 Database error code: ${error.errno}`)
        console.error(`   SQL State: ${error.sqlState || 'N/A'}`)
    }

    console.error('')
    process.exit(1)
}
