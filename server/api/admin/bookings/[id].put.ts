import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_bookings')(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      })
    }

    const body = await readBody(event)
    const { status } = body

    // Validate status
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status must be APPROVED or REJECTED'
      })
    }

    // Check if booking exists
    const existingBooking = await getQuery('SELECT id FROM bookings WHERE id = ?', [id])
    if (!existingBooking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found'
      })
    }

    // Update booking status
    const sql = `
      UPDATE bookings
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `
    const params = [status, id]

    const result = await runQuery(sql, params)

    // Verify update was successful
    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found or no changes made'
      })
    }

    return {
      message: 'Booking status updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating booking status:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
