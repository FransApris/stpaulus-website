import { runQuery, getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_hero_themes')(event)

  const id = parseInt(event.context.params?.id || '0')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid theme ID'
    })
  }

  const body = await readBody(event)
  const { name } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }

  // Check if theme exists
  const existingTheme = await getQuery(`
    SELECT id FROM hero_themes WHERE id = ?
  `, [id])

  if (!existingTheme) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Theme not found'
    })
  }

  try {
    await runQuery(`
      UPDATE hero_themes
      SET name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name.trim(), id])

    return {
      success: true,
      message: 'Theme updated successfully'
    }
  } catch (error) {
    console.error('Error updating theme:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update theme'
    })
  }
})
