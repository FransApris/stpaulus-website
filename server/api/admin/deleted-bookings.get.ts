import { allQuery, getQuery as dbGetQuery } from '~/server/database/db'
import { requireAuth, requirePermission, getUserPermissions } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const userId = decoded.userId

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

    requirePermission('manage_bookings')(event)

    const query = getQuery(event)
    const limit = Number(query.limit) || 50
    const offset = Number(query.offset) || 0

    const bookings = await allQuery(
      `SELECT b.id, b.room_id, b.user_id, b.event_name, b.start_time, b.end_time, b.status, b.deleted_at, b.deleted_by, r.name as room_name, u.full_name as user_name, u.email as user_email, du.full_name as deleter_name, du.email as deleter_email FROM bookings b LEFT JOIN rooms r ON b.room_id = r.id LEFT JOIN users u ON b.user_id = u.id LEFT JOIN users du ON b.deleted_by = du.id WHERE b.deleted_at IS NOT NULL ORDER BY b.deleted_at DESC LIMIT ${limit} OFFSET ${offset}`,
      []
    )

    return bookings || []
  } catch (error: any) {
    console.error('[DELETED_BOOKINGS] Error:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error.sqlMessage || error.message || 'Failed to fetch deleted bookings'
    })
  }
})
