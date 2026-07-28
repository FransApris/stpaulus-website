import { allQuery, getQuery as dbGetOne } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Only super_admin and admin_sekretariat can access booking reports
  const admin = await dbGetOne(
    `SELECT r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
    [userId]
  ) as any

  if (!admin || !['super_admin', 'admin_sekretariat'].includes(admin.role_name)) {
    throw createError({ statusCode: 403, statusMessage: 'Akses ditolak' })
  }

  const queryParams = getQuery(event)
  const rawStart = (queryParams.startDate as string) || ''
  const rawEnd = (queryParams.endDate as string) || ''

  // ── Bug #6A fix: validasi format tanggal sebelum interpolasi SQL ─────────
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  const startDate = dateRegex.test(rawStart) ? rawStart : ''
  const endDate   = dateRegex.test(rawEnd)   ? rawEnd   : ''

  // Build dynamic date filter — safe because inputs are validated as YYYY-MM-DD
  const dateFilter = startDate && endDate
    ? `AND DATE(b.start_time) BETWEEN '${startDate}' AND '${endDate}'`
    : startDate
      ? `AND DATE(b.start_time) >= '${startDate}'`
      : endDate
        ? `AND DATE(b.start_time) <= '${endDate}'`
        : ''

  // 1. Summary counts by status
  const summary = await allQuery(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN b.status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN b.status = 'PENDING' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN b.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN b.status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
    FROM bookings b
    WHERE b.deleted_at IS NULL ${dateFilter}
  `, [])

  // 2. Most used rooms (top 10)
  const roomUsage = await allQuery(`
    SELECT
      r.name as room_name,
      r.location,
      COUNT(*) as total_bookings,
      SUM(CASE WHEN b.status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      ROUND(SUM(CASE WHEN b.status = 'APPROVED'
        THEN TIMESTAMPDIFF(MINUTE, b.start_time, b.end_time) ELSE 0 END) / 60.0, 1) as total_hours
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.deleted_at IS NULL ${dateFilter}
    GROUP BY r.id, r.name, r.location
    ORDER BY total_bookings DESC
    LIMIT 10
  `, [])

  // 3. Monthly trend (last 12 months)
  const monthlyTrend = await allQuery(`
    SELECT
      DATE_FORMAT(b.start_time, '%Y-%m') as month,
      COUNT(*) as total,
      SUM(CASE WHEN b.status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN b.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN b.status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.start_time >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(b.start_time, '%Y-%m')
    ORDER BY month ASC
  `, [])

  // 4. Bookings by user category
  const byCategory = await allQuery(`
    SELECT
      COALESCE(u.user_category, 'Tidak Diketahui') as category,
      COUNT(*) as total,
      SUM(CASE WHEN b.status = 'APPROVED' THEN 1 ELSE 0 END) as approved
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.deleted_at IS NULL ${dateFilter}
    GROUP BY u.user_category
    ORDER BY total DESC
  `, [])

  // 5. Approval rate (approved vs rejected — excludes pending/cancelled)
  const decisions = await dbGetOne(`
    SELECT
      SUM(CASE WHEN b.status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN b.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.status IN ('APPROVED', 'REJECTED')
      ${dateFilter}
  `, []) as any

  // 6. Busiest day of week
  const byDayOfWeek = await allQuery(`
    SELECT
      DAYOFWEEK(b.start_time) as day_num,
      DAYNAME(b.start_time) as day_name,
      COUNT(*) as total
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.status = 'APPROVED'
      ${dateFilter}
    GROUP BY DAYOFWEEK(b.start_time), DAYNAME(b.start_time)
    ORDER BY day_num ASC
  `, [])

  // 7. Busiest hour of day
  const byHour = await allQuery(`
    SELECT
      HOUR(b.start_time) as hour,
      COUNT(*) as total
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.status = 'APPROVED'
      ${dateFilter}
    GROUP BY HOUR(b.start_time)
    ORDER BY hour ASC
  `, [])

  // 8. Recent rejections (last 20)
  const rejections = await allQuery(`
    SELECT
      b.event_name,
      r.name as room_name,
      u.full_name as user_name,
      u.user_category,
      DATE_FORMAT(b.start_time, '%d/%m/%Y %H:%i') as booking_date,
      b.rejection_reason,
      DATE_FORMAT(b.updated_at, '%d/%m/%Y') as rejected_at
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.status = 'REJECTED' AND b.deleted_at IS NULL ${dateFilter}
    ORDER BY b.updated_at DESC
    LIMIT 20
  `, [])

  // 9. Recent cancellations (last 20)
  let cancellations: any[] = []
  try {
    cancellations = await allQuery(`
      SELECT
        b.id,
        b.event_name,
        r.name as room_name,
        u.full_name as user_name,
        u.user_category,
        DATE_FORMAT(b.start_time, '%d/%m/%Y %H:%i') as booking_date,
        b.cancellation_reason,
        DATE_FORMAT(b.updated_at, '%d/%m/%Y') as cancelled_at
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.status = 'CANCELLED' AND b.deleted_at IS NULL ${dateFilter}
      ORDER BY b.updated_at DESC
      LIMIT 20
    `, [])
  } catch (err) {
    cancellations = []
  }

  return {
    summary: summary[0] || {},
    roomUsage,
    monthlyTrend,
    byCategory,
    approvalRate: {
      approved: decisions?.approved || 0,
      rejected: decisions?.rejected || 0
    },
    byDayOfWeek,
    byHour,
    rejections,
    cancellations,
    dateRange: { startDate, endDate }
  }
})
