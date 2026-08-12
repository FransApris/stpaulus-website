import { allQuery, getQuery as dbGetOne } from '../../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // ── T-5 Fix: Gunakan RBAC requirePermission, bukan hardcode role name ────────
  const decoded = requireAuth(event)
  const userId = decoded.userId

  const user = await dbGetOne('SELECT role_id FROM users WHERE id = ?', [userId]) as any
  if (!user) throw createError({ statusCode: 401, statusMessage: 'User not found' })

  const permissions = await getUserPermissions(user)
  event.context.auth = { userId, permissions }

  // view_bookings mencakup super_admin dan admin_sekretariat melalui RBAC
  requirePermission('view_bookings')(event)

  const queryParams = getQuery(event)
  const rawStart = (queryParams.startDate as string) || ''
  const rawEnd   = (queryParams.endDate   as string) || ''

  // Validasi format tanggal ketat — hanya YYYY-MM-DD diterima
  const dateRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/
  const startDate = dateRegex.test(rawStart) ? rawStart : ''
  const endDate   = dateRegex.test(rawEnd)   ? rawEnd   : ''

  // ── K-1 Fix: Bangun conditions + params array, gunakan parameterized query ───
  // Bukan interpolasi string! Semua 9 query sekarang pakai shared buildDateParams.

  /**
   * Bangun array conditions (WHERE clause additions) dan params untuk dateFilter.
   * Setiap query memanggil ini dan menggabungkan dengan kondisi spesifiknya.
   */
  const buildDateParams = (): { conditions: string[]; params: string[] } => {
    const conditions: string[] = []
    const params: string[] = []
    if (startDate && endDate) {
      conditions.push('DATE(b.start_time) BETWEEN ? AND ?')
      params.push(startDate, endDate)
    } else if (startDate) {
      conditions.push('DATE(b.start_time) >= ?')
      params.push(startDate)
    } else if (endDate) {
      conditions.push('DATE(b.start_time) <= ?')
      params.push(endDate)
    }
    return { conditions, params }
  }

  // 1. Summary counts by status
  const { conditions: c1, params: p1 } = buildDateParams()
  const summaryWhere = c1.length ? 'AND ' + c1.join(' AND ') : ''
  const summary = await allQuery(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN b.status = 'APPROVED'  THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN b.status = 'PENDING'   THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN b.status = 'REJECTED'  THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN b.status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
    FROM bookings b
    WHERE b.deleted_at IS NULL ${summaryWhere}
  `, p1)

  // 2. Most used rooms (top 10)
  const { conditions: c2, params: p2 } = buildDateParams()
  const roomWhere = c2.length ? 'AND ' + c2.join(' AND ') : ''
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
    WHERE b.deleted_at IS NULL ${roomWhere}
    GROUP BY r.id, r.name, r.location
    ORDER BY total_bookings DESC
    LIMIT 10
  `, p2)

  // 3. Monthly trend (last 12 months) — tidak pakai dateFilter (selalu 12 bulan terakhir)
  const monthlyTrend = await allQuery(`
    SELECT
      DATE_FORMAT(b.start_time, '%Y-%m') as month,
      COUNT(*) as total,
      SUM(CASE WHEN b.status = 'APPROVED'  THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN b.status = 'REJECTED'  THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN b.status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.start_time >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(b.start_time, '%Y-%m')
    ORDER BY month ASC
  `, [])

  // 4. Bookings by user category
  const { conditions: c4, params: p4 } = buildDateParams()
  const catWhere = c4.length ? 'AND ' + c4.join(' AND ') : ''
  const byCategory = await allQuery(`
    SELECT
      COALESCE(u.user_category, 'Tidak Diketahui') as category,
      COUNT(*) as total,
      SUM(CASE WHEN b.status = 'APPROVED' THEN 1 ELSE 0 END) as approved
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.deleted_at IS NULL ${catWhere}
    GROUP BY u.user_category
    ORDER BY total DESC
  `, p4)

  // 5. Approval rate
  const { conditions: c5, params: p5 } = buildDateParams()
  const approvalWhere = c5.length ? 'AND ' + c5.join(' AND ') : ''
  const decisions = await dbGetOne(`
    SELECT
      SUM(CASE WHEN b.status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN b.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.status IN ('APPROVED', 'REJECTED')
      ${approvalWhere}
  `, p5) as any

  // 6. Busiest day of week
  const { conditions: c6, params: p6 } = buildDateParams()
  const dowWhere = c6.length ? 'AND ' + c6.join(' AND ') : ''
  const byDayOfWeek = await allQuery(`
    SELECT
      DAYOFWEEK(b.start_time) as day_num,
      DAYNAME(b.start_time)   as day_name,
      COUNT(*) as total
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.status = 'APPROVED'
      ${dowWhere}
    GROUP BY DAYOFWEEK(b.start_time), DAYNAME(b.start_time)
    ORDER BY day_num ASC
  `, p6)

  // 7. Busiest hour of day
  const { conditions: c7, params: p7 } = buildDateParams()
  const hourWhere = c7.length ? 'AND ' + c7.join(' AND ') : ''
  const byHour = await allQuery(`
    SELECT
      HOUR(b.start_time) as hour,
      COUNT(*) as total
    FROM bookings b
    WHERE b.deleted_at IS NULL
      AND b.status = 'APPROVED'
      ${hourWhere}
    GROUP BY HOUR(b.start_time)
    ORDER BY hour ASC
  `, p7)

  // 8. Recent rejections (last 20)
  const { conditions: c8, params: p8 } = buildDateParams()
  const rejWhere = c8.length ? 'AND ' + c8.join(' AND ') : ''
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
    WHERE b.status = 'REJECTED' AND b.deleted_at IS NULL ${rejWhere}
    ORDER BY b.updated_at DESC
    LIMIT 20
  `, p8)

  // 9. Recent cancellations (last 20)
  let cancellations: any[] = []
  try {
    const { conditions: c9, params: p9 } = buildDateParams()
    const canWhere = c9.length ? 'AND ' + c9.join(' AND ') : ''
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
      WHERE b.status = 'CANCELLED' AND b.deleted_at IS NULL ${canWhere}
      ORDER BY b.updated_at DESC
      LIMIT 20
    `, p9)
  } catch (_err) {
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
