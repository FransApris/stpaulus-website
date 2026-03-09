import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
const envPath = path.join(__dirname, '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      const value = valueParts.join('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    }
  })
}

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'stpaulus'
}

async function listTables() {
  let connection
  
  try {
    console.log('Connecting to database...')
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Connected to database\n')
    
    // Get all tables
    const [tables] = await connection.query('SHOW TABLES')
    
    console.log('=== DAFTAR TABEL DI DATABASE ===\n')
    
    if (tables.length === 0) {
      console.log('Tidak ada tabel di database')
      return
    }
    
    const tableKey = Object.keys(tables[0])[0]
    
    console.log(`Total: ${tables.length} tabel\n`)
    
    for (const table of tables) {
      const tableName = table[tableKey]
      console.log(`📋 ${tableName}`)
      
      // Get row count
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``)
      const count = countResult[0].count
      console.log(`   └─ ${count} rows`)
    }
    
    console.log('\n=== TABEL YANG MUNGKIN BERISI DATA USER ===\n')
    
    const userTables = tables.filter(t => {
      const name = t[tableKey].toLowerCase()
      return name.includes('user') || name.includes('pengguna') || name.includes('admin')
    })
    
    if (userTables.length > 0) {
      for (const table of userTables) {
        const tableName = table[tableKey]
        console.log(`\n📌 ${tableName}`)
        
        // Get structure
        const [columns] = await connection.query(`DESCRIBE \`${tableName}\``)
        console.log('   Columns:')
        columns.forEach(col => {
          console.log(`   - ${col.Field} (${col.Type})`)
        })
        
        // Get sample data
        const [rows] = await connection.query(`SELECT * FROM \`${tableName}\` LIMIT 3`)
        console.log(`   Sample data (${rows.length} rows):`)
        rows.forEach((row, idx) => {
          console.log(`   \n   Row ${idx + 1}:`)
          Object.keys(row).forEach(key => {
            const value = key.toLowerCase().includes('password') ? '***' : row[key]
            console.log(`     ${key}: ${value}`)
          })
        })
      }
    } else {
      console.log('Tidak ada tabel dengan nama yang mengandung "user", "pengguna", atau "admin"')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

listTables()
