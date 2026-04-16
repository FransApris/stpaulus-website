import { getQuery, allQuery, runQuery } from '../../database/db'
import { getClientIp, getClientFingerprint } from '~/server/utils/client-info'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article slug is required'
    });
  }

  try {
    // Get article detail with categories
    const articleSql = `
      SELECT
        a.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM articles a
      LEFT JOIN article_category_relations acr ON a.id = acr.article_id
      LEFT JOIN article_categories ac ON acr.category_id = ac.id
      WHERE a.slug = ? AND a.status = 'published'
      GROUP BY a.id
      LIMIT 1
    `;

    const article = await getQuery(articleSql, [slug]);

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      });
    }

    // Record view (prevent duplicate views from same session)
    const clientIp = getClientIp(event);
    const userAgent = getHeader(event, 'user-agent') || '';
    const userSession = getClientFingerprint(event);

    // Check if already viewed in this session
    const existingView = await getQuery(
      `SELECT id FROM article_interactions 
       WHERE article_id = ? AND interaction_type = 'view' 
       AND user_session = ? AND user_ip = ?
       AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
      [article.id, userSession, clientIp]
    );

    if (!existingView) {
      // Record new view
      await runQuery(
        `INSERT INTO article_interactions 
         (article_id, interaction_type, user_ip, user_agent, user_session) 
         VALUES (?, 'view', ?, ?, ?)`,
        [article.id, clientIp, userAgent, userSession]
      );

      // Increment views_count
      await runQuery(
        'UPDATE articles SET views_count = views_count + 1 WHERE id = ?',
        [article.id]
      );
    }

    // Get updated article data with new view count
    const updatedArticle = await getQuery(
      'SELECT likes_count, shares_count, views_count FROM articles WHERE id = ?',
      [article.id]
    );

    // Process categories
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

    // Check if current user has liked this article
    const userLiked = await getQuery(
      `SELECT id FROM article_interactions 
       WHERE article_id = ? AND interaction_type = 'like' 
       AND user_session = ? AND user_ip = ?`,
      [article.id, userSession, clientIp]
    );

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content,
      author: article.author || 'Admin',
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      date: new Date((article.published_at || article.created_at).toString().replace(' ', 'T') + 'Z').toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      image: article.image || '/images/default-article.jpg',
      categories: categories,
      likes_count: updatedArticle?.likes_count || 0,
      shares_count: updatedArticle?.shares_count || 0,
      views_count: updatedArticle?.views_count || 0,
      user_liked: !!userLiked
    };
  } catch (error: any) {
    console.error('Error fetching article detail:', error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
