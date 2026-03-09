import { requireAuth } from '../../../../utils/auth'
import { writeFile, mkdir } from 'node:fs/promises'
import { join, extname } from 'node:path'

export default defineEventHandler(async (event) => {
  // Authentication check
  requireAuth(event)

  try {
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      })
    }

    const albumId = getQuery(event).albumId as string

    if (!albumId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Album ID is required'
      })
    }

    // Validate album exists
    const albumPath = join('public/images/album', albumId)
    try {
      await mkdir(albumPath, { recursive: true })
    } catch (error) {
      // Directory might already exist, continue
    }

    const uploadedFiles = []

    for (const file of formData) {
      if (!file.filename || !file.data) continue

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type || '')) {
        continue // Skip invalid files
      }

      // Validate file size (10MB limit)
      if (file.data.length > 10 * 1024 * 1024) {
        continue // Skip large files
      }

      // Generate unique filename
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const extension = extname(file.filename || 'image.jpg')
      const filename = `${albumId}-${timestamp}-${random}${extension}`

      const filePath = join(albumPath, filename)

      // Save file
      await writeFile(filePath, file.data)

      uploadedFiles.push({
        id: `${albumId}-photo-${uploadedFiles.length + 1}`,
        url: `/images/album/${albumId}/${filename}`,
        filename: filename,
        originalFilename: file.filename
      })
    }

    if (uploadedFiles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid image files uploaded'
      })
    }

    return {
      success: true,
      uploaded: uploadedFiles.length,
      files: uploadedFiles
    }

  } catch (error: any) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Upload failed'
    })
  }
})
