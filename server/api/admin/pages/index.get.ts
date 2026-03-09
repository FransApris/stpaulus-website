import { allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_pages')(event)

  try {
    const pages = allQuery(`
      SELECT id, title, slug, is_published, created_at, updated_at
      FROM pages
      ORDER BY created_at DESC
    `)

    return pages
  } catch (error: any) {
    console.error('Error fetching pages:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch pages'
    })
  }
})
