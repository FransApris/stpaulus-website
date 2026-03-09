#!/usr/bin/env node

/**
 * Script to create parish statistics table and insert initial data
 * Run: node scripts/create-parish-statistics.mjs
 */

import mysql from 'mysql2/promise'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function createParishStatistics() {
    let connection

    try {
        // Get database config from environment or use defaults
        const dbConfig = {
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'pressgk31',
            database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
            multipleStatements: true
        }

        console.log('🔌 Connecting to database...')
        console.log(`   Host: ${dbConfig.host}`)
        console.log(`   Database: ${dbConfig.database}`)
        console.log(`   User: ${dbConfig.user}`)

        connection = await mysql.createConnection(dbConfig)
        console.log('✅ Connected to database\n')

        // Read migration file
        const migrationPath = join(__dirname, '..', 'server', 'database', 'migrations', '006_create_parish_statistics.sql')
        const sql = fs.readFileSync(migrationPath, 'utf8')

        console.log('📊 Running parish statistics migration...')

        // Execute the entire SQL at once with multipleStatements enabled
        await connection.query(sql)

        console.log('✅ Migration completed successfully!\n')

        // Verify data
        const [rows] = await connection.query(`
      SELECT stat_key, stat_value, stat_label, stat_subtitle, display_order 
      FROM parish_statistics 
      WHERE is_active = TRUE
      ORDER BY display_order
    `)

        console.log('📈 Current Parish Statistics:')
        console.log('─'.repeat(60))
        rows.forEach(row => {
            console.log(`  ${row.display_order}. ${row.stat_label}: ${row.stat_value}`)
            console.log(`     └─ ${row.stat_subtitle}`)
        })
        console.log('─'.repeat(60))
        console.log(`\n✅ Total: ${rows.length} statistics created\n`)

        // Check audit log table
        const [logCount] = await connection.query(`
      SELECT COUNT(*) as count FROM parish_statistics_log
    `)
        console.log(`📝 Audit log table created (${logCount[0].count} entries)`)

    } catch (error) {
        console.error('\n❌ Error:', error.message)
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n💡 Tip: Check your database credentials in .env or update the script')
        }
        process.exit(1)
    } finally {
        if (connection) {
            await connection.end()
            console.log('\n🔌 Database connection closed')
        }
    }
}

// Run the script
createParishStatistics()
