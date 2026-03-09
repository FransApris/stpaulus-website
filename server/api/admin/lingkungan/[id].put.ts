// API: Update lingkungan
// Path: PUT /api/admin/lingkungan/:id
// Purpose: Update existing lingkungan information

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Lingkungan ID is required'
            })
        }

        // Check if lingkungan exists
        const existing = await getQuery('SELECT id, no FROM lingkungan WHERE id = ?', [id]) as any
        if (!existing) {
            throw createError({
                statusCode: 404,
                message: 'Lingkungan not found'
            })
        }

        // If updating lingkungan number, check for duplicates
        if (body.no && body.no !== existing.no) {
            const duplicate = await getQuery('SELECT id FROM lingkungan WHERE no = ? AND id != ?', [body.no, id]) as any
            if (duplicate) {
                throw createError({
                    statusCode: 400,
                    message: `Lingkungan nomor ${body.no} already exists`
                })
            }
        }

        // Prepare update data
        const updates: string[] = []
        const values: any[] = []

        const fields = [
            'no', 'nama', 'wilayah_id', 'wilayah_text', 'ketua', 'telp', 'no_hp_pengurus', 'email', 'alamat',
            'jumlah_kk', 'jumlah_jiwa', 'color', 'keterangan', 'display_order', 'is_visible'
        ]

        fields.forEach(field => {
            if (body[field] !== undefined) {
                updates.push(`${field} = ?`)
                values.push(body[field])
            }
        })

        if (updates.length === 0) {
            throw createError({
                statusCode: 400,
                message: 'No fields to update'
            })
        }

        // Add updated_by and id to values
        values.push(null)
        values.push(id)

        // Update database
        const sql = `
            UPDATE lingkungan 
            SET ${updates.join(', ')}, updated_by = ?
            WHERE id = ?
        `

        await runQuery(sql, values)

        console.log(`[Admin Lingkungan API] Updated lingkungan ID: ${id}`)

        // Fetch updated lingkungan with wilayah data
        const updated = await getQuery(
            `SELECT l.*, w.nama as wilayah_nama 
             FROM lingkungan l 
             LEFT JOIN wilayah w ON l.wilayah_id = w.id 
             WHERE l.id = ?`,
            [id]
        ) as any

        return {
            success: true,
            message: 'Lingkungan updated successfully',
            data: updated
        }
    } catch (error: any) {
        console.error('[Admin Lingkungan API] Error updating lingkungan:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to update lingkungan',
            data: error.data
        })
    }
})
