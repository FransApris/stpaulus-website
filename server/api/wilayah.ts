// API: Get all wilayah (public endpoint)
// Path: GET /api/wilayah
// Purpose: Fetch all visible wilayah for public display
// NOTE: File intentionally named wilayah.ts (no .get suffix) so Nuxt
//       registers it as GET /api/wilayah automatically.

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (_event) => {
    try {
        console.log('[Wilayah API] Fetching wilayah list')

        const sql = `
            SELECT 
                id,
                nama
            FROM wilayah
            WHERE is_visible = 1
            ORDER BY display_order ASC, nama ASC
        `

        const wilayah = await allQuery(sql, []) as any[]

        console.log(`[Wilayah API] Found ${wilayah.length} wilayah`)

        return {
            data: wilayah
        }

    } catch (error: any) {
        console.error('[Wilayah API] Error fetching wilayah:', error)
        console.error('[Wilayah API] Error stack:', error.stack)

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch wilayah',
            data: error.message
        })
    }
})
