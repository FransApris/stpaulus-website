import { requireAuth, requirePermission } from '../../../utils/auth'
import { runQuery, getQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  const body = await readBody(event)
  const { title, description, tanggal_peristiwa, category_id, slug } = body

  // Validate required fields
  if (!title || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and slug are required'
    })
  }

  try {
    // Check if slug already exists
    const existingAlbum = await getQuery('SELECT id FROM gallery_albums WHERE slug = ?', [slug])
    if (existingAlbum) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Album with this slug already exists'
      })
    }

    // Insert new album
    const result = await runQuery(`
      INSERT INTO gallery_albums (title, slug, description, tanggal_peristiwa, category_id, status)
      VALUES (?, ?, ?, ?, ?, 'published')
    `, [title, slug, description, tanggal_peristiwa, category_id || 1])

    // Get the created album with category info
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
        c.color as category_color
      FROM gallery_albums a
      LEFT JOIN gallery_categories c ON a.category_id = c.id
      WHERE a.id = ?
    `, [result.insertId]) as any

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
        photos_count: 0
      }
    }
  } catch (error) {
    console.error('Error creating album:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create album'
    })
  }
})
