import { runQuery, getQuery as dbGetQuery, allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = 5
    const offset = (page - 1) * limit

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM contact_messages'
    const countResult = await dbGetQuery(countQuery, []) as any
    const total = countResult ? countResult.total : 0
    const totalPages = Math.ceil(total / limit)

    // Get messages with pagination
    const messagesQuery = `
      SELECT id, name, email, phone, message, is_read, created_at
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    const messages = await allQuery(messagesQuery, []) as any[]

    // Format messages
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      message_preview: msg.message.length > 50 ? msg.message.substring(0, 50) + '...' : msg.message,
      is_read: Boolean(msg.is_read),
      created_at: msg.created_at
    }))

    return {
      messages: formattedMessages,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_messages: total,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    }
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
