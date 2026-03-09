import { defineEventHandler } from 'h3'
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async () => {
    try {
        console.log('[Devotions Public API] Fetching active devotions...')

        const devotions = await allQuery(`
      SELECT 
        d.id,
        d.title,
        d.type,
        d.day_of_week,
        d.time,
        d.location,
        d.description,
        d.display_order,
        dt.name as type_name,
        dt.icon as type_icon,
        dt.color as type_color
      FROM devotions d
      LEFT JOIN devotion_types dt ON d.type = dt.slug
      WHERE d.is_active = 1
      ORDER BY d.display_order ASC, d.time ASC
    `)

        console.log('[Devotions Public API] Found:', devotions.length, 'active devotions')

        return {
            success: true,
            data: devotions
        }
    } catch (error) {
        console.error('[Devotions Public API] Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch devotions'
        })
    }
})
