// API: Get all seksi (admin endpoint)
// Path: GET /api/admin/seksi
// Purpose: Fetch all seksi for admin management

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // Build SQL query
        let sql = `
            SELECT 
                id,
                nama,
                bidang,
                is_active,
                display_order,
                created_at
            FROM seksi
        `

        const params: any[] = []
        const conditions: string[] = []

        // Filter by visibility if provided
        if (query.is_active !== undefined && query.is_active !== 'all') {
            conditions.push('is_active = ?')
            params.push(query.is_active === 'true' || query.is_active === '1' ? 1 : 0)
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

        const seksi = await allQuery(sql, params) as any[]

        return {
            success: true,
            data: seksi
        }

    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch seksi',
            data: error.message
        })
    }
})
