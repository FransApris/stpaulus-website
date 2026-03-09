import { runQuery, allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // Check if category exists
    const existingCategory = await allQuery('SELECT id FROM article_categories WHERE id = ?', [id])
    if (!existingCategory || existingCategory.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Check if category has child categories
    const childCategories = await allQuery('SELECT id FROM article_categories WHERE parent_id = ? LIMIT 1', [id])
    if (childCategories && childCategories.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete category that has subcategories'
      })
    }

    // Check if category is being used by any articles
    const articlesUsingCategory = await allQuery('SELECT article_id FROM article_category_relations WHERE category_id = ? LIMIT 1', [id])
    if (articlesUsingCategory && articlesUsingCategory.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete category that is being used by articles'
      })
    }

    // Delete category
    const deleteResult = await runQuery('DELETE FROM article_categories WHERE id = ?', [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found or already deleted'
      })
    }

    return {
      success: true,
      message: 'Category deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting article category:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
