import { defineEventHandler, createError, getRouterParam, setHeader, sendRedirect } from 'h3'
import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { allQuery } from '~/server/database/db'
import fs from 'fs'
import path from 'path'

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

  // If the file is hosted on cloud storage, inline can redirect directly.
  // Attachment mode proxies bytes so browser always treats it as downloadable.
  if (doc.file_path.startsWith('https://') || doc.file_path.startsWith('http://')) {
    if (mode === 'inline') {
      console.log(`[Document Download] id=${id} → redirecting to cloud URL (inline): ${doc.file_path}`)
      return sendRedirect(event, doc.file_path, 302)
    }

    try {
      const remoteResponse = await fetch(doc.file_path)
      if (!remoteResponse.ok) {
        throw new Error(`Remote fetch failed: ${remoteResponse.status}`)
      }

      const arrayBuffer = await remoteResponse.arrayBuffer()
      const fileBuffer = Buffer.from(arrayBuffer)

      setHeader(event, 'Content-Type', doc.mime_type || remoteResponse.headers.get('content-type') || 'application/octet-stream')
      setHeader(event, 'Content-Disposition', `attachment; filename="${doc.original_filename}"`)
      setHeader(event, 'Content-Length', fileBuffer.length)

      return fileBuffer
    } catch (error) {
      console.error(`[Document Download] Failed to proxy cloud file for id=${id}:`, error)
      throw createError({
        statusCode: 502,
        statusMessage: 'Gagal mengambil file dokumen dari penyimpanan cloud'
      })
    }
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

    // Set headers for preview/download mode
    setHeader(event, 'Content-Type', doc.mime_type || 'application/octet-stream')
    setHeader(event, 'Content-Disposition', `${mode}; filename="${doc.original_filename}"`)
    setHeader(event, 'Content-Length', fileBuffer.length)

    return fileBuffer
  } catch (error) {
    console.error(`[Document Download] Error reading file: ${filePath}`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal membaca file'
    })
  }
})
