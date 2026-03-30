// Admin API: Update kronik section
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Section ID is required'
    })
  }

  // TODO: Add authentication middleware
  // const user = event.context.user
  // if (!user || !['super-admin', 'admin-paroki'].includes(user.role)) {
  //   throw createError({ statusCode: 403, message: 'Forbidden' })
  // }

  try {
    const body = await readBody(event)

    // Check if section exists
    const existing = await getOne(`
      SELECT id FROM kronik_sections WHERE id = ?
    `, [id])

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: 'Section not found'
      })
    }

    // Check slug uniqueness if slug is being updated
    if (body.slug) {
      const slugExists = await getOne(`
        SELECT id FROM kronik_sections WHERE slug = ? AND id != ?
      `, [body.slug, id])

      if (slugExists) {
        throw createError({
          statusCode: 409,
          message: 'Section with this slug already exists'
        })
      }
    }

    // Build update query dynamically
    const updates: string[] = []
    const params: any[] = []

    if (body.category_id !== undefined) {
      updates.push('category_id = ?')
      params.push(body.category_id)
    }
    if (body.name !== undefined) {
      updates.push('name = ?')
      params.push(body.name)
    }
    if (body.slug !== undefined) {
      updates.push('slug = ?')
      params.push(body.slug)
    }
    if (body.description !== undefined) {
      updates.push('description = ?')
      params.push(body.description)
    }
    if (body.order_index !== undefined) {
      updates.push('order_index = ?')
      params.push(body.order_index)
    }
    if (body.is_active !== undefined) {
      updates.push('is_active = ?')
      params.push(body.is_active)
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    // Add ID to params for WHERE clause
    params.push(id)

    // Update section
    await runQuery(`
      UPDATE kronik_sections 
      SET ${updates.join(', ')}
      WHERE id = ?
    `, params)

    // Get updated section
    const section = await getOne(`
      SELECT 
        s.*,
        c.name as category_name,
        c.slug as category_slug
      FROM kronik_sections s
      INNER JOIN kronik_categories c ON s.category_id = c.id
      WHERE s.id = ?
    `, [id])

    return {
      success: true,
      message: 'Section updated successfully',
      data: section
    }
  } catch (error: any) {
    console.error('Error updating section:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update section'
    })
  }
})
