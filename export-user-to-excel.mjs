import mysql from 'mysql2/promise'
import XLSX from 'xlsx'
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
  console.log('✅ .env file loaded')
} else {
  console.log('⚠️ .env file not found, using default values')
}

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'stpaulus'
}

console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? '***SET***' : '***NOT SET***'
})

async function exportUserToExcel() {
  let connection
  
  try {
    console.log('Connecting to database...')
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Connected to database')
    
    // Get table structure
    console.log('\n=== STRUKTUR TABEL USERS ===')
    const [columns] = await connection.query('DESCRIBE users')
    console.log('\nFields:')
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`)
    })
    
    // Get all user data (exclude password_hash for security)
    console.log('\n=== MENGAMBIL DATA USERS ===')
    const [users] = await connection.query(`
      SELECT id, username, email, role, role_id, full_name, 
             contact_phone, user_category, unit_name, 
             created_at, updated_at, organization_type, organization_id
      FROM users
      ORDER BY id
    `)
    console.log(`Total users: ${users.length}`)
    
    if (users.length === 0) {
      console.log('⚠️ Tidak ada data user untuk di-export')
      return
    }
    
    // Show sample data
    console.log('\nSample data (first 3 users):')
    users.slice(0, 3).forEach((user, idx) => {
      console.log(`\nUser ${idx + 1}:`)
      Object.keys(user).forEach(key => {
        console.log(`  ${key}: ${user[key]}`)
      })
    })
    
    // Create workbook
    const ws = XLSX.utils.json_to_sheet(users)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Users')
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `user_data_${timestamp}.xlsx`
    const filepath = path.join(process.cwd(), filename)
    
    // Write to file
    XLSX.writeFile(wb, filepath)
    
    console.log(`\n✅ Data berhasil di-export ke: ${filename}`)
    console.log(`📁 Full path: ${filepath}`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('Tabel "users" tidak ditemukan di database')
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Tidak dapat terhubung ke MySQL. Pastikan MySQL berjalan.')
    }
  } finally {
    if (connection) {
      await connection.end()
      console.log('\nDatabase connection closed')
    }
  }
}

// Run the export
exportUserToExcel()
