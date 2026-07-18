// API: Upload announcement thumbnail
// Path: POST /api/admin/announcements/upload
// Permission: manage_church_announcements

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { requireAuth, requirePermission } from '~/server/utils/auth'
import { validateAndGetImageExtension } from '~/server/utils/fileValidator'
import { isCloudinaryEnabled, uploadToCloudinary } from '~/server/utils/cloudinary'

export default defineEventHandler(async (event) => {
    requireAuth(event)
    requirePermission('manage_church_announcements')(event)

    try {
        const form = await readMultipartFormData(event)
        if (!form || form.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'No file uploaded'
            })
        }

        const file = form[0]
        if (!file.filename || !file.data) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid file data'
            })
        }

        // Validate file type via Magic Bytes
        const safeExt = validateAndGetImageExtension(file.data)

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.data.length > maxSize) {
            throw createError({
                statusCode: 400,
                statusMessage: 'File size too large. Maximum size is 5MB.'
            })
        }

        let publicUrl: string

        if (isCloudinaryEnabled()) {
            // Upload to Cloudinary — persists across redeploys
            console.log('[Announcement Upload] Uploading to Cloudinary...')
            publicUrl = await uploadToCloudinary(
                Buffer.from(file.data),
                'announcements',
                `announcement-${Date.now()}.${safeExt}`
            )
            console.log('[Announcement Upload] Cloudinary success:', publicUrl)
        } else {
            // Fallback: save to local disk
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(2, 8)
            const filename = `announcement-${timestamp}-${randomString}.${safeExt}`

            const uploadDir = join(process.cwd(), 'public', 'uploads', 'announcements')
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true })
            }

            const filePath = join(uploadDir, filename)
            await writeFile(filePath, file.data)
            publicUrl = `/uploads/announcements/${filename}`
            console.log('[Announcement Upload] Saved locally (Cloudinary not configured):', publicUrl)
        }

        return {
            success: true,
            url: publicUrl,
            filename: file.filename
        }
    } catch (error: any) {
        console.error('[Announcement Upload] Error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to upload file'
        })
    }
})
