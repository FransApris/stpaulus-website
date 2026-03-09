import { runQuery, getQuery as dbGetQuery } from '../../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../../utils/auth'
import { createAuditLog, getClientInfo, AuditAction } from '../../../utils/audit'
import * as XLSX from 'xlsx'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const userId = decoded.userId

    // Check permissions
    const user = await dbGetQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    const permissions = await getUserPermissions(user)
    event.context.auth = {
      userId: userId,
      permissions: permissions
    }

    // Require admin permissions
    requirePermission('manage_bookings')(event)

    // Get query parameters
    const queryParams = getQuery(event)
    const format = (queryParams.format as string) || 'xlsx'
    const startDate = queryParams.startDate as string
    const endDate = queryParams.endDate as string
    const status = queryParams.status as string
    const includeDeleted = queryParams.includeDeleted === 'true'

    // Build WHERE clause
    const whereConditions = []
    const sqlParams: any[] = []

    if (!includeDeleted) {
      whereConditions.push('b.deleted_at IS NULL')
    }

    if (startDate) {
      whereConditions.push('DATE(b.start_time) >= ?')
      sqlParams.push(startDate)
    }

    if (endDate) {
      whereConditions.push('DATE(b.start_time) <= ?')
      sqlParams.push(endDate)
    }

    if (status) {
      whereConditions.push('b.status = ?')
      sqlParams.push(status)
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : ''

    // Fetch bookings data
    const result = await runQuery(`
      SELECT 
        b.id,
        b.event_name,
        r.name as room_name,
        r.location as room_location,
        u.full_name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        c.name as category_name,
        c.unit as category_unit,
        DATE_FORMAT(b.start_time, '%d/%m/%Y') as date,
        DATE_FORMAT(b.start_time, '%H:%i') as start_time,
        DATE_FORMAT(b.end_time, '%H:%i') as end_time,
        b.status,
        b.rejection_reason,
        b.cancellation_reason,
        DATE_FORMAT(b.created_at, '%d/%m/%Y %H:%i') as created_at,
        DATE_FORMAT(b.updated_at, '%d/%m/%Y %H:%i') as updated_at,
        DATE_FORMAT(b.deleted_at, '%d/%m/%Y %H:%i') as deleted_at,
        deleter.full_name as deleted_by_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN user_categories c ON u.user_category = c.name
      LEFT JOIN users deleter ON b.deleted_by = deleter.id
      ${whereClause}
      ORDER BY b.created_at DESC
    `, sqlParams) as any

    // runQuery returns rows directly (already unwrapped)
    const bookings = result

    if (!bookings || bookings.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No booking data found for export'
      })
    }

    // Format data for export
    const exportData = bookings.map((booking: any) => ({
      'ID': booking.id,
      'Nama Acara': booking.event_name,
      'Ruangan': booking.room_name,
      'Lokasi': booking.room_location,
      'Pemesan': booking.user_name,
      'Email': booking.user_email,
      'Telepon': booking.user_phone || '-',
      'Kategori': booking.category_name || '-',
      'Unit': booking.category_unit || '-',
      'Tanggal': booking.date,
      'Waktu Mulai': booking.start_time,
      'Waktu Selesai': booking.end_time,
      'Status': booking.status,
      'Alasan Penolakan': booking.rejection_reason || '-',
      'Alasan Pembatalan': booking.cancellation_reason || '-',
      'Dibuat': booking.created_at,
      'Diupdate': booking.updated_at || '-',
      'Dihapus': booking.deleted_at || '-',
      'Dihapus Oleh': booking.deleted_by_name || '-'
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const colWidths = [
      { wch: 5 },  // ID
      { wch: 30 }, // Nama Acara
      { wch: 20 }, // Ruangan
      { wch: 20 }, // Lokasi
      { wch: 25 }, // Pemesan
      { wch: 30 }, // Email
      { wch: 15 }, // Telepon
      { wch: 15 }, // Kategori
      { wch: 20 }, // Unit
      { wch: 12 }, // Tanggal
      { wch: 10 }, // Waktu Mulai
      { wch: 10 }, // Waktu Selesai
      { wch: 12 }, // Status
      { wch: 30 }, // Alasan Penolakan
      { wch: 30 }, // Alasan Pembatalan
      { wch: 18 }, // Dibuat
      { wch: 18 }, // Diupdate
      { wch: 18 }, // Dihapus
      { wch: 25 }  // Dihapus Oleh
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Pemesanan Ruangan')

    // Generate Excel file
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    // Log export activity to audit trail
    const { ipAddress, userAgent } = getClientInfo(event)
    await createAuditLog({
      userId,
      action: AuditAction.EXPORT,
      entityType: 'booking',
      entityId: 0, // No specific booking
      newValue: {
        count: bookings.length,
        filters: { startDate, endDate, status, includeDeleted }
      },
      ipAddress,
      userAgent
    })

    // Set response headers
    const filename = `Pemesanan_Ruangan_${new Date().toISOString().split('T')[0]}.xlsx`
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)

    console.log('[EXPORT] Exported bookings:', {
      count: bookings.length,
      filename,
      userId
    })

    return buffer
  } catch (error: any) {
    console.error('[EXPORT] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to export bookings'
    })
  }
})
