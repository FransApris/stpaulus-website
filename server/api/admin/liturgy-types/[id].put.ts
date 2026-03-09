import { runQuery, getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permission
  requirePermission('manage_liturgy_types')(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, slug, icon, color, description, display_order, is_active } = body

  // Validation
  if (!id || !name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID, name and slug are required'
    })
  }

  // Check if liturgy type exists
  const existing = await getQuery('SELECT id FROM liturgy_types WHERE id = ?', [id])
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Liturgy type not found'
    })
  }

  // Auto-generate unique slug if conflict exists (excluding current record)
  let uniqueSlug = slug
  let counter = 1
  while (true) {
    const slugCheck = await getQuery('SELECT id FROM liturgy_types WHERE slug = ? AND id != ?', [uniqueSlug, id])
    if (!slugCheck) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  try {
    await runQuery(`
      UPDATE liturgy_types
      SET name = ?, slug = ?, icon = ?, color = ?, description = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, uniqueSlug, icon || '⛪', color || '#6B7280', description || '', display_order || 0, is_active ? 1 : 0, id])

    // Fetch updated data to return
    const updatedType = await getQuery('SELECT * FROM liturgy_types WHERE id = ?', [id])

    return {
      success: true,
      message: 'Liturgy type updated successfully',
      data: updatedType
    }
  } catch (error) {
    console.error('Error updating liturgy type:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update liturgy type'
    })
  }
})
