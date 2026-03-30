// Public API: Get kronik entries by category
import { allQuery, getQuery as getOne } from '~/server/database/db'
import { getQuery } from 'h3'

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

export default defineEventHandler(async (event) => {
  const categorySlug = getRouterParam(event, 'category')
  const queryParams = getQuery(event)
  const page = parseInt(queryParams.page as string) || 1
  const limit = parseInt(queryParams.limit as string) || 12
  const offset = (page - 1) * limit
  const sectionId = queryParams.section_id

  if (!categorySlug) {
    throw createError({
      statusCode: 400,
      message: 'Category slug is required'
    })
  }

  try {
    let whereClause = 'c.slug = ? AND e.status = ?'
    let params: any[] = [categorySlug, 'published']

    if (sectionId) {
      whereClause += ' AND e.section_id = ?'
      params.push(sectionId)
    }

    // Get total count
    const countResult = await getOne(`
      SELECT COUNT(*) as total
      FROM kronik_entries e
      INNER JOIN kronik_categories c ON e.category_id = c.id
      WHERE ${whereClause}
    `, params)

    // Get entries
    const entries = await allQuery(`
      SELECT 
        e.id,
        e.what_title,
        e.what_description,
        e.when_date,
        e.where_location,
        e.featured_image,
        e.views_count,
        e.published_at,
        c.name as category_name,
        c.slug as category_slug,
        s.name as section_name,
        u.username as author_name
      FROM kronik_entries e
      INNER JOIN kronik_categories c ON e.category_id = c.id
      LEFT JOIN kronik_sections s ON e.section_id = s.id
      LEFT JOIN users u ON e.author_id = u.id
      WHERE ${whereClause}
      ORDER BY e.when_date DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    const normalizedEntries = entries.map((entry: any) => ({
      ...entry,
      featured_image: ensureImagePathExists(entry.featured_image)
    }))

    // Get category info
    const category = await getOne(`
      SELECT id, name, slug, description
      FROM kronik_categories
      WHERE slug = ?
    `, [categorySlug])

    return {
      success: true,
      data: normalizedEntries,
      category: category,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching kronik entries:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch entries'
    })
  }
})
