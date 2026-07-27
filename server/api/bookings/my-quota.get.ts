import { getQuery, runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

const MAX_ACTIVE_BOOKINGS = 3

/**
 * GET /api/bookings/my-quota
 * Returns the current user's active booking count and the maximum allowed.
 * Requires authentication.
 */
export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  try {
    const result = await getQuery(`
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE user_id = ?
        AND status IN ('PENDING', 'APPROVED')
        AND end_time > NOW()
        AND deleted_at IS NULL
    `, [userId]) as any

    const activeCount = Number(result?.count ?? 0)

    return {
      active_count: activeCount,
      max_allowed: MAX_ACTIVE_BOOKINGS,
      remaining: Math.max(0, MAX_ACTIVE_BOOKINGS - activeCount),
      can_book: activeCount < MAX_ACTIVE_BOOKINGS
    }
  } catch (error: any) {
    console.error('[MY QUOTA] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data kuota pemesanan'
    })
  }
})
