/**
 * server/routes/sitemap.xml.ts
 *
 * Dynamic XML Sitemap Generator for Search Engine Crawlers (Google, Bing).
 * Automatically queries news, articles, and public routes from database.
 */
import { getQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://stpaulusjuanda.org'

  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/jadwal-misa', priority: '0.9', changefreq: 'weekly' },
    { url: '/berita', priority: '0.8', changefreq: 'daily' },
    { url: '/artikel', priority: '0.8', changefreq: 'weekly' },
    { url: '/pengumuman', priority: '0.8', changefreq: 'daily' },
    { url: '/kronik', priority: '0.7', changefreq: 'weekly' },
    { url: '/dpp', priority: '0.6', changefreq: 'monthly' },
    { url: '/bgkp', priority: '0.6', changefreq: 'monthly' },
    { url: '/pastor', priority: '0.6', changefreq: 'monthly' },
    { url: '/dokumen', priority: '0.6', changefreq: 'weekly' },
    { url: '/kontak', priority: '0.5', changefreq: 'monthly' },
    { url: '/booking', priority: '0.7', changefreq: 'weekly' }
  ]

  let dynamicUrls: Array<{ url: string; lastmod?: string; priority: string; changefreq: string }> = []

  try {
    // 1. Fetch active news
    const news = await getQuery(
      'SELECT slug, updated_at, created_at FROM news WHERE status = "published" OR is_active = 1 ORDER BY id DESC LIMIT 500',
      []
    ) as any[]
    if (Array.isArray(news)) {
      news.forEach(item => {
        dynamicUrls.push({
          url: `/berita/${item.slug}`,
          lastmod: item.updated_at || item.created_at,
          priority: '0.7',
          changefreq: 'monthly'
        })
      })
    }

    // 2. Fetch active articles
    const articles = await getQuery(
      'SELECT slug, updated_at, created_at FROM articles WHERE status = "published" OR is_active = 1 ORDER BY id DESC LIMIT 500',
      []
    ) as any[]
    if (Array.isArray(articles)) {
      articles.forEach(item => {
        dynamicUrls.push({
          url: `/artikel/${item.slug}`,
          lastmod: item.updated_at || item.created_at,
          priority: '0.7',
          changefreq: 'monthly'
        })
      })
    }
  } catch (err) {
    console.warn('[Sitemap] Failed to fetch dynamic database routes:', err)
  }

  const allPages = [...staticPages, ...dynamicUrls]
  const now = new Date().toISOString().slice(0, 10)

  const xmlUrls = allPages
    .map(page => {
      const lastmod = page.lastmod ? new Date(page.lastmod).toISOString().slice(0, 10) : now
      return `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })
    .join('\n')

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=14400')

  return send(event, xmlContent, 'application/xml')
})

