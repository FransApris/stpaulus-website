// API: Upload pastor photo
// Path: POST /api/admin/pastors/upload
// Purpose: Handle pastor photo upload with Cloudinary support

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireAuth } from '~/server/utils/auth'
import { isCloudinaryEnabled, uploadToCloudinary } from '~/server/utils/cloudinary'

export default defineEventHandler(async (event) => {
    try {
        console.log('[Pastor Photo Upload] Request received')

        requireAuth(event)

        const form = await readMultipartFormData(event)

        if (!form || form.length === 0) {
            throw createError({
                statusCode: 400,
                message: 'No file uploaded'
            })
        }

        // Find the file in form data
        const fileData = form.find(item => item.name === 'file')

        if (!fileData || !fileData.filename || !fileData.data) {
            console.error('[Pastor Photo Upload] File data missing:', { fileData })
            throw createError({
                statusCode: 400,
                message: 'Invalid file data'
            })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(fileData.type || '')) {
            throw createError({
                statusCode: 400,
                message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            })
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (fileData.data.length > maxSize) {
            throw createError({
                statusCode: 400,
                message: 'File too large. Maximum size is 5MB.'
            })
        }

        let publicUrl: string

        if (isCloudinaryEnabled()) {
            // Upload to Cloudinary — persists across redeploys
            console.log('[Pastor Photo Upload] Uploading to Cloudinary...')
            publicUrl = await uploadToCloudinary(
                Buffer.from(fileData.data),
                'pastors',
                fileData.filename
            )
            console.log('[Pastor Photo Upload] Cloudinary success:', publicUrl)
        } else {
            // Fallback: save to local disk
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'pastors')
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true })
                console.log('[Pastor Photo Upload] Directory created:', uploadDir)
            }

            const ext = fileData.filename.split('.').pop()
            const filename = `pastors-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
            const filepath = join(uploadDir, filename)

            await writeFile(filepath, fileData.data)
            publicUrl = `/uploads/pastors/${filename}`
            console.log('[Pastor Photo Upload] Saved locally (Cloudinary not configured):', publicUrl)
        }

        return {
            success: true,
            url: publicUrl,
            filename: fileData.filename
        }

    } catch (error: any) {
        console.error('[Pastor Photo Upload] Error:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to upload photo'
        })
    }
})
