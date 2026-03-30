import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const authContext = event.context.auth
  const hasAccess = authContext?.permissions?.some((perm: string) =>
    ['manage_chatbot_faqs', 'manage_chatbot'].includes(perm)
  )

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }

  const categories = await allQuery(`
    SELECT id, name, slug, description, color, display_order, is_active, created_at, updated_at
    FROM chatbot_faq_categories
    ORDER BY display_order ASC, name ASC
  `)

  return categories
})
