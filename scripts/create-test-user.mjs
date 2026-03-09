import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const config = {
  host: 'localhost',
  port: 3306,
  user: 'new_cms_user',
  password: 'secure_app_password_2025',
  database: 'stpaulus_cms_db'
}

async function createTestUser() {
  const connection = await mysql.createConnection(config)
  
  try {
    // Hash password
    const passwordHash = await bcrypt.hash('testuser123', 10)
    
    // Create test user for booking (role_id = NULL, no admin access)
    const [result] = await connection.execute(`
      INSERT INTO users (username, email, password_hash, full_name, role, role_id, user_category, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    `, ['testuser', 'test@example.com', passwordHash, 'Test User', 'user', null, 'Lingkungan'])
    
    console.log('✅ Test user created successfully!')
    console.log('Username: testuser')
    console.log('Password: testuser123')
    console.log('Category: Lingkungan')
    console.log('Role: user (no admin access)')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await connection.end()
  }
}

createTestUser()
