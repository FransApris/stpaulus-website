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

    const body = await readBody(event)
    const { platform_name, platform_icon, url, display_order, is_active } = body

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

    // Update social link
    await runQuery(
      'UPDATE footer_social_links SET platform_name = ?, platform_icon = ?, url = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [platform_name, platform_icon, url, display_order || 0, is_active ? 1 : 0, id]
    )

    return {
      success: true,
      message: 'Social link updated successfully'
    }
  } catch (error) {
    console.error('Error updating social link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
