// Admin API: Delete kronik entry
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
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

    // Delete related records first
    await runQuery('DELETE FROM kronik_views WHERE entry_id = ?', [id])
    await runQuery('DELETE FROM kronik_comments WHERE entry_id = ?', [id])

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
