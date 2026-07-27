import { runQuery, getQuery, getConnection } from '../database/db'
import { requireAuth } from '../utils/auth'
import { getHeader } from 'h3'
import { sendBookingCreatedEmail } from '../utils/email'

const isMissingColumnError = (error: any, columnName: string) => {
  const message = String(error?.message || '')
  return message.includes('Unknown column') && message.includes(columnName)
}

export default defineEventHandler(async (event) => {
  try {
    console.log('[CREATE BOOKING] Starting...')

    const authHeader = getHeader(event, 'authorization')
    console.log('[CREATE BOOKING] Auth header:', authHeader ? 'exists' : 'missing')

    const decoded = requireAuth(event)
    console.log('[CREATE BOOKING] Decoded token:', decoded)

    const userId = decoded.userId

    const body = await readBody(event)
    const { room_id, event_name, requester_name, start_time, end_time } = body

    console.log('[CREATE BOOKING] Request:', { userId, room_id, event_name, requester_name, start_time, end_time })

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
    const user = await getQuery('SELECT full_name, role, user_category, role_id FROM users WHERE id = ?', [userId]) as any

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
      ((user.role_id || 0) > 0)

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

      // Normalize + alias category names so code-style and display-style values match.
      const normalizeCategory = (cat: string): string => {
        return String(cat || '')
          .toLowerCase()
          .trim()
          .replace(/[_-]+/g, ' ')
          .replace(/\s+/g, ' ')
      }

      const categoryAliasMap: Record<string, string[]> = {
        wilayah: ['wilayah', 'region'],
        lingkungan: ['lingkungan'],
        kategorial: ['kategorial', 'categorical group', 'categorical_group'],
        komunitas: ['komunitas', 'community'],
        seksi: ['seksi', 'section'],
        // BGKP (Badan Gereja Katolik Paroki) is grouped with DPP — both are parish-level bodies
        // so BGKP users get access to the same rooms that allow "Dewan Pastoral Paroki"
        dewan: ['dewan pastoral paroki', 'dewan paroki pastoral', 'dewan paroki', 'dpp', 'parish council', 'parish_council', 'badan gereja katolik paroki', 'bgkp']
      }

      const canonicalizeCategory = (raw: string): string => {
        const normalized = normalizeCategory(raw)
        for (const [canonical, aliases] of Object.entries(categoryAliasMap)) {
          if (aliases.some((alias) => normalized.includes(alias))) {
            return canonical
          }
        }
        return normalized
      }

      const userCategoryRaw = String(user.user_category || '')
      const userCategoryCanonical = canonicalizeCategory(userCategoryRaw)
      const allowedCanonical = allowedCategories.map((c: string) => canonicalizeCategory(String(c)))

      // Keep partial fallback for uncommon labels not yet in alias map.
      const hasExactMatch = allowedCanonical.includes(userCategoryCanonical)
      const userNormalized = normalizeCategory(userCategoryRaw)
      const hasPartialMatch = allowedCategories.some((allowedCat: string) => {
        const allowed = normalizeCategory(String(allowedCat))
        return allowed.includes(userNormalized) || userNormalized.includes(allowed)
      })

      const hasAccess = hasExactMatch || hasPartialMatch

      console.log('[CREATE BOOKING] Category match:', {
        userCategoryCanonical,
        allowedCanonical,
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

    // ── Cek kuota pemesanan bulanan per user ──────────────────────────────────
    // DPP (PARISH_COUNCIL) dan BGKP (CATEGORICAL_GROUP) tidak terkena batas.
    // User lain dibatasi MAX_MONTHLY_BOOKINGS per bulan kalender.
    const UNLIMITED_CATEGORIES = ['PARISH_COUNCIL', 'CATEGORICAL_GROUP']
    const MAX_MONTHLY_BOOKINGS = 3

    const userCategoryRaw = String(user.user_category || '').toUpperCase()
    const isUnlimited = UNLIMITED_CATEGORIES.includes(userCategoryRaw)

    if (!isUnlimited) {
      // Hitung pemesanan bulan ini (UTC boundaries)
      const now = new Date()
      const firstDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))
        .toISOString().slice(0, 19).replace('T', ' ')
      const lastDay  = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59))
        .toISOString().slice(0, 19).replace('T', ' ')

      const quotaResult = await getQuery(`
        SELECT COUNT(*) AS count
        FROM bookings
        WHERE user_id = ?
          AND status IN ('PENDING', 'APPROVED')
          AND start_time >= ?
          AND start_time <= ?
          AND deleted_at IS NULL
      `, [userId, firstDay, lastDay]) as any

      const monthlyCount = Number(quotaResult?.count ?? 0)

      if (monthlyCount >= MAX_MONTHLY_BOOKINGS) {
        const monthLabel = now.toLocaleDateString('id-ID', {
          month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
        })
        throw createError({
          statusCode: 429,
          statusMessage: `Anda sudah memiliki ${monthlyCount} pemesanan di bulan ${monthLabel}. ` +
            `Maksimal ${MAX_MONTHLY_BOOKINGS} pemesanan per bulan untuk kategori Anda.`
        })
      }

      console.log('[CREATE BOOKING] Monthly quota check passed:', { monthlyCount, max: MAX_MONTHLY_BOOKINGS })
    } else {
      console.log('[CREATE BOOKING] Quota check skipped — unlimited category:', userCategoryRaw)
    }

    // Serialize booking creation per room to prevent race-condition double booking.
    const lockName = `booking_room_${room_id}`
    const connection = await getConnection()
    let lockAcquired = false


    try {
      const [lockRows] = await connection.query('SELECT GET_LOCK(?, 10) AS locked', [lockName]) as any
      const lockStatus = lockRows?.[0]?.locked

      if (lockStatus !== 1) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Sistem sedang memproses pemesanan ruangan ini. Silakan coba lagi.'
        })
      }

      lockAcquired = true

      const [conflicts] = await connection.query(`
        SELECT 
          b.id,
          b.event_name,
          b.start_time,
          b.end_time,
          b.status,
          u.full_name
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        WHERE b.room_id = ? 
        AND b.status IN ('APPROVED', 'PENDING')
        AND NOT (b.end_time <= ? OR b.start_time >= ?)
      `, [room_id, mysqlStart, mysqlEnd]) as any

      console.log('[CREATE BOOKING] Conflict check result:', conflicts)

      if (conflicts && conflicts.length > 0) {
        const conflictInfo = conflicts[0]
        console.log('[CREATE BOOKING] Conflict found:', conflictInfo)

        // Format waktu ke WIB (UTC+7) agar sesuai tampilan frontend
        const formatWIBTime = (dt: Date | string) => {
          const d = dt instanceof Date ? dt : new Date(dt as string)
          return d.toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit',
            timeZone: 'Asia/Jakarta', hour12: false
          }).replace(':', '.')
        }
        const startFormatted = formatWIBTime(conflictInfo.start_time)
        const endFormatted = formatWIBTime(conflictInfo.end_time)

        const statusText = conflictInfo.status === 'PENDING' ? 'sedang menunggu persetujuan' : 'sudah disetujui'
        throw createError({
          statusCode: 409,
          statusMessage: `Ruangan sudah dipesan oleh ${conflictInfo.full_name} dari pukul ${startFormatted} - ${endFormatted} (${statusText}). Silakan pilih waktu lain.`
        })
      }

      console.log('[CREATE BOOKING] No conflicts found, proceeding with booking...')

      // Determine status based on room settings
      const status = room.requires_approval ? 'PENDING' : 'APPROVED'

      // Insert booking
      const normalizedRequesterName = String(requester_name || '').trim() || String(user.full_name || '').trim()

      let result: any

      try {
        const [insertResult] = await connection.query(`
          INSERT INTO bookings (room_id, user_id, event_name, requester_name, start_time, end_time, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [room_id, userId, event_name, normalizedRequesterName, mysqlStart, mysqlEnd, status]) as any
        result = insertResult
      } catch (insertError: any) {
        if (!isMissingColumnError(insertError, 'requester_name')) {
          throw insertError
        }

        console.warn('[CREATE BOOKING] requester_name column missing, retrying legacy insert')

        const [legacyInsertResult] = await connection.query(`
          INSERT INTO bookings (room_id, user_id, event_name, start_time, end_time, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [room_id, userId, event_name, mysqlStart, mysqlEnd, status]) as any
        result = legacyInsertResult
      }

      console.log('[CREATE BOOKING] Success:', { insertId: result.insertId, status })

      // ── Fire-and-forget: Notifikasi email ke admin jika status PENDING ───────────
      if (status === 'PENDING') {
        const adminEmail = process.env.ADMIN_BOOKING_EMAIL ||
          process.env.SECURITY_ALERT_EMAIL ||
          process.env.RESEND_FROM

        if (adminEmail) {
          setImmediate(async () => {
            try {
              const toUTCStr = (s: any) =>
                s ? String(s).replace(' ', 'T') + (String(s).endsWith('Z') ? '' : 'Z') : null

              const fmtTime = (raw: any) => new Date(toUTCStr(raw) as string)
                .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false })
                .replace(':', '.')

              const fmtDate = (raw: any) => new Date(toUTCStr(raw) as string)
                .toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' })

              await sendBookingCreatedEmail({
                adminEmail,
                requesterName: normalizedRequesterName,
                eventName: event_name,
                roomName: room.name,
                startFormatted: fmtTime(mysqlStart),
                endFormatted: fmtTime(mysqlEnd),
                dateFormatted: fmtDate(mysqlStart),
                bookingId: result.insertId
              })
            } catch (emailErr) {
              console.error('[CREATE BOOKING] Admin email notification failed (non-critical):', emailErr)
            }
          })
        }
      }

      return {
        id: result.insertId,
        message: status === 'APPROVED' ? 'Pemesanan berhasil' : 'Pemesanan menunggu persetujuan admin'
      }
    } finally {
      if (lockAcquired) {
        try {
          await connection.query('SELECT RELEASE_LOCK(?)', [lockName])
        } catch (releaseError) {
          console.warn('[CREATE BOOKING] Failed to release DB lock:', releaseError)
        }
      }

      connection.release()
    }
  } catch (error: any) {
    console.error('[CREATE BOOKING] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Terjadi kesalahan saat membuat booking'
    })
  }
})
