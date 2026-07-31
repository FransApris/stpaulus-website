import { getQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

/**
 * Kategori yang TIDAK terkena batas kuota bulanan:
 * - PARISH_COUNCIL  = DPP (Dewan Pastoral Paroki)
 * - CATEGORICAL_GROUP = BGKP (Badan Gereja Katolik Paroki)
 */
const UNLIMITED_CATEGORIES = [
  'PARISH_COUNCIL', 
  'CATEGORICAL_GROUP', 
  'DEWAN PASTORAL PAROKI', 
  'BADAN GEREJA KATOLIK PAROKI',
  'DPP',
  'BGKP'
]

/** Batas pemesanan per bulan kalender bagi user biasa */
const MAX_MONTHLY_BOOKINGS = 3

/**
 * GET /api/bookings/my-quota
 * Returns the current user's monthly booking count, max allowed, and whether
 * they are in an unlimited category (DPP / BGKP).
 * Requires authentication.
 */
export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  try {
    // ── Ambil data user untuk cek kategori ───────────────────────────────────
    let userData: any = null
    try {
      userData = await getQuery(
        'SELECT user_category FROM users WHERE id = ? AND deleted_at IS NULL',
        [userId]
      )
    } catch (uErr: any) {
      userData = await getQuery(
        'SELECT user_category FROM users WHERE id = ?',
        [userId]
      )
    }

    const userCategory = String(userData?.user_category || '').toUpperCase()
    const isUnlimited = UNLIMITED_CATEGORIES.includes(userCategory)

    if (isUnlimited) {
      // DPP / BGKP — tidak ada batas
      return {
        monthly_count : 0,
        max_allowed   : null,           // null = tidak terbatas
        remaining     : null,
        can_book      : true,
        is_unlimited  : true,
        user_category : userCategory,
        period        : getCurrentMonthLabel()
      }
    }

    // ── Hitung pemesanan bulan ini (status apapun kecuali CANCELLED & soft-deleted) ──
    const firstDay = getFirstDayOfMonth()   // YYYY-MM-01 00:00:00
    const lastDay  = getLastDayOfMonth()    // YYYY-MM-last 23:59:59

    const result = await getQuery(`
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE user_id = ?
        AND status IN ('PENDING', 'APPROVED')
        AND start_time >= ?
        AND start_time <= ?
        AND deleted_at IS NULL
    `, [userId, firstDay, lastDay]) as any

    const monthlyCount = Number(result?.count ?? 0)

    return {
      monthly_count : monthlyCount,
      max_allowed   : MAX_MONTHLY_BOOKINGS,
      remaining     : Math.max(0, MAX_MONTHLY_BOOKINGS - monthlyCount),
      can_book      : monthlyCount < MAX_MONTHLY_BOOKINGS,
      is_unlimited  : false,
      user_category : userCategory,
      period        : getCurrentMonthLabel()
    }
  } catch (error: any) {
    console.error('[MY QUOTA] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data kuota pemesanan'
    })
  }
})

// ── Helper functions ──────────────────────────────────────────────────────────

/** Returns first day of current month as MySQL datetime string (UTC) */
function getFirstDayOfMonth(): string {
  const now = new Date()
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))
  return first.toISOString().slice(0, 19).replace('T', ' ')
}

/** Returns last day of current month as MySQL datetime string (UTC) */
function getLastDayOfMonth(): string {
  const now = new Date()
  // Day 0 of next month = last day of current month
  const last = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59))
  return last.toISOString().slice(0, 19).replace('T', ' ')
}

/** Returns "Juli 2026" style label in Indonesian */
function getCurrentMonthLabel(): string {
  return new Date().toLocaleDateString('id-ID', {
    month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
  })
}
