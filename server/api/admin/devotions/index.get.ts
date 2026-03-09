import { defineEventHandler } from 'h3'
import { allQuery } from '~/server/database/db'
import { requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    // Check permission
    requirePermission('manage_mass_schedules')(event)

    try {
        const devotions = await allQuery(`
      SELECT 
        d.id,
        d.title,
        d.type,
        d.day_of_week,
        d.time,
        d.location,
        d.description,
        d.is_active,
        d.display_order,
        d.created_at,
        d.updated_at,
        dt.name as type_name,
        dt.icon as type_icon,
        dt.color as type_color
      FROM devotions d
      LEFT JOIN devotion_types dt ON d.type = dt.slug
      ORDER BY d.display_order ASC, d.time ASC
    `)

        return {
            success: true,
            data: devotions
        }
    } catch (error) {
        console.error('Error fetching devotions:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch devotions'
        })
    }
})
