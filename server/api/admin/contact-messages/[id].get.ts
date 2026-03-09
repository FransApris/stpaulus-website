import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID pesan diperlukan'
    })
  }

  try {
    // Get message and mark as read
    const messageQuery = `
      SELECT id, name, email, phone, message, is_read, created_at, updated_at
      FROM contact_messages
      WHERE id = ?
    `
    const message = await getQuery(messageQuery, [id]) as any

    if (!message) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pesan tidak ditemukan'
      })
    }

    // Mark as read if not already read
    if (!message.is_read) {
      const updateQuery = `
        UPDATE contact_messages
        SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      await runQuery(updateQuery, [id])
    }

    return {
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      message: message.message,
      is_read: true, // Always return true since we mark it as read
      created_at: message.created_at,
      updated_at: message.updated_at
    }
  } catch (error) {
    console.error('Error fetching contact message:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
