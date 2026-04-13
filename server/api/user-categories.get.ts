import { allQuery } from '../../database/db'

// Public endpoint — returns active user categories for the registration form
export default defineEventHandler(async () => {
  try {
    const categories = await allQuery(
      'SELECT id, name, display_name FROM user_categories WHERE is_active = 1 ORDER BY display_name ASC'
    )
    return categories
  } catch (error: any) {
    console.error('[GET /api/user-categories] Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Gagal memuat kategori pengguna' })
  }
})
