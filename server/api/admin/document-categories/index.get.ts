import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can access document categories
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_document_categories')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can manage document categories'
    })
  }

  // Disable caching for admin endpoints
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  const categories = await allQuery(`
    SELECT id, name, slug, description, color, display_order, is_active, created_at, updated_at
    FROM document_categories
    ORDER BY display_order ASC, name ASC
  `)

  return categories
})
