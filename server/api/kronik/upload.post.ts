import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { readMultipartFormData } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { requireKronikUserAccess } from '~/server/utils/kronik-auth'
import { validateAndGetImageExtension } from '~/server/utils/fileValidator'

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

      // Validate Magic Bytes and get safe extension
      try {
        const safeExt = validateAndGetImageExtension(file.data)

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const filename = `kronik-${timestamp}-${randomString}.${safeExt}`

        console.log('[Kronik Upload] Saving as:', filename)

        // Save file
        const filePath = join(uploadDir, filename)
        await writeFile(filePath, file.data)

        console.log('[Kronik Upload] File saved:', filePath)

        // Return API media URL so files stay accessible in production runtime/volume.
        uploadedFiles.push(`/api/kronik/media/${encodeURIComponent(filename)}`)
      } catch (validationError) {
        console.error('[Kronik Upload] Validation failed for file:', file.filename, validationError)
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
