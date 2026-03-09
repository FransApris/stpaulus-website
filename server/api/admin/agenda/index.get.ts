import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_agenda')(event)

  try {
    // Get query parameters for filtering
    const query = getQuery(event)
    const search = query?.search as string
    const category = query?.category as string
    const month = query?.month as string
    const year = query?.year as string

    // Build dynamic query
    let sql = `
      SELECT a.*, c.name as category_name, c.color as category_color, c.slug as category_slug
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    // Search filter (title, description, location)
    if (search) {
      sql += ' AND (a.title LIKE ? OR a.description LIKE ? OR a.location LIKE ?)'
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
    }

    // Category filter
    if (category) {
      sql += ' AND c.name = ?'
      params.push(category)
    }

    // Month filter
    if (month && year) {
      sql += ' AND MONTH(a.start_date) = ? AND YEAR(a.start_date) = ?'
      params.push(month, year)
    } else if (month) {
      sql += ' AND MONTH(a.start_date) = ?'
      params.push(month)
    } else if (year) {
      sql += ' AND YEAR(a.start_date) = ?'
      params.push(year)
    }

    sql += ' ORDER BY a.start_date ASC'

    const agendas = await allQuery(sql, params);

    // Convert to plain objects for JSON serialization
    return agendas.map((agenda: any) => ({
      id: agenda.id,
      title: agenda.title,
      description: agenda.description,
      start_date: agenda.start_date,
      end_date: agenda.end_date,
      location: agenda.location,
      category_id: agenda.category_id,
      category_name: agenda.category_name || 'Uncategorized',
      category_color: agenda.category_color,
      category_slug: agenda.category_slug,
      contact_person: agenda.contact_person,
      created_at: agenda.created_at,
      updated_at: agenda.updated_at
    }));
  } catch (error) {
    console.error('Error fetching admin agendas:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
