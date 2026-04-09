import { defineEventHandler, createError, getRouterParam, setHeader, sendStream } from 'h3'
import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { allQuery } from '~/server/database/db'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary once at module load (safe to call multiple times)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

/**
 * Extract the Cloudinary public_id from a stored URL.
 * e.g. https://res.cloudinary.com/xxx/raw/upload/v123/stpaulus/documents/file.pdf
 *      → stpaulus/documents/file.pdf
 */
function extractCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/(?:raw|image|video)\/upload\/(?:v\d+\/)?(.+)$/)
  return match ? match[1] : null
}

/**
 * Generate a signed Cloudinary URL valid for 5 minutes.
 * Falls back to the original URL if public_id cannot be extracted.
 */
function getSignedCloudinaryUrl(storedUrl: string): string {
  const publicId = extractCloudinaryPublicId(storedUrl)
  if (!publicId) return storedUrl
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 300 // valid 5 min
  })
}

// Download endpoint for documents

/**
 * Resolve the base directory for uploads.
 * Set UPLOAD_BASE_PATH env var (e.g. /app/public/uploads) when using Railway Volume.
 * When unset, falls back to <cwd>/public/uploads (works for local dev and Railway with
 * volume mounted at /app/public/uploads, since process.cwd() = /app on Railway).
 */
function getUploadBasePath() {
  if (process.env.UPLOAD_BASE_PATH) {
    return process.env.UPLOAD_BASE_PATH
  }
  return path.join(process.cwd(), 'public', 'uploads')
}

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const mode = String(query.mode || 'attachment').toLowerCase() === 'inline' ? 'inline' : 'attachment'
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  // Get document info
  const documents = await allQuery(`
    SELECT d.file_path, d.filename, d.original_filename, d.mime_type, dc.is_active
    FROM documents d
    JOIN document_categories dc ON d.category_id = dc.id
    WHERE d.id = ? AND dc.is_active = 1
  `, [id])

  if (documents.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }

  const doc = documents[0] as { file_path: string; filename: string; original_filename: string; mime_type: string }

  // For cloud-hosted files: stream bytes through this server for BOTH inline and attachment.
  // Direct redirect to Cloudinary raw URLs causes browser security errors because Cloudinary
  // serves raw resources without proper Content-Type/Content-Disposition headers for inline viewing.
  if (doc.file_path.startsWith('https://') || doc.file_path.startsWith('http://')) {
    let remoteResponse: Response
    try {
      // Use signed URL to bypass Cloudinary access restrictions (fixes 401)
      const fetchUrl = getSignedCloudinaryUrl(doc.file_path)
      console.log(`[Document Download] id=${id} fetching cloud url (signed=${fetchUrl !== doc.file_path})`)

      // 45-second timeout — large PDFs on Cloudinary can take time
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)

      remoteResponse = await fetch(fetchUrl, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!remoteResponse.ok) {
        console.error(`[Document Download] Cloudinary returned ${remoteResponse.status} for id=${id} url=${doc.file_path}`)
        throw createError({
          statusCode: 502,
          statusMessage: `File tidak dapat diambil dari cloud (Cloudinary status: ${remoteResponse.status}). Silakan upload ulang dokumen ini.`
        })
      }
    } catch (err: any) {
      if (err.statusCode) throw err // already a createError
      const isTimeout = err.name === 'AbortError' || err.code === 'UND_ERR_CONNECT_TIMEOUT'
      console.error(`[Document Download] Fetch error for id=${id}:`, err.message || err)
      throw createError({
        statusCode: 502,
        statusMessage: isTimeout
          ? 'Timeout saat mengambil file dari cloud. Coba lagi beberapa saat.'
          : 'Gagal terhubung ke penyimpanan cloud. Coba lagi beberapa saat.'
      })
    }

    const encodedFilename = encodeURIComponent(doc.original_filename).replace(/['()]/g, escape).replace(/\*/g, '%2A')
    const contentType = doc.mime_type || remoteResponse.headers.get('content-type') || 'application/octet-stream'
    const contentLength = remoteResponse.headers.get('content-length')

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Content-Disposition', `${mode}; filename="${doc.original_filename}"; filename*=UTF-8''${encodedFilename}`)
    if (contentLength) setHeader(event, 'Content-Length', contentLength)
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    if (mode === 'inline') {
      setHeader(event, 'Cache-Control', 'private, max-age=300')
    }

    console.log(`[Document Download] id=${id} cloud stream mode=${mode} contentType=${contentType} size=${contentLength ?? 'unknown'}`)

    // Stream response body directly — avoids buffering entire PDF in server memory
    return sendStream(event, Readable.fromWeb(remoteResponse.body as any))
  }

  // Build physical file path. doc.file_path is stored as /uploads/documents/<filename>
  // getUploadBasePath() returns the <cwd>/public/uploads  directory, so we strip the
  // leading /uploads prefix from file_path to get just /documents/<filename>
  const relativeFilePath = doc.file_path.replace(/^\/uploads/, '')  // → /documents/<filename>
  const filePath = path.join(getUploadBasePath(), relativeFilePath)

  console.log(`[Document Download] id=${id} filename=${doc.filename} resolvedPath=${filePath}`)

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`[Document Download] File missing on disk: ${filePath}`)
    throw createError({
      statusCode: 404,
      statusMessage: 'File tidak tersedia di server. Silakan upload ulang dokumen ini melalui panel admin.'
    })
  }

  try {
    // Read file
    const fileBuffer = fs.readFileSync(filePath)

    // Encode filename for RFC 5987 compliance (handles spaces and non-ASCII characters)
    const encodedFilename = encodeURIComponent(doc.original_filename).replace(/['()]/g, escape).replace(/\*/g, '%2A')

    // Set headers for preview/download mode
    setHeader(event, 'Content-Type', doc.mime_type || 'application/octet-stream')
    setHeader(event, 'Content-Disposition', `${mode}; filename="${doc.original_filename}"; filename*=UTF-8''${encodedFilename}`)
    setHeader(event, 'Content-Length', fileBuffer.length)
    // Allow browser to render inline (needed for PDF preview in new tab)
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    if (mode === 'inline') {
      setHeader(event, 'Cache-Control', 'private, max-age=300')
    }

    return fileBuffer
  } catch (error) {
    console.error(`[Document Download] Error reading file: ${filePath}`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal membaca file'
    })
  }
})
