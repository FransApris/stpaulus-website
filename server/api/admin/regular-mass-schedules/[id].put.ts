import { requireAuth } from '../../../utils/auth'
import { runQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Require authentication
  requireAuth(event)

  try {
    const id = parseInt(getRouterParam(event, 'id')!)
    const body = await readBody(event)
    const { day_of_week, time, mass_type, is_active } = body

    // Validate required fields
    if (!day_of_week || !time || !mass_type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hari, waktu, dan jenis misa diperlukan'
      })
    }

    // Validate day_of_week
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    if (!validDays.includes(day_of_week)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hari tidak valid'
      })
    }

    // Update the regular mass schedule
    await runQuery(
      'UPDATE regular_mass_schedules SET day_of_week = ?, time = ?, mass_type = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [day_of_week, time, mass_type, is_active ? 1 : 0, id]
    )

    return {
      id,
      day_of_week,
      time,
      mass_type,
      is_active: is_active ? 1 : 0,
      updated_at: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('Error updating regular mass schedule:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update regular mass schedule'
    })
  }
})
