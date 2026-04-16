import { getQuery, allQuery, runQuery } from '../../database/db'
import { getClientIp, getClientFingerprint } from '~/server/utils/client-info'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'News slug is required'
    });
  }

  try {
    // Get news detail with categories
    const newsSql = `
      SELECT
        n.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM news n
      LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
      LEFT JOIN article_categories ac ON ncr.category_id = ac.id
      WHERE n.slug = ? AND n.status = 'published'
      GROUP BY n.id
      LIMIT 1
    `;

    const news = await getQuery(newsSql, [slug]);

    if (!news) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found'
      });
    }

    // Record view (prevent duplicate views from same session)
    const clientIp = getClientIp(event);
    const userAgent = getHeader(event, 'user-agent') || '';
    const userSession = getClientFingerprint(event);

    // Check if already viewed in this session
    const existingView = await getQuery(
      `SELECT id FROM news_interactions 
       WHERE news_id = ? AND interaction_type = 'view' 
       AND user_session = ? AND user_ip = ?
       AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
      [news.id, userSession, clientIp]
    );

    if (!existingView) {
      // Record new view
      await runQuery(
        `INSERT INTO news_interactions 
         (news_id, interaction_type, user_ip, user_agent, user_session) 
         VALUES (?, 'view', ?, ?, ?)`,
        [news.id, clientIp, userAgent, userSession]
      );

      // Increment views_count
      await runQuery(
        'UPDATE news SET views_count = views_count + 1 WHERE id = ?',
        [news.id]
      );
    }

    // Get updated news data with new view count
    const updatedNews = await getQuery(
      'SELECT likes_count, shares_count, views_count FROM news WHERE id = ?',
      [news.id]
    );

    // Process categories
    const categories: Array<{ id: number, name: string, slug: string }> = [];
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

    // Check if current user has liked this news
    const userLiked = await getQuery(
      `SELECT id FROM news_interactions 
       WHERE news_id = ? AND interaction_type = 'like' 
       AND user_session = ? AND user_ip = ?`,
      [news.id, userSession, clientIp]
    );

    return {
      id: news.id,
      title: news.title,
      slug: news.slug,
      excerpt: news.excerpt || '',
      content: news.content,
      author: news.author || 'Admin',
      published_at: news.published_at,
      created_at: news.created_at,
      updated_at: news.updated_at,
      date: new Date((news.published_at || news.created_at).toString().replace(' ', 'T') + 'Z').toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      image: news.image || '/images/default-news.jpg',
      categories: categories,
      likes_count: updatedNews?.likes_count || 0,
      shares_count: updatedNews?.shares_count || 0,
      views_count: updatedNews?.views_count || 0,
      user_liked: !!userLiked
    };
  } catch (error: any) {
    console.error('Error fetching news detail:', error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});

