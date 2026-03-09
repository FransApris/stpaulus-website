import { allQuery } from '../../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    // Get query parameters
    const query = getQuery(event)
    const search = query?.search as string

    // Build SQL query with search support and usage count
    let sql = `
      SELECT 
        c.*,
        COUNT(a.id) as agenda_count
      FROM agenda_categories c
      LEFT JOIN agendas a ON c.id = a.category_id
      WHERE 1=1
    `
    const params: any[] = []

    // Add search filter
    if (search) {
      sql += ' AND (c.name LIKE ? OR c.description LIKE ?)'
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern)
    }

    sql += ' GROUP BY c.id ORDER BY c.name ASC'

    const categories = await allQuery(sql, params)

    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      agenda_count: category.agenda_count || 0,
      created_at: category.created_at,
      updated_at: category.updated_at
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
