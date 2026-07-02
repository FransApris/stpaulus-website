// Admin API: Create new kronik section
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body.category_id || !body.name || !body.slug) {
      throw createError({
        statusCode: 400,
        message: 'Category ID, name, and slug are required'
      })
    }

    // Check if slug already exists
    const existing = await getOne(`
      SELECT id FROM kronik_sections WHERE slug = ?
    `, [body.slug])

    if (existing) {
      throw createError({
        statusCode: 409,
        message: 'Section with this slug already exists'
      })
    }

    // Insert new section
    const result = await runQuery(`
      INSERT INTO kronik_sections (
        category_id, 
        name, 
        slug, 
        description, 
        order_index, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      body.category_id,
      body.name,
      body.slug,
      body.description || null,
      body.order_index || 0,
      body.is_active !== undefined ? body.is_active : true
    ])

    // Get the created section
    const section = await getOne(`
      SELECT 
        s.*,
        c.name as category_name,
        c.slug as category_slug
      FROM kronik_sections s
      INNER JOIN kronik_categories c ON s.category_id = c.id
      WHERE s.id = ?
    `, [(result as any).insertId])

    return {
      success: true,
      message: 'Section created successfully',
      data: section
    }
  } catch (error: any) {
    console.error('Error creating section:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create section'
    })
  }
})
