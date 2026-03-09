import { allQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const types = await allQuery(`
      SELECT id, name, slug, icon, color, description, display_order
      FROM liturgy_types
      WHERE is_active = 1
      ORDER BY display_order ASC
    `)

    return { types }
  } catch (error) {
    console.error('Error fetching liturgy types:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch liturgy types'
    })
  }
})
