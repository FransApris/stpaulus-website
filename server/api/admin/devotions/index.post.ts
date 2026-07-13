import { defineEventHandler, readBody } from 'h3'
import { runQuery } from '~/server/database/db'
import { requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    // Check permission
    requirePermission('manage_mass_schedules')(event)

    try {
        const body = await readBody(event)

        // Validate required fields
        if (!body.title || !body.type || !body.day_of_week || !body.time) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Title, type, day_of_week, and time are required'
            })
        }

        // Insert devotion
        const result = await runQuery(
            `INSERT INTO devotions (title, type, day_of_week, time, location, description, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                body.title,
                body.type,
                body.day_of_week,
                body.time,
                body.location || 'Gereja Utama',
                body.description || null,
                // PERBAIKAN LOGIKA DISINI
                (body.is_active === true || body.is_active === 1 || body.is_active === '1') ? 1 : 0,
                body.display_order || 0
            ]
        )

        console.log('[Devotions API] Created devotion ID:', (result as any).insertId)

        return {
            success: true,
            message: 'Devotion created successfully',
            data: {
                id: (result as any).insertId,
                ...body
            }
        }
    } catch (error: any) {
        console.error('[Devotions API] Error creating devotion:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to create devotion'
        })
    }
})