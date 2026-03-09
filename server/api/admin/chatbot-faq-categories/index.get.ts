import { allQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC (middleware already set auth context)
  requirePermission('manage_chatbot_faqs')(event)

  const categories = allQuery(`
    SELECT id, name, slug, description, color, display_order, is_active, created_at, updated_at
    FROM chatbot_faq_categories
    ORDER BY display_order ASC, name ASC
  `)

  return categories
})
