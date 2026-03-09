import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Article ID is required'
      })
    }

    // Check if article exists
    const existingArticle = await getDbQuery('SELECT id FROM articles WHERE id = ?', [id])
    if (!existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Delete article
    const deleteResult = await runQuery('DELETE FROM articles WHERE id = ?', [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found or already deleted'
      })
    }

    return {
      message: 'Article deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
