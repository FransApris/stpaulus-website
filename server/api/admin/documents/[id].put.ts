import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can update documents
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_documents')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can manage documents'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  const body = await readBody(event)
  const { title, description, category_id } = body

  if (!title || !category_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and category_id are required'
    })
  }

  // Check if document exists
  const existingDoc = await getQuery(`SELECT id FROM documents WHERE id = ?`, [id])
  if (!existingDoc) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }

  // Check if category exists and is active
  const category = await getQuery(`SELECT id FROM document_categories WHERE id = ? AND is_active = 1`, [category_id])
  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category'
    })
  }

  try {
    // Update document
    const updateResult = await runQuery(`
      UPDATE documents
      SET title = ?, description = ?, category_id = ?, updated_at = NOW()
      WHERE id = ?
    `, [title.trim(), description || null, category_id, id])

    if ((updateResult as any).affectedRows === 0) {
      // Check if document still exists (in case it was deleted concurrently)
      const check = await getQuery('SELECT id FROM documents WHERE id = ?', [id])
      if (!check) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Document not found'
        })
      }
      // If exists but no changes, still success
    }

    // Return updated document
    const updatedDoc = await getQuery(`
      SELECT
        d.id,
        d.title,
        d.description,
        d.filename,
        d.original_filename,
        d.file_path,
        d.file_size,
        d.mime_type,
        d.uploaded_by,
        d.created_at,
        d.updated_at,
        dc.name as category_name,
        dc.color as category_color,
        u.full_name as uploader_name
      FROM documents d
      JOIN document_categories dc ON d.category_id = dc.id
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.id = ?
    `, [id])

    return updatedDoc
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update document'
    })
  }
})
