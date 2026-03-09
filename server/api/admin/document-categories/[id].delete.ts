import { runQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can delete document categories
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

  try {
    // Check if category is being used by any documents
    const documentsCount = await runQuery(`
      SELECT COUNT(*) as count FROM documents WHERE category_id = ?
    `, [id]) as unknown as { count: number }[]

    const count = documentsCount[0]?.count || 0

    if (count > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete category that is being used by documents'
      })
    }

    await runQuery(`DELETE FROM document_categories WHERE id = ?`, [id])

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category'
    })
  }
})
