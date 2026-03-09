import { getQuery } from '../database/db'
import { requireAuth, getUserPermissions } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)

  const user = await getQuery(`
    SELECT u.id, u.username, u.email, u.full_name, u.contact_phone, u.user_category, u.unit_name, u.role, u.role_id, u.organization_type, u.organization_id, r.name as role_name, r.display_name as role_display_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [decoded.userId]) as any

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const permissions = await getUserPermissions(user)

  return {
    ...user,
    permissions
  }
})
