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

    let news = await getQuery(newsSql, [slug]);

    // Fallback: if slug lookup fails and param looks numeric, try by ID
    if (!news && /^\d+$/.test(slug as string)) {
      const byIdSql = `
        SELECT
          n.*,
          GROUP_CONCAT(ac.name) as category_names,
          GROUP_CONCAT(ac.id) as category_ids,
          GROUP_CONCAT(ac.slug) as category_slugs
        FROM news n
        LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
        LEFT JOIN article_categories ac ON ncr.category_id = ac.id
        WHERE n.id = ? AND n.status = 'published'
        GROUP BY n.id
        LIMIT 1
      `;
      news = await getQuery(byIdSql, [parseInt(slug as string)]);
    }

    if (!news) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found'
      });
    }

    // === Interaction Tracking (optional - degrades gracefully if table missing) ===
    let interactionCounts = { likes_count: 0, shares_count: 0, views_count: 0 };
    let userLikedResult = false;

    try {
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

      // Get updated counts
      const updatedNews = await getQuery(
        'SELECT likes_count, shares_count, views_count FROM news WHERE id = ?',
        [news.id]
      );
      if (updatedNews) {
        interactionCounts = {
          likes_count: updatedNews.likes_count || 0,
          shares_count: updatedNews.shares_count || 0,
          views_count: updatedNews.views_count || 0,
        };
      }

      // Check if current user has liked this news
      const userLiked = await getQuery(
        `SELECT id FROM news_interactions 
         WHERE news_id = ? AND interaction_type = 'like' 
         AND user_session = ? AND user_ip = ?`,
        [news.id, userSession, clientIp]
      );
      userLikedResult = !!userLiked;

    } catch (interactionErr: any) {
      // Interaction tracking failed (e.g. table missing) — log and continue
      console.warn('[berita/[id]] Interaction tracking unavailable:', interactionErr?.message);
    }
    // === End Interaction Tracking ===

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
    // (already handled inside the interaction tracking block above)

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
      likes_count: interactionCounts.likes_count,
      shares_count: interactionCounts.shares_count,
      views_count: interactionCounts.views_count,
      user_liked: userLikedResult
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

