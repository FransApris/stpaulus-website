import { getQuery as getOne } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { requireKronikUserAccess } from '~/server/utils/kronik-auth'
import { getRouterParam } from 'h3'

const normalizeImagePath = (value: unknown): string | null => {
    const text = String(value || '').trim()
    if (!text) return null
    if (text.startsWith('http://') || text.startsWith('https://')) return text
    if (text.startsWith('/api/kronik/media/')) return text
    if (text.startsWith('/uploads/kronik/')) {
        const filename = text.split('/').pop()
        return filename ? `/api/kronik/media/${encodeURIComponent(filename)}` : null
    }
    if (text.startsWith('/')) return text
    return `/api/kronik/media/${encodeURIComponent(text)}`
}

const ensureImagePathExists = (value: unknown): string | null => {
    return normalizeImagePath(value)
}

const parseJsonMaybeNested = (value: any) => {
    if (!value) return []
    let parsed: any = value

    for (let i = 0; i < 2; i++) {
        if (typeof parsed !== 'string') break
        const text = parsed.trim()
        if (!text) return []
        try {
            parsed = JSON.parse(text)
        } catch {
            break
        }
    }

    return Array.isArray(parsed) ? parsed : []
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

        entry.featured_image = ensureImagePathExists(entry.featured_image)
        entry.gallery = parseJsonMaybeNested(entry.gallery)
            .map((img: unknown) => ensureImagePathExists(img))
            .filter(Boolean)
        entry.documents = parseJsonMaybeNested(entry.documents)

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
