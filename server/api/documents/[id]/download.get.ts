import { defineEventHandler, createError, getRouterParam, setHeader, sendStream } from 'h3'
import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { allQuery } from '~/server/database/db'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import crypto from 'crypto'

/**
 * Build a Cloudinary Admin API download URL.
 *
 * Resources stored as "authenticated" delivery type (ml_default Signed preset)
 * return 401 on direct CDN fetch. The Admin API download endpoint accepts a
 * HMAC-SHA256 signature in query params and works for ANY delivery type.
 *
 * Endpoint: GET https://api.cloudinary.com/v1_1/{cloud}/raw/download
 * Params: public_id, api_key, timestamp, signature
 * Signature: SHA1("{param}={val}&...{api_secret}") — Cloudinary v1 signing
 */
function buildCloudinaryApiDownloadUrl(storedUrl: string): string | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[Document Download] Cloudinary env vars missing — cannot build API download URL')
    return null
  }

  // Extract public_id from stored URL (extension stays in public_id for raw files)
  const publicIdMatch = storedUrl.match(/\/(?:raw|image|video)\/(?:upload|authenticated|private)\/(?:v\d+\/)?(.+)$/)
  if (!publicIdMatch) {
    console.error(`[Document Download] Cannot parse public_id from URL: ${storedUrl}`)
    return null
  }
  const publicId = publicIdMatch[1]

  const timestamp = Math.floor(Date.now() / 1000)

  // Cloudinary signature: SHA1 of sorted params string + api_secret
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

  const params = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature: signature
  })

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/raw/download?${params}`
  console.log(`[Document Download] API download URL built for public_id="${publicId}"`)
  return url
}

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

  // Get document info — no category is_active filter here so downloads work even if
  // category was deactivated after the document appeared in the public list.
  const documents = await allQuery(`
    SELECT d.file_path, d.filename, d.original_filename, d.mime_type
    FROM documents d
    WHERE d.id = ?
  `, [id])

  console.log(`[Document Download] id=${id} query returned ${documents.length} row(s)`)

  if (documents.length === 0) {
    console.warn(`[Document Download] 404 — no document with id=${id} in DB`)
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
      // Resources stored via ml_default (Signed preset) are "authenticated" delivery type.
      // Use Cloudinary Admin API download endpoint — bypasses CDN delivery-type restrictions.
      const fetchUrl = buildCloudinaryApiDownloadUrl(doc.file_path) ?? doc.file_path

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)
      remoteResponse = await fetch(fetchUrl, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!remoteResponse.ok) {
        console.error(`[Document Download] Cloud fetch ${remoteResponse.status} for id=${id} storedUrl=${doc.file_path}`)
        throw createError({
          statusCode: 502,
          statusMessage: `Gagal mengambil file dari cloud (status: ${remoteResponse.status}). Silakan upload ulang dokumen ini.`
        })
      }
    } catch (err: any) {
      if (err.statusCode) throw err
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
