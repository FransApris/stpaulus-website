import { requireAuth, requirePermission } from '../../../utils/auth'
import { getRouterParam, readBody } from 'h3'
import db from '../../../database/db'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Album ID is required' })
  }

  // Check if album exists
  const [albums] = await db!.execute('SELECT id FROM gallery_albums WHERE id = ?', [id])
  if (!albums || (albums as any).length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Album not found' })
  }

  const body = await readBody(event)
  const { title, slug, category_id, description } = body

  if (!title || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Title and slug are required' })
  }

  try {
    await db!.execute(
      `UPDATE gallery_albums SET title = ?, slug = ?, category_id = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, slug, category_id || null, description || null, id]
    )

    return { success: true, message: 'Album updated successfully' }
  } catch (error) {
    console.error('Error updating album:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update album' })
  }
})
