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

  try {
    // Fetch all articles with categories (including drafts)
    const sql = `
      SELECT
        a.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM articles a
      LEFT JOIN article_category_relations acr ON a.id = acr.article_id
      LEFT JOIN article_categories ac ON acr.category_id = ac.id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `;

    const articlesList = await allQuery(sql);

    // Process categories for each article item
    const processedArticles = articlesList.map((article: any) => {
      const categories: Array<{id: number, name: string, slug: string}> = [];
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

    return processedArticles;
  } catch (error) {
    console.error('Error fetching admin articles:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
