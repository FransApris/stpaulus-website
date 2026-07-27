import { allQuery, getQuery } from '../../../database/db'
import { requireAuth, getUserPermissions } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const userId = decoded.userId

    const user = await getQuery('SELECT role_id, role FROM users WHERE id = ?', [userId]) as any
    const permissions = await getUserPermissions(user)
    const isAdmin = permissions.includes('manage_bookings') || permissions.includes('view_bookings')

    if (!isAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Akses ditolak: Hanya Admin yang dapat melihat statistik'
      })
    }

    // 1. Top Rooms Usage
    let roomUsage: any[] = []
    try {
      roomUsage = await allQuery(`
        SELECT 
          r.name as room_name,
          r.location as room_location,
          COUNT(b.id) as total_bookings,
          SUM(TIMESTAMPDIFF(HOUR, b.start_time, b.end_time)) as total_hours
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.deleted_at IS NULL AND b.status = 'APPROVED'
        GROUP BY r.id, r.name, r.location
        ORDER BY total_bookings DESC
        LIMIT 10
      `)
    } catch (err) {
      roomUsage = []
    }

    // 2. Unit / Category Usage
    let unitUsage: any[] = []
    try {
      unitUsage = await allQuery(`
        SELECT 
          COALESCE(u.user_category, 'Umum') as category_name,
          COUNT(b.id) as total_bookings
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.deleted_at IS NULL AND b.status = 'APPROVED'
        GROUP BY COALESCE(u.user_category, 'Umum')
        ORDER BY total_bookings DESC
      `)
    } catch (err) {
      unitUsage = []
    }

    // 3. Peak Hours Distribution
    let peakHours: any[] = []
    try {
      peakHours = await allQuery(`
        SELECT 
          HOUR(b.start_time) as hour_of_day,
          COUNT(b.id) as booking_count
        FROM bookings b
        WHERE b.deleted_at IS NULL AND b.status IN ('APPROVED', 'PENDING')
        GROUP BY HOUR(b.start_time)
        ORDER BY hour_of_day ASC
      `)
    } catch (err) {
      peakHours = []
    }

    // 4. Monthly Trends
    let monthlyTrends: any[] = []
    try {
      monthlyTrends = await allQuery(`
        SELECT 
          DATE_FORMAT(b.start_time, '%Y-%m') as month_key,
          COUNT(b.id) as total_bookings
        FROM bookings b
        WHERE b.deleted_at IS NULL
        GROUP BY DATE_FORMAT(b.start_time, '%Y-%m')
        ORDER BY month_key DESC
        LIMIT 12
      `)
    } catch (err) {
      monthlyTrends = []
    }

    return {
      success: true,
      data: {
        roomUsage,
        unitUsage,
        peakHours,
        monthlyTrends
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal memuat statistik ruangan'
    })
  }
})
