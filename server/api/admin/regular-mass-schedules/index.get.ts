import { requireAuth } from '../../../utils/auth'
import { allQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Require authentication
  requireAuth(event)

  try {
    const schedules = await allQuery(`
      SELECT id, day_of_week, time, mass_type, is_active, created_at, updated_at
      FROM regular_mass_schedules
      ORDER BY
        CASE day_of_week
          WHEN 'Minggu' THEN 1
          WHEN 'Senin' THEN 2
          WHEN 'Selasa' THEN 3
          WHEN 'Rabu' THEN 4
          WHEN 'Kamis' THEN 5
          WHEN 'Jumat' THEN 6
          WHEN 'Sabtu' THEN 7
        END,
        time ASC
    `)

    return schedules
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch regular mass schedules'
    })
  }
})
