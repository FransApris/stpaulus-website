import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'
import { clearFAQCache } from '../../../utils/faqCache'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requirePermission('manage_chatbot_faqs')(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID diperlukan'
    })
  }

  // Check if FAQ exists
  const existing = await getQuery('SELECT id FROM chatbot_faqs WHERE id = ?', [id]) as any
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'FAQ tidak ditemukan'
    })
  }

  const deleteResult = await runQuery('DELETE FROM chatbot_faqs WHERE id = ?', [id])

  if ((deleteResult as any).affectedRows === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'FAQ tidak ditemukan atau sudah dihapus'
    })
  }

  // Clear global chatbot FAQ cache
  clearFAQCache()

  return {
    message: 'FAQ berhasil dihapus'
  }
})
