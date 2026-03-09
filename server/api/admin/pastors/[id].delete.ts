// API: Delete pastor
// Path: DELETE /api/admin/pastors/:id
// Purpose: Remove pastor from database

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        // TODO: Add authentication check
        // const user = await requireAuth(event)
        // if (!user || !user.isAdmin) throw createError({ statusCode: 403, message: 'Forbidden' })

        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Pastor ID is required'
            })
        }

        // Check if pastor exists
        const pastor = await getQuery('SELECT id, name FROM pastors WHERE id = ?', [id]) as any
        if (!pastor) {
            throw createError({
                statusCode: 404,
                message: 'Pastor not found'
            })
        }

        // Delete pastor
        await runQuery('DELETE FROM pastors WHERE id = ?', [id])

        console.log(`[Admin Pastors API] Deleted pastor ID: ${id} (${pastor.name})`)

        return {
            success: true,
            message: `Pastor "${pastor.name}" deleted successfully`,
            data: { id: pastor.id, name: pastor.name }
        }
    } catch (error: any) {
        console.error('[Admin Pastors API] Error deleting pastor:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to delete pastor'
        })
    }
})
