const mysql = require('mysql2/promise')
require('dotenv').config()

async function checkPastorsTable() {
    const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
    })

    console.log('\n📋 Struktur Tabel pastors:\n')

    const [cols] = await conn.execute('DESCRIBE pastors')
    console.log('Field                | Type                           | Null | Key | Default')
    console.log('-'.repeat(90))

    cols.forEach(col => {
        const field = String(col.Field).padEnd(20)
        const type = String(col.Type).padEnd(30)
        const nullable = String(col.Null).padEnd(4)
        const key = String(col.Key).padEnd(3)
        const def = col.Default === null ? 'NULL' : String(col.Default)
        console.log(`${field} | ${type} | ${nullable} | ${key} | ${def}`)
    })

    await conn.end()
}

checkPastorsTable().catch(e => console.error('Error:', e.message))
