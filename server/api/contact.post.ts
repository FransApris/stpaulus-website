import { runQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, phone, message } = body

    // Validation
    if (!name || !email || !phone || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama, email, nomor HP, dan pesan diperlukan'
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format email tidak valid'
      })
    }

    // Insert contact message
    const result = await runQuery(
      'INSERT INTO contact_messages (name, email, phone, message, is_read, created_at, updated_at) VALUES (?, ?, ?, ?, FALSE, NOW(), NOW())',
      [name, email, phone, message]
    ) as any

    return {
      id: result.insertId,
      message: 'Pesan berhasil dikirim'
    }
  } catch (error) {
    console.error('Error creating contact message:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
