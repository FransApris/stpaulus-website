import { allQuery, runQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import { createSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can create document categories
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_document_categories')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can manage document categories'
    })
  }

  const body = await readBody(event)
  const { name, description, color, display_order } = body

  if (!name || name.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }

  const slug = createSlug(name)

  try {
    const result: any = await runQuery(`
      INSERT INTO document_categories (name, slug, description, color, display_order)
      VALUES (?, ?, ?, ?, ?)
    `, [name.trim(), slug, description || null, color || '#6B7280', display_order || 0])

    // For MySQL, use insertId instead of lastInsertRowid
    const insertId = result.insertId || result.lastInsertRowid

    return {
      id: insertId,
      name: name.trim(),
      slug,
      description,
      color: color || '#6B7280',
      display_order: display_order || 0,
      is_active: true,
      created_at: new Date().toISOString()
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
      statusMessage: 'Failed to create category'
    })
  }
})
