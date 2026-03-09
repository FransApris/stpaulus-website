import { allQuery, runQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import { createSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can update document categories
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_document_categories')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can manage document categories'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  const body = await readBody(event)
  const { name, description, color, display_order, is_active } = body

  if (!name || name.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }

  const slug = createSlug(name)

  try {
    await runQuery(`
      UPDATE document_categories
      SET name = ?, slug = ?, description = ?, color = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name.trim(), slug, description || null, color || '#6B7280', display_order || 0, is_active !== undefined ? is_active : true, id])

    return {
      id: parseInt(id),
      name: name.trim(),
      slug,
      description,
      color: color || '#6B7280',
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString()
    }
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Category name already exists'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category'
    })
  }
})
