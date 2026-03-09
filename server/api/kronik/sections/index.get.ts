import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const categoryId = query.category_id ? parseInt(query.category_id as string) : undefined

    try {
        let sections

        if (categoryId) {
            // Filter by category_id if provided
            sections = await allQuery(`
        SELECT 
          s.id,
          s.name,
          s.description,
          s.category_id,
          s.order_index,
          s.is_active,
          c.name as category_name,
          c.slug as category_slug
        FROM kronik_sections s
        INNER JOIN kronik_categories c ON s.category_id = c.id
        WHERE s.category_id = ? AND s.is_active = TRUE
        ORDER BY s.order_index ASC
      `, [categoryId])
        } else {
            // Get all active sections
            sections = await allQuery(`
        SELECT 
          s.id,
          s.name,
          s.description,
          s.category_id,
          s.order_index,
          s.is_active,
          c.name as category_name,
          c.slug as category_slug
        FROM kronik_sections s
        INNER JOIN kronik_categories c ON s.category_id = c.id
        WHERE s.is_active = TRUE
        ORDER BY c.order_index ASC, s.order_index ASC
      `)
        }

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
