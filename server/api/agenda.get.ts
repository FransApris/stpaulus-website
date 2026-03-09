import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  // Set cache headers to prevent stale data
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')
  
  try {
    // Get query parameters for filtering
    const query = getQuery(event)
    const category = query?.category as string
    const month = query?.month as string
    const year = query?.year as string

    // Build query - show only upcoming events with JOIN
    let sql = `
      SELECT a.*, c.name as category_name, c.color as category_color
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      WHERE a.start_date >= NOW()
    `
    let params: any[] = []

    if (category) {
      sql += ' AND c.name = ?'
      params.push(category)
    }

    if (month && year) {
      sql += ' AND MONTH(start_date) = ? AND YEAR(start_date) = ?'
      params.push(month.padStart(2, '0'), year)
    } else if (month) {
      sql += ' AND MONTH(start_date) = ?'
      params.push(month.padStart(2, '0'))
    } else if (year) {
      sql += ' AND YEAR(start_date) = ?'
      params.push(year)
    }

    sql += ' ORDER BY start_date ASC'

    const agendas = await allQuery(sql, params)

    // Convert to plain objects for JSON serialization
    return agendas.map((agenda: any) => ({
      id: agenda.id,
      title: agenda.title,
      description: agenda.description,
      start_date: agenda.start_date,
      end_date: agenda.end_date,
      location: agenda.location,
      category: agenda.category_name || 'Uncategorized',
      category_color: agenda.category_color,
      contact_person: agenda.contact_person,
      created_at: agenda.created_at
    }))
  } catch (error) {
    console.error('Error fetching public agendas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
