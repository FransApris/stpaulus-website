import { runQuery, getQuery } from '../../../database/db'
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

  const body = await readBody(event)
  const { title, new_slug, content, is_published } = body

  if (!title || !new_slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and slug are required'
    })
  }

  // Check if page exists
  const existingPage = getQuery('SELECT id FROM pages WHERE slug = ?', [slug])
  if (!existingPage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    })
  }

  // Generate unique slug if needed
  let uniqueSlug = new_slug
  if (new_slug !== slug) {
    let counter = 1
    while (true) {
      const existing = runQuery('SELECT id FROM pages WHERE slug = ? AND slug != ?', [uniqueSlug, slug])
      if (!existing) break
      uniqueSlug = `${new_slug}-${counter}`
      counter++
    }
  }

  try {
    runQuery(`
      UPDATE pages
      SET title = ?, slug = ?, content = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `, [title, uniqueSlug, content || null, is_published ? 1 : 0, slug])

    return {
      message: 'Page updated successfully',
      slug: uniqueSlug
    }
  } catch (error: any) {
    console.error('Error updating page:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update page'
    })
  }
})
