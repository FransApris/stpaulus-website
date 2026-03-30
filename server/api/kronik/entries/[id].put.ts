import { getQuery as getOne, runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { requireKronikUserAccess } from '~/server/utils/kronik-auth'
import { getRouterParam } from 'h3'

const normalizeImagePath = (value: unknown): string | null => {
    const text = String(value || '').trim()
    if (!text) return null
    if (text.startsWith('http://') || text.startsWith('https://')) return text
    if (text.startsWith('/')) return text
    return `/uploads/kronik/${text}`
}

const normalizeGalleryInput = (value: unknown): string | null => {
    let list: unknown[] = []

    if (Array.isArray(value)) {
        list = value
    } else if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value)
            if (Array.isArray(parsed)) {
                list = parsed
            }
        } catch {
            // Ignore invalid JSON and store as null.
        }
    }

    const normalized = list
        .map(item => normalizeImagePath(item))
        .filter(Boolean)

    return normalized.length > 0 ? JSON.stringify(normalized) : null
}

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

        const user = await requireKronikUserAccess(decoded.userId)

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

        // Only allow author to update their own entries
        if (entry.author_id !== user.id) {
            throw createError({
                statusCode: 403,
                message: 'You can only update your own entries'
            })
        }

        const body = await readBody(event)
        const normalizedFeaturedImage = normalizeImagePath(body.featured_image)
        const normalizedGallery = normalizeGalleryInput(body.gallery)

        // Validate required fields with detailed error
        const missingFields: string[] = []
        if (!body.category_id) missingFields.push('category_id')
        if (!body.what_title) missingFields.push('what_title')
        if (!body.when_date) missingFields.push('when_date')

        if (missingFields.length > 0) {
            console.error('[Update Kronik] Missing fields:', missingFields, 'Received:', {
                category_id: body.category_id,
                what_title: body.what_title,
                when_date: body.when_date
            })
            throw createError({
                statusCode: 400,
                message: `Missing required fields: ${missingFields.join(', ')}`
            })
        }

        // Update the entry
        await runQuery(
            `UPDATE kronik_entries SET
        category_id = ?,
        section_id = ?,
        what_title = ?,
        what_description = ?,
        who_involved = ?,
        when_date = ?,
        when_duration = ?,
        where_location = ?,
        where_address = ?,
        why_purpose = ?,
        how_process = ?,
        featured_image = ?,
        gallery = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?`,
            [
                body.category_id,
                body.section_id,
                body.what_title,
                body.what_description || null,
                body.who_involved || null,
                body.when_date,
                body.when_duration || null,
                body.where_location || null,
                body.where_address || null,
                body.why_purpose || null,
                body.how_process || null,
                normalizedFeaturedImage,
                normalizedGallery,
                body.status || 'pending',
                id
            ]
        )

        // Get the updated entry
        const updatedEntry = await getOne(
            `SELECT 
        ke.*,
        kc.name as category_name,
        ks.name as section_name,
        u.full_name as author_name
      FROM kronik_entries ke
      LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
      LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
      LEFT JOIN users u ON ke.author_id = u.id
      WHERE ke.id = ?`,
            [id]
        )

        return {
            success: true,
            message: 'Kronik entry updated successfully',
            data: updatedEntry
        }
    } catch (error: any) {
        console.error('Error updating kronik entry:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to update kronik entry'
        })
    }
})
