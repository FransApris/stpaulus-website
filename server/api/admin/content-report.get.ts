import { allQuery, getQuery as dbGetOne } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Only super_admin and admin_komsos can access content reports
  const admin = await dbGetOne(
    `SELECT r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
    [userId]
  ) as any

  if (!admin || !['super_admin', 'admin_komsos'].includes(admin.role_name)) {
    throw createError({ statusCode: 403, statusMessage: 'Akses ditolak' })
  }

  const queryParams = getQuery(event)
  const startDate = (queryParams.startDate as string) || ''
  const endDate = (queryParams.endDate as string) || ''

  // Filters WITH table alias (for queries that use alias a/n/ga)
  const articleDateFilter = startDate && endDate
    ? `AND DATE(a.created_at) BETWEEN '${startDate}' AND '${endDate}'`
    : startDate ? `AND DATE(a.created_at) >= '${startDate}'`
    : endDate   ? `AND DATE(a.created_at) <= '${endDate}'`
    : ''

  const newsDateFilter = startDate && endDate
    ? `AND DATE(n.created_at) BETWEEN '${startDate}' AND '${endDate}'`
    : startDate ? `AND DATE(n.created_at) >= '${startDate}'`
    : endDate   ? `AND DATE(n.created_at) <= '${endDate}'`
    : ''

  const galleryDateFilter = startDate && endDate
    ? `AND DATE(ga.created_at) BETWEEN '${startDate}' AND '${endDate}'`
    : startDate ? `AND DATE(ga.created_at) >= '${startDate}'`
    : endDate   ? `AND DATE(ga.created_at) <= '${endDate}'`
    : ''

  // Filters WITHOUT alias (for subqueries without alias)
  const articleDateFilterRaw = startDate && endDate
    ? `AND DATE(created_at) BETWEEN '${startDate}' AND '${endDate}'`
    : startDate ? `AND DATE(created_at) >= '${startDate}'`
    : endDate   ? `AND DATE(created_at) <= '${endDate}'`
    : ''

  const newsDateFilterRaw = startDate && endDate
    ? `AND DATE(created_at) BETWEEN '${startDate}' AND '${endDate}'`
    : startDate ? `AND DATE(created_at) >= '${startDate}'`
    : endDate   ? `AND DATE(created_at) <= '${endDate}'`
    : ''

  // 1. Articles summary
  const articleSummaryRows = await allQuery(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN a.status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN a.status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(CASE WHEN a.status = 'archived' THEN 1 ELSE 0 END) as archived
    FROM articles a
    WHERE 1=1 ${articleDateFilter}
  `, [])
  const articleSummary = (articleSummaryRows[0] as any) || {}

  // 2. News summary
  const newsSummaryRows = await allQuery(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN n.status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN n.status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(CASE WHEN n.status = 'archived' THEN 1 ELSE 0 END) as archived
    FROM news n
    WHERE 1=1 ${newsDateFilter}
  `, [])
  const newsSummary = (newsSummaryRows[0] as any) || {}

  // 3. Gallery summary
  const gallerySummaryRows = await allQuery(`
    SELECT
      COUNT(DISTINCT ga.id) as total_albums,
      SUM(CASE WHEN ga.status = 'published' THEN 1 ELSE 0 END) as published_albums,
      COUNT(DISTINCT gp.id) as total_photos
    FROM gallery_albums ga
    LEFT JOIN gallery_photos gp ON ga.id = gp.album_id
    WHERE 1=1 ${galleryDateFilter}
  `, [])
  const gallerySummary = (gallerySummaryRows[0] as any) || {}

  // 4. Articles by category
  const articlesByCategory = await allQuery(`
    SELECT
      COALESCE(ac.name, 'Tanpa Kategori') as category,
      COUNT(DISTINCT a.id) as total,
      SUM(CASE WHEN a.status = 'published' THEN 1 ELSE 0 END) as published
    FROM articles a
    LEFT JOIN article_category_relations acr ON a.id = acr.article_id
    LEFT JOIN article_categories ac ON acr.category_id = ac.id
    WHERE 1=1 ${articleDateFilter}
    GROUP BY ac.id, ac.name
    ORDER BY total DESC
    LIMIT 10
  `, [])

  // 5. Monthly trend: articles + news published, last 12 months
  const monthlyTrend = await allQuery(`
    SELECT
      DATE_FORMAT(month_date, '%Y-%m') as month,
      SUM(articles) as articles,
      SUM(news_count) as news
    FROM (
      SELECT DATE_FORMAT(published_at, '%Y-%m') as month_date, COUNT(*) as articles, 0 as news_count
      FROM articles
      WHERE published_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) AND status = 'published'
      GROUP BY DATE_FORMAT(published_at, '%Y-%m')
      UNION ALL
      SELECT DATE_FORMAT(published_at, '%Y-%m') as month_date, 0 as articles, COUNT(*) as news_count
      FROM news
      WHERE published_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) AND status = 'published'
      GROUP BY DATE_FORMAT(published_at, '%Y-%m')
    ) combined
    GROUP BY DATE_FORMAT(month_date, '%Y-%m')
    ORDER BY month ASC
    LIMIT 12
  `, [])

  // 6. Gallery albums by category
  const galleryByCategory = await allQuery(`
    SELECT
      COALESCE(gc.nama_kategori, 'Tanpa Kategori') as category,
      COALESCE(gc.color, '#6B7280') as color,
      COUNT(DISTINCT ga.id) as total_albums,
      COUNT(DISTINCT gp.id) as total_photos
    FROM gallery_albums ga
    LEFT JOIN gallery_categories gc ON ga.category_id = gc.id
    LEFT JOIN gallery_photos gp ON ga.id = gp.album_id
    WHERE 1=1 ${galleryDateFilter}
    GROUP BY gc.id, gc.nama_kategori, gc.color
    ORDER BY total_albums DESC
  `, [])

  // 7. Draft articles older than 30 days (need attention)
  const staleDrafts = await allQuery(`
    SELECT
      a.id,
      a.title,
      a.author,
      a.created_at,
      DATEDIFF(NOW(), a.created_at) as days_old
    FROM articles a
    WHERE a.status = 'draft'
      AND a.created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
    ORDER BY a.created_at ASC
    LIMIT 10
  `, [])

  // 8. Kronik entries by section
  const kronikBySection = await allQuery(`
    SELECT
      COALESCE(ks.title, 'Tanpa Seksi') as section,
      COUNT(ke.id) as total
    FROM kronik_entries ke
    LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
    GROUP BY ks.id, ks.title
    ORDER BY total DESC
  `, []).catch(() => [])

  // 9. Chatbot FAQ stats
  const faqStats = await allQuery(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
      SUM(usage_count) as total_usage
    FROM chatbot_faqs
  `, []).catch(() => [{ total: 0, active: 0, inactive: 0, total_usage: 0 }])

  // 10. Most active authors (articles + news combined)
  const topAuthors = await allQuery(`
    SELECT author, SUM(cnt) as total
    FROM (
      SELECT author, COUNT(*) as cnt FROM articles WHERE author IS NOT NULL AND author != '' ${articleDateFilterRaw} GROUP BY author
      UNION ALL
      SELECT author, COUNT(*) as cnt FROM news WHERE author IS NOT NULL AND author != '' ${newsDateFilterRaw} GROUP BY author
    ) combined
    GROUP BY author
    ORDER BY total DESC
    LIMIT 10
  `, [])

  return {
    articleSummary,
    newsSummary,
    gallerySummary,
    articlesByCategory,
    monthlyTrend,
    galleryByCategory,
    staleDrafts,
    kronikBySection,
    faqStats: (faqStats[0] as any) || {},
    topAuthors
  }
})
