import { allQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const days = parseInt(query?.days as string) || 7
    const limit = parseInt(query?.limit as string) || 20

    // Calculate date range
    const today = new Date()
    const endDate = new Date()
    endDate.setDate(today.getDate() + days)

    const todayStr = today.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    const schedules = await allQuery(`
      SELECT
        ls.*,
        lt.name as liturgy_type_name,
        lt.slug as liturgy_type_slug,
        lt.icon as liturgy_type_icon,
        lt.color as liturgy_type_color
      FROM liturgy_schedules ls
      JOIN liturgy_types lt ON ls.liturgy_type_id = lt.id
      WHERE ls.status = 'active'
        AND ls.date >= ?
        AND ls.date <= ?
      ORDER BY ls.date ASC, ls.time ASC
      LIMIT ${limit}
    `, [todayStr, endDateStr])

    // Group by date
    const groupedSchedules: { [key: string]: any[] } = {}
    schedules.forEach((schedule: any) => {
      const date = schedule.date
      if (!groupedSchedules[date]) {
        groupedSchedules[date] = []
      }
      groupedSchedules[date].push({
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
        liturgy_type: {
          id: schedule.liturgy_type_id,
          name: schedule.liturgy_type_name,
          slug: schedule.liturgy_type_slug,
          icon: schedule.liturgy_type_icon,
          color: schedule.liturgy_type_color
        }
      })
    })

    return {
      date_range: {
        start: todayStr,
        end: endDateStr,
        days: days
      },
      schedules_by_date: groupedSchedules,
      total_schedules: schedules.length
    }
  } catch (error) {
    console.error('Error fetching upcoming liturgy schedules:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch upcoming liturgy schedules'
    })
  }
})
