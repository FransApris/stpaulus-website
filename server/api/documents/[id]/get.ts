import { defineEventHandler, createError, getRouterParam } from 'h3'
import type { H3Event } from 'h3'
import { getQuery } from '~/server/database/db'

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  const document = await getQuery(`
    SELECT 
      d.id,
      d.title,
      d.description,
      d.filename,
      d.original_filename,
      d.file_size,
      d.mime_type,
      d.created_at,
      dc.name as category_name,
      dc.color as category_color,
      CONCAT('/uploads/documents/', d.filename) as file_path
    FROM documents d
    LEFT JOIN document_categories dc ON d.category_id = dc.id
    WHERE d.id = ?
  `, [id])

  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }

  return document
})
