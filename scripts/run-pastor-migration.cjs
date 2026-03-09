const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

async function runMigration() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
            multipleStatements: true
        })

        console.log('\n🔄 Running migration: Add birth and ordination fields to pastors...\n')

        const sqlFile = path.join(__dirname, '../migrations/007_add_pastor_birth_ordination_fields.sql')
        const sqlContent = fs.readFileSync(sqlFile, 'utf-8')

        await conn.query(sqlContent)

        console.log('✅ Migration completed successfully!\n')

        // Verify the changes
        const [cols] = await conn.execute('DESCRIBE pastors')
        console.log('📋 Updated table structure (new fields only):\n')

        const newFields = ['birth_place', 'birth_date', 'ordination_date']
        cols.filter(col => newFields.includes(col.Field)).forEach(col => {
            console.log(`  ✓ ${col.Field.padEnd(20)} | ${col.Type}`)
        })

        console.log('\n')

        await conn.end()
    } catch (error) {
        console.error('❌ Migration failed:', error.message)
        process.exit(1)
    }
}

runMigration()
