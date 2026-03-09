import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Only super admin can access user categories
  requireAuth(event)

  const user = event.context.auth
  if (!user || user.permissions?.includes('manage_users') !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin can manage user categories'
    })
  }

  const categories = allQuery(`
    SELECT id, name, display_name, description, is_active, display_order, created_at, updated_at
    FROM user_categories
    ORDER BY display_order ASC, display_name ASC
  `)

  return categories
})
