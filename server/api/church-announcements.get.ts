// API: Get active church announcements (public)
// Path: GET /api/church-announcements
// Purpose: Display on homepage

import { runQuery } from '../database/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const limit = parseInt(query.limit as string) || 10
        const page = parseInt(query.page as string) || 1
        const offset = (page - 1) * limit

        console.log('[Church Announcements API] Fetching with limit:', limit, 'offset:', offset)

        // Get active announcements, sorted by event_date DESC
        const announcements = await runQuery(
            `SELECT 
        id, 
        title, 
        description, 
        activity_type,
        event_date, 
        event_time, 
        thumbnail,
        created_at
      FROM church_announcements 
      WHERE is_active = 1 
      ORDER BY event_date DESC, event_time DESC
      LIMIT ? OFFSET ?`,
            [limit, offset]
        ) as any[]

        console.log('[Church Announcements API] Found:', announcements?.length || 0, 'announcements')

        // Get total count for pagination
        const countResult = await runQuery(
            `SELECT COUNT(*) as total FROM church_announcements WHERE is_active = 1`
        ) as any[]

        const total = countResult?.[0]?.total || 0

        console.log('[Church Announcements API] Total active:', total)

        return {
            success: true,
            data: announcements || [],
            count: total,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error: any) {
        console.error('[Church Announcements API] Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch church announcements'
        })
    }
})
