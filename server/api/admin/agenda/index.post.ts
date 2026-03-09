import { defineEventHandler, createError, readBody } from 'h3'
import { requireAuth, requirePermission } from '../../../utils/auth'
import { allQuery, runQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  await requireAuth(event)
  await requirePermission('manage_agenda')(event)

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

  // Insert new agenda
  const sql = `
    INSERT INTO agendas (title, description, start_date, end_date, location, category_id, contact_person)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  const result = await runQuery(sql, [
    title,
    body.description || null,
    start_date,
    body.end_date || null,
    location,
    category_id,
    body.contact_person || null
  ])

  return {
    success: true,
    message: 'Agenda created successfully',
    agenda: {
      id: (result as any).insertId,
      title,
      description: body.description,
      start_date,
      end_date: body.end_date,
      location,
      category_id,
      contact_person: body.contact_person
    }
  }
})
