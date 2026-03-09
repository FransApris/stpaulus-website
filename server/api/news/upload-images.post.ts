import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    console.log('[News Upload] Request received')

    try {
        // Auth check
        const authHeader = getHeader(event, 'authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError({ statusCode: 401, message: 'No token provided' })
        }

        const token = authHeader.substring(7)
        const user = verifyToken(token)

        if (!user) {
            throw createError({ statusCode: 401, message: 'Invalid token' })
        }

        console.log('[News Upload] User authenticated:', user.id, user.username)

        // Parse multipart form data
        const formData = await readMultipartFormData(event)

        if (!formData || formData.length === 0) {
            throw createError({ statusCode: 400, message: 'No files uploaded' })
        }

        console.log('[News Upload] Files received:', formData.length)

        // Create upload directory if not exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'news')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
            console.log('[News Upload] Created directory:', uploadDir)
        }

        const uploadedFiles: string[] = []

        // Process each file
        for (const file of formData) {
            if (file.filename && file.data) {
                const ext = file.filename.split('.').pop()
                const fileName = `news-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`
                const filePath = join(uploadDir, fileName)

                console.log('[News Upload] Processing:', file.filename, '→', fileName)

                await writeFile(filePath, file.data)

                const publicPath = `/uploads/news/${fileName}`
                uploadedFiles.push(publicPath)

                console.log('[News Upload] Saved:', publicPath)
            }
        }

        console.log('[News Upload] Success! Total files:', uploadedFiles.length)

        return {
            success: true,
            files: uploadedFiles
        }

    } catch (error: any) {
        console.error('[News Upload] Error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Upload failed'
        })
    }
})
