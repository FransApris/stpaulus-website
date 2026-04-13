import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)

    // Only super_admin can bulk-delete users
    const admin = await getQuery(
      `SELECT u.id, r.name as role_name 
       FROM users u LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.userId]
    ) as any

    if (!admin || admin.role_name !== 'super_admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Hanya Super Admin yang dapat menghapus semua user booking'
      })
    }

    // Count first for response
    const countResult = await getQuery(
      `SELECT COUNT(*) as total FROM users WHERE role = 'user' AND (role_id IS NULL OR role_id = 0)`,
      []
    ) as any

    const total = countResult?.total || 0

    if (total === 0) {
      return { success: true, deleted: 0, message: 'Tidak ada user booking untuk dihapus' }
    }

    // Delete related bookings first (avoid FK constraint errors)
    await runQuery(
      `DELETE FROM bookings WHERE user_id IN (
        SELECT id FROM users WHERE role = 'user' AND (role_id IS NULL OR role_id = 0)
      )`,
      []
    )

    // Delete all booking users
    await runQuery(
      `DELETE FROM users WHERE role = 'user' AND (role_id IS NULL OR role_id = 0)`,
      []
    )

    console.log(`[Clear Booking Users] Super Admin ${decoded.userId} deleted ${total} booking users`)

    return {
      success: true,
      deleted: total,
      message: `${total} user booking berhasil dihapus`
    }
  } catch (error: any) {
    console.error('[Clear Booking Users] Error:', error)
    throw error
  }
})
