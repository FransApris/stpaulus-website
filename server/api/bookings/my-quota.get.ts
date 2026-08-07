import { getQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { getUserQuotaInfo } from '~/server/utils/quota'

/**
 * GET /api/bookings/my-quota
 *
 * Returns the current user's monthly booking count, max allowed, and whether
 * they are in an unlimited category (DPP / BGKP).
 *
 * Quota resolution priority:
 *  1. Per-user override (monthly_quota_override / quota_is_unlimited_override)
 *  2. Category DB settings (user_categories.is_unlimited / monthly_quota)
 *  3. Hardcoded fallback (3 bookings / month)
 *
 * Requires authentication.
 */
export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId  = decoded.userId

  try {
    // ── Resolve effective quota config (DB-driven, with overrides) ─────────────
    const quotaInfo = await getUserQuotaInfo(userId)

    // ── Hitung pemesanan bulan ini (dipakai baik unlimited maupun terbatas) ─────
    const firstDay = getFirstDayOfMonth()
    const lastDay  = getLastDayOfMonth()

    const countResult = await getQuery(`
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE user_id = ?
        AND status IN ('PENDING', 'APPROVED')
        AND start_time >= ?
        AND start_time <= ?
        AND deleted_at IS NULL
    `, [userId, firstDay, lastDay]) as any

    const monthlyCount = Number(countResult?.count ?? 0)

    if (quotaInfo.isUnlimited) {
      // DPP / BGKP or user-level unlimited override — no limit
      // monthly_count tetap dihitung agar widget bisa menampilkan pemakaian aktual
      return {
        monthly_count : monthlyCount,
        max_allowed   : null,           // null = tidak terbatas
        remaining     : null,
        can_book      : true,
        is_unlimited  : true,
        quota_source  : quotaInfo.source,
        period        : getCurrentMonthLabel()
      }
    }

    const maxAllowed   = quotaInfo.maxMonthly

    return {
      monthly_count : monthlyCount,
      max_allowed   : maxAllowed,
      remaining     : Math.max(0, maxAllowed - monthlyCount),
      can_book      : monthlyCount < maxAllowed,
      is_unlimited  : false,
      quota_source  : quotaInfo.source,
      period        : getCurrentMonthLabel()
    }
  } catch (error: any) {
    console.error('[MY QUOTA] Error:', error)
    throw createError({
      statusCode    : 500,
      statusMessage : 'Gagal mengambil data kuota pemesanan'
    })
  }
})

// ── Helper functions ──────────────────────────────────────────────────────────

/** Returns first day of current month as MySQL datetime string (UTC) */
function getFirstDayOfMonth(): string {
  const now   = new Date()
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))
  return first.toISOString().slice(0, 19).replace('T', ' ')
}

/** Returns last day of current month as MySQL datetime string (UTC) */
function getLastDayOfMonth(): string {
  const now  = new Date()
  const last = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59))
  return last.toISOString().slice(0, 19).replace('T', ' ')
}

/** Returns "Juli 2026" style label in Indonesian */
function getCurrentMonthLabel(): string {
  return new Date().toLocaleDateString('id-ID', {
    month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
  })
}
