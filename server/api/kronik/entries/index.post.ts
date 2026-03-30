import { getQuery as getOne, runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { requireKronikUserAccess } from '~/server/utils/kronik-auth'
import { readBody } from 'h3'

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
    try {
        // Verify user authentication using JWT
        const decoded = requireAuth(event)

        // User-only guard: admin CMS accounts cannot use kronik user endpoints.
        const user = await requireKronikUserAccess(decoded.userId)

        const body = await readBody(event)
        const normalizedFeaturedImage = normalizeImagePath(body.featured_image)
        const normalizedGallery = normalizeGalleryInput(body.gallery)

        // Validate required fields
        if (!body.category_id || !body.what_title || !body.when_date) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields: category_id, what_title, when_date'
            })
        }

        // Insert the entry
        const result = await runQuery(
            `INSERT INTO kronik_entries (
        category_id,
        section_id,
        what_title,
        what_description,
        who_involved,
        when_date,
        when_duration,
        where_location,
        where_address,
        why_purpose,
        how_process,
        featured_image,
        gallery,
        author_id,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
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
                user.id,
                body.status || 'draft'
            ]
        )

        // Get the created entry
        const entry = await getOne(
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
            [result.insertId]
        )

        return {
            success: true,
            message: 'Kronik entry created successfully',
            data: entry
        }
    } catch (error: any) {
        console.error('Error creating kronik entry:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to create kronik entry'
        })
    }
})
