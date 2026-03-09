import { runQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_pages')(event)

  const body = await readBody(event)
  const { title, slug, content, is_published } = body

  if (!title || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and slug are required'
    })
  }

  // Generate unique slug if needed
  let uniqueSlug = slug
  let counter = 1
  while (true) {
    const existing = runQuery('SELECT id FROM pages WHERE slug = ?', [uniqueSlug])
    if (!existing) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  try {
    const result = runQuery(`
      INSERT INTO pages (title, slug, content, is_published, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [title, uniqueSlug, content || null, is_published ? 1 : 0])

    return {
      id: result.lastInsertRowid,
      title,
      slug: uniqueSlug,
      content,
      is_published: is_published ? 1 : 0
    }
  } catch (error: any) {
    console.error('Error creating page:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create page'
    })
  }
})
