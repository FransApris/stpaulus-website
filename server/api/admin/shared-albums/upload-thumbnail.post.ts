import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { readMultipartFormData } from 'h3'

/**
 * Upload thumbnail for shared albums
 * POST /api/admin/shared-albums/upload-thumbnail
 * 
 * Requires admin authentication (handled by middleware)
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[Thumbnail Upload] Request received')
    console.log('[Thumbnail Upload] Headers:', event.headers)

    // Parse multipart form data
    const form = await readMultipartFormData(event)
    console.log('[Thumbnail Upload] Form data parsed:', form?.length || 0, 'items')
    
    if (!form || form.length === 0) {
      console.error('[Thumbnail Upload] No files found in form')
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }

    // Log form structure for debugging
    console.log('[Thumbnail Upload] First item:', {
      name: form[0]?.name,
      filename: form[0]?.filename,
      type: form[0]?.type,
      dataSize: form[0]?.data?.length
    })

    // Setup upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'thumbnails')
    console.log('[Thumbnail Upload] Upload directory:', uploadDir)
    
    if (!existsSync(uploadDir)) {
      console.log('[Thumbnail Upload] Creating directory...')
      await mkdir(uploadDir, { recursive: true })
    }

    // Process the file
    const file = form[0] // Get first file
    
    if (!file) {
      throw createError({
        statusCode: 400,
        message: 'No file found'
      })
    }
    
    if (!file.type || !file.type.startsWith('image/')) {
      console.error('[Thumbnail Upload] Invalid file type:', file.type)
      throw createError({
        statusCode: 400,
        message: 'File must be an image'
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.filename?.split('.').pop() || 'jpg'
    const filename = `album-${timestamp}-${randomString}.${extension}`

    console.log('[Thumbnail Upload] Saving file:', filename)

    // Save file
    const filePath = join(uploadDir, filename)
    await writeFile(filePath, file.data)

    console.log('[Thumbnail Upload] File saved successfully:', filePath)

    // Return relative path for database
    return {
      success: true,
      url: `/uploads/thumbnails/${filename}`,
      filename: filename
    }
  } catch (error: any) {
    console.error('[Thumbnail Upload] Error:', error)
    console.error('[Thumbnail Upload] Error stack:', error.stack)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to upload thumbnail'
    })
  }
})
