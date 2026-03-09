import { requireAuth } from '../../../utils/auth'
import { writeFile, mkdir } from 'node:fs/promises'
import { join, extname } from 'node:path'

export default defineEventHandler(async (event) => {
  // Authentication check
  requireAuth(event)

  try {
    const formData = await readMultipartFormData(event)

    console.log('[Upload] Received form data:', formData?.length || 0, 'files')

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      })
    }

    // Create articles upload directory
    const uploadDir = join('public/uploads/articles')
    try {
      await mkdir(uploadDir, { recursive: true })
      console.log('[Upload] Directory ensured:', uploadDir)
    } catch (error) {
      console.log('[Upload] Directory already exists')
    }

    const uploadedFiles = []

    for (const file of formData) {
      console.log('[Upload] Processing file:', {
        name: file.name,
        filename: file.filename,
        type: file.type,
        size: file.data?.length
      })

      if (!file.filename || !file.data) {
        console.log('[Upload] Skipping file: missing filename or data')
        continue
      }

      // Validate file type - be more lenient with type checking
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      const extension = extname(file.filename || '').toLowerCase()
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
      
      if (!allowedTypes.includes(file.type || '') && !allowedExtensions.includes(extension)) {
        console.log('[Upload] Skipping file: invalid type/extension', file.type, extension)
        continue
      }

      // Validate file size (5MB limit for articles)
      if (file.data.length > 5 * 1024 * 1024) {
        console.log('[Upload] Skipping file: too large', file.data.length)
        continue
      }

      // Generate unique filename
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const finalExtension = extension || '.jpg'
      const filename = `article-${timestamp}-${random}${finalExtension}`

      const filePath = join(uploadDir, filename)

      // Save file
      await writeFile(filePath, file.data)
      console.log('[Upload] File saved:', filePath)

      uploadedFiles.push({
        url: `/uploads/articles/${filename}`,
        filename: filename,
        originalFilename: file.filename
      })
    }

    if (uploadedFiles.length === 0) {
      console.log('[Upload] No valid files uploaded')
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid image files uploaded'
      })
    }

    console.log('[Upload] Success:', uploadedFiles[0].url)

    // Return the first uploaded file URL (for single image upload)
    return {
      success: true,
      url: uploadedFiles[0].url
    }

  } catch (error: any) {
    console.error('[Upload] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Upload failed'
    })
  }
})
