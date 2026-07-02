// Admin API: Delete kronik entry
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { getRouterParam } from 'h3'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Entry ID is required'
    })
  }

  try {
    // Check if entry exists
    const entry = await getOne('SELECT id FROM kronik_entries WHERE id = ?', [id])

    if (!entry) {
      throw createError({
        statusCode: 404,
        message: 'Entry not found'
      })
    }

    // Delete related records first (FK uses kronik_id)
    await runQuery('DELETE FROM kronik_views WHERE kronik_id = ?', [id])
    await runQuery('DELETE FROM kronik_comments WHERE kronik_id = ?', [id])

    // Delete the entry
    await runQuery('DELETE FROM kronik_entries WHERE id = ?', [id])

    return {
      success: true,
      message: 'Kronik entry deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting kronik entry:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete kronik entry'
    })
  }
})
