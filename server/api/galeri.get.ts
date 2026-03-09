import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  try {
    // Get albums with category information and photo count
    const sql = `
      SELECT
        a.id,
        a.title,
        a.slug,
        a.description,
        a.tanggal_peristiwa,
        a.cover_image,
        a.status,
        a.created_at,
        c.nama_kategori as category_name,
        c.color as category_color,
        (SELECT COUNT(*) FROM gallery_photos WHERE album_id = a.id) as photo_count
      FROM gallery_albums a
      LEFT JOIN gallery_categories c ON a.category_id = c.id
      WHERE a.status = 'published'
      ORDER BY a.created_at DESC
    `

    const albums = await allQuery(sql)

    // Format albums for frontend compatibility
    const formattedAlbums = albums.map((album: any) => ({
      id: album.slug,
      title: album.title,
      description: album.description,
      tanggal_peristiwa: album.tanggal_peristiwa,
      thumbnail: album.cover_image,
      photoCount: album.photo_count || 0,
      category: album.category_name ? {
        name: album.category_name,
        color: album.category_color
      } : null,
      photos: [] // Will be populated when viewing album detail
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
