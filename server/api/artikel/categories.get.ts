import { allQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  try {
    // Query actual article counts from database
    const sql = `
      SELECT
        ac.id,
        ac.name,
        ac.slug,
        ac.description,
        COUNT(DISTINCT a.id) as article_count
      FROM article_categories ac
      LEFT JOIN article_category_relations acr ON ac.id = acr.category_id
      LEFT JOIN articles a ON acr.article_id = a.id AND a.status = 'published'
      GROUP BY ac.id, ac.name, ac.slug, ac.description
      ORDER BY ac.name ASC
    `;

    const categories = await allQuery(sql);

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
