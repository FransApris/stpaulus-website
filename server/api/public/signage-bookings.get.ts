import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  // Public Endpoint: No authentication required
  // Data Privacy: Only fetches event_name, room_name, and time. No user personal data.

  // 1. Define date range (yesterday to 14 days in future)
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - 1) // include past days for events crossing midnight
  const endDate = new Date(now)
  endDate.setDate(now.getDate() + 14)

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  console.log('[Public Signage API] Date range:', { start: startDateStr, end: endDateStr })

  // 2. Query only safe columns, hardcode status to APPROVED
  const query = `
    SELECT
      b.id,
      b.event_name,
      b.start_time,
      b.end_time,
      b.status,
      r.name as room_name,
      r.location
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.deleted_at IS NULL
      AND r.is_active = 1
      AND b.status = 'APPROVED'
      AND DATE(b.start_time) BETWEEN ? AND ?
    ORDER BY b.start_time ASC
  `

  const params = [startDateStr, endDateStr]
  
  try {
    const rawBookings = await allQuery(query, params)
    
    // Normalize datetime strings to UTC by appending 'Z'
    // MySQL with dateStrings:true returns "YYYY-MM-DD HH:MM:SS" without TZ
    const toUTC = (s: any) => (s ? String(s).replace(' ', 'T') + 'Z' : null)

    const bookings = rawBookings.map((b: any) => ({
      ...b,
      start_time: toUTC(b.start_time),
      end_time:   toUTC(b.end_time),
    }))

    console.log(`[Public Signage API] Found ${bookings.length} approved bookings`)

    return {
      success: true,
      bookings: bookings,
      meta: {
        date_range: { start: startDateStr, end: endDateStr },
        total: bookings.length,
        is_public: true
      }
    }
  } catch (error: any) {
    console.error('[Public Signage API] Error fetching public bookings:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch public signage data'
    })
  }
})
