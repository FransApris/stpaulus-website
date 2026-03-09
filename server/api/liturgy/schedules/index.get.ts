import { allQuery, getQuery as dbGetQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Set cache headers to prevent stale data
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')
  
  try {
    const query = getQuery(event)
    const typeId = query?.type_id || query?.type as string  // Support both type_id and type parameters
    const startDate = query?.start_date as string
    const endDate = query?.end_date as string
    const page = parseInt(query?.page as string) || 1
    const limit = parseInt(query?.limit as string) || 100  // Default to 100 like admin API
    const offset = (page - 1) * limit

    // Build WHERE clause - match admin API behavior
    let whereClause = 'WHERE ls.status IN (\'active\', \'cancelled\')'  // Include cancelled like admin
    const params: any[] = []

    if (typeId) {
      whereClause += ' AND ls.liturgy_type_id = ?'
      params.push(typeId)
    }

    if (startDate) {
      whereClause += ' AND ls.date >= ?'
      params.push(startDate)
    }

    if (endDate) {
      whereClause += ' AND ls.date <= ?'
      params.push(endDate)
    }

    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total
      FROM liturgy_schedules ls
      JOIN liturgy_types lt ON ls.liturgy_type_id = lt.id
      ${whereClause}
    `
    const countResult = await dbGetQuery(countSql, params) as any
    const total = countResult?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Get paginated schedules - match admin API ordering (newest first)
    // Using string interpolation for LIMIT/OFFSET to avoid prepared statement issues
    let sql = `
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
      ${whereClause}
      ORDER BY ls.date DESC, ls.time DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const schedules = await allQuery(sql, params)

    // Convert to plain objects for JSON serialization
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
    console.error('Error fetching liturgy schedules:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch liturgy schedules'
    })
  }
})
