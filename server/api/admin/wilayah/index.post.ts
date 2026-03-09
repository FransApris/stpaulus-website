// API: Create new wilayah
// Path: POST /api/admin/wilayah
// Purpose: Add new wilayah to database

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Validate required fields
        if (!body.nama) {
            throw createError({
                statusCode: 400,
                message: 'Nama wilayah is required'
            })
        }

        // Prepare data
        const wilayahData = {
            nama: body.nama,
            keterangan: body.keterangan || null,
            display_order: body.display_order || 0,
            is_visible: body.is_visible !== undefined ? body.is_visible : true,
            created_by: null, // TODO: Add user.id when auth is implemented
            updated_by: null
        }

        // Insert into database
        const sql = `
            INSERT INTO wilayah (
                nama, keterangan, display_order, is_visible, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?)
        `

        const values = [
            wilayahData.nama,
            wilayahData.keterangan,
            wilayahData.display_order,
            wilayahData.is_visible,
            wilayahData.created_by,
            wilayahData.updated_by
        ]

        const result = await runQuery(sql, values)

        console.log(`[Admin Wilayah API] Created wilayah ID: ${result.insertId}`)

        // Fetch the created wilayah
        const created = await getQuery('SELECT * FROM wilayah WHERE id = ?', [result.insertId]) as any

        return {
            success: true,
            message: 'Wilayah created successfully',
            data: created
        }

    } catch (error: any) {
        console.error('[Admin Wilayah API] Error creating wilayah:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to create wilayah',
            data: error.data
        })
    }
})
