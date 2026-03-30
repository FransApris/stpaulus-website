// Admin API: Get single kronik entry
import { getQuery as getOne } from '~/server/database/db'
import { getRouterParam } from 'h3'
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
    // Get the entry with all related data
    const entry = await getOne(`
      SELECT 
        ke.*,
        kc.name as category_name,
        kc.slug as category_slug,
        ks.name as section_name,
        u.full_name as author_name,
        u.username as author_username
      FROM kronik_entries ke
      LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
      LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
      LEFT JOIN users u ON ke.author_id = u.id
      WHERE ke.id = ?
    `, [id])

    if (!entry) {
      throw createError({
        statusCode: 404,
        message: 'Entry not found'
      })
    }

    entry.featured_image = ensureImagePathExists(entry.featured_image)
    entry.gallery = parseJsonMaybeNested(entry.gallery)
      .map((img: unknown) => ensureImagePathExists(img))
      .filter(Boolean)
    entry.documents = parseJsonMaybeNested(entry.documents)

    return {
      success: true,
      data: entry
    }
  } catch (error: any) {
    console.error('Error fetching kronik entry:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch kronik entry'
    })
  }
})
