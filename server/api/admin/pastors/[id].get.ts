// API: Get single pastor by ID
// Path: GET /api/admin/pastors/:id
// Purpose: Fetch detailed pastor information

import { getQuery } from '~/server/database/db'

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

        // Fetch pastor
        const pastor = await getQuery(
            'SELECT * FROM pastors WHERE id = ?',
            [id]
        ) as any

        if (!pastor) {
            throw createError({
                statusCode: 404,
                message: 'Pastor not found'
            })
        }

        console.log(`[Admin Pastors API] Fetched pastor ID: ${id}`)

        return {
            success: true,
            data: pastor
        }

    } catch (error: any) {
        console.error('[Admin Pastors API] Error fetching pastor:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch pastor'
        })
    }
})
