import { allQuery, getQuery as getOne } from '~/server/database/db'
import { getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { requireKronikUserAccess } from '~/server/utils/kronik-auth'

export default defineEventHandler(async (event) => {
    const queryParams = getQuery(event)
    const authorOnly = queryParams.author_only === 'true'
    const status = queryParams.status as string || undefined
    const categoryId = queryParams.category_id ? parseInt(queryParams.category_id as string) : undefined
    const searchQuery = queryParams.search as string || undefined
    const page = parseInt(queryParams.page as string) || 1
    const limit = parseInt(queryParams.limit as string) || 10
    const offset = (page - 1) * limit

    console.log('[KRONIK API] Request received:', { authorOnly, status, categoryId, searchQuery, page, limit })

    try {
        // Check if kronik_entries table exists
        try {
            await getOne('SELECT 1 FROM kronik_entries LIMIT 1')
        } catch (tableError: any) {
            console.error('[KRONIK API] Table kronik_entries does not exist or is empty:', tableError.message)
            // Return empty result instead of error
            return {
                success: true,
                data: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0
                },
                message: 'Tabel kronik_entries belum ada. Silakan jalankan migrasi database.'
            }
        }
        // If author_only is requested, verify user authentication
        let userId: number | null = null
        if (authorOnly) {
            // Verify JWT token
            const decoded = requireAuth(event)
            const user = await requireKronikUserAccess(decoded.userId)
            userId = user.id

            console.log('[KRONIK API] User authenticated:', userId, 'category:', user.user_category)
        }

        // Build WHERE clause
        const whereClauses: string[] = []
        const whereParams: any[] = []

        if (status) {
            whereClauses.push('ke.status = ?')
            whereParams.push(status)
        }

        if (categoryId) {
            whereClauses.push('ke.category_id = ?')
            whereParams.push(categoryId)
        }

        if (authorOnly && userId) {
            whereClauses.push('ke.author_id = ?')
            whereParams.push(userId)
        }

        if (searchQuery) {
            whereClauses.push('(ke.what_title LIKE ? OR ke.what_description LIKE ?)')
            whereParams.push(`%${searchQuery}%`, `%${searchQuery}%`)
        }

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

        console.log('[KRONIK API] Query params:', { authorOnly, status, categoryId, searchQuery, userId })
        console.log('[KRONIK API] WHERE clause:', whereClause)
        console.log('[KRONIK API] WHERE params:', whereParams)

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM kronik_entries ke ${whereClause}`
        console.log('[KRONIK API] Count query:', countQuery)

        const countResult = await getOne(countQuery, whereParams)
        const total = countResult?.total || 0
        console.log('[KRONIK API] Total entries found:', total)

        // Get entries with category and section info
        const entries = await allQuery(
            `SELECT 
        ke.id,
        ke.what_title,
        ke.what_description,
        ke.when_date,
        ke.when_duration,
        ke.where_location,
        ke.where_address,
        ke.who_involved,
        ke.why_purpose,
        ke.how_process,
        ke.status,
        ke.created_at,
        ke.updated_at,
        kc.id as category_id,
        kc.name as category_name,
        kc.slug as category_slug,
        ks.id as section_id,
        ks.name as section_name,
        u.full_name as author_name
      FROM kronik_entries ke
      LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
      LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
      LEFT JOIN users u ON ke.author_id = u.id
      ${whereClause}
      ORDER BY ke.when_date DESC, ke.created_at DESC
      LIMIT ? OFFSET ?`,
            [...whereParams, limit, offset]
        )

        return {
            success: true,
            data: entries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error: any) {
        console.error('Error fetching kronik entries:', error)
        console.error('Error stack:', error.stack)
        console.error('Error query params:', { authorOnly, status, categoryId, searchQuery })

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: `Failed to fetch kronik entries: ${error.message}`
        })
    }
})
