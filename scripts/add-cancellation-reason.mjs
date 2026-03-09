import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'new_cms_user',
  password: process.env.MYSQL_PASSWORD || 'secure_app_password_2025',
  database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
})

try {
  console.log('🔍 Checking if cancellation_reason column exists...')
  
  const [columns] = await connection.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = ? 
    AND TABLE_NAME = 'bookings' 
    AND COLUMN_NAME = 'cancellation_reason'
  `, [process.env.MYSQL_DATABASE || 'stpaulus_cms_db'])
  
  if (columns.length > 0) {
    console.log('✅ Column cancellation_reason already exists')
  } else {
    console.log('➕ Adding cancellation_reason column...')
    await connection.query(`
      ALTER TABLE bookings 
      ADD COLUMN cancellation_reason TEXT NULL 
      AFTER rejection_reason
    `)
    console.log('✅ Column cancellation_reason added successfully')
  }
  
  console.log('\n📊 Current bookings table structure:')
  const [structure] = await connection.query('DESCRIBE bookings')
  console.table(structure)
  
} catch (error) {
  console.error('❌ Error:', error)
} finally {
  await connection.end()
  console.log('\n✅ Done!')
}
