import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  // Allow read access for content management permissions
  const authContext = event.context.auth
  if (!authContext || !authContext.permissions?.some((perm: string) =>
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
    const whereClause = status ? 'WHERE n.status = ?' : ''
    const countParams = status ? [status] : []

    // Get total count
    const countResult = await allQuery(
      `SELECT COUNT(DISTINCT n.id) as total FROM news n ${whereClause}`,
      countParams
    )
    const total = (countResult[0] as any).total as number
    const totalPages = Math.ceil(total / limit)

    // Fetch paginated news with categories
    const dataParams = status ? [status, limit, offset] : [limit, offset]
    const sql = `
      SELECT
        n.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM news n
      LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
      LEFT JOIN article_categories ac ON ncr.category_id = ac.id
      ${whereClause}
      GROUP BY n.id
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `

    const newsList = await allQuery(sql, dataParams);

    // Process categories for each news item
    const processedNews = newsList.map((news: any) => {
      const categories: Array<{id: number, name: string, slug: string}> = [];
      if (news.category_names) {
        const names = news.category_names.split(',');
        const ids = news.category_ids.split(',');
        const slugs = news.category_slugs.split(',');

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
        id: news.id,
        title: news.title,
        slug: news.slug,
        content: news.content,
        excerpt: news.excerpt || '',
        author: news.author || '',
        image: news.image || null,
        status: news.status,
        published_at: news.published_at,
        created_at: news.created_at,
        updated_at: news.updated_at,
        categories: categories
      };
    });

    return { data: processedNews, total, page, limit, totalPages };
  } catch (error) {
    console.error('Error fetching admin news:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
