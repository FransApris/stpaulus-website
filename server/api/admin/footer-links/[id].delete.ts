import { runQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Footer link ID is required'
      })
    }

    // Delete footer link
    await runQuery('DELETE FROM footer_links WHERE id = ?', [id])

    return {
      success: true,
      message: 'Footer link deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting footer link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
