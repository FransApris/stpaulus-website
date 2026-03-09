import { hash } from 'bcryptjs'
import { runQuery, getQuery, initDatabase } from '../database/db'
import { generateToken } from '../utils/auth'

async function createAdminKomsosUser() {
  try {
    // Initialize database first
    await initDatabase()

    // Check if admin_komsos role exists, if not create it
    let roleResult = await getQuery('SELECT id FROM roles WHERE name = ?', ['admin_komsos'])
    let roleId: number

    if (!roleResult) {
      // Create admin_komsos role
      const roleInsert = await runQuery(
        'INSERT INTO roles (name, display_name, description) VALUES (?, ?, ?)',
        ['admin_komsos', 'Admin Komsos', 'Administrator untuk komsos paroki']
      )
      roleId = roleInsert[0].insertId
      console.log('Created admin_komsos role with ID:', roleId)

      // Assign permissions to admin_komsos role
      const permissions = [
        'manage_gallery',
        'manage_articles'
      ]

      for (const permName of permissions) {
        // Get permission ID
        const permResult = await getQuery('SELECT id FROM permissions WHERE name = ?', [permName])
        if (permResult) {
          await runQuery(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
            [roleId, permResult.id]
          )
          console.log(`Assigned permission ${permName} to admin_komsos role`)
        }
      }
    } else {
      roleId = roleResult.id
      console.log('admin_komsos role already exists with ID:', roleId)
    }

    // Hash the password
    const passwordHash = await hash('password123', 10)

    // Check if admin_komsos user exists
    const existingUser = await getQuery('SELECT id FROM users WHERE username = ?', ['admin_komsos'])

    let userId: number
    if (!existingUser) {
      // Insert admin_komsos user
      const userInsert = await runQuery(
        'INSERT INTO users (username, email, password_hash, role, role_id, full_name) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin_komsos', 'komsos@stpaulusjuanda.org', passwordHash, 'admin_komsos', roleId, 'Admin Komsos']
      )
      userId = userInsert[0].insertId
      console.log('Created admin_komsos user with ID:', userId)
    } else {
      userId = existingUser.id
      console.log('admin_komsos user already exists with ID:', userId)
    }

    // Generate JWT token
    const token = generateToken(userId, 'admin_komsos')

    console.log('Admin Komsos user created/updated successfully!')
    console.log('Username: admin_komsos')
    console.log('Password: komsos123')
    console.log('Token:', token)

    return token
  } catch (error) {
    console.error('Error creating admin_komsos user:', error)
    throw error
  }
}

// Export for use in other scripts
export { createAdminKomsosUser }

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminKomsosUser()
    .then((token) => {
      console.log('\n=== TOKEN FOR TESTING ===')
      console.log(token)
      process.exit(0)
    })
    .catch((error) => {
      console.error('Failed to create admin_komsos user:', error)
      process.exit(1)
    })
}
