import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import { unsyncNewsFromKronik } from '../../../utils/news-kronik-sync'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'News ID is required'
      })
    }

    const existingNews = await getDbQuery('SELECT id FROM news WHERE id = ?', [id])
    if (!existingNews) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found'
      })
    }

    // Remove from kronik if it was synced
    await unsyncNewsFromKronik(parseInt(id))

    const deleteResult = await runQuery('DELETE FROM news WHERE id = ?', [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found or already deleted'
      })
    }

    return {
      message: 'News deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting news:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
