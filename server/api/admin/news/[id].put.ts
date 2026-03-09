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
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'News ID is required'
      })
    }

    const body = await readBody(event)
    const {
      title, slug, excerpt, content, author, status, category_ids, image,
      when_date, when_time, where_location, who_participants, why_purpose, how_process,
      gallery_images, ai_generated, ai_prompt
    } = body

    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    const existingNews = await getDbQuery('SELECT id FROM news WHERE id = ?', [id])
    if (!existingNews) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found'
      })
    }

    const finalSlug = slug || createSlug(title)

    const slugCheck = await getDbQuery('SELECT id FROM news WHERE slug = ? AND id != ?', [finalSlug, id])
    if (slugCheck) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    let publishedAt = null
    if (status === 'published') {
      const currentNews = await getDbQuery('SELECT status, published_at FROM news WHERE id = ?', [id]) as { status: string, published_at: string } | undefined
      if (currentNews && currentNews.status !== 'published') {
        // Format datetime for MySQL: YYYY-MM-DD HH:MM:SS
        publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      } else if (currentNews && currentNews.published_at) {
        // Keep existing published_at if already published
        publishedAt = currentNews.published_at
      }
    }

    console.log('[News Update] Image value:', image ? image.substring(0, 50) : 'null')

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
      publishedAt,
      id
    ]

    console.log('[News Update] SQL params:', params.map((p, i) => `[${i}]: ${p === null ? 'NULL' : typeof p}`))

    const result = await runQuery(
      `UPDATE news SET 
        title = ?, slug = ?, content = ?, excerpt = ?, author = ?, status = ?, image = ?, gallery_images = ?,
        when_date = ?, when_time = ?, where_location = ?, who_participants = ?, why_purpose = ?, how_process = ?,
        ai_generated = ?, ai_prompt = ?, published_at = ?, updated_at = NOW() 
      WHERE id = ?`,
      params
    )

    if ((result as any).affectedRows === 0) {
      // Check if news still exists (in case it was deleted concurrently)
      const check = await getDbQuery('SELECT id FROM news WHERE id = ?', [id])
      if (!check) {
        throw createError({
          statusCode: 404,
          statusMessage: 'News not found'
        })
      }
      // If exists but no changes, still success
    }

    // Update category relations
    // First, delete existing relations
    await runQuery('DELETE FROM news_category_relations WHERE news_id = ?', [id])

    // Then insert new relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      const categoryPromises = category_ids.map(categoryId =>
        runQuery(
          'INSERT INTO news_category_relations (news_id, category_id) VALUES (?, ?)',
          [id, categoryId]
        )
      )
      await Promise.all(categoryPromises)
    }

    // Auto-sync to kronik based on status and categories
    await handleNewsKronikSync(
      parseInt(id),
      status || 'draft',
      category_ids && Array.isArray(category_ids) ? category_ids : []
    )

    // Fetch the updated news with categories
    const updatedNews = await getDbQuery(
      `SELECT n.*, 
       GROUP_CONCAT(DISTINCT nc.id) as category_ids,
       GROUP_CONCAT(DISTINCT nc.name) as category_names
       FROM news n
       LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
       LEFT JOIN article_categories nc ON ncr.category_id = nc.id
       WHERE n.id = ?
       GROUP BY n.id`,
      [id]
    )

    return {
      success: true,
      message: 'News updated successfully',
      data: updatedNews
    }
  } catch (error: any) {
    console.error('Error updating news:', error)
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
