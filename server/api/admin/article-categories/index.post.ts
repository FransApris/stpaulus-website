import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication
  requireAuth(event)
  requirePermission('manage_article_categories')(event)

  try {
    const body = await readBody(event)

    // Validate required fields
    const { name } = body

    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if name already exists
    const existingName = await getQuery('SELECT id FROM article_categories WHERE name = ?', [name])
    if (existingName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category with this name already exists'
      })
    }

    // Check if slug already exists
    const existingSlug = await getQuery('SELECT id FROM article_categories WHERE slug = ?', [slug])
    if (existingSlug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category with this slug already exists'
      })
    }

    // Validate parent_id if provided
    if (body.parent_id) {
      const parentCategory = await getQuery('SELECT id FROM article_categories WHERE id = ?', [body.parent_id])
      if (!parentCategory) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Parent category does not exist'
        })
      }
    }

    // Insert new category
    const sql = `
      INSERT INTO article_categories (name, slug, parent_id, description)
      VALUES (?, ?, ?, ?)
    `

    const result = await runQuery(sql, [
      name,
      slug,
      body.parent_id || null,
      body.description || null
    ])

    return {
      success: true,
      message: 'Category created successfully',
      id: result.insertId
    }
  } catch (error: any) {
    console.error('Error creating article category:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
