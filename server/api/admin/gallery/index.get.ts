import { requireAuth, requirePermission } from '../../../utils/auth'
import db, { allQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  try {
    // Get albums with category information
    const albums = await allQuery(`
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
      WHERE a.status = 'published'
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `)

    // Format albums for frontend compatibility
    const formattedAlbums = albums.map((album: any) => ({
      id: album.id,
      slug: album.slug,
      title: album.title,
      description: album.description,
      tanggal_peristiwa: album.tanggal_peristiwa,
      thumbnail: album.cover_image,
      category: album.category_name ? {
        name: album.category_name,
        color: album.category_color
      } : null,
      photos: [], // Will be populated when viewing album detail
      photos_count: album.photo_count
    }))

    return { albums: formattedAlbums }
  } catch (error) {
    console.error('Error fetching gallery data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch gallery data.',
    })
  }
})
