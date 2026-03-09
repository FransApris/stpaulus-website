import { runQuery, allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agenda ID is required'
      })
    }

    const body = await readBody(event)

    // Validate required fields
    const { title, start_date, location, category_id } = body

    if (!title || !start_date || !location || !category_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, start date, location, and category are required'
      })
    }

    // Validate category exists
    const categoryCheck = await allQuery('SELECT id FROM agenda_categories WHERE id = ?', [category_id])
    if (!categoryCheck || categoryCheck.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid category'
      })
    }

    // Validate date logic: start_date should be before end_date if end_date is provided
    if (body.end_date && new Date(start_date) >= new Date(body.end_date)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Start date must be before end date'
      })
    }

    // Update agenda
    const sql = `
      UPDATE agendas
      SET title = ?, description = ?, start_date = ?, end_date = ?, location = ?, category_id = ?, contact_person = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    const result = await runQuery(sql, [
      title,
      body.description || null,
      start_date,
      body.end_date || null,
      location,
      category_id,
      body.contact_person || null,
      id
    ]) as any

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agenda not found'
      })
    }

    return {
      success: true,
      message: 'Agenda updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating agenda:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
