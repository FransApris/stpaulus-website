import { createError, defineEventHandler, getRouterParam, setHeader } from 'h3'
import fs from 'fs'
import path from 'path'

const MIME_BY_EXT: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
}

function getUploadBasePath() {
    if (process.env.UPLOAD_BASE_PATH) {
        return process.env.UPLOAD_BASE_PATH
    }
    return path.join(process.cwd(), 'public', 'uploads')
}

function resolveCandidatePaths(fileName: string): string[] {
    const safeName = fileName.replace(/[\\/]/g, '')
    const base = getUploadBasePath()
    return [
        path.join(base, 'kronik', safeName),
        path.join(base, 'documents', safeName),
        path.join(base, 'articles', safeName),
        path.join(process.cwd(), '.output', 'public', 'uploads', 'kronik', safeName)
    ]
}

export default defineEventHandler(async (event) => {
    const raw = getRouterParam(event, 'filename')
    const fileName = decodeURIComponent(String(raw || '')).trim()

    if (!fileName) {
        throw createError({ statusCode: 400, statusMessage: 'Filename is required' })
    }

    const candidatePaths = resolveCandidatePaths(fileName)
    const existingPath = candidatePaths.find((p) => fs.existsSync(p))

    if (!existingPath) {
        throw createError({ statusCode: 404, statusMessage: 'Kronik media not found' })
    }

    const ext = path.extname(existingPath).toLowerCase()
    setHeader(event, 'Content-Type', MIME_BY_EXT[ext] || 'application/octet-stream')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

    return fs.readFileSync(existingPath)
})
