import { requireAuth, requirePermission } from '../../../utils/auth'
import db from '../../../database/db'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  try {
    const [albums] = await db!.execute(`
      SELECT
        id,
        title,
        slug,
        category_id,
        description,
        created_at,
        updated_at
      FROM gallery_albums
      ORDER BY created_at DESC
    `)

    return { albums }
  } catch (error) {
    console.error('Error fetching gallery albums:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch gallery albums.'
    })
  }
})
