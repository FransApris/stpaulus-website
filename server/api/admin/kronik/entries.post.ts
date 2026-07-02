// Admin API: Create new kronik entry
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const body = await readBody(event)

  // Validation
  if (!body.category_id || !body.what_title || !body.what_description || !body.when_date) {
    throw createError({
      statusCode: 400,
      message: 'Category, title, description, and date are required'
    })
  }

  try {
    // Normalize JSON fields and avoid double-encoding
    const gallery = Array.isArray(body.gallery)
      ? JSON.stringify(body.gallery)
      : (typeof body.gallery === 'string' && body.gallery.trim() ? body.gallery : null)
    const documents = Array.isArray(body.documents)
      ? JSON.stringify(body.documents)
      : (typeof body.documents === 'string' && body.documents.trim() ? body.documents : null)

    const result = await runQuery(`
      INSERT INTO kronik_entries (
        category_id,
        section_id,
        what_title,
        what_description,
        who_involved,
        when_date,
        when_duration,
        where_location,
        where_address,
        why_purpose,
        how_process,
        featured_image,
        gallery,
        documents,
        status,
        author_id,
        published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      body.category_id,
      body.section_id || null,
      body.what_title,
      body.what_description,
      body.who_involved || null,
      body.when_date,
      body.when_duration || null,
      body.where_location || null,
      body.where_address || null,
      body.why_purpose || null,
      body.how_process || null,
      body.featured_image || null,
      gallery,
      documents,
      body.status || 'draft',
      body.author_id || null,
      body.status === 'published' ? new Date() : null
    ])

    // Get the created entry
    const entry = await getOne(`
      SELECT 
        e.*,
        c.name as category_name,
        s.name as section_name
      FROM kronik_entries e
      INNER JOIN kronik_categories c ON e.category_id = c.id
      LEFT JOIN kronik_sections s ON e.section_id = s.id
      WHERE e.id = ?
    `, [(result as any).insertId])

    return {
      success: true,
      message: 'Entry created successfully',
      data: entry
    }
  } catch (error) {
    console.error('Error creating entry:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create entry'
    })
  }
})
