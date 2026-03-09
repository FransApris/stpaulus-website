import { defineEventHandler, getQuery } from 'h3'
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryId = query.category_id

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
      d.created_at,
      dc.name as category_name,
      dc.color as category_color
    FROM documents d
    LEFT JOIN document_categories dc ON d.category_id = dc.id
    WHERE 1=1
  `

  const params = []

  if (categoryId) {
    sql += ` AND d.category_id = ?`
    params.push(categoryId)
  }

  sql += ` ORDER BY d.created_at DESC`

  const documents = allQuery(sql, params)

  return documents
})
