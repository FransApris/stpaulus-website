import { allQuery, runQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can access admin documents
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_documents')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can manage documents'
    })
  }

  const query = getQuery(event)
  const categoryId = query.category_id

  const whereClause = categoryId ? `WHERE d.category_id = ?` : ''
  const params = categoryId ? [categoryId] : []

  const documents = await allQuery(`
    SELECT 
      d.id,
      d.title,
      d.description,
      d.category_id,
      d.filename,
      d.original_filename,
      d.file_path,
      d.file_size,
      d.mime_type,
      d.uploaded_by,
      d.created_at,
      d.updated_at,
      d.is_featured,
      dc.name as category_name,
      dc.color as category_color,
      u.full_name as uploader_name
    FROM documents d
    LEFT JOIN document_categories dc ON d.category_id = dc.id
    LEFT JOIN users u ON d.uploaded_by = u.id
    ${whereClause}
    ORDER BY d.created_at DESC
  `, params)

  return documents
})
