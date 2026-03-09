import { defineEventHandler, createError, readBody } from 'h3'
import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_mass_schedules')(event)

  try {
    const body = await readBody(event) as {
      title: string
      date: string
      time: string
      liturgy_type_id: number
      language?: string
      priest_name?: string
      location?: string
      notes?: string
      is_recurring?: boolean
      status?: string
    }

    const {
      title,
      date,
      time,
      liturgy_type_id,
      language = 'Indonesia',
      priest_name,
      location = 'Gereja Utama',
      notes,
      is_recurring = false,
      status = 'active'
    } = body

    // Validate liturgy type ID exists and is active
    if (!liturgy_type_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Jenis liturgi wajib dipilih'
      })
    }

    const type = await getQuery('SELECT id, name FROM liturgy_types WHERE id = ? AND is_active = 1', [liturgy_type_id])
    if (!type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Jenis liturgi yang dipilih tidak valid atau tidak aktif'
      })
    }

    // Validate required fields
    if (!title || !date || !time || !liturgy_type_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Judul, tanggal, waktu, dan jenis liturgi wajib diisi'
      })
    }

    // Validate date format
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format tanggal tidak valid'
      })
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(time)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format waktu tidak valid (gunakan format HH:MM)'
      })
    }

    // Insert new liturgy schedule
    const sql = `
      INSERT INTO liturgy_schedules (
        title, date, time, liturgy_type_id, language, priest_name,
        location, notes, is_recurring, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `

    const result = await runQuery(sql, [
      title, date, time, liturgy_type_id, language, priest_name || null,
      location, notes || null, is_recurring ? 1 : 0, status
    ])

    return {
      id: (result as any).insertId,
      message: 'Liturgy schedule created successfully'
    }
  } catch (error) {
    console.error('Error creating liturgy schedule:', error)
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred'
    throw createError({
      statusCode: (error as any)?.statusCode || 500,
      statusMessage: (error as any)?.statusMessage || errorMessage
    })
  }
})
