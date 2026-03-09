import { runQuery, allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication
  requireAuth(event)
  requirePermission('manage_article_categories')(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    const body = await readBody(event)

    // Validate required fields
    const { name } = body

    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    // Check if category exists
    const existingCategory = await allQuery('SELECT id FROM article_categories WHERE id = ?', [id])
    if (!existingCategory || existingCategory.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Generate new slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists (excluding current category)
    const slugCheck = await allQuery('SELECT id FROM article_categories WHERE slug = ? AND id != ?', [slug, id])
    if (slugCheck && slugCheck.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category with this name already exists'
      })
    }

    // Validate parent_id if provided (prevent self-reference and circular references)
    if (body.parent_id) {
      if (body.parent_id === parseInt(id)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Category cannot be its own parent'
        })
      }

      const parentCategory = await allQuery('SELECT id FROM article_categories WHERE id = ?', [body.parent_id])
      if (!parentCategory || parentCategory.length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Parent category does not exist'
        })
      }
    }

    // Update category
    const sql = `
      UPDATE article_categories
      SET name = ?, slug = ?, parent_id = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    runQuery(sql, [
      name,
      slug,
      body.parent_id || null,
      body.description || null,
      id
    ])

    return {
      success: true,
      message: 'Category updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating article category:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
