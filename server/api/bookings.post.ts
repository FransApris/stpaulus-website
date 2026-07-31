import { runQuery, getQuery, getConnection } from '../database/db'
import { requireAuth } from '../utils/auth'
import { getHeader } from 'h3'
import { sendBookingCreatedEmail, sendBookingApprovedEmail } from '../utils/email'

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
    const { room_id, event_name, requester_name, start_time, end_time, is_recurring, recurrence_pattern, repeat_until } = body

    console.log('[CREATE BOOKING] Request:', { userId, room_id, event_name, requester_name, start_time, end_time, is_recurring, recurrence_pattern, repeat_until })

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

      const userCategoryForRoom = String(user.user_category || '')
      const userCategoryCanonical = canonicalizeCategory(userCategoryForRoom)
      const allowedCanonical = allowedCategories.map((c: string) => canonicalizeCategory(String(c)))

      // Keep partial fallback for uncommon labels not yet in alias map.
      const hasExactMatch = allowedCanonical.includes(userCategoryCanonical)
      const userNormalized = normalizeCategory(userCategoryForRoom)
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
    const UNLIMITED_CATEGORIES = [
      'PARISH_COUNCIL', 
      'CATEGORICAL_GROUP',
      'DEWAN PASTORAL PAROKI',
      'BADAN GEREJA KATOLIK PAROKI',
      'DPP',
      'BGKP'
    ]
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

      // ── Bug #3B fix: hitung occurrence yang AKAN dibuat ──────────────────
      // Estimasi jumlah occurrence dari form (sebelum insert) agar kuota
      // tidak bisa di-bypass dengan recurring booking.
      let estimatedNewOccurrences = 1
      if (is_recurring && recurrence_pattern && repeat_until) {
        const untilDate = new Date(`${repeat_until}T23:59:59`)
        let tempStart = new Date(start)
        let count = 1
        while (count < 20) {
          if (recurrence_pattern === 'WEEKLY')      tempStart.setDate(tempStart.getDate() + 7)
          else if (recurrence_pattern === 'BIWEEKLY') tempStart.setDate(tempStart.getDate() + 14)
          else if (recurrence_pattern === 'MONTHLY')  tempStart.setMonth(tempStart.getMonth() + 1)
          else break
          if (tempStart > untilDate) break
          count++
        }
        estimatedNewOccurrences = count
      }

      if (monthlyCount + estimatedNewOccurrences > MAX_MONTHLY_BOOKINGS) {
        const monthLabel = now.toLocaleDateString('id-ID', {
          month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
        })
        throw createError({
          statusCode: 429,
          statusMessage: `Kuota bulan ${monthLabel} tidak mencukupi. ` +
            `Saat ini: ${monthlyCount} pemesanan, akan ditambah: ${estimatedNewOccurrences}. ` +
            `Maksimal ${MAX_MONTHLY_BOOKINGS} per bulan untuk kategori Anda.`
        })
      }

      console.log('[CREATE BOOKING] Monthly quota check passed:', { monthlyCount, estimatedNewOccurrences, max: MAX_MONTHLY_BOOKINGS })
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

      // Calculate occurrences if recurring requested
      const occurrences: { start: string; end: string }[] = [{ start: mysqlStart, end: mysqlEnd }]

      if (is_recurring && recurrence_pattern && repeat_until) {
        // ── Bug #5A fix: validasi maksimum 90 hari ke depan ─────────────────
        const untilDate = new Date(`${repeat_until}T23:59:59`)
        const maxFutureDate = new Date(start)
        maxFutureDate.setDate(maxFutureDate.getDate() + 90)
        if (untilDate > maxFutureDate) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Batas pemesanan berulang maksimal 90 hari (3 bulan) ke depan dari tanggal pertama.'
          })
        }

        const durationMs = end.getTime() - start.getTime()
        let currStart = new Date(start)

        while (true) {
          if (recurrence_pattern === 'WEEKLY') {
            currStart.setDate(currStart.getDate() + 7)
          } else if (recurrence_pattern === 'BIWEEKLY') {
            currStart.setDate(currStart.getDate() + 14)
          } else if (recurrence_pattern === 'MONTHLY') {
            currStart.setMonth(currStart.getMonth() + 1)
          } else {
            break
          }

          if (currStart > untilDate) break
          if (occurrences.length >= 20) break // Safety cap max 20 occurrences

          const currEnd = new Date(currStart.getTime() + durationMs)
          occurrences.push({
            start: currStart.toISOString().slice(0, 19).replace('T', ' '),
            end: currEnd.toISOString().slice(0, 19).replace('T', ' ')
          })
        }
      }

      console.log('[CREATE BOOKING] Generated occurrences count:', occurrences.length)

      // Check conflicts for ALL occurrences
      for (const occ of occurrences) {
        const [conflicts] = await connection.query(`
          SELECT b.id, b.event_name, b.start_time, b.end_time, b.status, u.full_name
          FROM bookings b
          JOIN users u ON b.user_id = u.id
          WHERE b.room_id = ? 
            AND b.deleted_at IS NULL
            AND b.status IN ('APPROVED', 'PENDING')
            AND NOT (b.end_time <= ? OR b.start_time >= ?)
          LIMIT 1
        `, [room_id, occ.start, occ.end]) as any[]

        if (conflicts && conflicts.length > 0) {
          const conflictInfo = conflicts[0]
          const formatWIBTime = (dt: Date | string) => {
            const d = dt instanceof Date ? dt : new Date(dt as string)
            return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false }).replace(':', '.')
          }
          const startFormatted = formatWIBTime(conflictInfo.start_time)
          const endFormatted = formatWIBTime(conflictInfo.end_time)
          const conflictDateStr = occ.start.slice(0, 10)

          throw createError({
            statusCode: 409,
            statusMessage: `Konflik jadwal pada ${conflictDateStr}: Ruangan dipesan oleh ${conflictInfo.full_name} (${startFormatted} - ${endFormatted}).`
          })
        }
      }

      console.log('[CREATE BOOKING] No conflicts found across occurrences, creating entries...')

      // Determine status based on room settings
      const status = room.requires_approval ? 'PENDING' : 'APPROVED'
      const normalizedRequesterName = String(requester_name || '').trim() || String(user.full_name || '').trim()
      const recPattern = is_recurring ? (recurrence_pattern || 'WEEKLY') : null

      let firstInsertId: number | null = null

      for (const [i, occ] of occurrences.entries()) {
        const parentId = i === 0 ? null : firstInsertId

        let result: any
        try {
          const [insertResult] = await connection.query(`
            INSERT INTO bookings (room_id, user_id, event_name, requester_name, start_time, end_time, status, parent_booking_id, recurrence_pattern)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [room_id, userId, event_name, normalizedRequesterName, occ.start, occ.end, status, parentId, recPattern]) as any
          result = insertResult
        } catch (insertError: any) {
          const [legacyInsertResult] = await connection.query(`
            INSERT INTO bookings (room_id, user_id, event_name, start_time, end_time, status)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [room_id, userId, event_name, occ.start, occ.end, status]) as any
          result = legacyInsertResult
        }

        if (i === 0) {
          firstInsertId = result.insertId
        }
      }

      console.log('[CREATE BOOKING] Success:', { insertId: firstInsertId, occurrencesCount: occurrences.length, status })

      // ── Fire-and-forget: Notifikasi email ──────────────────────────────────
      setImmediate(async () => {
        try {
          const toUTCStr = (s: any) =>
            s ? String(s).replace(' ', 'T') + (String(s).endsWith('Z') ? '' : 'Z') : null

          const fmtTime = (raw: any) => new Date(toUTCStr(raw) as string)
            .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false })
            .replace(':', '.')

          const fmtDate = (raw: any) => new Date(toUTCStr(raw) as string)
            .toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' })

          const emailCommon = {
            eventName: event_name,
            roomName: room.name,
            startFormatted: fmtTime(mysqlStart),
            endFormatted: fmtTime(mysqlEnd),
            dateFormatted: fmtDate(mysqlStart)
          }

          // ── Bug #1A fix: kirim email ke pemesan juga ──────────────────────
          const userEmail = await getQuery('SELECT email, full_name FROM users WHERE id = ?', [userId]) as any
          if (userEmail?.email) {
            if (status === 'APPROVED') {
              // Auto-approved (room tanpa persetujuan) — langsung konfirmasi
              await sendBookingApprovedEmail({
                to: userEmail.email,
                fullName: userEmail.full_name || normalizedRequesterName,
                ...emailCommon
              })
            } else {
              // PENDING — beri tahu pemesan bahwa booking diterima & menunggu review
              const { Resend } = await import('resend')
              const resendKey = process.env.RESEND_API_KEY
              const fromEmail = process.env.RESEND_FROM || 'noreply@stpaulusjuanda.org'
              if (resendKey) {
                const resend = new Resend(resendKey)
                await resend.emails.send({
                  from: `Paroki St. Paulus - Juanda <${fromEmail}>`,
                  to: userEmail.email,
                  subject: `📋 Pemesanan Diterima — Menunggu Persetujuan: "${event_name}"`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px;">
                      <div style="background: #882f1d; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 20px;">Paroki Santo Paulus Juanda</h1>
                      </div>
                      <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
                        <h2 style="color: #1f2937;">Halo, ${userEmail.full_name || normalizedRequesterName}!</h2>
                        <p style="color: #374151;">Pemesanan ruangan Anda telah <strong>diterima</strong> dan sedang menunggu persetujuan admin paroki.</p>
                        <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 20px; margin: 20px 0;">
                          <p style="margin: 0 0 12px 0; color: #713f12; font-weight: bold;">⏳ Menunggu Persetujuan Admin</p>
                          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #713f12;">
                            <tr><td style="padding: 5px 0; font-weight: bold; width: 120px;">Nama Acara</td><td>${event_name}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold;">Ruangan</td><td>${room.name}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold;">Tanggal</td><td>${fmtDate(mysqlStart)}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold;">Waktu</td><td>${fmtTime(mysqlStart)} – ${fmtTime(mysqlEnd)} WIB</td></tr>
                            ${occurrences.length > 1 ? `<tr><td style="padding: 5px 0; font-weight: bold;">Jumlah Jadwal</td><td>${occurrences.length} jadwal (berulang)</td></tr>` : ''}
                          </table>
                        </div>
                        <p style="color: #374151; font-size: 14px;">Anda akan menerima email lagi setelah pemesanan disetujui atau ditolak oleh admin. Pantau juga notifikasi lonceng di halaman pemesanan.</p>
                      </div>
                      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Email ini dikirim otomatis. Jangan membalas email ini.</p>
                    </div>
                  `
                })
              }
            }
          }

          // Kirim juga ke admin jika PENDING
          if (status === 'PENDING') {
            const adminEmail = process.env.ADMIN_BOOKING_EMAIL ||
              process.env.SECURITY_ALERT_EMAIL ||
              process.env.RESEND_FROM

            if (adminEmail) {
              await sendBookingCreatedEmail({
                adminEmail,
                requesterName: normalizedRequesterName,
                ...emailCommon,
                bookingId: firstInsertId!
              })
            }
          }
        } catch (emailErr) {
          console.error('[CREATE BOOKING] Email notification failed (non-critical):', emailErr)
        }
      })

      // ── Bug #5C fix: pesan sukses yang tepat ────────────────────────────────
      const isActuallyRecurring = is_recurring && occurrences.length > 1
      let successMsg: string
      if (isActuallyRecurring) {
        successMsg = status === 'APPROVED'
          ? `Pemesanan berulang (${occurrences.length} jadwal) berhasil dibuat`
          : `Pemesanan berulang (${occurrences.length} jadwal) menunggu persetujuan admin`
      } else {
        successMsg = status === 'APPROVED'
          ? 'Pemesanan berhasil dibuat'
          : 'Pemesanan berhasil diajukan dan menunggu persetujuan admin'
      }

      return {
        id: firstInsertId,
        createdCount: occurrences.length,
        message: successMsg
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
