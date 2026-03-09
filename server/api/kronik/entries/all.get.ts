import { allQuery, getQuery as getOne } from '~/server/database/db'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const page = parseInt(queryParams.page as string) || 1
  const limit = parseInt(queryParams.limit as string) || 10
  const offset = (page - 1) * limit

  try {
    // Get total count
    const countResult = await getOne(
      'SELECT COUNT(*) as total FROM kronik_entries WHERE status = ?',
      ['published']
    )
    const total = countResult?.total || 0

    // Get entries with category and section info
    const entries = await allQuery(
      `SELECT 
        ke.id,
        ke.what_title,
        ke.what_description,
        ke.when_date,
        ke.where_location,
        kc.name as category_name,
        kc.slug as category_slug,
        ks.name as section_name
      FROM kronik_entries ke
      LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
      LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
      WHERE ke.status = ?
      ORDER BY ke.when_date DESC, ke.created_at DESC
      LIMIT ? OFFSET ?`,
      ['published', limit, offset]
    )

    return {
      success: true,
      data: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error('Error fetching all kronik entries:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch kronik entries'
    })
  }
})
