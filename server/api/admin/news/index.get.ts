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

  try {
    // Fetch all news with categories (including drafts)
    const sql = `
      SELECT
        n.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM news n
      LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
      LEFT JOIN article_categories ac ON ncr.category_id = ac.id
      GROUP BY n.id
      ORDER BY n.created_at DESC
      LIMIT 50
    `;

    const newsList = await allQuery(sql);

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

    return processedNews;
  } catch (error) {
    console.error('Error fetching admin news:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
