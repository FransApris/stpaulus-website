import { runQuery, getQuery } from '../database/db'
import { requireAuth } from '../utils/auth'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    console.log('[CREATE BOOKING] Starting...')

    const authHeader = getHeader(event, 'authorization')
    console.log('[CREATE BOOKING] Auth header:', authHeader ? 'exists' : 'missing')

    const decoded = requireAuth(event)
    console.log('[CREATE BOOKING] Decoded token:', decoded)

    const userId = decoded.userId

    const body = await readBody(event)
    const { room_id, event_name, start_time, end_time } = body

    console.log('[CREATE BOOKING] Request:', { userId, room_id, event_name, start_time, end_time })

    if (!room_id || !event_name || !start_time || !end_time) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Semua field diperlukan'
      })
    }

    // Validate dates
    const start = new Date(start_time)
    const end = new Date(end_time)

    if (start >= end) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Waktu mulai harus sebelum waktu selesai'
      })
    }

    if (start < new Date()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tidak dapat memesan untuk waktu yang sudah lewat'
      })
    }

    // Convert to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
    const mysqlStart = start.toISOString().slice(0, 19).replace('T', ' ')
    const mysqlEnd = end.toISOString().slice(0, 19).replace('T', ' ')

    // Check if room exists and is active
    const room = await getQuery('SELECT * FROM rooms WHERE id = ? AND is_active = 1', [room_id]) as any
    if (!room) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ruangan tidak ditemukan'
      })
    }

    // Check user permissions for the room
    const user = await getQuery('SELECT user_category, role, role_id FROM users WHERE id = ?', [userId]) as any

    console.log('[CREATE BOOKING] User details:', {
      id: userId,
      user_category: user.user_category,
      role: user.role,
      role_id: user.role_id
    })
    console.log('[CREATE BOOKING] Room allowed_categories:', room.allowed_categories)

    // Admin users should NOT use public booking - they manage bookings via admin panel
    const isAdmin = user.role === 'super_admin' ||
      user.role === 'admin_komsos' ||
      user.role === 'admin_sekretariat' ||
      user.role_id !== null

    if (isAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin tidak dapat membuat booking melalui halaman public. Gunakan Admin Panel untuk mengelola booking.'
      })
    }

    // Regular users must have appropriate user_category
    console.log('[CREATE BOOKING] User is regular user, checking category permissions...')

    if (room.allowed_categories && user.user_category) {
      let allowedCategories = []
      try {
        // Try to parse as JSON array
        allowedCategories = typeof room.allowed_categories === 'string'
          ? JSON.parse(room.allowed_categories)
          : room.allowed_categories
      } catch (e) {
        // If not JSON, treat as comma-separated string
        allowedCategories = typeof room.allowed_categories === 'string'
          ? room.allowed_categories.split(',').map((c: string) => c.trim())
          : [room.allowed_categories]
      }

      if (!Array.isArray(allowedCategories)) {
        allowedCategories = [allowedCategories]
      }

      console.log('[CREATE BOOKING] Parsed allowed categories:', allowedCategories)
      console.log('[CREATE BOOKING] User category:', user.user_category)

      // Normalize category names for comparison
      const normalizeCategory = (cat: string): string => {
        return cat.toLowerCase().trim()
          .replace(/\s+/g, ' ')  // normalize spaces
          .replace(/pastoral\s*/i, '')  // remove "pastoral" variations
          .replace(/dewan\s+paroki/i, 'dewanparoki')  // normalize "dewan paroki"
      }

      // Case-insensitive + partial matching for category access
      const userCategoryNormalized = normalizeCategory(user.user_category)
      const allowedCategoriesNormalized = allowedCategories.map((c: string) => normalizeCategory(c))
      
      // Check exact match first, then partial match
      const hasExactMatch = allowedCategoriesNormalized.includes(userCategoryNormalized)
      const hasPartialMatch = allowedCategories.some((allowedCat: string) => {
        const allowed = allowedCat.toLowerCase().trim()
        const userCat = user.user_category.toLowerCase().trim()
        // Check if either string contains the other (for cases like "Dewan Paroki" vs "Dewan Pastoral Paroki")
        return allowed.includes(userCat) || userCat.includes(allowed)
      })
      
      const hasAccess = hasExactMatch || hasPartialMatch

      console.log('[CREATE BOOKING] Category match:', {
        exactMatch: hasExactMatch,
        partialMatch: hasPartialMatch,
        hasAccess
      })

      if (!hasAccess) {
        throw createError({
          statusCode: 403,
          statusMessage: `Anda tidak memiliki akses ke ruangan ini. Ruangan ini hanya untuk: ${allowedCategories.join(', ')}`
        })
      }
    } else if (room.allowed_categories && !user.user_category) {
      // User doesn't have user_category but room requires specific categories
      console.log('[CREATE BOOKING] User has no category but room requires categories')
      throw createError({
        statusCode: 403,
        statusMessage: 'Anda tidak memiliki akses ke ruangan ini'
      })
    } else if (!room.allowed_categories) {
      console.log('[CREATE BOOKING] Room has no category restrictions, allowing booking')
      // Room has no restrictions, allow booking
    }

    // Check for booking conflicts - check both APPROVED and PENDING bookings
    const conflictResult = await runQuery(`
      SELECT 
        b.id,
        b.event_name,
        DATE_FORMAT(b.start_time, '%H:%i') as start_time_formatted,
        DATE_FORMAT(b.end_time, '%H:%i') as end_time_formatted,
        b.status,
        u.full_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.room_id = ? 
      AND b.status IN ('APPROVED', 'PENDING')
      AND NOT (b.end_time <= ? OR b.start_time >= ?)
    `, [room_id, mysqlStart, mysqlEnd]) as any

    // runQuery returns rows directly (already unwrapped)
    const conflicts = conflictResult

    console.log('[CREATE BOOKING] Conflict check result:', conflicts)

    if (conflicts && conflicts.length > 0) {
      const conflictInfo = conflicts[0]
      console.log('[CREATE BOOKING] Conflict found:', conflictInfo)

      const statusText = conflictInfo.status === 'PENDING' ? 'sedang menunggu persetujuan' : 'sudah disetujui'
      throw createError({
        statusCode: 409,
        statusMessage: `Ruangan sudah dipesan oleh ${conflictInfo.full_name} dari pukul ${conflictInfo.start_time_formatted} - ${conflictInfo.end_time_formatted} (${statusText}). Silakan pilih waktu lain.`
      })
    }

    console.log('[CREATE BOOKING] No conflicts found, proceeding with booking...')

    // Determine status based on room settings
    const status = room.requires_approval ? 'PENDING' : 'APPROVED'

    // Insert booking
    const result = await runQuery(`
      INSERT INTO bookings (room_id, user_id, event_name, start_time, end_time, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [room_id, userId, event_name, mysqlStart, mysqlEnd, status]) as any

    console.log('[CREATE BOOKING] Success:', { insertId: result.insertId, status })

    return {
      id: result.insertId,
      message: status === 'APPROVED' ? 'Pemesanan berhasil' : 'Pemesanan menunggu persetujuan admin'
    }
  } catch (error: any) {
    console.error('[CREATE BOOKING] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Terjadi kesalahan saat membuat booking'
    })
  }
})
