// Server route: serve runtime-uploaded files from public/uploads/
// Needed in Railway production because Nitro serves static from .output/public/ at build time,
// but runtime uploads are saved to process.cwd()/public/uploads/
// This route bridges the gap by directly streaming files from the filesystem.

import { createReadStream, existsSync } from 'fs'
import { stat } from 'fs/promises'
import { join, resolve, extname } from 'path'

const MIME_TYPES: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export default defineEventHandler(async (event) => {
    const pathParam = getRouterParam(event, 'path') || ''

    // Security: prevent path traversal
    if (pathParam.includes('\0')) {
        throw createError({ statusCode: 400, message: 'Invalid path' })
    }

    const uploadsRoot = resolve(join(process.cwd(), 'public', 'uploads'))
    const filePath = resolve(join(uploadsRoot, pathParam))

    // Security: ensure the resolved path is still inside uploads directory
    if (!filePath.startsWith(uploadsRoot + '/') && filePath !== uploadsRoot) {
        throw createError({ statusCode: 400, message: 'Invalid path' })
    }

    if (!existsSync(filePath)) {
        throw createError({ statusCode: 404, message: 'File not found' })
    }

    const fileStats = await stat(filePath)
    if (fileStats.isDirectory()) {
        throw createError({ statusCode: 404, message: 'File not found' })
    }

    const ext = extname(filePath).toLowerCase()
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream'

    setHeader(event, 'Content-Type', mimeType)
    setHeader(event, 'Content-Length', fileStats.size.toString())
    setHeader(event, 'Cache-Control', 'public, max-age=86400')

    return sendStream(event, createReadStream(filePath))
})
