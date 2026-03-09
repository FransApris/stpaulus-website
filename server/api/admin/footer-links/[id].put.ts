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

    const body = await readBody(event)
    const { title, url, column_type, display_order, is_active } = body

    // Validation
    if (!title || !url || !column_type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, URL, and column type are required'
      })
    }

    if (!['legal', 'support', 'content'].includes(column_type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Column type must be legal, support, or content'
      })
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://example.com${url}`)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL format'
      })
    }

    // Update footer link
    await runQuery(
      'UPDATE footer_links SET title = ?, url = ?, column_type = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, url, column_type, display_order || 0, is_active ? 1 : 0, id]
    )

    return {
      success: true,
      message: 'Footer link updated successfully'
    }
  } catch (error) {
    console.error('Error updating footer link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
