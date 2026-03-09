// API: Update wilayah
// Path: PUT /api/admin/wilayah/:id
// Purpose: Update existing wilayah information

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Wilayah ID is required'
            })
        }

        // Check if wilayah exists
        const existing = await getQuery('SELECT id FROM wilayah WHERE id = ?', [id]) as any
        if (!existing) {
            throw createError({
                statusCode: 404,
                message: 'Wilayah not found'
            })
        }

        // Prepare update data
        const updates: string[] = []
        const values: any[] = []

        const fields = ['nama', 'keterangan', 'display_order', 'is_visible']

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
        values.push(null) // TODO: Add user.id when auth is implemented
        values.push(id)

        // Update database
        const sql = `
            UPDATE wilayah 
            SET ${updates.join(', ')}, updated_by = ?
            WHERE id = ?
        `

        await runQuery(sql, values)

        console.log(`[Admin Wilayah API] Updated wilayah ID: ${id}`)

        // Fetch updated wilayah
        const updated = await getQuery('SELECT * FROM wilayah WHERE id = ?', [id]) as any

        return {
            success: true,
            message: 'Wilayah updated successfully',
            data: updated
        }
    } catch (error: any) {
        console.error('[Admin Wilayah API] Error updating wilayah:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to update wilayah',
            data: error.data
        })
    }
})
