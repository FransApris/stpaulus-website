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
        statusMessage: 'Social link ID is required'
      })
    }

    // Delete social link
    await runQuery('DELETE FROM footer_social_links WHERE id = ?', [id])

    return {
      success: true,
      message: 'Social link deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting social link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
