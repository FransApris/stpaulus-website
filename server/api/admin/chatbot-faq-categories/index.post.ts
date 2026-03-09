import { runQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC (middleware already set auth context)
  requirePermission('manage_chatbot_faqs')(event)

  const body = await readBody(event)
  const { name, slug, description, color, display_order } = body

  if (!name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and slug are required'
    })
  }

  try {
    const result = runQuery(`
      INSERT INTO chatbot_faq_categories
      (name, slug, description, color, display_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [name, slug, description || null, color || '#6B7280', display_order || 0])

    return {
      id: result.lastInsertRowid,
      name,
      slug,
      description,
      color: color || '#6B7280',
      display_order: display_order || 0,
      is_active: true
    }
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Category with this name or slug already exists'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create category'
    })
  }
})
