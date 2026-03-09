import { getQuery as getOne } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Entry ID is required'
        })
    }

    try {
        // Verify user authentication using JWT
        const decoded = requireAuth(event)

        // Get user details
        const user = await getOne(
            'SELECT id, user_category FROM users WHERE id = ?',
            [decoded.userId]
        )

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'Invalid user'
            })
        }

        // Check if user has kronik access
        const validCategories = ['PARISH_COUNCIL', 'CATEGORICAL_GROUP', 'REGION', 'COMMUNITY', 'LINGKUNGAN']
        if (!validCategories.includes(user.user_category)) {
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to access kronik entries'
            })
        }

        // Get the entry
        const entry = await getOne(`
      SELECT 
        ke.*,
        kc.name as category_name,
        kc.slug as category_slug,
        ks.name as section_name,
        u.full_name as author_name
      FROM kronik_entries ke
      LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
      LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
      LEFT JOIN users u ON ke.author_id = u.id
      WHERE ke.id = ?
    `, [id])

        if (!entry) {
            throw createError({
                statusCode: 404,
                message: 'Entry not found'
            })
        }

        // Only allow author to view their own entries (unless published)
        if (entry.status !== 'published' && entry.author_id !== user.id) {
            throw createError({
                statusCode: 403,
                message: 'You can only view your own entries'
            })
        }

        return {
            success: true,
            data: entry
        }
    } catch (error: any) {
        console.error('Error fetching kronik entry:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch kronik entry'
        })
    }
})
