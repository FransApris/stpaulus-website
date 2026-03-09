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
        statusMessage: 'Social link ID is required'
      })
    }

    // Get social link by ID
    const socialLinks = await allQuery('SELECT * FROM footer_social_links WHERE id = ?', [id])

    if (socialLinks.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Social link not found'
      })
    }

    return socialLinks[0]
  } catch (error) {
    console.error('Error fetching social link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
