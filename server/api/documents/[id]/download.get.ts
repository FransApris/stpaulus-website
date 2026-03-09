import { defineEventHandler, createError, getRouterParam, setHeader } from 'h3'
import type { H3Event } from 'h3'
import { allQuery } from '~/server/database/db'
import fs from 'fs'
import path from 'path'

// Download endpoint for documents

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  // Get document info
  const documents = await allQuery(`
    SELECT d.file_path, d.original_filename, d.mime_type, dc.is_active
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

  const doc = documents[0] as { file_path: string; original_filename: string; mime_type: string }
  const filePath = path.join(process.cwd(), 'public', doc.file_path)

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found on server'
    })
  }

  try {
    // Read file
    const fileBuffer = fs.readFileSync(filePath)

    // Set headers for download
    setHeader(event, 'Content-Type', doc.mime_type)
    setHeader(event, 'Content-Disposition', `attachment; filename="${doc.original_filename}"`)
    setHeader(event, 'Content-Length', fileBuffer.length)

    return fileBuffer
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read file'
    })
  }
})
