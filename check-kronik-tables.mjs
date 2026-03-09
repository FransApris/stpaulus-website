// Check if kronik tables exist
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stpaulus'
})

try {
    console.log('Checking kronik tables...')

    const [tables] = await connection.query("SHOW TABLES LIKE 'kronik_%'")
    console.log('Kronik tables found:', tables.length)
    console.log(tables)

    if (tables.length === 0) {
        console.log('\n❌ No kronik tables found!')
        console.log('📋 Please run migration: migrations/020_create_kronik_system.sql')
    } else {
        console.log('\n✅ Kronik tables exist')

        // Check kronik_entries structure
        const [entries] = await connection.query('SELECT COUNT(*) as count FROM kronik_entries')
        console.log('kronik_entries count:', entries[0].count)
    }
} catch (error) {
    console.error('Error:', error.message)
} finally {
    await connection.end()
}
