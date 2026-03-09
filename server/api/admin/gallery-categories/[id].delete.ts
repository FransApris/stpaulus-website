import { requireAuth, requirePermission } from '../../../utils/auth'
import { runQuery, getQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery_categories')(event)

  const categoryId = getRouterParam(event, 'id')

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  try {
    // Check if category exists
    const existingCategory = await getQuery('SELECT id, nama_kategori FROM gallery_categories WHERE id = ?', [categoryId]) as any
    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Check if category is being used by any albums
    const albumsUsingCategory = await getQuery('SELECT COUNT(*) as count FROM gallery_albums WHERE category_id = ?', [categoryId]) as any
    if (albumsUsingCategory.count > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete category that is being used by albums. Please reassign albums to another category first.'
      })
    }

    // Delete category
    const deleteResult = await runQuery('DELETE FROM gallery_categories WHERE id = ?', [categoryId])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found or already deleted'
      })
    }

    return {
      success: true,
      message: `Category "${existingCategory.nama_kategori}" has been deleted successfully`
    }
  } catch (error) {
    console.error('Error deleting gallery category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete gallery category'
    })
  }
})
