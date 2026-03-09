// API: Get all church announcements (Admin)
// Path: GET /api/admin/announcements
// Permission: manage_church_announcements

import { runQuery } from '~/server/database/db'
import { requireAuth, requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    console.log('[Announcements API] GET request received')

    try {
        requireAuth(event)
        requirePermission('manage_church_announcements')(event)
        console.log('[Announcements API] Auth & permission check passed')
    } catch (authError) {
        console.error('[Announcements API] Auth/Permission error:', authError)
        throw authError
    }

    try {
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 20
        const search = query.search as string || ''
        const offset = (page - 1) * limit

        let sql = `
      SELECT 
        id,
        title,
        description,
        activity_type,
        thumbnail,
        event_date,
        event_time,
        is_active,
        display_order,
        created_at,
        updated_at
      FROM church_announcements
      WHERE 1=1
    `
        const params: any[] = []

        if (search) {
            sql += ` AND (title LIKE ? OR description LIKE ?)`
            params.push(`%${search}%`, `%${search}%`)
        }

        sql += ` ORDER BY event_date DESC, event_time ASC`

        // Use string interpolation for LIMIT/OFFSET to avoid prepared statement issues
        sql += ` LIMIT ${limit} OFFSET ${offset}`

        const announcements = await runQuery(sql, params) as any[]
        console.log('[Announcements API] Query result:', announcements?.length || 0, 'items')

        // Get total count
        let countSql = `SELECT COUNT(*) as total FROM church_announcements WHERE 1=1`
        const countParams: any[] = []
        if (search) {
            countSql += ` AND (title LIKE ? OR description LIKE ?)`
            countParams.push(`%${search}%`, `%${search}%`)
        }
        const countResult = await runQuery(countSql, countParams) as any[]

        const response = {
            data: announcements,
            total: countResult?.[0]?.total || 0,
            page,
            limit,
            totalPages: Math.ceil((countResult?.[0]?.total || 0) / limit)
        }

        console.log('[Announcements API] Returning response:', response)
        return response
    } catch (error: any) {
        console.error('[Announcements API] Error fetching:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch announcements'
        })
    }
})
