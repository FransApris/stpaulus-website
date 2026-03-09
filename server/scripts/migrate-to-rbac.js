import { runQuery } from '../database/db'

const migrateToRBAC = async () => {
  console.log('Migrating existing users to RBAC system...')

  // Update existing users berdasarkan role lama
  console.log('Updating admin users to super_admin role...')
  await runQuery(`
    UPDATE users
    SET role_id = (SELECT id FROM roles WHERE name = 'super_admin')
    WHERE role = 'admin'
  `)

  console.log('Updating regular users to admin_sekretariat role...')
  await runQuery(`
    UPDATE users
    SET role_id = (SELECT id FROM roles WHERE name = 'admin_sekretariat')
    WHERE role = 'user'
  `)

  // Check results
  const userCount = await runQuery('SELECT COUNT(*) as count FROM users')
  const migratedCount = await runQuery('SELECT COUNT(*) as count FROM users WHERE role_id IS NOT NULL')

  console.log(`Total users: ${userCount[0].count}`)
  console.log(`Migrated users: ${migratedCount[0].count}`)

  console.log('Migration to RBAC completed successfully!')
}

// Run migration
migrateToRBAC().catch(console.error)
