import { requireAuth, requirePermission } from '../../../utils/auth'
import { runQuery, getQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery_categories')(event)

  const categoryId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nama_kategori, description, color, display_order, is_active } = body

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  try {
    // Check if category exists
    const existingCategory = await getQuery('SELECT id FROM gallery_categories WHERE id = ?', [categoryId])
    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Generate new slug if nama_kategori changed
    let slug = null
    if (nama_kategori) {
      slug = nama_kategori
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Check if new slug conflicts with other categories
      const slugConflict = await getQuery('SELECT id FROM gallery_categories WHERE slug = ? AND id != ?', [slug, categoryId])
      if (slugConflict) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Category with this name already exists'
        })
      }
    }

    // Update category
    const updateFields = []
    const updateValues = []

    if (nama_kategori !== undefined) {
      updateFields.push('nama_kategori = ?')
      updateValues.push(nama_kategori)
    }

    if (slug) {
      updateFields.push('slug = ?')
      updateValues.push(slug)
    }

    if (description !== undefined) {
      updateFields.push('description = ?')
      updateValues.push(description)
    }

    if (color !== undefined) {
      updateFields.push('color = ?')
      updateValues.push(color)
    }

    if (display_order !== undefined) {
      updateFields.push('display_order = ?')
      updateValues.push(display_order)
    }

    if (is_active !== undefined) {
      updateFields.push('is_active = ?')
      updateValues.push(is_active ? 1 : 0)
    }

    updateFields.push('updated_at = NOW()')
    updateValues.push(categoryId)

    const updateQuery = `UPDATE gallery_categories SET ${updateFields.join(', ')} WHERE id = ?`
    const updateResult = await runQuery(updateQuery, updateValues)

    if ((updateResult as any).affectedRows === 0) {
      // Check if category still exists (in case it was deleted concurrently)
      const check = await getQuery('SELECT id FROM gallery_categories WHERE id = ?', [categoryId])
      if (!check) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Category not found'
        })
      }
      // If exists but no changes, still success
    }

    // Get updated category
    const category = await getQuery('SELECT * FROM gallery_categories WHERE id = ?', [categoryId]) as any

    return {
      success: true,
      category
    }
  } catch (error) {
    console.error('Error updating gallery category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update gallery category'
    })
  }
})
