import { defineEventHandler, createError, getRouterParam, setHeader, sendStream, sendRedirect } from 'h3'
import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { allQuery } from '~/server/database/db'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary SDK once at module load
const CLOUDINARY_CONFIGURED = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)
if (CLOUDINARY_CONFIGURED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

/**
 * Parse a Cloudinary URL into its components.
 * URL format: https://res.cloudinary.com/{cloud}/{resource_type}/{delivery_type}/{version?}/{public_id}
 */
function parseCloudinaryUrl(storedUrl: string) {
  // Use URL parser — handles edge cases like query strings
  let pathname: string
  try {
    pathname = new URL(storedUrl).pathname
  } catch {
    return null
  }
  // pathname: /{cloud}/{resource_type}/{delivery_type}/{version?}/{...public_id}
  const parts = pathname.split('/').filter(Boolean)
  // parts[0]=cloud, parts[1]=raw/image/video, parts[2]=upload/authenticated/private, parts[3+]=version?+publicId
  if (parts.length < 4) return null

  const deliveryType = parts[2] as 'upload' | 'authenticated' | 'private'
  const rest = parts.slice(3) // e.g. ['v1712345678', 'stpaulus', 'documents', 'myfile.pdf']

  let version: number | undefined
  let publicIdParts = rest
  if (rest[0] && /^v\d+$/.test(rest[0])) {
    version = parseInt(rest[0].substring(1))
    publicIdParts = rest.slice(1)
  }
  const publicId = publicIdParts.join('/')
  return { deliveryType, publicId, version }
}

/**
 * Fetch a Cloudinary-stored file.
 * - type=upload: fetch directly (no auth needed)
 * - type=authenticated|private: generate a properly signed URL including the
 *   version number (critical for Cloudinary signature verification)
 *
 * Returns { response, cloudinaryError } — cloudinaryError is set when all strategies fail.
 */
async function fetchCloudinaryFile(storedUrl: string): Promise<{ response: Response; cloudinaryError?: string }> {
  console.log(`[DocDL] storedUrl="${storedUrl}"`)
  console.log(`[DocDL] cloudinaryConfigured=${CLOUDINARY_CONFIGURED} cloud=${process.env.CLOUDINARY_CLOUD_NAME}`)

  const parsed = parseCloudinaryUrl(storedUrl)
  if (!parsed) {
    console.error(`[DocDL] Cannot parse Cloudinary URL — ${storedUrl}`)
    return { response: await fetch(storedUrl) }
  }

  const { deliveryType, publicId, version } = parsed
  console.log(`[DocDL] type="${deliveryType}" version=${version} publicId="${publicId}"`)

  // type=upload: direct fetch, no signature needed
  if (deliveryType === 'upload') {
    console.log(`[DocDL] strategy=direct`)
    const r = await fetch(storedUrl)
    console.log(`[DocDL] direct status=${r.status}`)
    if (r.ok) return { response: r }
    const errBody = await r.text()
    console.error(`[DocDL] direct failed body="${errBody.substring(0, 300)}"`)
    return { response: r, cloudinaryError: `HTTP ${r.status}: ${errBody.substring(0, 200)}` }
  }

  if (!CLOUDINARY_CONFIGURED) {
    console.error(`[DocDL] Cloudinary credentials missing — cannot sign`)
    const r = await fetch(storedUrl)
    return { response: r, cloudinaryError: 'Cloudinary credentials not configured on server' }
  }

  // Build signed URL — MUST include version so signature matches
  let signedUrl: string
  try {
    signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: deliveryType,
      sign_url: true,
      secure: true,
      ...(version ? { version } : {})
    })
    console.log(`[DocDL] strategy=signed url="${signedUrl.substring(0, 200)}"`)
  } catch (e: any) {
    console.error(`[DocDL] cloudinary.url() threw: ${e.message}`)
    const r = await fetch(storedUrl)
    return { response: r, cloudinaryError: `Failed to build signed URL: ${e.message}` }
  }

  const r2 = await fetch(signedUrl)
  console.log(`[DocDL] signed status=${r2.status}`)
  if (r2.ok) return { response: r2 }

  const errBody2 = await r2.text()
  console.error(`[DocDL] signed failed body="${errBody2.substring(0, 300)}"`)
  return { response: r2, cloudinaryError: `Signed URL HTTP ${r2.status}: ${errBody2.substring(0, 200)}` }
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

  // For cloud-hosted files
  if (doc.file_path.startsWith('https://') || doc.file_path.startsWith('http://')) {
    const parsed = parseCloudinaryUrl(doc.file_path)

    // Untuk dokumen Cloudinary tipe 'upload' (public): redirect 302 langsung ke CDN.
    // Client fetch() mengikuti redirect otomatis → tidak ada proxy server → tidak ada 502.
    // Catatan: tidak menimbulkan chrome-error karena fetch() berbeda dari window.open() navigation.
    if (parsed?.deliveryType === 'upload') {
      console.log(`[DocDL] public Cloudinary → redirect 302 id=${id}`)
      setHeader(event, 'Access-Control-Allow-Origin', '*')
      return sendRedirect(event, doc.file_path, 302)
    }

    // Untuk tipe authenticated/private: proxy stream (perlu signed URL via Cloudinary SDK)
    const { response: remoteResponse, cloudinaryError } = await fetchCloudinaryFile(doc.file_path)

    if (!remoteResponse.ok) {
      console.error(`[DocDL] FINAL status=${remoteResponse.status} id=${id} err="${cloudinaryError}"`)
      throw createError({
        statusCode: 502,
        statusMessage: cloudinaryError
          ? `Gagal mengambil file dari cloud. ${cloudinaryError}`
          : `Gagal mengambil file dari cloud (HTTP ${remoteResponse.status}). Silakan upload ulang dokumen ini.`
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
