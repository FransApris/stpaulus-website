import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Article ID is required'
      })
    }

    const body = await readBody(event)
    const { title, slug, excerpt, content, author, status, category_ids, image } = body

    // Validation
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    // Check if article exists
    const existingArticle = await getDbQuery('SELECT id FROM articles WHERE id = ?', [id])
    if (!existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Generate slug if not provided
    const finalSlug = slug || createSlug(title)

    // Check if slug already exists (excluding current article)
    const slugCheck = await getDbQuery('SELECT id FROM articles WHERE slug = ? AND id != ?', [finalSlug, id])
    if (slugCheck) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    // Validate category_ids if provided
    if (category_ids && Array.isArray(category_ids)) {
      for (const categoryId of category_ids) {
        const category = await getDbQuery('SELECT id FROM article_categories WHERE id = ?', [categoryId])
        if (!category) {
          throw createError({
            statusCode: 400,
            statusMessage: `Category with ID ${categoryId} does not exist`
          })
        }
      }
    }

    // Update published_at based on status
    let publishedAt = null
    if (status === 'published') {
      // Check current status
      const currentArticle = await getDbQuery('SELECT status, published_at FROM articles WHERE id = ?', [id]) as { status: string, published_at: string | null } | undefined
      if (currentArticle && currentArticle.status !== 'published') {
        // First time publishing
        publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      } else if (currentArticle && currentArticle.published_at) {
        // Keep existing published date
        publishedAt = currentArticle.published_at
      } else {
        // Fallback: set current time
        publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    }

    console.log('[Article Update] Update data:', { id, title, status, publishedAt })
    console.log('[Article Update] Image value type:', typeof image)
    console.log('[Article Update] Image value length:', image ? image.length : 0)
    console.log('[Article Update] Image value preview:', image ? image.substring(0, 100) + '...' : 'null')

    // Update article
    let result
    try {
      result = await runQuery(
        `UPDATE articles SET title = ?, slug = ?, content = ?, excerpt = ?, author = ?, status = ?, image = ?, published_at = ?, updated_at = NOW() WHERE id = ?`,
        [title, finalSlug, content, excerpt || '', author || '', status || 'draft', image || null, publishedAt, id]
      )
      console.log('[Article Update] Query result:', result)
    } catch (queryError: any) {
      console.error('[Article Update] Query error:', queryError)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${queryError.message}`
      })
    }

    if ((result as any).affectedRows === 0) {
      // Check if article still exists (in case it was deleted concurrently)
      const check = await getDbQuery('SELECT id FROM articles WHERE id = ?', [id])
      if (!check) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Article not found'
        })
      }
      // If exists but no changes, still success
    }

    // Update category relations
    // First, remove existing relations
    await runQuery('DELETE FROM article_category_relations WHERE article_id = ?', [id])

    // Then, insert new relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        await runQuery(
          'INSERT INTO article_category_relations (article_id, category_id) VALUES (?, ?)',
          [id, categoryId]
        )
      }
    }

    console.log('[Article Update] Successfully updated article:', id)

    // Return complete article data for optimistic update
    return {
      id: parseInt(id),
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || '',
      author: author || '',
      status: status || 'draft',
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
      message: 'Article updated successfully'
    }
  } catch (error: any) {
    console.error('[Article Update] Error updating article:', error)
    console.error('[Article Update] Error details:', {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode
    })
    
    // If it's already a createError, rethrow it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise, create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
