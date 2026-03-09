import { hash } from 'bcryptjs'
import { runQuery, getQuery, initDatabase } from '../database/db'
import { generateToken } from '../utils/auth'

async function createAdminSekretariatUser() {
  try {
    // Initialize database first
    await initDatabase()

    // Check if admin_sekretariat role exists, if not create it
    let roleResult = await getQuery('SELECT id FROM roles WHERE name = ?', ['admin_sekretariat'])
    let roleId: number

    if (!roleResult) {
      // Create admin_sekretariat role
      const roleInsert = await runQuery(
        'INSERT INTO roles (name, display_name, description) VALUES (?, ?, ?)',
        ['admin_sekretariat', 'Admin Sekretariat', 'Administrator untuk sekretariat paroki']
      )
      roleId = roleInsert[0].insertId
      console.log('Created admin_sekretariat role with ID:', roleId)

      // Assign permissions to admin_sekretariat role
      const permissions = [
        'manage_rooms',
        'manage_bookings',
        'manage_users_komsos_sekretariat'
      ]

      for (const permName of permissions) {
        // Get permission ID
        const permResult = await getQuery('SELECT id FROM permissions WHERE name = ?', [permName])
        if (permResult) {
          await runQuery(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
            [roleId, permResult.id]
          )
          console.log(`Assigned permission ${permName} to admin_sekretariat role`)
        }
      }
    } else {
      roleId = roleResult.id
      console.log('admin_sekretariat role already exists with ID:', roleId)
    }

    // Hash the password
    const passwordHash = await hash('sekretariat123', 10)

    // Check if admin_sekretariat user exists
    const existingUser = await getQuery('SELECT id FROM users WHERE username = ?', ['admin_sekretariat'])

    let userId: number
    if (!existingUser) {
      // Insert admin_sekretariat user
      const userInsert = await runQuery(
        'INSERT INTO users (username, email, password_hash, role, role_id, full_name) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin_sekretariat', 'sekretariat@stpaulusjuanda.org', passwordHash, 'admin_sekretariat', roleId, 'Admin Sekretariat']
      )
      userId = userInsert[0].insertId
      console.log('Created admin_sekretariat user with ID:', userId)
    } else {
      userId = existingUser.id
      console.log('admin_sekretariat user already exists with ID:', userId)
    }

    // Generate JWT token
    const token = generateToken(userId, 'admin_sekretariat')

    console.log('Admin Sekretariat user created/updated successfully!')
    console.log('Username: adminsekretariat')
    console.log('Password: password123')
    console.log('Token:', token)

    return token
  } catch (error) {
    console.error('Error creating admin_sekretariat user:', error)
    throw error
  }
}

// Export for use in other scripts
export { createAdminSekretariatUser }

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminSekretariatUser()
    .then((token) => {
      console.log('\n=== TOKEN FOR TESTING ===')
      console.log(token)
      process.exit(0)
    })
    .catch((error) => {
      console.error('Failed to create admin_sekretariat user:', error)
      process.exit(1)
    })
}
