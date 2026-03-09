// API: Get all pastors (public endpoint)
// Path: /api/pastors
// Purpose: Fetch visible pastors for public display

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // Build SQL query
        let sql = `
      SELECT 
        id,
        name,
        full_name,
        title,
        start_year,
        end_year,
        status,
        photo_url,
        bio,
        quote,
        achievements,
        display_order
      FROM pastors
      WHERE is_visible = TRUE
    `

        const params: any[] = []

        // Filter by status if provided
        if (query.status && query.status !== 'all') {
            sql += ` AND status = ?`
            params.push(query.status)
        }

        // Sort by display order and start year
        sql += ` ORDER BY display_order ASC, start_year DESC`

        // Execute query
        const pastors = await allQuery(sql, params) as any[]

        console.log(`[Pastors API] Found ${pastors.length} pastors`)

        return {
            success: true,
            data: pastors,
            count: pastors.length
        }

    } catch (error: any) {
        console.error('[Pastors API] Error fetching pastors:', error)

        return {
            success: false,
            error: 'Failed to fetch pastors',
            message: error.message
        }
    }
})
