// API: Create new seksi
// Path: POST /api/admin/seksi

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        if (!body.nama) {
            throw createError({ statusCode: 400, message: 'Nama seksi is required' })
        }

        const data = {
            nama: body.nama,
            bidang: body.bidang || null,
            display_order: body.display_order || 0,
            is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1
        }

        const sql = `INSERT INTO seksi (nama, bidang, display_order, is_active) VALUES (?, ?, ?, ?)`
        const values = [data.nama, data.bidang, data.display_order, data.is_active]

        const result = await runQuery(sql, values)
        const created = await getQuery('SELECT * FROM seksi WHERE id = ?', [result.insertId]) as any

        return {
            success: true,
            message: 'Seksi created successfully',
            data: created
        }

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to create seksi',
            data: error.data
        })
    }
})
