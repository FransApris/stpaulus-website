import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC (middleware already set auth context)
  requirePermission('manage_chatbot_faqs')(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  try {
    // Check if category is being used by any FAQs
    const faqCount = await getQuery(`
      SELECT COUNT(*) as count FROM chatbot_faqs WHERE category = (
        SELECT slug FROM chatbot_faq_categories WHERE id = ?
      )
    `, [id]) as { count: number }

    if (faqCount.count > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete category that is being used by FAQs'
      })
    }

    const deleteResult = await runQuery('DELETE FROM chatbot_faq_categories WHERE id = ?', [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found or already deleted'
      })
    }

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category'
    })
  }
})
