// API: GET /api/seksi
// Public endpoint - ambil semua seksi aktif, dikelompokkan per bidang
import { allQuery } from '../database/db'

export default defineEventHandler(async () => {
    try {
        const rows = await allQuery(
            'SELECT id, nama, bidang FROM seksi WHERE is_active = 1 ORDER BY display_order ASC'
        )
        return rows
    } catch (error) {
        console.error('Error fetching seksi:', error)
        throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
    }
})
