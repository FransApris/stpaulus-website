import { getQuery, allQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  
  const allowedRoles = ['kontributor_berita', 'admin_komsos', 'super_admin']
  if (!allowedRoles.includes(decoded.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Role tidak diizinkan' })
  }

  try {
    const author_id = decoded.userId
    
    // Total drafts
    const draftResult = await getQuery(
      'SELECT COUNT(*) as count FROM news WHERE author_id = ? AND status = "draft"',
      [author_id]
    ) as any
    const drafts = Number(draftResult?.count) || 0

    // Total published
    const publishedResult = await getQuery(
      'SELECT COUNT(*) as count FROM news WHERE author_id = ? AND status = "published"',
      [author_id]
    ) as any
    const published = Number(publishedResult?.count) || 0

    return {
      success: true,
      data: {
        drafts,
        published,
        total: drafts + published
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal server error'
    })
  }
})
