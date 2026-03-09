import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_mass_schedules')(event)

  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const {
      title,
      date,
      time,
      liturgy_type_id,
      language,
      priest_name,
      location,
      notes,
      is_recurring,
      status
    } = body

    // Validate required fields
    if (!title || !date || !time || !liturgy_type_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Judul, tanggal, waktu, dan jenis liturgi wajib diisi'
      })
    }

    // Validate liturgy type ID exists and is active
    const type = await getQuery('SELECT id, name FROM liturgy_types WHERE id = ? AND is_active = 1', [liturgy_type_id])
    if (!type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Jenis liturgi yang dipilih tidak valid atau tidak aktif'
      })
    }

    // Check if liturgy schedule exists
    const existingSchedule = await getQuery('SELECT id FROM liturgy_schedules WHERE id = ?', [id])
    if (!existingSchedule) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Jadwal liturgi tidak ditemukan'
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

    // Validate ID exists
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID jadwal liturgi diperlukan'
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

    // Update liturgy schedule
    const sql = `
      UPDATE liturgy_schedules SET
        title = ?, date = ?, time = ?, liturgy_type_id = ?, language = ?,
        priest_name = ?, location = ?, notes = ?, is_recurring = ?, status = ?,
        updated_at = NOW()
      WHERE id = ?
    `

    await runQuery(sql, [
      title, date, time, liturgy_type_id, language || 'Indonesia',
      priest_name || null, location || 'Gereja Utama', notes || null,
      is_recurring ? 1 : 0, status || 'active', id
    ])

    return {
      message: 'Liturgy schedule updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating liturgy schedule:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
