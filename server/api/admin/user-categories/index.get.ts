import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const user = event.context.auth
  // Super admin, admin_sekretariat, atau admin_ruangan (manage_rooms) boleh baca
  const canRead = user?.permissions?.includes('manage_users') ||
    user?.permissions?.includes('manage_users_komsos_sekretariat') ||
    user?.permissions?.includes('manage_rooms')

  if (!canRead) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }

  const categories = await allQuery(`
    SELECT id, name, display_name, description, is_active, is_unlimited,
           monthly_quota, display_order, created_at, updated_at
    FROM user_categories
    ORDER BY display_order ASC, display_name ASC
  `)

  return categories
})
