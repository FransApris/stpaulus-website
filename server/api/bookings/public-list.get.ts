import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  // Get query parameters for filtering
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 100 // Default limit 100 untuk menampilkan lebih banyak data
  const days = parseInt(query.days as string) || 90 // Show bookings for next 90 days (increased from 30)

  // Calculate date range
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - 30) // Include past 30 days (increased from 7)
  const endDate = new Date(now)
  endDate.setDate(now.getDate() + days) // Include next X days

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  // Only use placeholders for WHERE conditions
  const params = [startDateStr, endDateStr]

  const runPublicBookingsQuery = async () => {
    try {
      return await allQuery(`
        SELECT
          b.id,
          r.name as room_name,
          r.location as room_location,
          b.event_name,
          b.requester_name,
          u.username,
          u.full_name as user_name,
          b.start_time,
          b.end_time,
          b.status,
          b.created_at
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.deleted_at IS NULL
        AND b.status IN ('APPROVED', 'PENDING', 'REJECTED', 'CANCELLED')
        AND DATE(b.start_time) BETWEEN ? AND ?
        ORDER BY b.start_time ASC
      `, params)
    } catch (error: any) {
      const message = String(error?.message || '')
      const isMissingRequesterName = message.includes('Unknown column') && message.includes('requester_name')

      if (!isMissingRequesterName) {
        throw error
      }

      console.warn('[Public Bookings API] requester_name column missing, using legacy fallback query')

      return await allQuery(`
        SELECT
          b.id,
          r.name as room_name,
          r.location as room_location,
          b.event_name,
          NULL as requester_name,
          u.username,
          u.full_name as user_name,
          b.start_time,
          b.end_time,
          b.status,
          b.created_at
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.deleted_at IS NULL
        AND b.status IN ('APPROVED', 'PENDING', 'REJECTED', 'CANCELLED')
        AND DATE(b.start_time) BETWEEN ? AND ?
        ORDER BY b.start_time ASC
      `, params)
    }
  }

  // Get public booking list and include requester identity fields for display.
  // Falls back cleanly if production schema is behind.
  const bookings = await runPublicBookingsQuery()

  // Apply limit in JavaScript to avoid SQL injection
  const limitedBookings = bookings.slice(0, limit)

  // Helper: normalize DB datetime strings (stored as UTC) by appending 'Z'
  // so that browsers parse them as UTC instead of local time.
  // This is consistent with how booking.vue and index.get.ts process datetime values.
  const toUTC = (s: any) => s ? String(s).replace(' ', 'T') + 'Z' : null

  // Format the response
  const formattedBookings = limitedBookings.map((booking: any) => {
    const startTimeUTC = toUTC(booking.start_time)
    const endTimeUTC = toUTC(booking.end_time)

    // Extract date part in Jakarta timezone for display
    let eventDateStr = ''
    if (startTimeUTC) {
      const startDate = new Date(startTimeUTC)
      // Format as YYYY-MM-DD in WIB (Asia/Jakarta = UTC+7)
      const dateInJakarta = startDate.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' })
      eventDateStr = dateInJakarta
    }

    // Extract time strings in Jakarta timezone for display
    let startTimeStr = ''
    let endTimeStr = ''
    if (startTimeUTC) {
      startTimeStr = new Date(startTimeUTC).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      }).replace('.', ':')
    }
    if (endTimeUTC) {
      endTimeStr = new Date(endTimeUTC).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      }).replace('.', ':')
    }

    return {
      id: booking.id,
      room_name: booking.room_name,
      room_location: booking.room_location,
      event_name: booking.event_name,
      requester_name: booking.requester_name,
      username: booking.username,
      user_name: booking.user_name,
      event_date: eventDateStr,
      start_time: startTimeStr,
      end_time: endTimeStr,
      // Also include full UTC ISO strings for accurate client-side filtering
      start_time_utc: startTimeUTC,
      end_time_utc: endTimeUTC,
      status: booking.status,
      created_at: booking.created_at
    }
  })

  return {
    bookings: formattedBookings,
    date_range: {
      start: startDateStr,
      end: endDateStr
    },
    total: formattedBookings.length
  }
})
