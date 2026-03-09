import { runQuery, getQuery as dbGetQuery } from '~/server/database/db'
import { requireAuth, requirePermission, getUserPermissions } from '~/server/utils/auth'
import { logAudit } from '~/server/utils/audit'

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication - admin only
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
    const permissions = await getUserPermissions(user)
    event.context.auth = {
      userId: userId,
      permissions: permissions
    }

    // Check permissions - admin only
    requirePermission('manage_bookings')(event)

    const bookingId = getRouterParam(event, 'id')

    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required',
      })
    }

    // Check if booking exists and is deleted
    const booking = await dbGetQuery(
      'SELECT id, deleted_at FROM bookings WHERE id = ?',
      [bookingId]
    )

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found',
      })
    }

    if (!booking.deleted_at) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking is not deleted',
      })
    }

    // Restore the booking (soft delete restore)
    await runQuery(
      'UPDATE bookings SET deleted_at = NULL, deleted_by = NULL WHERE id = ?',
      [bookingId]
    )

    // Log the audit
    await logAudit(event, {
      action: 'RESTORE_BOOKING',
      target_type: 'booking',
      target_id: bookingId,
      changes: {
        deleted_at: null,
        deleted_by: null,
      },
      user_id: userId,
    })

    return {
      success: true,
      message: 'Booking restored successfully',
    }
  } catch (error: any) {
    console.error('Error restoring booking:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to restore booking',
    })
  }
})
