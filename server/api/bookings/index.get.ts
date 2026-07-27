import { allQuery } from '~/server/database/db'
import { verifyToken } from '~/server/utils/auth'

type BookingQueryFeatures = {
    hasRequesterName: boolean
    hasRejectionReason: boolean
    hasCancellationReason: boolean
    hasUserPhone: boolean
    hasRecurrencePattern: boolean
}

const buildBookingsQuery = (canManageAllBookings: boolean, features: BookingQueryFeatures) => {
    const requesterNameSelect = features.hasRequesterName ? 'b.requester_name' : 'NULL as requester_name'
    const rejectionReasonSelect = features.hasRejectionReason ? 'b.rejection_reason' : 'NULL as rejection_reason'
    const cancellationReasonSelect = features.hasCancellationReason ? 'b.cancellation_reason' : 'NULL as cancellation_reason'
    const userPhoneSelect = features.hasUserPhone ? 'u.contact_phone as user_phone' : 'NULL as user_phone'
    const recurrenceSelect = features.hasRecurrencePattern ? 'b.recurrence_pattern, b.parent_booking_id' : 'NULL as recurrence_pattern, NULL as parent_booking_id'

    let sql = `
      SELECT 
        b.id,
        b.room_id,
        b.user_id,
        b.event_name,
        ${requesterNameSelect},
        b.start_time,
        b.end_time,
        b.status,
        ${rejectionReasonSelect},
        ${cancellationReasonSelect},
        ${recurrenceSelect},
        b.created_at,
        b.updated_at,
        r.name as room_name,
        r.location as room_location,
        u.full_name as user_name,
        u.email as user_email,
        ${userPhoneSelect}
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.deleted_at IS NULL
    `

    const params: any[] = []

    if (!canManageAllBookings) {
        sql += ' AND b.user_id = ?'
    }

    sql += ' ORDER BY b.start_time DESC'

    return { sql, params }
}

const getMissingColumnFeature = (error: any): keyof BookingQueryFeatures | null => {
    const message = String(error?.message || '')
    if (!message.includes('Unknown column')) {
        return null
    }

    if (message.includes('requester_name')) {
        return 'hasRequesterName'
    }
    if (message.includes('rejection_reason')) {
        return 'hasRejectionReason'
    }
    if (message.includes('cancellation_reason')) {
        return 'hasCancellationReason'
    }
    if (message.includes('contact_phone')) {
        return 'hasUserPhone'
    }
    if (message.includes('recurrence_pattern') || message.includes('parent_booking_id')) {
        return 'hasRecurrencePattern'
    }

    return null
}

export default defineEventHandler(async (event) => {
    try {
        // Get and verify token
        const authHeader = getHeader(event, 'authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            throw createError({
                statusCode: 401,
                message: 'No token provided'
            })
        }

        const token = authHeader.substring(7)
        const decoded = verifyToken(token)
        const userId = decoded.userId

        console.log('[User Bookings API] Fetching bookings for user:', userId)

        // Get user's role and permissions
        const userRole = await allQuery(
            `SELECT 
        u.id, 
        u.role, 
        u.role_id, 
        u.full_name, 
        u.email,
        r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
            [userId]
        )

        if (!userRole || userRole.length === 0) {
            throw createError({
                statusCode: 404,
                message: 'User not found'
            })
        }

        const user = userRole[0]!
        console.log('[User Bookings API] User info:', {
            id: user.id,
            name: user.full_name,
            role: user.role,
            role_name: user.role_name
        })

        // Get user permissions
        const userPermissions = await allQuery(
            `SELECT p.name 
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = ?`,
            [userId]
        )

        const permissions = userPermissions.map((p: any) => p.name)
        console.log('[User Bookings API] User permissions:', permissions)

        // Regular users only see their own bookings
        // Admins with 'manage_bookings' permission see all bookings
        const canManageAllBookings = permissions.includes('manage_bookings') ||
            permissions.includes('view_bookings') ||
            user.role === 'super_admin'

        const params: any[] = []
        if (!canManageAllBookings) {
            params.push(userId)
            console.log('[User Bookings API] Filtering by user_id:', userId)
        } else {
            console.log('[User Bookings API] User has admin access - showing all bookings')
        }

        const features: BookingQueryFeatures = {
            hasRequesterName: true,
            hasRejectionReason: true,
            hasCancellationReason: true,
            hasUserPhone: true,
            hasRecurrencePattern: true
        }

        let bookings: any[] = []

        while (true) {
            const { sql } = buildBookingsQuery(canManageAllBookings, features)

            console.log('[User Bookings API] Executing SQL:', sql)
            console.log('[User Bookings API] With params:', params)

            try {
                bookings = await allQuery(sql, params)
                break
            } catch (queryError: any) {
                const missingFeature = getMissingColumnFeature(queryError)

                if (!missingFeature || !features[missingFeature]) {
                    throw queryError
                }

                features[missingFeature] = false
                console.warn(`[User Bookings API] Missing legacy column detected, retrying without ${missingFeature}`)
            }
        }

        console.log('[User Bookings API] Found', bookings.length, 'bookings')

        // Log summary by status
        const statusSummary = bookings.reduce((acc: any, b: any) => {
            acc[b.status] = (acc[b.status] || 0) + 1
            return acc
        }, {})
        console.log('[User Bookings API] Status summary:', statusSummary)

        // Format response
        // Helper: normalize DB datetime strings (stored as UTC) by appending 'Z'
        // so that browsers parse them as UTC instead of local time.
        // Without 'Z', new Date("2026-07-10 07:00:00") is treated as local (WIB)
        // causing a 7-hour discrepancy for UTC-stored values.
        const toUTC = (s: any) => s ? String(s).replace(' ', 'T') + 'Z' : null

        const formattedBookings = bookings.map((booking: any) => ({
            id: booking.id,
            room_id: booking.room_id,
            room_name: booking.room_name,
            room_location: booking.room_location,
            event_name: booking.event_name,
            requester_name: booking.requester_name,
            start_time: toUTC(booking.start_time),
            end_time: toUTC(booking.end_time),
            status: booking.status,
            rejection_reason: booking.rejection_reason,
            cancellation_reason: booking.cancellation_reason,
            created_at: toUTC(booking.created_at),
            updated_at: toUTC(booking.updated_at),
            user_name: booking.user_name,
            user_email: booking.user_email,
            user_phone: booking.user_phone,
            is_own_booking: booking.user_id === userId
        }))

        return {
            success: true,
            data: formattedBookings,
            meta: {
                total: formattedBookings.length,
                user_id: userId,
                has_admin_access: canManageAllBookings
            }
        }
    } catch (error: any) {
        console.error('[User Bookings API] Error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch bookings'
        })
    }
})
