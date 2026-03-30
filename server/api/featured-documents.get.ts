import { defineEventHandler, createError } from 'h3'
import { allQuery } from '~/server/database/db'

interface DocumentWithCategory {
  id: number
  title: string
  description: string | null
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  created_at: string
  category_name: string
  category_slug: string
  category_color: string
}

export default defineEventHandler(async (event) => {
  try {
    const documents = await allQuery(`
      SELECT
        d.id,
        d.title,
        d.description,
        d.filename,
        d.original_filename,
        d.file_path,
        d.file_size,
        d.mime_type,
        d.created_at,
        dc.name as category_name,
        dc.slug as category_slug,
        dc.color as category_color
      FROM documents d
      LEFT JOIN document_categories dc ON d.category_id = dc.id
      WHERE d.is_featured = 1
      ORDER BY d.created_at DESC
      LIMIT 6
    `) as DocumentWithCategory[]

    return documents.map((doc: DocumentWithCategory) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      filename: doc.filename,
      original_filename: doc.original_filename,
      file_path: doc.file_path,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      created_at: doc.created_at,
      category_name: doc.category_name,
      category_slug: doc.category_slug,
      category_color: doc.category_color
    }))
  } catch (error) {
    console.error('Featured documents error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch featured documents'
    })
  }
})
