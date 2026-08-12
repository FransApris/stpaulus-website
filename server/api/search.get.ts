import { allQuery, runQuery } from '../database/db'

// ✅ Simple in-memory cache for search results
const searchCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const RESULTS_PER_PAGE = 20 // ✅ FASE 2: Pagination

// ✅ FASE 2: Search Analytics Logger
async function logSearch(searchTerm: string, resultsCount: number) {
  try {
    const sql = `
      INSERT INTO search_logs (query, results_count, searched_at)
      VALUES (?, ?, NOW())
    `
    await runQuery(sql, [searchTerm, resultsCount])
  } catch (error) {
    // Silent fail - don't break search if logging fails
    console.error('Failed to log search:', error)
  }
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    const query = getQuery(event)
    const searchTerm = query.q as string
    const page = parseInt(query.page as string) || 1 // ✅ FASE 2: Page number
    
    // ✅ FASE 3: Filter parameters
    const filterType = query.type as string
    const dateFrom = query.dateFrom as string
    const dateTo = query.dateTo as string
    const sortBy = query.sort as string || 'relevance'

    // ✅ SECURITY: Validate inputs to prevent SQL Injection
    const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);
    if (dateFrom && !isValidDate(dateFrom)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid dateFrom format. Expected YYYY-MM-DD' })
    }
    if (dateTo && !isValidDate(dateTo)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid dateTo format. Expected YYYY-MM-DD' })
    }
    
    const allowedSorts = ['relevance', 'date_desc', 'date_asc', 'title_asc']
    if (query.sort && !allowedSorts.includes(sortBy)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid sort option' })
    }
    
    const allowedTypes = ['', 'article', 'news', 'agenda', 'document']
    if (filterType && !allowedTypes.includes(filterType)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid filter type' })
    }

    if (!searchTerm || searchTerm.trim().length < 2) {
      return {
        query: searchTerm || '',
        results: [],
        total: 0,
        page: 1,
        perPage: RESULTS_PER_PAGE,
        totalPages: 0,
        queryTime: 0
      }
    }

    const cleanSearchTerm = searchTerm.trim()
    
    // ✅ FASE 3: Include filters in cache key
    const cacheKey = `${cleanSearchTerm.toLowerCase()}_page_${page}_${filterType || 'all'}_${dateFrom || ''}_${dateTo || ''}_${sortBy}`

    // ✅ CHECK CACHE FIRST
    const cached = searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`✅ Cache hit for: "${cleanSearchTerm}" page ${page} (${Date.now() - startTime}ms)`)
      return {
        ...cached.data,
        cached: true,
        queryTime: Date.now() - startTime
      }
    }

    // ✅ FASE 3: Build dynamic WHERE clauses for filters
    const dateFilter = dateFrom && dateTo ? 
      `AND date BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''
    
    // ✅ Build ORDER BY clause based on sort option
    let orderBy = 'ORDER BY relevance DESC, date DESC' // default
    if (sortBy === 'date_desc') {
      orderBy = 'ORDER BY date DESC, relevance DESC'
    } else if (sortBy === 'date_asc') {
      orderBy = 'ORDER BY date ASC, relevance DESC'
    } else if (sortBy === 'title_asc') {
      orderBy = 'ORDER BY title ASC'
    }

    // ✅ FULLTEXT SEARCH - Get ALL results first for total count
    // ✅ FASE 3: Build count query based on type filter
    let countSql = ''
    let countParams: string[] = []
    
    if (!filterType || filterType === '') {
      // All types
      countSql = `
        SELECT COUNT(*) as total FROM (
          SELECT id FROM articles 
          WHERE status = 'published' AND MATCH(title, excerpt, content) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFrom && dateTo ? `AND published_at BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
          UNION ALL
          SELECT id FROM news 
          WHERE status = 'published' AND MATCH(title, excerpt, content) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFrom && dateTo ? `AND published_at BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
          UNION ALL
          SELECT id FROM agendas 
          WHERE start_date >= NOW() AND MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFrom && dateTo ? `AND start_date BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
          UNION ALL
          SELECT id FROM documents 
          WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFrom && dateTo ? `AND created_at BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
        ) as combined_results
      `
      countParams = [cleanSearchTerm, cleanSearchTerm, cleanSearchTerm, cleanSearchTerm]
    } else if (filterType === 'article') {
      countSql = `
        SELECT COUNT(*) as total FROM articles 
        WHERE status = 'published' AND MATCH(title, excerpt, content) AGAINST(? IN NATURAL LANGUAGE MODE)
        ${dateFrom && dateTo ? `AND published_at BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
      `
      countParams = [cleanSearchTerm]
    } else if (filterType === 'news') {
      countSql = `
        SELECT COUNT(*) as total FROM news 
        WHERE status = 'published' AND MATCH(title, excerpt, content) AGAINST(? IN NATURAL LANGUAGE MODE)
        ${dateFrom && dateTo ? `AND published_at BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
      `
      countParams = [cleanSearchTerm]
    } else if (filterType === 'agenda') {
      countSql = `
        SELECT COUNT(*) as total FROM agendas 
        WHERE start_date >= NOW() AND MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
        ${dateFrom && dateTo ? `AND start_date BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
      `
      countParams = [cleanSearchTerm]
    } else if (filterType === 'document') {
      countSql = `
        SELECT COUNT(*) as total FROM documents 
        WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
        ${dateFrom && dateTo ? `AND created_at BETWEEN '${dateFrom}' AND '${dateTo} 23:59:59'` : ''}
      `
      countParams = [cleanSearchTerm]
    }

    const [countResult] = await allQuery(countSql, countParams)
    const totalResults = countResult?.total || 0

    // ✅ FULLTEXT SEARCH with PAGINATION (Much faster than LIKE - 18x improvement)
    const offset = (page - 1) * RESULTS_PER_PAGE
    
    // ✅ FASE 3: Build search query based on type filter
    let sql = ''
    let params: string[] = []
    
    if (!filterType || filterType === '') {
      // ⚠️ IMPORTANT: LIMIT and OFFSET must be literal integers, not placeholders in MySQL
      sql = `
        SELECT
          'article' as type,
          a.id,
          a.title,
          a.excerpt,
          a.content,
          a.slug,
          a.published_at as date,
          a.created_at,
          a.author,
          '' as location,
          '' as category_name,
          '' as category_color,
          MATCH(a.title, a.excerpt, a.content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM articles a
        WHERE a.status = 'published'
          AND MATCH(a.title, a.excerpt, a.content) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}

        UNION ALL

        SELECT
          'news' as type,
          n.id,
          n.title,
          n.excerpt,
          n.content,
          n.slug,
          n.published_at as date,
          n.created_at,
          n.author,
          '' as location,
          '' as category_name,
          '' as category_color,
          MATCH(n.title, n.excerpt, n.content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM news n
        WHERE n.status = 'published'
          AND MATCH(n.title, n.excerpt, n.content) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}

        UNION ALL

        SELECT
          'agenda' as type,
          ag.id,
          ag.title,
          ag.description as excerpt,
          '' as content,
          CONCAT('agenda/', ag.id) as slug,
          ag.start_date as date,
          ag.created_at,
          ag.contact_person as author,
          ag.location,
          c.name as category_name,
          c.color as category_color,
          MATCH(ag.title, ag.description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM agendas ag
        LEFT JOIN agenda_categories c ON ag.category_id = c.id
        WHERE ag.start_date >= NOW()
          AND MATCH(ag.title, ag.description) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}

        UNION ALL

        SELECT
          'document' as type,
          d.id,
          d.title,
          d.description as excerpt,
          '' as content,
          CONCAT('dokumen/', d.id) as slug,
          d.created_at as date,
          d.created_at,
          '' as author,
          '' as location,
          dc.name as category_name,
          dc.color as category_color,
          MATCH(d.title, d.description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM documents d
        LEFT JOIN document_categories dc ON d.category_id = dc.id
        WHERE MATCH(d.title, d.description) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}

        ${orderBy}
        LIMIT ${RESULTS_PER_PAGE} OFFSET ${offset}
      `
      params = [
        cleanSearchTerm, cleanSearchTerm, // articles
        cleanSearchTerm, cleanSearchTerm, // news
        cleanSearchTerm, cleanSearchTerm, // agendas
        cleanSearchTerm, cleanSearchTerm  // documents
      ]
    } else if (filterType === 'article') {
      sql = `
        SELECT
          'article' as type,
          a.id,
          a.title,
          a.excerpt,
          a.content,
          a.slug,
          a.published_at as date,
          a.created_at,
          a.author,
          '' as location,
          '' as category_name,
          '' as category_color,
          MATCH(a.title, a.excerpt, a.content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM articles a
        WHERE a.status = 'published'
          AND MATCH(a.title, a.excerpt, a.content) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}
        ${orderBy}
        LIMIT ${RESULTS_PER_PAGE} OFFSET ${offset}
      `
      params = [cleanSearchTerm, cleanSearchTerm]
    } else if (filterType === 'news') {
      sql = `
        SELECT
          'news' as type,
          n.id,
          n.title,
          n.excerpt,
          n.content,
          n.slug,
          n.published_at as date,
          n.created_at,
          n.author,
          '' as location,
          '' as category_name,
          '' as category_color,
          MATCH(n.title, n.excerpt, n.content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM news n
        WHERE n.status = 'published'
          AND MATCH(n.title, n.excerpt, n.content) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}
        ${orderBy}
        LIMIT ${RESULTS_PER_PAGE} OFFSET ${offset}
      `
      params = [cleanSearchTerm, cleanSearchTerm]
    } else if (filterType === 'agenda') {
      sql = `
        SELECT
          'agenda' as type,
          ag.id,
          ag.title,
          ag.description as excerpt,
          '' as content,
          CONCAT('agenda/', ag.id) as slug,
          ag.start_date as date,
          ag.created_at,
          ag.contact_person as author,
          ag.location,
          c.name as category_name,
          c.color as category_color,
          MATCH(ag.title, ag.description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM agendas ag
        LEFT JOIN agenda_categories c ON ag.category_id = c.id
        WHERE ag.start_date >= NOW()
          AND MATCH(ag.title, ag.description) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}
        ${orderBy}
        LIMIT ${RESULTS_PER_PAGE} OFFSET ${offset}
      `
      params = [cleanSearchTerm, cleanSearchTerm]
    } else if (filterType === 'document') {
      sql = `
        SELECT
          'document' as type,
          d.id,
          d.title,
          d.description as excerpt,
          '' as content,
          CONCAT('dokumen/', d.id) as slug,
          d.created_at as date,
          d.created_at,
          '' as author,
          '' as location,
          dc.name as category_name,
          dc.color as category_color,
          MATCH(d.title, d.description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM documents d
        LEFT JOIN document_categories dc ON d.category_id = dc.id
        WHERE MATCH(d.title, d.description) AGAINST(? IN NATURAL LANGUAGE MODE)
          ${dateFilter}
        ${orderBy}
        LIMIT ${RESULTS_PER_PAGE} OFFSET ${offset}
      `
      params = [cleanSearchTerm, cleanSearchTerm]
    }

    const results = await allQuery(sql, params)

    // ✅ FASE 2: Log search analytics (async, don't wait)
    logSearch(cleanSearchTerm, totalResults).catch(err => console.error('Log error:', err))

    // Process results to add formatted date and URL
    const processedResults = results.map((result: any) => {
      let url = ''
      if (result.type === 'agenda') {
        url = `/${result.slug}` // agenda/[id]
      } else if (result.type === 'document') {
        url = `/dokumen/${result.id}` // dokumen/[id]
      } else if (result.type === 'article') {
        url = `/artikel/${result.slug}` // ✅ FIXED: artikel (Indonesian)
      } else if (result.type === 'news') {
        url = `/berita/${result.slug}` // ✅ FIXED: berita (Indonesian)
      } else {
        url = `/${result.type}/${result.slug}` // fallback
      }

      return {
        type: result.type,
        id: result.id,
        title: result.title,
        excerpt: result.excerpt || '',
        slug: result.slug,
        date: result.date,
        formatted_date: result.date ? new Date(result.date).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : '',
        author: result.author || '',
        location: result.location || '',
        category_name: result.category_name || '',
        category_color: result.category_color || '',
        url,
        relevance: result.relevance || 0
      }
    })

    const queryTime = Date.now() - startTime
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE)

    const response = {
      query: cleanSearchTerm,
      results: processedResults,
      total: totalResults,
      page,
      perPage: RESULTS_PER_PAGE,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      queryTime,
      cached: false
    }

    // ✅ CACHE THE RESULT
    searchCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    })

    // ✅ CLEANUP OLD CACHE (keep max 100 entries)
    if (searchCache.size > 100) {
      const oldestKey = Array.from(searchCache.keys())[0]
      searchCache.delete(oldestKey)
    }

    console.log(`🔍 Search "${cleanSearchTerm}": ${processedResults.length} results in ${queryTime}ms`)

    return response

  } catch (error) {
    console.error('Error performing search:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
