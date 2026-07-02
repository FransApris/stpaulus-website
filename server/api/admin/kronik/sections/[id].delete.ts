// Admin API: Delete kronik section
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { getRouterParam } from 'h3'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')

  try {
    // Check if section exists
    const section = await getOne(`
      SELECT id, name FROM kronik_sections WHERE id = ?
    `, [id])

    if (!section) {
      throw createError({
        statusCode: 404,
        message: 'Section not found'
      })
    }

    // Check if section has entries
    const entryCount = await getOne(`
      SELECT COUNT(*) as total FROM kronik_entries WHERE section_id = ?
    `, [id])

    if (entryCount && (entryCount as any).total > 0) {
      throw createError({
        statusCode: 409,
        message: `Cannot delete section. It has ${(entryCount as any).total} entries. Please delete or reassign the entries first.`
      })
    }

    // Delete section
    await runQuery(`
      DELETE FROM kronik_sections WHERE id = ?
    `, [id])

    return {
      success: true,
      message: 'Section deleted successfully',
      data: { id, name: (section as any).name }
    }
  } catch (error: any) {
    console.error('Error deleting section:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete section'
    })
  }
})
