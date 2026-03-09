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

  // Get public booking list (without user names for privacy)
  // Note: Fetch all matching records, then limit in JavaScript for safety
  const bookings = await allQuery(`
    SELECT
      b.id,
      r.name as room_name,
      r.location as room_location,
      b.event_name,
      DATE(b.start_time) as event_date,
      TIME(b.start_time) as start_time,
      TIME(b.end_time) as end_time,
      b.status,
      b.created_at
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.deleted_at IS NULL
    AND b.status IN ('APPROVED', 'PENDING', 'REJECTED', 'CANCELLED')
    AND DATE(b.start_time) BETWEEN ? AND ?
    ORDER BY b.start_time ASC
  `, params)

  // Apply limit in JavaScript to avoid SQL injection
  const limitedBookings = bookings.slice(0, limit)

  // Format the response
  const formattedBookings = limitedBookings.map((booking: any) => {
    // Ensure event_date is in YYYY-MM-DD format (not ISO timestamp)
    let eventDateStr = booking.event_date
    if (booking.event_date instanceof Date) {
      const year = booking.event_date.getFullYear()
      const month = String(booking.event_date.getMonth() + 1).padStart(2, '0')
      const day = String(booking.event_date.getDate()).padStart(2, '0')
      eventDateStr = `${year}-${month}-${day}`
    } else if (typeof booking.event_date === 'string' && booking.event_date.includes('T')) {
      // If it's ISO format, extract date part only
      eventDateStr = booking.event_date.split('T')[0]
    }
    
    return {
      id: booking.id,
      room_name: booking.room_name,
      room_location: booking.room_location,
      event_name: booking.event_name,
      event_date: eventDateStr,
      start_time: booking.start_time,
      end_time: booking.end_time,
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
