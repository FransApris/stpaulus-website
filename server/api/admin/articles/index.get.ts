import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  // Allow read access for content management permissions
  const authContext = event.context.auth
  if (!authContext || !authContext.permissions || !Array.isArray(authContext.permissions) || !authContext.permissions.some((perm: string) =>
    ['manage_articles', 'manage_news', 'manage_gallery', 'manage_agenda', 'manage_users', 'manage_rooms', 'manage_bookings'].includes(perm)
  )) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }

  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
  const offset = (page - 1) * limit
  const allowedStatuses = ['published', 'draft', 'archived']
  const status = allowedStatuses.includes(query.status as string) ? query.status as string : ''

  try {
    const whereClause = status ? 'WHERE a.status = ?' : ''
    const countParams = status ? [status] : []

    // Get total count
    const countResult = await allQuery(
      `SELECT COUNT(DISTINCT a.id) as total FROM articles a ${whereClause}`,
      countParams
    )
    const total = (countResult[0] as any).total as number
    const totalPages = Math.ceil(total / limit)

    // Fetch paginated articles with categories
    const dataParams = status ? [status, limit, offset] : [limit, offset]
    const sql = `
      SELECT
        a.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM articles a
      LEFT JOIN article_category_relations acr ON a.id = acr.article_id
      LEFT JOIN article_categories ac ON acr.category_id = ac.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `

    const articlesList = await allQuery(sql, dataParams);

    // Process categories for each article item
    const processedArticles = articlesList.map((article: any) => {
      const categories: Array<{ id: number, name: string, slug: string }> = [];
      if (article.category_names) {
        const names = article.category_names.split(',');
        const ids = article.category_ids.split(',');
        const slugs = article.category_slugs.split(',');

        names.forEach((name: string, index: number) => {
          if (name) {
            categories.push({
              id: parseInt(ids[index]),
              name: name,
              slug: slugs[index]
            });
          }
        });
      }

      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt || '',
        author: article.author || '',
        image: article.image || '',
        status: article.status,
        published_at: article.published_at,
        created_at: article.created_at,
        updated_at: article.updated_at,
        categories: categories
      };
    });

    return { data: processedArticles, total, page, limit, totalPages };
  } catch (error) {
    console.error('Error fetching admin articles:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
