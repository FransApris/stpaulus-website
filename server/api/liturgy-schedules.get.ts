import { defineEventHandler } from 'h3'
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async () => {
    try {
        console.log('[Liturgy Schedules Public API] Fetching active schedules...')

        const schedules = await allQuery(`
    SELECT 
      ls.id,
      ls.title,
      DATE_FORMAT(ls.date, '%Y-%m-%d') as date,
      ls.time,
      ls.location,
      ls.status,
      lt.name as liturgy_type_name,
      lt.color as liturgy_type_color
    FROM liturgy_schedules ls
    LEFT JOIN liturgy_types lt ON ls.liturgy_type_id = lt.id
    WHERE ls.status = 'active'
    ORDER BY ls.date ASC, ls.time ASC
  `)

        console.log('[Liturgy Schedules Public API] Found:', schedules.length, 'active schedules')

        return {
            success: true,
            schedules: schedules
        }
    } catch (error) {
        console.error('[Liturgy Schedules Public API] Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch liturgy schedules'
        })
    }
})
