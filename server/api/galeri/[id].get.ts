import { getQuery, allQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album slug is required'
    })
  }

  try {
    // Get album details with category
    const albumSql = `
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
        c.color as category_color
      FROM gallery_albums a
      LEFT JOIN gallery_categories c ON a.category_id = c.id
      WHERE a.slug = ? AND a.status = 'published'
      LIMIT 1
    `

    const album = await getQuery(albumSql, [slug])

    if (!album) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    // Get all photos for this album
    const photosSql = `
      SELECT
        id,
        filename,
        original_filename,
        path,
        size,
        mime_type,
        created_at
      FROM gallery_photos
      WHERE album_id = ?
      ORDER BY created_at ASC
    `

    const photos = await allQuery(photosSql, [album.id])

    // Format response
    const formattedAlbum = {
      id: album.slug,
      title: album.title,
      description: album.description,
      tanggal_peristiwa: album.tanggal_peristiwa,
      thumbnail: album.cover_image,
      category: album.category_name ? {
        name: album.category_name,
        color: album.category_color
      } : null,
      photos: photos.map(photo => ({
        id: photo.id,
        url: photo.path,
        filename: photo.filename,
        originalName: photo.original_filename,
        size: photo.size,
        mimeType: photo.mime_type,
        caption: photo.original_filename || photo.filename
      }))
    }

    return formattedAlbum
  } catch (error: any) {
    console.error('Error fetching album detail:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
