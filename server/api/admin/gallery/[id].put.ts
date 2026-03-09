import { requireAuth, requirePermission } from '../../../utils/auth'
import { runQuery, getQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  const albumId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { title, description, tanggal_peristiwa, category_id } = body

  if (!albumId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album ID is required'
    })
  }

  try {
    // Check if album exists
    const existingAlbum = await getQuery('SELECT id FROM gallery_albums WHERE slug = ?', [albumId])
    if (!existingAlbum) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    // Update album
    const updateResult = await runQuery(`
      UPDATE gallery_albums
      SET title = ?, description = ?, tanggal_peristiwa = ?, category_id = ?, updated_at = NOW()
      WHERE slug = ?
    `, [title, description, tanggal_peristiwa, category_id, albumId])

    if ((updateResult as any).affectedRows === 0) {
      // Check if album still exists (in case it was deleted concurrently)
      const check = await getQuery('SELECT id FROM gallery_albums WHERE slug = ?', [albumId])
      if (!check) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Album not found'
        })
      }
      // If exists but no changes, still success
    }

    // Get updated album with category info
    const album = await getQuery(`
      SELECT
        a.id,
        a.title,
        a.slug,
        a.description,
        a.tanggal_peristiwa,
        a.cover_image,
        a.status,
        a.created_at,
        a.updated_at,
        c.nama_kategori as category_name,
        c.color as category_color,
        COUNT(p.id) as photo_count
      FROM gallery_albums a
      LEFT JOIN gallery_categories c ON a.category_id = c.id
      LEFT JOIN gallery_photos p ON a.id = p.album_id
      WHERE a.slug = ?
      GROUP BY a.id
    `, [albumId]) as any

    return {
      success: true,
      album: {
        id: album.slug,
        title: album.title,
        description: album.description,
        tanggal_peristiwa: album.tanggal_peristiwa,
        thumbnail: album.cover_image,
        category: album.category_name ? {
          name: album.category_name,
          color: album.category_color
        } : null,
        photos: [],
        photos_count: album.photo_count
      }
    }
  } catch (error) {
    console.error('Error updating album:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update album'
    })
  }
})
