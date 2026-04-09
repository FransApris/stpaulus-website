import { defineEventHandler, createError, getRouterParam, setHeader, sendStream } from 'h3'
import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { allQuery } from '~/server/database/db'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

/**
 * Build the correct fetch URL for a Cloudinary-stored file.
 *
 * The Cloudinary account uses the `ml_default` preset (Signed mode), so all raw
 * uploads are stored as delivery type "authenticated" (not "upload").
 * Fetching /raw/authenticated/... without a signature returns 401.
 *
 * This function:
 *  1. Parses the stored URL to detect delivery type (upload | authenticated | private).
 *  2. Extracts the public_id (for raw resources the extension is part of the public_id).
 *  3. Generates a signed CDN URL with the correct delivery type.
 *     A signed "authenticated" URL is accepted by Cloudinary regardless of restrictions.
 */
function buildSignedFetchUrl(storedUrl: string): string {
  const cfg = cloudinary.config()
  if (!cfg.api_key || !cfg.api_secret) return storedUrl

  // Detect delivery type from URL: upload | authenticated | private
  const typeMatch = storedUrl.match(/\/(?:raw|image|video)\/(upload|authenticated|private)\//)
  const deliveryType = typeMatch ? typeMatch[1] : 'upload'

  // Extract public_id — for raw resources the extension stays in the public_id
  const publicIdMatch = storedUrl.match(/\/(?:raw|image|video)\/(?:upload|authenticated|private)\/(?:v\d+\/)?(.+)$/)
  if (!publicIdMatch) return storedUrl
  const publicId = publicIdMatch[1]

  try {
    const signed = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: deliveryType as 'upload' | 'authenticated' | 'private',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 600 // valid 10 min
    })
    console.log(`[Document Download] built signed URL type=${deliveryType}`)
    return signed
  } catch (e) {
    console.error('[Document Download] Failed to build signed URL:', e)
    return storedUrl
  }
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
      // Always use a signed URL — resources uploaded via ml_default (Signed preset)
      // are stored as "authenticated" delivery type and return 401 without a signature.
      const fetchUrl = buildSignedFetchUrl(doc.file_path)

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
