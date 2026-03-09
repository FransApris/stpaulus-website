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

    // Get all footer links
    const footerLinks = await allQuery('SELECT * FROM footer_links ORDER BY column_type ASC, display_order ASC')

    return footerLinks
  } catch (error) {
    console.error('Error fetching footer links:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
