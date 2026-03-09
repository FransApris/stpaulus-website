import { allQuery, getQuery as dbGetQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_mass_schedules')(event)

  try {
    const query = getQuery(event)
    const page = parseInt(query?.page as string) || 1
    const limit = parseInt(query?.limit as string) || 50
    const offset = (page - 1) * limit

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM liturgy_schedules`
    const countResult = await dbGetQuery(countSql, []) as any
    const total = countResult?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Get paginated schedules - Using string interpolation for LIMIT/OFFSET to avoid prepared statement issues
    const sql = `
      SELECT
        ls.id,
        ls.liturgy_type_id,
        ls.title,
        ls.date,
        ls.time,
        ls.language,
        ls.priest_name,
        ls.location,
        ls.notes,
        ls.is_recurring,
        ls.recurrence_pattern,
        ls.recurrence_end_date,
        ls.status,
        ls.created_at,
        ls.updated_at,
        lt.name as liturgy_type_name,
        lt.slug as liturgy_type_slug,
        lt.icon as liturgy_type_icon,
        lt.color as liturgy_type_color
      FROM liturgy_schedules ls
      JOIN liturgy_types lt ON ls.liturgy_type_id = lt.id
      ORDER BY ls.date DESC, ls.time DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const schedules = await allQuery(sql, [])

    return {
      schedules: schedules.map((schedule: any) => ({
        id: schedule.id,
        liturgy_type_id: schedule.liturgy_type_id,
        title: schedule.title,
        date: schedule.date,
        time: schedule.time,
        language: schedule.language,
        priest_name: schedule.priest_name,
        location: schedule.location,
        notes: schedule.notes,
        is_recurring: Boolean(schedule.is_recurring),
        status: schedule.status,
        created_at: schedule.created_at,
        updated_at: schedule.updated_at,
        liturgy_type: {
          id: schedule.liturgy_type_id,
          name: schedule.liturgy_type_name,
          slug: schedule.liturgy_type_slug,
          icon: schedule.liturgy_type_icon,
          color: schedule.liturgy_type_color
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  } catch (error) {
    console.error('Error fetching admin liturgy schedules:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
