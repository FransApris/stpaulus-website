import { runQuery, getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'
import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_hero_themes')(event)

  const id = parseInt(event.context.params?.id || '0')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid theme ID'
    })
  }

  // Check if theme exists
  const theme = await getQuery(`
    SELECT id, image_path, is_active FROM hero_themes WHERE id = ?
  `, [id]) as { id: number, image_path: string | null, is_active: number } | undefined

  if (!theme) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Theme not found'
    })
  }

  // Don't allow deletion of active theme
  if (theme.is_active) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot delete active theme. Deactivate it first.'
    })
  }

  try {
    // Delete from database first
    const deleteResult = await runQuery('DELETE FROM hero_themes WHERE id = ?', [id])

    if ((deleteResult as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Theme not found or already deleted'
      })
    }

    // Delete image file
    if (theme.image_path) {
      const imagePath = path.join(process.cwd(), 'public', theme.image_path)
      try {
        await fs.unlink(imagePath)
      } catch (fileError) {
        console.warn('Could not delete image file:', fileError)
        // Don't fail the request if file deletion fails
      }
    }

    return {
      success: true,
      message: 'Theme deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting theme:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete theme'
    })
  }
})
