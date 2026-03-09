// API: Get all pastors (admin endpoint - includes hidden)
// Path: /api/admin/pastors
// Purpose: Fetch all pastors for admin management

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // TODO: Add authentication check
        // const user = await requireAuth(event)
        // if (!user || !user.isAdmin) throw createError({ statusCode: 403, message: 'Forbidden' })

        // Build SQL query
        let sql = `
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
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM pastors
    `

        const params: any[] = []
        const conditions: string[] = []

        // Filter by position_type if provided
        if (query.position_type && query.position_type !== 'all') {
            conditions.push('position_type = ?')
            params.push(query.position_type)
        }

        // Filter by status if provided
        if (query.status && query.status !== 'all') {
            conditions.push('status = ?')
            params.push(query.status)
        }

        // Filter by visibility if provided
        if (query.is_visible !== undefined && query.is_visible !== 'all') {
            conditions.push('is_visible = ?')
            params.push(query.is_visible === 'true' || query.is_visible === '1')
        }

        // Search by name
        if (query.search) {
            conditions.push('(name LIKE ? OR full_name LIKE ?)')
            const searchTerm = `%${query.search}%`
            params.push(searchTerm, searchTerm)
        }

        // Add conditions to query
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ')
        }

        // Sort
        const sortField = query.sort || 'display_order'
        const sortOrder = query.order === 'desc' ? 'DESC' : 'ASC'
        sql += ` ORDER BY ${sortField} ${sortOrder}, start_year DESC`

        console.log('[Admin Pastors API] Executing SQL:', sql)
        console.log('[Admin Pastors API] With params:', params)

        // Execute query
        const pastors = await allQuery(sql, params) as any[]

        console.log(`[Admin Pastors API] Found ${pastors.length} pastors`)

        return {
            success: true,
            data: pastors,
            count: pastors.length
        }

    } catch (error: any) {
        console.error('[Admin Pastors API] Error fetching pastors:', error)
        console.error('[Admin Pastors API] Error stack:', error.stack)

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch pastors',
            data: error.message
        })
    }
})
