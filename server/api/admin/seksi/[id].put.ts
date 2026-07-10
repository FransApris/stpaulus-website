// API: Update seksi
// Path: PUT /api/admin/seksi/[id]

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id
        const body = await readBody(event)

        if (!id) throw createError({ statusCode: 400, message: 'ID is required' })
        if (!body.nama) throw createError({ statusCode: 400, message: 'Nama seksi is required' })

        // Check if exists
        const existing = await getQuery('SELECT id FROM seksi WHERE id = ?', [id])
        if (!existing) throw createError({ statusCode: 404, message: 'Seksi not found' })

        const sql = `UPDATE seksi SET nama = ?, bidang = ?, display_order = ?, is_active = ? WHERE id = ?`
        const is_active_val = body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1
        const values = [body.nama, body.bidang || null, body.display_order || 0, is_active_val, id]

        await runQuery(sql, values)
        const updated = await getQuery('SELECT * FROM seksi WHERE id = ?', [id])

        return {
            success: true,
            message: 'Seksi updated successfully',
            data: updated
        }

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to update seksi',
            data: error.data
        })
    }
})
