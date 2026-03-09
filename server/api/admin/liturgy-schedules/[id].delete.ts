import { runQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_mass_schedules')(event)

  try {
    const id = getRouterParam(event, 'id')

    // Delete liturgy schedule
    const sql = `DELETE FROM liturgy_schedules WHERE id = ?`
    const deleteResult = await runQuery(sql, [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Liturgy schedule not found'
      })
    }

    return {
      message: 'Liturgy schedule deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting liturgy schedule:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
