import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  try {
    // Fetch news with categories
    const sql = `
      SELECT
        n.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM news n
      LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
      LEFT JOIN article_categories ac ON ncr.category_id = ac.id
      WHERE n.status = 'published'
      GROUP BY n.id
      ORDER BY n.published_at DESC, n.created_at DESC
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
        excerpt: news.excerpt || '',
        content: news.content,
        author: news.author || '',
        status: news.status,
        published_at: news.published_at,
        created_at: news.created_at,
        updated_at: news.updated_at,
        slug: news.slug,
        date: new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        image: news.image || '/images/default-news.jpg',
        categories: categories,
        likes_count: news.likes_count || 0,
        shares_count: news.shares_count || 0,
        views_count: news.views_count || 0
      };
    });

    return processedNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
