import { allQuery, getQuery } from '../../database/db'
import { requireAuth, getUserPermissions } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const userId = decoded.userId

    const user = await getQuery('SELECT role, role_id FROM users WHERE id = ?', [userId]) as any
    const permissions = await getUserPermissions(user)
    const isAdmin = permissions.includes('manage_bookings')

    let notifications: any[] = []
    let unreadCount = 0

    if (isAdmin) {
      // Admins see pending bookings requiring approval
      try {
        notifications = await allQuery(`
          SELECT 
            b.id,
            b.event_name,
            b.status,
            b.start_time,
            b.created_at,
            r.name as room_name,
            u.full_name as user_name
          FROM bookings b
          LEFT JOIN rooms r ON b.room_id = r.id
          LEFT JOIN users u ON b.user_id = u.id
          WHERE b.deleted_at IS NULL AND b.status = 'PENDING'
          ORDER BY b.created_at DESC
          LIMIT 10
        `)
        unreadCount = notifications.length
      } catch (err) {
        notifications = []
      }
    } else {
      // Regular users see recent status updates
      try {
        notifications = await allQuery(`
          SELECT 
            b.id,
            b.event_name,
            b.status,
            b.rejection_reason,
            b.cancellation_reason,
            b.updated_at,
            r.name as room_name
          FROM bookings b
          LEFT JOIN rooms r ON b.room_id = r.id
          WHERE b.user_id = ? AND b.deleted_at IS NULL AND b.status IN ('APPROVED', 'REJECTED', 'CANCELLED')
          ORDER BY b.updated_at DESC
          LIMIT 10
        `, [userId])

        const unreadItems = await getQuery(`
          SELECT COUNT(*) as count
          FROM bookings
          WHERE user_id = ? AND deleted_at IS NULL AND status IN ('APPROVED', 'REJECTED', 'CANCELLED') AND is_read = 0
        `, [userId]) as any

        unreadCount = unreadItems?.count || 0
      } catch (err) {
        notifications = []
      }
    }

    return {
      success: true,
      unreadCount,
      notifications: notifications.map((n: any) => ({
        id: n.id,
        event_name: n.event_name,
        status: n.status,
        room_name: n.room_name || 'Ruangan',
        user_name: n.user_name || null,
        rejection_reason: n.rejection_reason || null,
        cancellation_reason: n.cancellation_reason || null,
        timestamp: n.updated_at || n.created_at
      }))
    }
  } catch (error: any) {
    return {
      success: false,
      unreadCount: 0,
      notifications: []
    }
  }
})
