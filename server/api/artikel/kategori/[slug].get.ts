import { getQuery as dbGetQuery, allQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Set cache headers to prevent stale data
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')
  
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category slug is required'
      })
    }

    console.log('[Category Articles] Fetching category:', slug)

    // Get category info - IMPORTANT: await this!
    const category = await dbGetQuery('SELECT id, name, slug, description FROM article_categories WHERE slug = ?', [slug]) as any

    console.log('[Category Articles] Category found:', category)

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Get articles in this category
    const articlesQuery = `
      SELECT a.id, a.title, a.slug, a.excerpt, a.author, a.created_at, a.published_at
      FROM articles a
      INNER JOIN article_category_relations acr ON a.id = acr.article_id
      WHERE acr.category_id = ? AND a.status = 'published'
      ORDER BY a.published_at DESC, a.created_at DESC
    `
    const articles = await allQuery(articlesQuery, [category.id])

    console.log('[Category Articles] Found articles:', articles.length)

    // Format articles
    const formattedArticles = articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      author: article.author || '',
      published_at: article.published_at,
      created_at: article.created_at
    }))

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || ''
      },
      articles: formattedArticles
    }
  } catch (error: any) {
    console.error('[Category Articles] Error:', error)
    console.error('[Category Articles] Error details:', {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode
    })
    
    // If it's already a createError, rethrow it
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
