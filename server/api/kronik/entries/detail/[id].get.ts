// Public API: Get kronik entry detail
import { getQuery as getOne, runQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Entry ID is required'
    })
  }

  try {
    const entry = await getOne(`
      SELECT 
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        s.name as section_name,
        s.slug as section_slug,
        u.username as author_name
      FROM kronik_entries e
      INNER JOIN kronik_categories c ON e.category_id = c.id
      LEFT JOIN kronik_sections s ON e.section_id = s.id
      LEFT JOIN users u ON e.author_id = u.id
      WHERE e.id = ? AND e.status = 'published'
    `, [id])

    if (!entry) {
      throw createError({
        statusCode: 404,
        message: 'Entry not found'
      })
    }

    // Increment views count
    await runQuery(`
      UPDATE kronik_entries 
      SET views_count = views_count + 1 
      WHERE id = ?
    `, [id])

    // Log view (optional - jika ingin tracking detail views)
    const headers = getHeaders(event)
    await runQuery(`
      INSERT INTO kronik_views (kronik_id, ip_address, user_agent)
      VALUES (?, ?, ?)
    `, [id, headers['x-forwarded-for'] || 'unknown', headers['user-agent'] || 'unknown'])

    // Parse JSON fields
    if (entry.gallery) {
      try {
        entry.gallery = JSON.parse(entry.gallery)
      } catch (e) {
        entry.gallery = []
      }
    }

    if (entry.documents) {
      try {
        entry.documents = JSON.parse(entry.documents)
      } catch (e) {
        entry.documents = []
      }
    }

    return {
      success: true,
      data: entry
    }
  } catch (error: unknown) {
    console.error('Error fetching entry detail:', error)
    const err = error as any
    throw createError({
      statusCode: err?.statusCode || 500,
      message: err?.message || 'Failed to fetch entry'
    })
  }
})
