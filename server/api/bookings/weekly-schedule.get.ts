import { allQuery } from '~/server/database/db'

/**
 * GET /api/bookings/weekly-schedule
 * Returns all bookings for all rooms within a 7-day window.
 *
 * Query params:
 *   start_date : string  YYYY-MM-DD  (default: current Monday)
 *
 * Response:
 *   {
 *     week_start : string (YYYY-MM-DD)
 *     week_end   : string (YYYY-MM-DD)
 *     days       : string[]   (7 dates)
 *     rooms      : Room[]
 *     bookings   : BookingSlot[]
 *   }
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // ── 1. Determine week start (Monday) safely inside try-catch ─────────────
    let weekStart: Date

    if (query.start_date && typeof query.start_date === 'string') {
      const parsed = new Date(`${query.start_date}T00:00:00`)
      if (isNaN(parsed.getTime())) {
        throw createError({
          statusCode: 400,
          statusMessage: `Format start_date tidak valid: "${query.start_date}". Gunakan format YYYY-MM-DD.`
        })
      }
      weekStart = parsed
    } else {
      // Default to current Monday (WIB)
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
      const dayOfWeek = now.getDay() // 0=Sun, 1=Mon
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek)
      weekStart = new Date(now)
      weekStart.setDate(now.getDate() + diffToMonday)
      weekStart.setHours(0, 0, 0, 0)
    }

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    // Helper: Format Date to YYYY-MM-DD
    const toLocalDateStr = (d: Date) => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    const weekStartStr = toLocalDateStr(weekStart)
    const weekEndStr   = toLocalDateStr(weekEnd)

    // Generate array of 7 date strings
    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      days.push(toLocalDateStr(d))
    }

    // ── 2. Fetch all rooms with fallback ─────────────────────────────────────
    let rooms: any[] = []
    try {
      rooms = await allQuery(`
        SELECT id, name, capacity, location
        FROM rooms
        WHERE is_active = 1
        ORDER BY name ASC
      `)
    } catch (roomErr: any) {
      // Fallback if is_active column is missing
      rooms = await allQuery(`
        SELECT id, name, capacity, location
        FROM rooms
        ORDER BY name ASC
      `)
    }

    // ── 3. Fetch bookings in this week with fallback ─────────────────────────
    const startBuffer = new Date(weekStart)
    startBuffer.setDate(startBuffer.getDate() - 1)
    const endBuffer = new Date(weekEnd)
    endBuffer.setDate(endBuffer.getDate() + 1)

    const formatLocalDateStr = (d: Date) => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    const mysqlStart = `${formatLocalDateStr(startBuffer)} 00:00:00`
    const mysqlEnd   = `${formatLocalDateStr(endBuffer)} 23:59:59`

    let bookings: any[] = []
    try {
      bookings = await allQuery(`
        SELECT
          b.id,
          b.room_id,
          b.event_name,
          b.start_time,
          b.end_time,
          b.status,
          COALESCE(b.requester_name, u.full_name) AS requester_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.status IN ('APPROVED', 'PENDING')
          AND b.deleted_at IS NULL
          AND b.start_time < ?
          AND b.end_time > ?
        ORDER BY b.start_time ASC
      `, [mysqlEnd, mysqlStart])
    } catch (bookingErr: any) {
      const msg = String(bookingErr?.message || '')
      // Fallback if deleted_at or requester_name columns are missing
      if (msg.includes('requester_name') || msg.includes('deleted_at')) {
        bookings = await allQuery(`
          SELECT
            b.id,
            b.room_id,
            b.event_name,
            b.start_time,
            b.end_time,
            b.status,
            u.full_name AS requester_name
          FROM bookings b
          LEFT JOIN users u ON b.user_id = u.id
          WHERE b.status IN ('APPROVED', 'PENDING')
            AND b.start_time < ?
            AND b.end_time > ?
          ORDER BY b.start_time ASC
        `, [mysqlEnd, mysqlStart])
      } else {
        throw bookingErr
      }
    }

    // ── 4. Format booking times safely ───────────────────────────────────────
    const toUTCStr = (s: any): string => {
      if (!s) return ''
      if (s instanceof Date) return s.toISOString()
      const str = String(s).trim()
      return str.replace(' ', 'T') + (str.endsWith('Z') ? '' : 'Z')
    }

    // fmtTime: always parse as UTC first (DB stores UTC), then display in WIB
    const fmtTime = (raw: any): string => {
      if (!raw) return ''
      const utcStr = toUTCStr(raw)
      if (!utcStr) return ''
      const d = new Date(utcStr)
      if (isNaN(d.getTime())) return ''
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Jakarta', hour12: false
      }).replace(':', '.')
    }

    // fmtDateKey: parse as UTC, then get the WIB calendar date (YYYY-MM-DD)
    // This prevents day-boundary errors for bookings stored as e.g. "2026-08-21 00:30:00" UTC
    // which is actually "2026-08-21 07:30:00" WIB (same date) but could shift if close to midnight UTC.
    const fmtDateKey = (raw: any): string => {
      if (!raw) return ''
      const utcStr = toUTCStr(raw)
      if (!utcStr) return ''
      const d = new Date(utcStr)
      if (isNaN(d.getTime())) return ''
      return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
    }

    const formattedBookings = (bookings || []).map(b => ({
      id             : b?.id ?? 0,
      room_id        : b?.room_id ?? 0,
      event_name     : b?.event_name || 'Acara',
      requester_name : b?.requester_name || 'Tidak diketahui',
      date_key       : fmtDateKey(b?.start_time),
      start_time     : toUTCStr(b?.start_time),
      end_time       : toUTCStr(b?.end_time),
      start_formatted: fmtTime(b?.start_time),
      end_formatted  : fmtTime(b?.end_time),
      status         : b?.status || 'PENDING'
    }))

    return {
      week_start: weekStartStr,
      week_end  : weekEndStr,
      days,
      rooms,
      bookings  : formattedBookings
    }
  } catch (error: any) {
    console.error('[WEEKLY SCHEDULE] Crash avoided:', error)

    // If it's already an H3 / Nuxt error (like 400), throw directly
    if (error.statusCode) throw error

    // Throw informative 500 error for debugging
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil jadwal mingguan: ${error.message || 'Unknown server error'}`
    })
  }
})
