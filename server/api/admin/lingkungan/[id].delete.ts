// API: Delete lingkungan
// Path: DELETE /api/admin/lingkungan/:id
// Purpose: Delete lingkungan from database

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Lingkungan ID is required'
            })
        }

        // Check if lingkungan exists
        const existing = await getQuery('SELECT id, nama FROM lingkungan WHERE id = ?', [id]) as any
        if (!existing) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Lingkungan not found'
            })
        }

        // Delete lingkungan
        await runQuery('DELETE FROM lingkungan WHERE id = ?', [id])

        console.log(`[Admin Lingkungan API] Deleted lingkungan ID: ${id} (${existing.nama})`)

        return {
            success: true,
            message: 'Lingkungan deleted successfully'
        }
    } catch (error: any) {
        console.error('[Admin Lingkungan API] Error deleting lingkungan:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to delete lingkungan',
            data: error.data
        })
    }
})
