import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { readMultipartFormData } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { requireKronikUserAccess } from '~/server/utils/kronik-auth'

const ADMIN_ROLES = new Set(['super_admin', 'admin_komsos', 'admin_sekretariat'])

/**
 * Upload kronik images
 * POST /api/kronik/upload
 * 
 * Handles single or multiple image uploads for kronik entries
 * Requires authentication
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[Kronik Upload] Request received')

    // Verify authentication using JWT
    const decoded = requireAuth(event)

    // Allow both kronik users and CMS admin roles to upload images
    const role = String(decoded.role || '').toLowerCase()
    if (!ADMIN_ROLES.has(role)) {
      await requireKronikUserAccess(decoded.userId)
    }

    console.log('[Kronik Upload] User authenticated:', decoded.userId, decoded.username)

    // Parse multipart form data
    console.log('[Kronik Upload] Parsing form data...')
    const form = await readMultipartFormData(event)
    console.log('[Kronik Upload] Form parsed, files:', form?.length || 0)

    if (!form || form.length === 0) {
      console.log('[Kronik Upload] No files in form')
      return {
        success: false,
        error: 'No files uploaded'
      }
    }

    // Setup upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'kronik')
    console.log('[Kronik Upload] Upload directory:', uploadDir)

    if (!existsSync(uploadDir)) {
      console.log('[Kronik Upload] Creating upload directory...')
      await mkdir(uploadDir, { recursive: true })
      console.log('[Kronik Upload] Directory created')
    }

    const uploadedFiles: string[] = []

    // Process each file
    for (const file of form) {
      console.log('[Kronik Upload] Processing file:', file.filename, 'type:', file.type)

      if (file.type && file.type.startsWith('image/')) {
        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const extension = file.filename?.split('.').pop() || 'jpg'
        const filename = `kronik-${timestamp}-${randomString}.${extension}`

        console.log('[Kronik Upload] Saving as:', filename)

        // Save file
        const filePath = join(uploadDir, filename)
        await writeFile(filePath, file.data)

        console.log('[Kronik Upload] File saved:', filePath)

        // Add to uploaded files list (relative path for database)
        uploadedFiles.push(`/uploads/kronik/${filename}`)
      }
    }

    if (uploadedFiles.length === 0) {
      console.log('[Kronik Upload] No valid images found')
      return {
        success: false,
        error: 'No valid image files found'
      }
    }

    console.log('[Kronik Upload] Success! Uploaded:', uploadedFiles.length, 'files')
    return {
      success: true,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      }
    }

  } catch (error: any) {
    console.error('[Kronik Upload Error]:', error)
    console.error('[Kronik Upload Error Stack]:', error.stack)
    return {
      success: false,
      error: error.message || 'Failed to upload images'
    }
  }
})
