import { requireAuth } from '../../../../utils/auth'
import { allQuery } from '../../../../database/db'

export default defineEventHandler(async (event) => {
  // Authentication check
  requireAuth(event)

  const albumId = getRouterParam(event, 'id')

  if (!albumId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album ID is required'
    })
  }

  try {
    // Debug logging
    console.log('📸 Fetching photos for album ID:', albumId)
    
    // Query photos from database
    const photos = await allQuery(`
      SELECT 
        gp.id,
        gp.filename,
        gp.original_filename,
        gp.path,
        gp.size,
        gp.mime_type,
        gp.created_at,
        ga.title as album_title,
        ga.slug as album_slug
      FROM gallery_photos gp
      INNER JOIN gallery_albums ga ON gp.album_id = ga.id
      WHERE ga.id = ?
      ORDER BY gp.created_at ASC
    `, [albumId])
    
    console.log('📸 Found', photos.length, 'photos for album', albumId)

    // Format photos for frontend
    const formattedPhotos = photos.map((photo: any) => ({
      id: photo.id,
      url: photo.path,
      filename: photo.filename,
      original_filename: photo.original_filename,
      title: photo.original_filename ? photo.original_filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') : photo.filename,
      size: photo.size,
      mime_type: photo.mime_type,
      created_at: photo.created_at
    }))

    return { photos: formattedPhotos }

  } catch (error: any) {
    console.error('Error fetching album photos:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Could not fetch album photos'
    })
  }
})
