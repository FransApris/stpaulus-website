import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const wilayah_id = query.wilayah_id ? parseInt(query.wilayah_id as string) : null
    const lingkungan_id = query.lingkungan_id ? parseInt(query.lingkungan_id as string) : null
    const seksi_id = query.seksi_id ? parseInt(query.seksi_id as string) : null
    const is_bgkp = query.is_bgkp === '1' || query.is_bgkp === 'true'

    const conditions: string[] = ["n.status = 'published'"]
    const params: any[] = []

    if (wilayah_id) {
      conditions.push('EXISTS (SELECT 1 FROM news_wilayah_relations nwr WHERE nwr.news_id = n.id AND nwr.wilayah_id = ?)')
      params.push(wilayah_id)
    }
    if (lingkungan_id) {
      conditions.push('EXISTS (SELECT 1 FROM news_lingkungan_relations nlr WHERE nlr.news_id = n.id AND nlr.lingkungan_id = ?)')
      params.push(lingkungan_id)
    }
    if (seksi_id) {
      conditions.push('EXISTS (SELECT 1 FROM news_seksi_relations nsr WHERE nsr.news_id = n.id AND nsr.seksi_id = ?)')
      params.push(seksi_id)
    }
    if (is_bgkp) {
      conditions.push('n.is_bgkp = 1')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    // Fetch news with categories
    const sql = `
      SELECT
        n.*,
        GROUP_CONCAT(DISTINCT ac.name) as category_names,
        GROUP_CONCAT(DISTINCT ac.id) as category_ids,
        GROUP_CONCAT(DISTINCT ac.slug) as category_slugs
      FROM news n
      LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
      LEFT JOIN article_categories ac ON ncr.category_id = ac.id
      ${whereClause}
      GROUP BY n.id
      ORDER BY n.published_at DESC, n.created_at DESC
    `

    const newsList = await allQuery(sql, params);

    // Process categories for each news item
    const processedNews = newsList.map((news: any) => {
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

      // Generate fallback slug from title if slug is missing (matches admin createSlug logic)
      const effectiveSlug = news.slug ||
        (news.title
          ? news.title
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, '')
              .replace(/[\s_-]+/g, '-')
              .replace(/^-+|-+$/g, '')
          : null);

      // Skip news items with no usable slug
      if (!effectiveSlug) return null;

      return {
        id: news.id,
        title: news.title,
        excerpt: news.excerpt || '',
        content: news.content,
        author: news.author || '',
        status: news.status,
        published_at: news.published_at,
        created_at: news.created_at,
        updated_at: news.updated_at,
        slug: effectiveSlug,
        date: new Date((news.published_at || news.created_at).toString().replace(' ', 'T') + 'Z').toLocaleDateString('id-ID', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        image: news.image || '/images/default-news.jpg',
        categories: categories,
        is_bgkp: !!news.is_bgkp,
        likes_count: news.likes_count || 0,
        shares_count: news.shares_count || 0,
        views_count: news.views_count || 0
      };
    });

    return processedNews.filter(Boolean);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
