// API: Create new lingkungan
// Path: POST /api/admin/lingkungan
// Purpose: Add new lingkungan to database

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Validate required fields
        if (!body.no || !body.nama) {
            throw createError({
                statusCode: 400,
                message: 'Nomor and nama lingkungan are required'
            })
        }

        // Check if lingkungan number already exists IN THE SAME WILAYAH (not globally)
        // Lingkungan number is unique per wilayah, not across all wilayah
        let existing = null
        if (body.wilayah_id) {
            existing = await getQuery(
                'SELECT id FROM lingkungan WHERE no = ? AND wilayah_id = ?', 
                [body.no, body.wilayah_id]
            ) as any
        } else if (body.wilayah_text) {
            existing = await getQuery(
                'SELECT id FROM lingkungan WHERE no = ? AND wilayah_text = ?', 
                [body.no, body.wilayah_text]
            ) as any
        }
        
        if (existing) {
            const wilayahName = body.wilayah_text || `wilayah_id ${body.wilayah_id}`
            throw createError({
                statusCode: 400,
                message: `Lingkungan nomor ${body.no} di ${wilayahName} sudah ada`
            })
        }

        // Prepare data
        const lingkunganData = {
            no: body.no,
            nama: body.nama,
            wilayah_id: body.wilayah_id || null,
            wilayah_text: body.wilayah_text || null,
            ketua: body.ketua || null,
            telp: body.telp || null,
            no_hp_pengurus: body.no_hp_pengurus || null,
            email: body.email || null,
            alamat: body.alamat || null,
            jumlah_kk: body.jumlah_kk || 0,
            jumlah_jiwa: body.jumlah_jiwa || 0,
            color: body.color || '#3B82F6',
            keterangan: body.keterangan || null,
            display_order: body.display_order || 0,
            is_visible: body.is_visible !== undefined ? body.is_visible : true,
            created_by: null,
            updated_by: null
        }

        // Insert into database
        const sql = `
            INSERT INTO lingkungan (
                no, nama, wilayah_id, wilayah_text, ketua, telp, no_hp_pengurus, email, alamat,
                jumlah_kk, jumlah_jiwa, color, keterangan,
                display_order, is_visible, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        const values = [
            lingkunganData.no,
            lingkunganData.nama,
            lingkunganData.wilayah_id,
            lingkunganData.wilayah_text,
            lingkunganData.ketua,
            lingkunganData.telp,
            lingkunganData.no_hp_pengurus,
            lingkunganData.email,
            lingkunganData.alamat,
            lingkunganData.jumlah_kk,
            lingkunganData.jumlah_jiwa,
            lingkunganData.color,
            lingkunganData.keterangan,
            lingkunganData.display_order,
            lingkunganData.is_visible,
            lingkunganData.created_by,
            lingkunganData.updated_by
        ]

        const result = await runQuery(sql, values)

        console.log(`[Admin Lingkungan API] Created lingkungan ID: ${result.insertId}`)

        // Fetch the created lingkungan with wilayah data
        const created = await getQuery(
            `SELECT l.*, w.nama as wilayah_nama 
             FROM lingkungan l 
             LEFT JOIN wilayah w ON l.wilayah_id = w.id 
             WHERE l.id = ?`,
            [result.insertId]
        ) as any

        return {
            success: true,
            message: 'Lingkungan created successfully',
            data: created
        }

    } catch (error: any) {
        console.error('[Admin Lingkungan API] Error creating lingkungan:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to create lingkungan',
            data: error.data
        })
    }
})
