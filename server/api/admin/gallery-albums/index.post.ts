import { requireAuth, requirePermission } from '../../../utils/auth'
import { useBody } from 'h3'
import db from '../../../database/db'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  const body = await readBody(event)
  const { title, slug, category_id, description } = body

  try {
    const [result] = await db.execute(
      'INSERT INTO gallery_albums (title, slug, category_id, description) VALUES (?, ?, ?, ?)',
      [title, slug, category_id, description]
    )

    return { id: (result as any).insertId }
  } catch (error) {
    console.error('Error creating gallery album:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not create gallery album.' })
  }
})
