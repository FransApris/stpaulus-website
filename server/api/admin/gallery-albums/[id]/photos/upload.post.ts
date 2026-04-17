import { runQuery } from '../../../../../database/db'
import { requirePermission } from '../../../../../utils/auth'
import { promises as fs } from 'fs'
import path from 'path'
import { isCloudinaryEnabled, uploadToCloudinary } from '../../../../../utils/cloudinary'

export default defineEventHandler(async (event) => {
  // Check permissions
  requirePermission('manage_gallery')(event)

  const albumId = getRouterParam(event, 'id')
  if (!albumId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid album ID'
    })
  }

  // Verify album exists
  const album = await runQuery('SELECT id FROM gallery_albums WHERE id = ?', [albumId])
  if (!album.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Album not found'
    })
  }

  // Handle file upload
  const formData = await readMultipartFormData(event)
  if (!formData || !formData[0]) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded'
    })
  }

  const file = formData[0]
  if (!file.filename || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file'
    })
  }

  const originalFilename = file.filename

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
    })
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File too large. Maximum size is 10MB.'
    })
  }

  // Generate unique filename
  const ext = path.extname(originalFilename)
  const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`

  let photoPath: string

  if (isCloudinaryEnabled()) {
    // Upload to Cloudinary — persists across redeploys
    photoPath = await uploadToCloudinary(
      Buffer.from(file.data),
      'gallery',
      originalFilename
    )
  } else {
    // Fallback: save to local disk
    const uploadDir = path.join(process.cwd(), 'public/uploads/gallery')
    await fs.mkdir(uploadDir, { recursive: true })
    const filepath = path.join(uploadDir, filename)
    await fs.writeFile(filepath, file.data)
    photoPath = `/uploads/gallery/${filename}`
  }

  // Save to database
  const result = await runQuery(
    'INSERT INTO gallery_photos (album_id, filename, original_filename, path, size, mime_type) VALUES (?, ?, ?, ?, ?, ?)',
    [albumId, filename, originalFilename, photoPath, file.data.length, file.type]
  )

  return {
    success: true,
    photo: {
      id: result.insertId,
      album_id: albumId,
      filename,
      original_filename: originalFilename,
      path: photoPath,
      size: file.data.length,
      mime_type: file.type
    }
  }
})
