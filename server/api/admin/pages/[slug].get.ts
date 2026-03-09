import { getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_pages')(event)

  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page slug is required'
    })
  }

  try {
    const page = getQuery(`
      SELECT id, title, slug, content, is_published, created_at, updated_at
      FROM pages
      WHERE slug = ?
    `, [slug])

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    return page
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error fetching page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page'
    })
  }
})
