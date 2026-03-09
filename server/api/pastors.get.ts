// API: Get all pastors (public endpoint - only visible pastors)
// Path: /api/pastors
// Purpose: Fetch visible pastors for public display

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        console.log('[Pastors API] Fetching visible pastors')

        // Fetch only visible pastors, ordered by display_order
        const sql = `
            SELECT 
                id,
                name,
                full_name,
                title,
                position_type,
                start_year,
                end_year,
                status,
                photo_url,
                bio,
                quote,
                achievements,
                email,
                phone,
                birth_place,
                birth_date,
                ordination_date,
                display_order
            FROM pastors
            WHERE is_visible = 1
            ORDER BY display_order ASC, start_year DESC
        `

        const pastors = await allQuery(sql, []) as any[]

        console.log(`[Pastors API] Found ${pastors.length} visible pastors`)

        return {
            success: true,
            data: pastors
        }

    } catch (error: any) {
        console.error('[Pastors API] Error fetching pastors:', error)
        console.error('[Pastors API] Error stack:', error.stack)

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch pastors',
            data: error.message
        })
    }
})
