// Public API: Get kronik entry detail
import { getQuery as getOne, runQuery } from '~/server/database/db'
import { existsSync } from 'fs'
import { join } from 'path'

const normalizeImagePath = (value: unknown): string | null => {
  const text = String(value || '').trim()
  if (!text) return null
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.startsWith('/')) return text
  return `/uploads/kronik/${text}`
}

const ensureImagePathExists = (value: unknown): string | null => {
  const normalized = normalizeImagePath(value)
  if (!normalized) return null
  if (!normalized.startsWith('/uploads/')) return normalized

  const fullPath = join(process.cwd(), 'public', normalized.replace(/^\//, ''))
  return existsSync(fullPath) ? normalized : null
}

const parseJsonMaybeNested = (value: any) => {
  if (!value) return []
  let parsed: any = value

  for (let i = 0; i < 2; i++) {
    if (typeof parsed !== 'string') break
    const text = parsed.trim()
    if (!text) return []
    try {
      parsed = JSON.parse(text)
    } catch {
      break
    }
  }

  return Array.isArray(parsed) ? parsed : []
}

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

    entry.featured_image = ensureImagePathExists(entry.featured_image)
    // Parse JSON fields (supports legacy double-encoded rows)
    entry.gallery = parseJsonMaybeNested(entry.gallery)
      .map((img: unknown) => ensureImagePathExists(img))
      .filter(Boolean)
    entry.documents = parseJsonMaybeNested(entry.documents)

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
