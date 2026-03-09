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

    // Get all footer social links
    const socialLinks = await allQuery('SELECT * FROM footer_social_links ORDER BY display_order ASC')

    return socialLinks
  } catch (error) {
    console.error('Error fetching footer social links:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
