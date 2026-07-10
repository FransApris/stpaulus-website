// API: Delete seksi
// Path: DELETE /api/admin/seksi/[id]

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id
        if (!id) throw createError({ statusCode: 400, message: 'ID is required' })

        const existing = await getQuery('SELECT id FROM seksi WHERE id = ?', [id])
        if (!existing) throw createError({ statusCode: 404, message: 'Seksi not found' })

        await runQuery('DELETE FROM seksi WHERE id = ?', [id])

        return {
            success: true,
            message: 'Seksi deleted successfully'
        }

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to delete seksi',
            data: error.data
        })
    }
})
