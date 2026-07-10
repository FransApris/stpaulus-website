import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import { handleNewsKronikSync } from '../../../utils/news-kronik-sync'

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export default defineEventHandler(async (event) => {
  requireAuth(event)

  try {
    const body = await readBody(event)
    console.log('[News Create] Received body:', JSON.stringify(body, null, 2))

    const {
      title, slug, excerpt, content, author, status, category_ids, image,
      when_date, when_time, where_location, who_participants, why_purpose, how_process,
      gallery_images, ai_generated, ai_prompt,
      wilayah_ids, lingkungan_ids, seksi_ids, is_bgkp
    } = body

    console.log('[News Create] Parsed values:', {
      hasTitle: !!title,
      titleLength: title?.length || 0,
      hasContent: !!content,
      contentLength: content?.length || 0,
      contentPreview: content ? content.substring(0, 100) : 'null',
      status,
      categoryIds: category_ids
    })

    // Check if content is not just empty HTML tags
    const contentText = content?.replace(/<[^>]*>/g, '').trim()

    if (!title || !contentText || contentText.length === 0) {
      console.error('[News Create] Validation failed:', {
        title: title || 'MISSING',
        contentText: contentText || 'EMPTY',
        originalContent: content
      })
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    const finalSlug = slug || createSlug(title)

    const existingNews = await getDbQuery('SELECT id FROM news WHERE slug = ?', [finalSlug])
    if (existingNews) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    const publishedAt = status === 'published'
      ? new Date().toISOString().slice(0, 19).replace('T', ' ')
      : null

    console.log('[News Create] Image value:', image ? image.substring(0, 50) : 'null')

    // Ensure all undefined values are converted to null for MySQL
    const params = [
      title,
      finalSlug,
      content,
      excerpt || null,
      author || null,
      status || 'draft',
      image || null,
      gallery_images ? JSON.stringify(gallery_images) : null,
      when_date || null,
      when_time || null,
      where_location || null,
      who_participants || null,
      why_purpose || null,
      how_process || null,
      ai_generated || false,
      ai_prompt || null,
      publishedAt
    ]

    console.log('[News Create] SQL params:', params.map((p, i) => `[${i}]: ${p === null ? 'NULL' : typeof p}`))

    const result = await runQuery(
      `INSERT INTO news (
        title, slug, content, excerpt, author, status, image, gallery_images,
        when_date, when_time, where_location, who_participants, why_purpose, how_process,
        ai_generated, ai_prompt, published_at, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      params
    )

    const newsId = (result as any).insertId

    // Insert category relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      const categoryPromises = category_ids.map(categoryId =>
        runQuery(
          'INSERT INTO news_category_relations (news_id, category_id) VALUES (?, ?)',
          [newsId, categoryId]
        )
      )
      await Promise.all(categoryPromises)
    }

    // Auto-sync to kronik if status is published and category is configured
    if (status === 'published' && category_ids && category_ids.length > 0) {
      await handleNewsKronikSync(newsId, status, category_ids)
    }

    // Update is_bgkp flag
    if (is_bgkp !== undefined) {
      await runQuery('UPDATE news SET is_bgkp = ? WHERE id = ?', [is_bgkp ? 1 : 0, newsId])
    }

    // Insert wilayah relations
    if (wilayah_ids && Array.isArray(wilayah_ids) && wilayah_ids.length > 0) {
      await Promise.all(wilayah_ids.map((wid: number) =>
        runQuery('INSERT IGNORE INTO news_wilayah_relations (news_id, wilayah_id) VALUES (?, ?)', [newsId, wid])
      ))
    }

    // Insert lingkungan relations
    if (lingkungan_ids && Array.isArray(lingkungan_ids) && lingkungan_ids.length > 0) {
      await Promise.all(lingkungan_ids.map((lid: number) =>
        runQuery('INSERT IGNORE INTO news_lingkungan_relations (news_id, lingkungan_id) VALUES (?, ?)', [newsId, lid])
      ))
    }

    // Insert seksi relations
    if (seksi_ids && Array.isArray(seksi_ids) && seksi_ids.length > 0) {
      await Promise.all(seksi_ids.map((sid: number) =>
        runQuery('INSERT IGNORE INTO news_seksi_relations (news_id, seksi_id) VALUES (?, ?)', [newsId, sid])
      ))
    }

    // Fetch the created news with categories
    const createdNews = await getDbQuery(
      `SELECT n.*, 
       GROUP_CONCAT(DISTINCT nc.id) as category_ids,
       GROUP_CONCAT(DISTINCT nc.name) as category_names
       FROM news n
       LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
       LEFT JOIN article_categories nc ON ncr.category_id = nc.id
       WHERE n.id = ?
       GROUP BY n.id`,
      [newsId]
    )

    return {
      success: true,
      message: 'News created successfully',
      data: createdNews
    }
  } catch (error: any) {
    console.error('Error creating news:', error)
    console.error('Error stack:', error?.stack)
    console.error('Error message:', error?.message)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal server error',
      data: {
        error: error?.message,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      }
    })
  }
})
