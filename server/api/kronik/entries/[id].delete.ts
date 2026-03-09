import { getQuery as getOne, runQuery } from '~/server/database/db'
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
                message: 'You do not have permission to delete kronik entries'
            })
        }

        // Get the entry to verify ownership
        const entry = await getOne(
            'SELECT id, author_id, status FROM kronik_entries WHERE id = ?',
            [id]
        )

        if (!entry) {
            throw createError({
                statusCode: 404,
                message: 'Entry not found'
            })
        }

        // Only allow author to delete their own entries
        if (entry.author_id !== user.id) {
            throw createError({
                statusCode: 403,
                message: 'You can only delete your own entries'
            })
        }

        // Only allow deleting draft or pending entries
        if (entry.status === 'published') {
            throw createError({
                statusCode: 403,
                message: 'Cannot delete published entries. Please contact admin.'
            })
        }

        // Delete the entry
        await runQuery('DELETE FROM kronik_entries WHERE id = ?', [id])

        return {
            success: true,
            message: 'Entry deleted successfully'
        }
    } catch (error: any) {
        console.error('Error deleting kronik entry:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to delete kronik entry'
        })
    }
})
