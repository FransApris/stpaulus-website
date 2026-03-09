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
    const { title, url, column_type, display_order } = body

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

    // Insert new footer link
    await runQuery(
      'INSERT INTO footer_links (title, url, column_type, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [title, url, column_type, display_order || 0]
    )

    return {
      success: true,
      message: 'Footer link created successfully'
    }
  } catch (error) {
    console.error('Error creating footer link:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
