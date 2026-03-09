// Test mysql2 prepared statements
const mysql = require('mysql2/promise')

async function test() {
    const pool = mysql.createPool({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'pressgk31',
        database: 'stpaulus_cms_db',
        waitForConnections: true,
        connectionLimit: 10
    })

    try {
        const connection = await pool.getConnection()
        console.log('✅ Connected to MySQL')

        // Test 1: Query without params
        console.log('\n📝 Test 1: Query without params (no second argument)')
        try {
            const [rows1] = await connection.execute(
                'SELECT COUNT(*) as total FROM church_announcements WHERE is_active = 1'
            )
            console.log('✅ Success (no params):', rows1)
        } catch (err) {
            console.log('❌ Error (no params):', err.message)
        }

        // Test 2: Query without params but with empty array
        console.log('\n📝 Test 2: Query without params (with empty array [])')
        try {
            const [rows2] = await connection.execute(
                'SELECT COUNT(*) as total FROM church_announcements WHERE is_active = 1',
                []
            )
            console.log('✅ Success (empty array):', rows2)
        } catch (err) {
            console.log('❌ Error (empty array):', err.message)
        }

        // Test 3: Query with params
        console.log('\n📝 Test 3: Query with params [1, 0]')
        try {
            const [rows3] = await connection.execute(
                'SELECT id, title FROM church_announcements WHERE is_active = 1 LIMIT ? OFFSET ?',
                [1, 0]
            )
            console.log('✅ Success (with params):', rows3)
        } catch (err) {
            console.log('❌ Error (with params):', err.message)
        }

        // Test 4: Query with params using string concatenation (NOT SAFE - just for testing)
        console.log('\n📝 Test 4: Query with direct values (1, 0)')
        try {
            const [rows4] = await connection.execute(
                'SELECT id, title FROM church_announcements WHERE is_active = 1 LIMIT 1 OFFSET 0'
            )
            console.log('✅ Success (direct values):', rows4)
        } catch (err) {
            console.log('❌ Error (direct values):', err.message)
        }

        // Test 5: Try with query() instead of execute()
        console.log('\n📝 Test 5: Using query() instead of execute() with [1, 0]')
        try {
            const [rows5] = await connection.query(
                'SELECT id, title FROM church_announcements WHERE is_active = 1 LIMIT ? OFFSET ?',
                [1, 0]
            )
            console.log('✅ Success (query method):', rows5)
        } catch (err) {
            console.log('❌ Error (query method):', err.message)
        }

        connection.release()
        await pool.end()
    } catch (error) {
        console.error('Fatal error:', error.message)
        process.exit(1)
    }
}

test()
