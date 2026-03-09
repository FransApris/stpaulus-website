// Public API: Get sections by category slug
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const categorySlug = getRouterParam(event, 'category')

  if (!categorySlug) {
    throw createError({
      statusCode: 400,
      message: 'Category slug is required'
    })
  }

  try {
    const sections = await allQuery(`
      SELECT 
        s.*,
        c.name as category_name,
        c.slug as category_slug,
        COUNT(DISTINCT e.id) as entries_count
      FROM kronik_sections s
      INNER JOIN kronik_categories c ON s.category_id = c.id
      LEFT JOIN kronik_entries e ON s.id = e.section_id AND e.status = 'published'
      WHERE c.slug = ? AND s.is_active = TRUE
      GROUP BY s.id
      ORDER BY s.order_index ASC
    `, [categorySlug])

    return {
      success: true,
      data: sections
    }
  } catch (error) {
    console.error('Error fetching sections:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch sections'
    })
  }
})
