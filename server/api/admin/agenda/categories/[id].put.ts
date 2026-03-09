import { runQuery, allQuery } from '../../../../database/db'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    const body = await readBody(event)

    // Validate required fields
    const { name, color } = body

    if (!name || !color) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and color are required'
      })
    }

    // Check if category exists
    const existingCategory = await allQuery('SELECT id FROM agenda_categories WHERE id = ?', [id])
    if (!existingCategory || existingCategory.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Generate new slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists (excluding current category)
    const slugCheck = await allQuery('SELECT id FROM agenda_categories WHERE slug = ? AND id != ?', [slug, id])
    if (slugCheck && slugCheck.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category with this name already exists'
      })
    }

    // Update category
    const sql = `
      UPDATE agenda_categories
      SET name = ?, slug = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    await runQuery(sql, [
      name,
      slug,
      body.description || null,
      color,
      id
    ])

    // Get updated category
    const categories = await allQuery('SELECT * FROM agenda_categories WHERE id = ?', [id])

    return categories[0]
  } catch (error: any) {
    console.error('Error updating category:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
