import { runQuery, getQuery as dbGetQuery, allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

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

    // Get article with categories
    const articleQuery = `
      SELECT a.*, GROUP_CONCAT(ac.id) as category_ids, GROUP_CONCAT(ac.name) as category_names, GROUP_CONCAT(ac.slug) as category_slugs
      FROM articles a
      LEFT JOIN article_category_relations acr ON a.id = acr.article_id
      LEFT JOIN article_categories ac ON acr.category_id = ac.id
      WHERE a.id = ?
      GROUP BY a.id
    `
    const article = await dbGetQuery(articleQuery, [id]) as any

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Format categories
    const categories = []
    if (article.category_names) {
      const ids = article.category_ids.split(',')
      const names = article.category_names.split(',')
      const slugs = article.category_slugs.split(',')
      for (let i = 0; i < names.length; i++) {
        categories.push({
          id: parseInt(ids[i]),
          name: names[i],
          slug: slugs[i]
        })
      }
    }

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      image: article.image || '',
      status: article.status,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      categories: categories
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
