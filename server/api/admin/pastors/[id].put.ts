// API: Update pastor
// Path: PUT /api/admin/pastors/:id
// Purpose: Update existing pastor information

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        // TODO: Add authentication check
        // const user = await requireAuth(event)
        // if (!user || !user.isAdmin) throw createError({ statusCode: 403, message: 'Forbidden' })

        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Pastor ID is required'
            })
        }

        // Check if pastor exists
        const existing = await getQuery('SELECT id FROM pastors WHERE id = ?', [id]) as any
        if (!existing) {
            throw createError({
                statusCode: 404,
                message: 'Pastor not found'
            })
        }

        // Prepare update data
        const updates: string[] = []
        const values: any[] = []

        const fields = [
            'name', 'full_name', 'title', 'position_type', 'start_year', 'end_year', 'status',
            'photo_url', 'bio', 'quote', 'achievements', 'email', 'phone',
            'birth_place', 'birth_date', 'ordination_date',
            'display_order', 'is_visible'
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
        values.push(null) // TODO: Add user.id when auth is implemented
        values.push(id)

        // Update database
        const sql = `
      UPDATE pastors 
      SET ${updates.join(', ')}, updated_by = ?
      WHERE id = ?
    `

        await runQuery(sql, values)

        console.log(`[Admin Pastors API] Updated pastor ID: ${id}`)

        // Fetch updated pastor
        const updated = await getQuery('SELECT * FROM pastors WHERE id = ?', [id]) as any

        return {
            success: true,
            message: 'Pastor updated successfully',
            data: updated
        }
    } catch (error: any) {
        console.error('[Admin Pastors API] Error updating pastor:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to update pastor'
        })
    }
})
