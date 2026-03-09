import { defineEventHandler, getRouterParam } from 'h3'
import { runQuery, getQuery } from '~/server/database/db'
import { requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    // Check permission
    requirePermission('manage_mass_schedules')(event)

    try {
        const id = getRouterParam(event, 'id')
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Devotion ID is required'
            })
        }

        // Check if devotion exists
        const existing = await getQuery('SELECT id FROM devotions WHERE id = ?', [id])
        if (!existing) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Devotion not found'
            })
        }

        // Delete devotion
        await runQuery('DELETE FROM devotions WHERE id = ?', [id])

        console.log('[Devotions API] Deleted devotion ID:', id)

        return {
            success: true,
            message: 'Devotion deleted successfully'
        }
    } catch (error: any) {
        console.error('[Devotions API] Error deleting devotion:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to delete devotion'
        })
    }
})
