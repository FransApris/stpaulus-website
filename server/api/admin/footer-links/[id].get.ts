import { allQuery } from '../../../database/db'

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

    // Get footer link by ID
    const footerLinks = await allQuery('SELECT * FROM footer_links WHERE id = ?', [id])

    if (footerLinks.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Footer link not found'
      })
    }

    return footerLinks[0]
  } catch (error) {
    console.error('Error fetching footer link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
