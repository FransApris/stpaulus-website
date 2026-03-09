import { runQuery, getQuery as dbGetQuery } from '~/server/database/db'
import { requireAuth, requirePermission, getUserPermissions } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const decoded = requireAuth(event)
    const userId = decoded.userId

    // Set auth context for permission checking
    const user = await dbGetQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    const bookingId = getRouterParam(event, 'id')

    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required',
      })
    }

    // Get booking history from the database
    const history = await runQuery(
      `SELECT 
        bh.id,
        bh.booking_id,
        bh.action,
        bh.old_status,
        bh.new_status,
        bh.user_id,
        bh.reason as change_reason,
        bh.created_at as changed_at,
        u.full_name as changed_by_name,
        u.email as changed_by_email
      FROM booking_history bh
      LEFT JOIN users u ON bh.user_id = u.id
      WHERE bh.booking_id = ?
      ORDER BY bh.created_at DESC`,
      [bookingId]
    )

    return history
  } catch (error: any) {
    console.error('Error fetching booking history:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch booking history',
    })
  }
})
