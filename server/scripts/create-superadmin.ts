import { hash } from 'bcryptjs'
import { runQuery, initDatabase } from '../database/db'

async function createSuperAdminUser() {
  try {
    // Initialize database first
    await initDatabase()

    // Hash the password
    const passwordHash = await hash('password123', 10)

    // Insert or replace superadmin user
    await runQuery(
      'INSERT INTO users (username, email, password_hash, role, role_id) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = VALUES(email), password_hash = VALUES(password_hash), role = VALUES(role), role_id = VALUES(role_id)',
      ['superadmin', 'superadmin@stpaulusjuanda.org', passwordHash, 'super_admin', 1]
    )

    console.log('Super Admin user created/updated successfully!')
    console.log('Username: superadmin')
    console.log('Password: password123')
  } catch (error) {
    console.error('Error creating super admin user:', error)
  }
}

createSuperAdminUser()
