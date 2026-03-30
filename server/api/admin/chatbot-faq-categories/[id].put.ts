import { runQuery } from '../../../database/db'
import { getRouterParam } from 'h3'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const authContext = event.context.auth
  const hasAccess = authContext?.permissions?.some((perm: string) =>
    ['manage_chatbot_faqs', 'manage_chatbot'].includes(perm)
  )

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, slug, description, color, display_order, is_active } = body

  if (!id || !name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID, name and slug are required'
    })
  }

  try {
    await runQuery(`
      UPDATE chatbot_faq_categories
      SET name = ?, slug = ?, description = ?, color = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, slug, description || null, color || '#6B7280', display_order || 0, is_active ? 1 : 0, id])

    return {
      id: parseInt(id),
      name,
      slug,
      description,
      color: color || '#6B7280',
      display_order: display_order || 0,
      is_active: !!is_active
    }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Category with this name or slug already exists'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category'
    })
  }
})
