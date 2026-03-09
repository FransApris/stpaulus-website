import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can delete documents
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

  try {
    // Get document info to delete file
    const document = await getQuery(`SELECT file_path FROM documents WHERE id = ?`, [id]) as { file_path: string } | undefined

    if (document) {
      // Delete file from filesystem
      if (fs.existsSync(document.file_path)) {
        fs.unlinkSync(document.file_path)
      }
    }

    // Delete from database using direct db.prepare().run() call
    const deleteResult = await runQuery(`DELETE FROM documents WHERE id = ?`, [id])

    // Check if deletion actually happened
    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found or already deleted'
      })
    }

    return { success: true, message: 'Document deleted successfully' }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete document'
    })
  }
})
