import { runQuery, getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

const iconBySlug: Record<string, string> = {
  'misa-harian': '✝️',
  'misa-minggu': '⛪',
  'misa-hari-raya': '🎄',
  'sakramen-tobat': '🙏',
  'adorasi': '🕯️',
  'rosario': '📿',
  'novena': '🕊️',
  'ibadat-lainnya': '🙌'
}

const normalizeIcon = (icon: unknown, slug?: string) => {
  const text = String(icon || '').trim()
  const fallback = iconBySlug[String(slug || '').trim()] || '⛪'
  return (!text || /^\?+$/.test(text)) ? fallback : text
}

export default defineEventHandler(async (event) => {
  // Check permission
  requirePermission('manage_liturgy_types')(event)

  const body = await readBody(event)
  const { name, slug, icon, color, description, display_order } = body

  // Validation
  if (!name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and slug are required'
    })
  }

  // Auto-generate unique slug if conflict exists
  let uniqueSlug = slug
  let counter = 1
  while (true) {
    const existing = await getQuery('SELECT id FROM liturgy_types WHERE slug = ?', [uniqueSlug])
    if (!existing) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  try {
    const normalizedIcon = normalizeIcon(icon, uniqueSlug)

    const result = await runQuery(`
      INSERT INTO liturgy_types (name, slug, icon, color, description, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [name, uniqueSlug, normalizedIcon, color || '#6B7280', description || '', display_order || 0])

    const insertId = (result as any).insertId

    // Fetch created data to return
    const createdType = await getQuery('SELECT * FROM liturgy_types WHERE id = ?', [insertId])

    return {
      success: true,
      message: 'Liturgy type created successfully',
      data: createdType
    }
  } catch (error) {
    console.error('Error creating liturgy type:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create liturgy type'
    })
  }
})
