// Check users table
const mysql = require('mysql2/promise')

async function checkUsers() {
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
        const [users] = await connection.execute(
            'SELECT id, username, full_name, role FROM users ORDER BY id LIMIT 10'
        )
        
        console.log('👥 Users in database:')
        users.forEach(u => {
            console.log(`  ID: ${u.id} | Username: ${u.username} | Name: ${u.full_name || 'N/A'} | Role: ${u.role}`)
        })
        
        connection.release()
        await pool.end()
    } catch (error) {
        console.error('Error:', error.message)
    }
}

checkUsers()
