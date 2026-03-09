import { allQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  try {
    // Get upcoming 5 agendas
    const sql = `
      SELECT a.*, c.name as category_name, c.color as category_color
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      WHERE a.start_date >= CURDATE()
      ORDER BY start_date ASC
      LIMIT 5
    `

    const agendas = await allQuery(sql)

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
    console.error('Error fetching upcoming agendas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
