import { runQuery, allQuery } from '../../../../database/db'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
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
    const existingCategory = await allQuery('SELECT id FROM agenda_categories WHERE id = ?', [id])
    if (!existingCategory || existingCategory.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Check if category is being used by any agendas
    const agendasUsingCategory = await allQuery('SELECT id FROM agendas WHERE category_id = ? LIMIT 1', [id])
    if (agendasUsingCategory && agendasUsingCategory.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete category that is being used by agendas'
      })
    }

    // Delete category
    const deleteResult = await runQuery('DELETE FROM agenda_categories WHERE id = ?', [id])

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
    console.error('Error deleting category:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
