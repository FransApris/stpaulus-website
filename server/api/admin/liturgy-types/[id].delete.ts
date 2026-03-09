import { runQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permission
  requirePermission('manage_liturgy_types')(event)

  const id = getRouterParam(event, 'id')

  // Validation
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
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

  // Check if liturgy type is being used in schedules
  const usageCheck = await getQuery('SELECT COUNT(*) as count FROM liturgy_schedules WHERE liturgy_type_id = ?', [id])
  if (usageCheck && (usageCheck as any).count > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot delete liturgy type that is being used in schedules'
    })
  }

  try {
    const deleteResult = await runQuery('DELETE FROM liturgy_types WHERE id = ?', [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Liturgy type not found or already deleted'
      })
    }

    return {
      success: true,
      message: 'Liturgy type deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting liturgy type:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete liturgy type'
    })
  }
})
