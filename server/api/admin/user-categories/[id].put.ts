import { runQuery, getQuery, allQuery } from '../../../database/db'
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
  const body = await readBody(event)
  const { name, display_name, description, display_order, is_active } = body

  // Validation
  if (!name || !display_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and display name are required'
    })
  }

  // Check if category exists
  const existing = await getQuery('SELECT id FROM user_categories WHERE id = ?', [categoryId])
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found'
    })
  }

  // Check if name already exists (excluding current category)
  const duplicate = await getQuery('SELECT id FROM user_categories WHERE name = ? AND id != ?', [name, categoryId])
  if (duplicate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category name already exists'
    })
  }

  // Update category
  await runQuery(`
    UPDATE user_categories
    SET name = ?, display_name = ?, description = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [name, display_name, description || '', display_order || 0, is_active !== undefined ? (is_active ? 1 : 0) : 1, categoryId])

  // Get updated category
  const categories = await allQuery('SELECT * FROM user_categories WHERE id = ?', [categoryId])

  return categories[0]
})
