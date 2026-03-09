import { allQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    console.log('Fetching agenda id:', id)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agenda ID is required'
      })
    }

    // Get single agenda with category information
    const sql = `
      SELECT a.*, c.name as category_name, c.color as category_color
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      WHERE a.id = ?
    `

    const agenda = allQuery(sql, [id])[0] as {
      id: number
      title: string
      description: string
      start_date: string
      end_date: string
      location: string
      category_name: string | null
      category_color: string | null
      contact_person: string | null
      created_at: string
      updated_at: string
    } | undefined

    console.log('Agenda found:', agenda ? 'yes' : 'no', agenda ? agenda.title : '')

    if (!agenda) {
      console.log('Agenda not found for id:', id)
      throw createError({
        statusCode: 404,
        statusMessage: 'Agenda not found'
      })
    }

    // Convert to plain object for JSON serialization
    return {
      id: agenda.id,
      title: agenda.title,
      description: agenda.description,
      start_date: agenda.start_date,
      end_date: agenda.end_date,
      location: agenda.location,
      category: agenda.category_name || 'Uncategorized',
      category_color: agenda.category_color,
      contact_person: agenda.contact_person,
      created_at: agenda.created_at,
      updated_at: agenda.updated_at
    }
  } catch (error: any) {
    console.error('Error fetching agenda detail:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
