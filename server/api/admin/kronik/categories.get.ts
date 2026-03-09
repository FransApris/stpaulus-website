// Admin API: Get all categories (with entries count)
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const categories = await allQuery(`
      SELECT 
        c.*,
        COUNT(DISTINCT e.id) as total_entries,
        COUNT(DISTINCT CASE WHEN e.status = 'published' THEN e.id END) as published_entries,
        COUNT(DISTINCT CASE WHEN e.status = 'draft' THEN e.id END) as draft_entries,
        COUNT(DISTINCT CASE WHEN e.status = 'pending' THEN e.id END) as pending_entries
      FROM kronik_categories c
      LEFT JOIN kronik_entries e ON c.id = e.category_id
      GROUP BY c.id
      ORDER BY c.order_index ASC
    `)

    return {
      success: true,
      data: categories
    }
  } catch (error) {
    console.error('Error fetching admin categories:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch categories'
    })
  }
})
