import { allQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC (middleware already set auth context)
  requirePermission('manage_chatbot_faqs')(event)

  const faqs = await allQuery(`
    SELECT id, question, answer, category, keywords, is_active, usage_count, created_at, updated_at
    FROM chatbot_faqs
    ORDER BY created_at DESC
  `)

  return faqs
})
