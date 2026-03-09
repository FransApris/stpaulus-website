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
    const body = await readBody(event)
    const { title, slug, excerpt, content, author, status, category_ids, image } = body

    // Validation
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    // Ensure all values are defined (not undefined)
    const safeExcerpt = excerpt !== undefined ? excerpt : null
    const safeAuthor = author !== undefined ? author : null
    const safeStatus = status !== undefined ? status : 'draft'
    const safeImage = image !== undefined ? image : null

    // Generate slug if not provided
    const finalSlug = slug || createSlug(title)

    // Check if slug already exists
    const existingArticle = await getDbQuery('SELECT id FROM articles WHERE slug = ?', [finalSlug])
    if (existingArticle) {
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

    // Insert article
    const publishedAt = status === 'published' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null

    const result: any = await runQuery(
      `INSERT INTO articles (title, slug, content, excerpt, author, status, image, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, finalSlug, content, excerpt || '', author || '', status || 'draft', safeImage, publishedAt]
    )

    // Handle different database result formats
    const articleId = result.insertId || result.lastInsertRowid || result[0]?.insertId

    console.log('[Article Create] Insert result:', { result, articleId })

    // Insert category relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        await runQuery(
          'INSERT INTO article_category_relations (article_id, category_id) VALUES (?, ?)',
          [articleId, categoryId]
        )
      }
    }

    return {
      id: articleId,
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || '',
      author: author || '',
      status: status || 'draft',
      image: safeImage,
      published_at: publishedAt,
      message: 'Article created successfully'
    }
  } catch (error) {
    console.error('Error creating article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
