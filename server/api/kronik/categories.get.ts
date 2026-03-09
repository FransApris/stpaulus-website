// Public API: Get all kronik categories
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const categories = await allQuery(`
      SELECT 
        c.*,
        COUNT(DISTINCT e.id) as entries_count
      FROM kronik_categories c
      LEFT JOIN kronik_entries e ON c.id = e.category_id AND e.status = 'published'
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.order_index ASC
    `)

    return {
      success: true,
      data: categories
    }
  } catch (error) {
    console.error('Error fetching kronik categories:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch categories'
    })
  }
})
