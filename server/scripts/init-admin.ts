import { hash } from 'bcryptjs'
import { runQuery, initDatabase } from '../database/db'

async function createAdminUser() {
  try {
    // Initialize database first
    await initDatabase()

    // Hash the password
    const passwordHash = await hash('admin123', 10)

    // Insert or replace admin user
    await runQuery(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = VALUES(email), password_hash = VALUES(password_hash), role = VALUES(role)',
      ['admin', 'admin@stpaulusjuanda.org', passwordHash, 'super_admin']
    )

    console.log('Admin user created/updated successfully!')
    console.log('Username: admin')
    console.log('Password: admin123')
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser()
