// Admin API: Delete BGKP member
import { defineEventHandler, createError, getRouterParam } from 'h3'
import { runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    requireAuth(event)

    const id = getRouterParam(event, 'id')

    const sql = `DELETE FROM bgkp_members WHERE id = ?`
    await runQuery(sql, [id])

    return {
      success: true,
      message: 'BGKP member deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting BGKP member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete BGKP member',
      message: error.message
    })
  }
})
