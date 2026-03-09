// Public API: Get category detail by slug
import { getQuery as getOne } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Category slug is required'
    })
  }

  try {
    const category = await getOne(`
      SELECT 
        c.*,
        COUNT(DISTINCT e.id) as entries_count
      FROM kronik_categories c
      LEFT JOIN kronik_entries e ON c.id = e.category_id AND e.status = 'published'
      WHERE c.slug = ? AND c.is_active = TRUE
      GROUP BY c.id
    `, [slug])

    if (!category) {
      throw createError({
        statusCode: 404,
        message: 'Category not found'
      })
    }

    return {
      success: true,
      data: category
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch category'
    })
  }
})
