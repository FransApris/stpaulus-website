import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC - use view_bookings for reading data
  requirePermission('view_bookings')(event)

  const queryParams = getQuery(event)
  const status = queryParams.status as string | undefined

  // Get date range from query params.
  // Default: 365 hari ke depan (dari 90) agar booking jauh ke depan tidak luput dari pandangan admin.
  // Fix: booking di luar 90 hari tersimpan di DB tapi tidak terlihat → admin mengira slot kosong.
  const days = parseInt(queryParams.days as string) || 365
  const pastDays = parseInt(queryParams.past_days as string) || 30

  // Calculate date range
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - pastDays)
  const endDate = new Date(now)
  endDate.setDate(now.getDate() + days)

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  console.log('[Admin Bookings API] Request from user:', userId)
  console.log('[Admin Bookings API] Filter status:', status || 'all')
  console.log('[Admin Bookings API] Date range:', { start: startDateStr, end: endDateStr })

  let query = `
    SELECT
      b.id,
      b.room_id,
      b.user_id,
      b.event_name,
      b.start_time,
      b.end_time,
      b.status,
      b.rejection_reason,
      b.cancellation_reason,
      b.recurrence_pattern,
      b.parent_booking_id,
      b.created_at,
      b.deleted_at,
      r.name as room_name,
      r.location,
      u.full_name as user_name,
      u.email as user_email,
      u.unit_name,
      u.user_category
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.deleted_at IS NULL
      AND r.is_active = 1
      AND DATE(b.start_time) BETWEEN ? AND ?
  `

  const params = [startDateStr, endDateStr]

  if (status) {
    query += ' AND b.status = ?'
    params.push(status)
  }

  // Sort: PENDING first, then by created_at DESC
  query += ` ORDER BY 
    CASE 
      WHEN b.status = 'PENDING' THEN 0
      WHEN b.status = 'APPROVED' THEN 1
      WHEN b.status = 'REJECTED' THEN 2
      WHEN b.status = 'CANCELLED' THEN 3
      ELSE 4
    END,
    b.created_at DESC`

  console.log('[Admin Bookings API] Executing query with params:', params)

  let rawBookings: any[] = []
  try {
    rawBookings = await allQuery(query, params)
  } catch (err: any) {
    const msg = String(err?.message || '')
    console.warn('[Admin Bookings API] Query warning/fallback:', msg)

    if (msg.includes('recurrence_pattern') || msg.includes('parent_booking_id') || msg.includes('is_active') || msg.includes('unit_name')) {
      const fallbackSelect = query
        .replace('b.recurrence_pattern,', 'NULL as recurrence_pattern,')
        .replace('b.parent_booking_id,', 'NULL as parent_booking_id,')
        .replace('u.unit_name,', 'NULL as unit_name,')
        .replace('AND r.is_active = 1', '')
      rawBookings = await allQuery(fallbackSelect, params)
    } else {
      throw err
    }
  }

  console.log('[Admin Bookings API] Found', rawBookings.length, 'bookings')

  // Normalize datetime strings: MySQL with dateStrings:true returns "YYYY-MM-DD HH:MM:SS"
  // (no timezone info). Append 'Z' so browsers treat them as UTC instead of local WIB,
  // matching the normalization already done in the user-facing /api/bookings endpoint.
  const toUTC = (s: any) => (s ? String(s).replace(' ', 'T') + 'Z' : null)

  const bookings = rawBookings.map((b: any) => ({
    ...b,
    start_time: toUTC(b.start_time),
    end_time:   toUTC(b.end_time),
    created_at: toUTC(b.created_at)
  }))

  // Log summary by status
  const statusSummary = bookings.reduce((acc: any, b: any) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {})
  console.log('[Admin Bookings API] Status summary:', statusSummary)
  console.log('[Admin Bookings API] Date range applied:', { start: startDateStr, end: endDateStr })

  // Peringatan jika admin menggunakan range yang lebih sempit dari default baru (365 hari)
  const hasOutOfRangeWarning = days < 365

  return {
    bookings,
    date_range: {
      start: startDateStr,
      end: endDateStr,
      past_days: pastDays,
      future_days: days
    },
    total: bookings.length,
    status_summary: statusSummary,
    // Jika true, ada kemungkinan booking di luar rentang ini tidak ditampilkan
    has_out_of_range_warning: hasOutOfRangeWarning
  }
})
