// API: Get all wilayah (admin endpoint)
// Path: GET /api/admin/wilayah
// Purpose: Fetch all wilayah for admin management

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // Build SQL query
        let sql = `
            SELECT 
                id,
                nama,
                keterangan,
                display_order,
                is_visible,
                created_at,
                updated_at
            FROM wilayah
        `

        const params: any[] = []
        const conditions: string[] = []

        // Filter by visibility if provided
        if (query.is_visible !== undefined && query.is_visible !== 'all') {
            conditions.push('is_visible = ?')
            params.push(query.is_visible === 'true' || query.is_visible === '1')
        }

        // Search by name
        if (query.search) {
            conditions.push('nama LIKE ?')
            const searchTerm = `%${query.search}%`
            params.push(searchTerm)
        }

        // Add conditions to query
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ')
        }

        // Sort
        const sortField = query.sort || 'display_order'
        const sortOrder = query.order === 'desc' ? 'DESC' : 'ASC'
        sql += ` ORDER BY ${sortField} ${sortOrder}`

        console.log('[Admin Wilayah API] Executing SQL:', sql)
        console.log('[Admin Wilayah API] With params:', params)

        const wilayah = await allQuery(sql, params) as any[]

        console.log(`[Admin Wilayah API] Found ${wilayah.length} wilayah`)

        return {
            success: true,
            data: wilayah
        }

    } catch (error: any) {
        console.error('[Admin Wilayah API] Error fetching wilayah:', error)
        console.error('[Admin Wilayah API] Error stack:', error.stack)

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch wilayah',
            data: error.message
        })
    }
})
