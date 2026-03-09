import { requireAuth, requirePermission } from '../../../utils/auth'
import { getRouterParam } from 'h3'
import db from '../../../database/db'
import { rm } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Album ID is required' })
  }

  try {
    // Check if album exists and get slug
    const [albums] = await db!.execute(
      'SELECT id, slug FROM gallery_albums WHERE id = ?',
      [id]
    )
    if (!albums || (albums as any).length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Album not found' })
    }
    const album = (albums as any)[0]
    const albumSlug = album.slug

    // Check if album has photos
    const [photos] = await db!.execute(
      'SELECT COUNT(*) as photo_count FROM gallery_photos WHERE album_id = ?',
      [id]
    )
    const photoCount = photos && (photos as any)[0]?.photo_count

    if (photoCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete album with active photos'
      })
    }

    // Delete album from DB
    await db!.execute('DELETE FROM gallery_albums WHERE id = ?', [id])

    // Cleanup album folder in filesystem
    const albumPath = join(process.cwd(), 'public', 'images', 'album', albumSlug)
    try {
      await rm(albumPath, { recursive: true, force: true })
    } catch (err) {
      console.error('Error cleaning album directory:', err)
      // Proceed without failing on filesystem error
    }

    return { success: true, message: 'Album deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting album:', error)
    if (error.statusCode && error.statusMessage) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
      })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete album' })
  }
})
