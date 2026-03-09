import { getQuery, runQuery, allQuery } from '../../../database/db'
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

  const body = await readBody(event)
  const { name, display_name, description, display_order } = body

  // Validation
  if (!name || !display_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and display name are required'
    })
  }

  // Check if name already exists
  const existing = await getQuery('SELECT id FROM user_categories WHERE name = ?', [name])
  if (existing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category name already exists'
    })
  }

  // Insert new category
  const result = await runQuery(`
    INSERT INTO user_categories (name, display_name, description, display_order)
    VALUES (?, ?, ?, ?)
  `, [name, display_name, description || '', display_order || 0])

  // Get newly created category
  const categories = await allQuery('SELECT * FROM user_categories WHERE id = ?', [result.insertId])

  return categories[0]
})
