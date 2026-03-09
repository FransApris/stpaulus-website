import { getQuery, allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    const debugInfo: any = {
        step: '',
        error: null,
        data: {}
    }

    try {
        debugInfo.step = 'Fetching article category'
        const articleCategory = await getQuery(
            'SELECT id FROM article_categories WHERE name = ? LIMIT 1',
            ['Peristiwa Paroki']
        )
        debugInfo.data.articleCategory = articleCategory

        debugInfo.step = 'Fetching agenda category'
        const agendaCategory = await getQuery(
            'SELECT id FROM agenda_categories WHERE name = ? LIMIT 1',
            ['Peristiwa Paroki']
        )
        debugInfo.data.agendaCategory = agendaCategory

        if (articleCategory) {
            debugInfo.step = 'Fetching news'
            const newsQuery = `
        SELECT
          n.id,
          n.title,
          n.slug,
          n.excerpt,
          n.published_at as date,
          n.thumbnail,
          'news' as type,
          CONCAT('/berita/', n.slug) as link
        FROM news n
        INNER JOIN news_category_relations ncr ON n.id = ncr.news_id
        WHERE ncr.category_id = ? 
          AND n.status = 'published'
          AND n.published_at IS NOT NULL
          AND n.published_at <= NOW()
        ORDER BY n.published_at DESC
      `
            const news = await allQuery(newsQuery, [articleCategory.id])
            debugInfo.data.newsCount = news.length
            debugInfo.data.newsFirst = news[0] || null
        }

        if (agendaCategory) {
            debugInfo.step = 'Fetching agendas'
            const agendaQuery = `
        SELECT
          a.id,
          a.title,
          a.slug,
          a.description as excerpt,
          a.start_date as date,
          a.image as thumbnail,
          'agenda' as type,
          CONCAT('/agenda/', COALESCE(a.slug, a.id)) as link
        FROM agendas a
        WHERE a.category_id = ?
          AND a.start_date IS NOT NULL
        ORDER BY a.start_date DESC
      `
            const agendas = await allQuery(agendaQuery, [agendaCategory.id])
            debugInfo.data.agendasCount = agendas.length
            debugInfo.data.agendasFirst = agendas[0] || null
        }

        debugInfo.step = 'Success'
        return {
            success: true,
            debug: debugInfo
        }

    } catch (error: any) {
        debugInfo.error = {
            message: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sql: error.sql
        }

        return {
            success: false,
            debug: debugInfo
        }
    }
})
