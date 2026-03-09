// API: Delete wilayah
// Path: DELETE /api/admin/wilayah/:id
// Purpose: Delete wilayah from database

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Wilayah ID is required'
            })
        }

        // Check if wilayah exists
        const existing = await getQuery('SELECT id FROM wilayah WHERE id = ?', [id]) as any
        if (!existing) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Wilayah not found'
            })
        }

        // Check if wilayah is used by any lingkungan
        const lingkunganCount = await getQuery(
            'SELECT COUNT(*) as count FROM lingkungan WHERE wilayah_id = ?',
            [id]
        ) as any

        if (lingkunganCount.count > 0) {
            const errorMessage = `Cannot delete wilayah: ${lingkunganCount.count} lingkungan are still using this wilayah. Please reassign or delete them first.`
            console.log(`[Admin Wilayah API] Deletion blocked: ${errorMessage}`)
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: errorMessage
            })
        }

        // Delete wilayah
        await runQuery('DELETE FROM wilayah WHERE id = ?', [id])

        console.log(`[Admin Wilayah API] Deleted wilayah ID: ${id}`)

        return {
            success: true,
            message: 'Wilayah deleted successfully'
        }
    } catch (error: any) {
        console.error('[Admin Wilayah API] Error deleting wilayah:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to delete wilayah',
            data: error.data
        })
    }
})
