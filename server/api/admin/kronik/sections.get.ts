// Admin API: Get all sections
import { allQuery } from '~/server/database/db'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const categoryId = queryParams.category_id

  try {
    let whereClause = ''
    let params: any[] = []

    if (categoryId) {
      whereClause = 'WHERE s.category_id = ?'
      params.push(categoryId)
    }

    const sections = await allQuery(`
      SELECT 
        s.*,
        c.name as category_name,
        c.slug as category_slug,
        COUNT(DISTINCT e.id) as total_entries
      FROM kronik_sections s
      INNER JOIN kronik_categories c ON s.category_id = c.id
      LEFT JOIN kronik_entries e ON s.id = e.section_id
      ${whereClause}
      GROUP BY s.id
      ORDER BY c.order_index ASC, s.order_index ASC
    `, params)

    return {
      success: true,
      data: sections
    }
  } catch (error) {
    console.error('Error fetching admin sections:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch sections'
    })
  }
})
