import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const user = event.context.auth
  // Super admin atau admin_sekretariat (manage_users_komsos_sekretariat) boleh baca
  const canRead = user?.permissions?.includes('manage_users') ||
    user?.permissions?.includes('manage_users_komsos_sekretariat')

  if (!canRead) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }

  const categories = await allQuery(`
    SELECT id, name, display_name, description, is_active, display_order, created_at, updated_at
    FROM user_categories
    ORDER BY display_order ASC, display_name ASC
  `)

  return categories
})
