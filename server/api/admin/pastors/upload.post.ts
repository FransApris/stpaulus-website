// API: Upload pastor photo
// Path: POST /api/admin/pastors/upload
// Purpose: Handle pastor photo upload

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    try {
        console.log('[Pastor Photo Upload] Request received')

        // TODO: Add authentication check
        // const user = await requireAuth(event)
        // if (!user || !user.isAdmin) throw createError({ statusCode: 403, message: 'Forbidden' })

        const form = await readMultipartFormData(event)

        if (!form || form.length === 0) {
            throw createError({
                statusCode: 400,
                message: 'No file uploaded'
            })
        }

        // Find the file in form data
        const fileData = form.find(item => item.name === 'file')
        const typeData = form.find(item => item.name === 'type')

        if (!fileData || !fileData.filename || !fileData.data) {
            console.error('[Pastor Photo Upload] File data missing:', { fileData })
            throw createError({
                statusCode: 400,
                message: 'Invalid file data'
            })
        }

        // Get file type (default to 'pastors')
        const type = typeData?.data?.toString() || 'pastors'

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(fileData.type || '')) {
            throw createError({
                statusCode: 400,
                message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            })
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (fileData.data.length > maxSize) {
            throw createError({
                statusCode: 400,
                message: 'File too large. Maximum size is 5MB.'
            })
        }

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads', type)
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
            console.log('[Pastor Photo Upload] Directory created:', uploadDir)
        }

        // Generate unique filename
        const ext = fileData.filename.split('.').pop()
        const filename = `${type}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const filepath = join(uploadDir, filename)

        // Write file
        await writeFile(filepath, fileData.data)

        const publicPath = `/uploads/${type}/${filename}`
        console.log('[Pastor Photo Upload] File saved:', publicPath)

        return {
            success: true,
            url: publicPath,
            filename: filename
        }

    } catch (error: any) {
        console.error('[Pastor Photo Upload] Error:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to upload photo'
        })
    }
})
