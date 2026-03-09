import { requireAuth } from '../../../utils/auth'
import { runQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Require authentication
  requireAuth(event)

  try {
    const id = parseInt(getRouterParam(event, 'id')!)

    // Delete the regular mass schedule
    const deleteResult = await runQuery('DELETE FROM regular_mass_schedules WHERE id = ?', [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Regular mass schedule not found'
      })
    }

    return { success: true, message: 'Regular mass schedule deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting regular mass schedule:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete regular mass schedule'
    })
  }
})
