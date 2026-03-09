import { defineEventHandler, readBody, getRouterParam } from 'h3'
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

        const body = await readBody(event)

        // Check if devotion exists
        const existing = await getQuery('SELECT id FROM devotions WHERE id = ?', [id])
        if (!existing) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Devotion not found'
            })
        }

        // Update devotion
        await runQuery(
            `UPDATE devotions 
       SET title = ?, type = ?, day_of_week = ?, time = ?, 
           location = ?, description = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
            [
                body.title,
                body.type,
                body.day_of_week,
                body.time,
                body.location || 'Gereja Utama',
                body.description || null,
                body.is_active !== false ? 1 : 0,
                body.display_order || 0,
                id
            ]
        )

        console.log('[Devotions API] Updated devotion ID:', id)

        return {
            success: true,
            message: 'Devotion updated successfully'
        }
    } catch (error: any) {
        console.error('[Devotions API] Error updating devotion:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to update devotion'
        })
    }
})
