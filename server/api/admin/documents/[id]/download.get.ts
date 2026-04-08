import { defineEventHandler, createError, getRouterParam, setHeader } from 'h3'
import { getQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can download documents
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_documents')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can download documents'
    })
  }

  const documentId = getRouterParam(event, 'id')
  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  // Get document info from database
  const document = await getQuery(`
    SELECT filename, original_filename, file_path, mime_type
    FROM documents
    WHERE id = ?
  `, [documentId])

  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }

  try {
    let fileBuffer: Buffer
    let mimeType = document.mime_type || 'application/octet-stream'

    if (document.file_path.startsWith('http')) {
      // Cloudinary URL - fetch from Cloudinary
      const response = await fetch(document.file_path)
      if (!response.ok) {
        throw createError({
          statusCode: 404,
          statusMessage: 'File not found in Cloudinary'
        })
      }
      fileBuffer = Buffer.from(await response.arrayBuffer())
      mimeType = response.headers.get('content-type') || mimeType
    } else {
      // Local file
      const filePath = path.join(process.cwd(), 'public', document.file_path)
      if (!fs.existsSync(filePath)) {
        throw createError({
          statusCode: 404,
          statusMessage: 'File not found on disk'
        })
      }
      fileBuffer = fs.readFileSync(filePath)
    }

    // Set response headers for download
    setHeader(event, 'Content-Type', mimeType)
    setHeader(event, 'Content-Disposition', `attachment; filename="${document.original_filename}"`)
    setHeader(event, 'Content-Length', fileBuffer.length)

    return fileBuffer
  } catch (error) {
    console.error('Download error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to download document'
    })
  }
})