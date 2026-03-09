import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Only super admin can access user categories
  requireAuth(event)

  const user = event.context.auth
  if (!user || user.permissions?.includes('manage_users') !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin can manage user categories'
    })
  }

  const categoryId = getRouterParam(event, 'id')

  // Check if category exists
  const existing = await getQuery('SELECT id, name FROM user_categories WHERE id = ?', [categoryId]) as { id: number, name: string }
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found'
    })
  }

  // Check if category is being used by any users
  const usersUsingCategory = await getQuery('SELECT COUNT(*) as count FROM users WHERE user_category = ?', [existing.name]) as { count: number }
  if (usersUsingCategory.count > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot delete category that is being used by users'
    })
  }

  // Delete category
  const deleteResult = await runQuery('DELETE FROM user_categories WHERE id = ?', [categoryId])

  if ((deleteResult as any).affectedRows === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found or already deleted'
    })
  }

  return {
    message: 'User category deleted successfully'
  }
})
