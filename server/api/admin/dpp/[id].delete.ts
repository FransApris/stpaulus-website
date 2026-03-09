// Admin API: Delete DPP member
import { runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    requireAuth(event)

    const id = getRouterParam(event, 'id')

    const sql = `DELETE FROM dpp_members WHERE id = ?`
    await runQuery(sql, [id])

    return {
      success: true,
      message: 'DPP member deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting DPP member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete DPP member',
      message: error.message
    })
  }
})
