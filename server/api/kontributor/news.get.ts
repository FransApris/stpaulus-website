import { allQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  
  const allowedRoles = ['kontributor_berita', 'user_kontributor', 'admin_komsos', 'super_admin']
  if (!allowedRoles.includes(decoded.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Role tidak diizinkan mengakses data ini' })
  }

  try {
    const author_id = decoded.userId
    
    // Get all news authored by this user only
    const query = `
      SELECT n.id, n.title, n.slug, n.status, n.created_at, n.updated_at, n.published_at, n.image
      FROM news n
      WHERE n.author_id = ?
      ORDER BY n.created_at DESC
    `
    const news = await allQuery(query, [author_id])

    return {
      success: true,
      data: news || []
    }
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal server error'
    })
  }
})
