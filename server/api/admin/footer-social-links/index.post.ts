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

    const body = await readBody(event)
    const { platform_name, platform_icon, url, display_order } = body

    // Validation
    if (!platform_name || !platform_icon || !url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Platform name, icon, and URL are required'
      })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL format'
      })
    }

    // Insert new social link
    await runQuery(
      'INSERT INTO footer_social_links (platform_name, platform_icon, url, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [platform_name, platform_icon, url, display_order || 0]
    )

    return {
      success: true,
      message: 'Social link created successfully'
    }
  } catch (error) {
    console.error('Error creating social link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
