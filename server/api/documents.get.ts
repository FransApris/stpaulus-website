import { defineEventHandler, getQuery } from 'h3'
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryId = query.category_id

  const whereClause = categoryId ? `WHERE d.category_id = ?` : ''
  const params = categoryId ? [categoryId] : []

  let sql = `
    SELECT
      d.id,
      d.title,
      d.description,
      d.category_id,
      d.filename,
      d.original_filename,
      d.file_size,
      d.mime_type,
      d.file_path,
      d.created_at,
      dc.name as category_name,
      dc.color as category_color
    FROM documents d
    LEFT JOIN document_categories dc ON d.category_id = dc.id
    ${whereClause}
    ORDER BY d.created_at DESC
  `

  const documents = await allQuery(sql, params)

  return documents
})
