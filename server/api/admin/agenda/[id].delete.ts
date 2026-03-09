import { runQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agenda ID is required'
      })
    }

    // Delete agenda
    const sql = 'DELETE FROM agendas WHERE id = ?'
    const result = await runQuery(sql, [id]) as any

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agenda not found'
      })
    }

    return {
      success: true,
      message: 'Agenda deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting agenda:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
