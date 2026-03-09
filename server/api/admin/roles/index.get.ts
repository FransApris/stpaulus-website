import { allQuery } from '../../../database/db'
import { requireAuth, requireUserManagementPermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  await requireUserManagementPermission(event)

  // Get all roles
  const roles = await allQuery(`
    SELECT id, name, display_name, description, created_at
    FROM roles
    ORDER BY created_at ASC
  `)

  return roles
})
