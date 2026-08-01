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
  const { name, display_name, description, display_order, is_active, is_unlimited, monthly_quota } = body

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

  const isUnlimitedValue = is_unlimited !== undefined ? Boolean(is_unlimited) : false

  // Validate monthly_quota range (1–999, only relevant when not unlimited)
  const quotaValue = monthly_quota !== undefined ? Number(monthly_quota) : 3
  if (!isUnlimitedValue && (isNaN(quotaValue) || quotaValue < 1 || quotaValue > 999)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'monthly_quota harus antara 1 dan 999'
    })
  }

  // Update category
  await runQuery(`
    UPDATE user_categories
    SET name = ?, display_name = ?, description = ?, display_order = ?, is_active = ?,
        is_unlimited = ?, monthly_quota = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    name,
    display_name,
    description || '',
    display_order || 0,
    is_active !== undefined ? (is_active ? 1 : 0) : 1,
    isUnlimitedValue ? 1 : 0,
    isUnlimitedValue ? 999 : quotaValue,
    categoryId
  ])

  // Get updated category
  const categories = await allQuery('SELECT * FROM user_categories WHERE id = ?', [categoryId])

  return categories[0]
})
