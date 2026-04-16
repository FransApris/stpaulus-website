import { getQuery, allQuery } from '~/server/database/db'
import { getQuery as getQueryH3 } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const query = getQueryH3(event)
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 10))
    const offset = (page - 1) * limit

    console.log('[Kronik API] Fetching kronik for page:', page, 'limit:', limit)

    // Get category IDs for "Peristiwa Paroki"
    const articleCategory = await getQuery(
      'SELECT id FROM article_categories WHERE name = ? LIMIT 1',
      ['Peristiwa Paroki']
    ) as { id: number } | null

    const agendaCategory = await getQuery(
      'SELECT id FROM agenda_categories WHERE name = ? LIMIT 1',
      ['Peristiwa Paroki']
    ) as { id: number } | null

    console.log('[Kronik API] Categories found:', {
      article: articleCategory?.id,
      agenda: agendaCategory?.id
    })

    // Early return if no categories found
    if (!articleCategory && !agendaCategory) {
      console.log('[Kronik API] No categories found, returning empty')
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }

    let kronikItems: any[] = []

    // Get news with the category (through relations table)
    if (articleCategory && articleCategory.id) {
      try {
        const newsQuery = `
          SELECT
            n.id,
            n.title,
            n.slug,
            n.excerpt,
            n.published_at as date,
            n.image as thumbnail,
            'news' as type,
            CONCAT('/berita/', n.slug) as link
          FROM news n
          INNER JOIN news_category_relations ncr ON n.id = ncr.news_id
          WHERE ncr.category_id = ? 
            AND n.status = 'published'
            AND n.published_at IS NOT NULL
          ORDER BY n.published_at DESC
        `
        const news = await allQuery(newsQuery, [articleCategory.id])
        console.log('[Kronik API] News found:', news.length)
        if (news && news.length > 0) {
          console.log('[Kronik API] News items:', news.map((n: any) => ({
            id: n.id,
            title: n.title,
            date: n.date
          })))
          // Normalize UTC-stored published_at to ISO UTC format so clients (WIB) parse correctly
          kronikItems.push(...news.map((n: any) => ({
            ...n,
            date: n.date ? String(n.date).replace(' ', 'T') + 'Z' : n.date
          })))
        }
      } catch (newsError: any) {
        console.error('[Kronik API] Error fetching news:', newsError.message)
      }
    }

    // Get agendas with the category
    if (agendaCategory && agendaCategory.id) {
      try {
        const agendaQuery = `
          SELECT
            a.id,
            a.title,
            a.description as excerpt,
            a.start_date as date,
            NULL as thumbnail,
            'agenda' as type,
            CONCAT('/agenda/', a.id) as link
          FROM agendas a
          WHERE a.category_id = ?
            AND a.start_date IS NOT NULL
          ORDER BY a.start_date DESC
        `
        const agendas = await allQuery(agendaQuery, [agendaCategory.id])
        console.log('[Kronik API] Agendas found:', agendas.length)
        if (agendas && agendas.length > 0) {
          console.log('[Kronik API] Agenda items:', agendas.map((a: any) => ({
            id: a.id,
            title: a.title,
            date: a.date
          })))
          kronikItems.push(...agendas)
        }
      } catch (agendaError: any) {
        console.error('[Kronik API] Error fetching agendas:', agendaError.message)
      }
    }

    // Sort all items by date descending
    kronikItems.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })

    const total = kronikItems.length
    const totalPages = Math.ceil(total / limit)
    const paginatedItems = kronikItems.slice(offset, offset + limit)

    console.log('[Kronik API] Returning:', paginatedItems.length, 'items')

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  } catch (error: any) {
    console.error('[Kronik API] Fatal error:', error)
    console.error('[Kronik API] Error stack:', error.stack)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memuat data kronik. Silakan coba lagi.',
      data: { error: error.message }
    })
  }
})
