import { defineEventHandler, createError, getRouterParam, setHeader, sendStream } from 'h3'
import { getQuery as dbGetQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'

// Configure Cloudinary SDK
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

/**
 * Build signed URL for authenticated Cloudinary resources.
 * Uses cloudinary.url() with sign_url:true — works for upload and authenticated types.
 */
function buildSignedUrl(storedUrl: string): string {
  const typeMatch = storedUrl.match(/\/(?:raw|image|video)\/(upload|authenticated|private)\//)
  const deliveryType = (typeMatch ? typeMatch[1] : 'upload') as 'upload' | 'authenticated' | 'private'
  const publicIdMatch = storedUrl.match(/\/(?:raw|image|video)\/(?:upload|authenticated|private)\/(?:v\d+\/)?(.+)$/)
  if (!publicIdMatch) return storedUrl
  const publicId = publicIdMatch[1]
  console.log(`[AdminDocDL] publicId="${publicId}" type="${deliveryType}"`)
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    type: deliveryType,
    sign_url: true,
    secure: true
  })
}

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_documents')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const documentId = getRouterParam(event, 'id')
  if (!documentId) {
    throw createError({ statusCode: 400, statusMessage: 'Document ID is required' })
  }

  const document = await dbGetQuery(`
    SELECT filename, original_filename, file_path, mime_type
    FROM documents WHERE id = ?
  `, [documentId])

  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  console.log(`[AdminDocDL] id=${documentId} file_path="${document.file_path}"`)

  if (document.file_path.startsWith('http')) {
    const fetchUrl = buildSignedUrl(document.file_path)
    console.log(`[AdminDocDL] fetchUrl="${fetchUrl.substring(0, 200)}"`)

    const response = await fetch(fetchUrl)
    console.log(`[AdminDocDL] fetch status=${response.status}`)

    if (!response.ok) {
      const body = await response.text()
      console.error(`[AdminDocDL] fetch failed status=${response.status} body="${body.substring(0, 300)}"`)
      throw createError({
        statusCode: 502,
        statusMessage: `Gagal mengambil file dari cloud (status: ${response.status})`
      })
    }

    const mimeType = document.mime_type || response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length')
    setHeader(event, 'Content-Type', mimeType)
    setHeader(event, 'Content-Disposition', `attachment; filename="${document.original_filename}"`)
    if (contentLength) setHeader(event, 'Content-Length', contentLength)

    return sendStream(event, Readable.fromWeb(response.body as any))
  }

  // Local file fallback
  const filePath = path.join(process.cwd(), 'public', document.file_path)
  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found on disk' })
  }
  const fileBuffer = fs.readFileSync(filePath)
  setHeader(event, 'Content-Type', document.mime_type || 'application/octet-stream')
  setHeader(event, 'Content-Disposition', `attachment; filename="${document.original_filename}"`)
  setHeader(event, 'Content-Length', fileBuffer.length)
  return fileBuffer
})
