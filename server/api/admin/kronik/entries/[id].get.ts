// Admin API: Get single kronik entry
import { getQuery as getOne } from '~/server/database/db'
import { getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Entry ID is required'
    })
  }

  try {
    // Get the entry with all related data
    const entry = await getOne(`
      SELECT 
        ke.*,
        kc.name as category_name,
        kc.slug as category_slug,
        ks.name as section_name,
        u.full_name as author_name,
        u.username as author_username
      FROM kronik_entries ke
      LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
      LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
      LEFT JOIN users u ON ke.author_id = u.id
      WHERE ke.id = ?
    `, [id])

    if (!entry) {
      throw createError({
        statusCode: 404,
        message: 'Entry not found'
      })
    }

    return {
      success: true,
      data: entry
    }
  } catch (error: any) {
    console.error('Error fetching kronik entry:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch kronik entry'
    })
  }
})
