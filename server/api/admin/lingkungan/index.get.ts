// API: Get all lingkungan (admin endpoint)
// Path: GET /api/admin/lingkungan
// Purpose: Fetch all lingkungan for admin management

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // Build SQL query with wilayah join and ketua from DPP
        let sql = `
            SELECT
                l.id,
                l.no,
                l.nama,
                l.wilayah_id,
                l.wilayah_text,
                w.nama as wilayah_nama,
                COALESCE(dpp.name, l.ketua) as ketua,
                l.telp,
                l.no_hp_pengurus,
                l.email,
                l.alamat,
                l.jumlah_kk,
                l.jumlah_jiwa,
                l.color,
                l.keterangan,
                l.display_order,
                l.is_visible,
                l.created_at,
                l.updated_at
            FROM lingkungan l
            LEFT JOIN wilayah w ON l.wilayah_id = w.id
            LEFT JOIN dpp_members dpp ON (
                dpp.position_category = 'ketua_lingkungan'
                AND dpp.wilayah_name = COALESCE(w.nama, l.wilayah_text)
                AND dpp.lingkungan_number = l.no
                AND dpp.is_active = 1
            )
        `

        const params: any[] = []
        const conditions: string[] = []

        // Filter by wilayah_id if provided
        if (query.wilayah_id && query.wilayah_id !== 'all') {
            conditions.push('l.wilayah_id = ?')
            params.push(query.wilayah_id)
        }

        // Filter by visibility if provided
        if (query.is_visible !== undefined && query.is_visible !== 'all') {
            conditions.push('l.is_visible = ?')
            params.push(query.is_visible === 'true' || query.is_visible === '1')
        }

        // Search by name or ketua
        if (query.search) {
            conditions.push('(l.nama LIKE ? OR l.ketua LIKE ? OR l.wilayah_text LIKE ?)')
            const searchTerm = `%${query.search}%`
            params.push(searchTerm, searchTerm, searchTerm)
        }

        // Add conditions to query
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ')
        }

        // Sort
        const sortField = (query.sort as string) || 'display_order'
        const sortOrder = query.order === 'desc' ? 'DESC' : 'ASC'

        // Map sort field to include table prefix
        const sortFieldMap: Record<string, string> = {
            'display_order': 'l.display_order',
            'no': 'l.no',
            'nama': 'l.nama',
            'jumlah_kk': 'l.jumlah_kk',
            'created_at': 'l.created_at'
        }

        const finalSortField = sortFieldMap[sortField] || 'l.display_order'
        sql += ` ORDER BY ${finalSortField} ${sortOrder}`

        console.log('[Admin Lingkungan API] Executing SQL:', sql)
        console.log('[Admin Lingkungan API] With params:', params)

        const lingkungan = await allQuery(sql, params) as any[]

        console.log(`[Admin Lingkungan API] Found ${lingkungan.length} lingkungan`)

        return {
            success: true,
            data: lingkungan
        }

    } catch (error: any) {
        console.error('[Admin Lingkungan API] Error fetching lingkungan:', error)
        console.error('[Admin Lingkungan API] Error stack:', error.stack)

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch lingkungan',
            data: error.message
        })
    }
})
