// Admin API: Delete kronik section
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Section ID is required'
    })
  }

  // TODO: Add authentication middleware
  // const user = event.context.user
  // if (!user || !['super-admin', 'admin-paroki'].includes(user.role)) {
  //   throw createError({ statusCode: 403, message: 'Forbidden' })
  // }

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
