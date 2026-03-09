// Admin API: Get all kronik entries for admin
import { allQuery, getQuery as getOne } from '~/server/database/db'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // TODO: Add authentication middleware
  // const user = event.context.user
  // if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const queryParams = getQuery(event)
  const page = parseInt(queryParams.page as string) || 1
  const limit = parseInt(queryParams.limit as string) || 20
  const offset = (page - 1) * limit
  const status = queryParams.status as string
  const categoryId = queryParams.category_id
  const sectionId = queryParams.section_id
  const search = queryParams.search as string

  try {
    let whereConditions: string[] = []
    let params: any[] = []

    if (status) {
      whereConditions.push('e.status = ?')
      params.push(status)
    }

    if (categoryId) {
      whereConditions.push('e.category_id = ?')
      params.push(categoryId)
    }

    if (sectionId) {
      whereConditions.push('e.section_id = ?')
      params.push(sectionId)
    }

    if (search) {
      whereConditions.push('(e.what_title LIKE ? OR e.what_description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''

    // Get total count
    const countResult = await getOne(`
      SELECT COUNT(*) as total
      FROM kronik_entries e
      ${whereClause}
    `, params)

    // Get entries
    const entries = await allQuery(`
      SELECT 
        e.id,
        e.what_title,
        e.when_date,
        e.where_location,
        e.status,
        e.views_count,
        e.created_at,
        e.published_at,
        c.name as category_name,
        c.slug as category_slug,
        s.name as section_name,
        u.username as author_name
      FROM kronik_entries e
      INNER JOIN kronik_categories c ON e.category_id = c.id
      LEFT JOIN kronik_sections s ON e.section_id = s.id
      LEFT JOIN users u ON e.author_id = u.id
      ${whereClause}
      ORDER BY e.when_date DESC, e.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    return {
      success: true,
      data: {
        entries,
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching admin entries:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch entries'
    })
  }
})
