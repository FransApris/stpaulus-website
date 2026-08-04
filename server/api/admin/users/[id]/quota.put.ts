import { runQuery, getQuery } from '../../../../database/db'
import { requireAuth } from '../../../../utils/auth'

/**
 * PUT /api/admin/users/:id/quota
 *
 * Super Admin only — override the monthly booking quota for a specific user.
 *
 * Body:
 *   {
 *     monthly_quota_override: number | null,      // null = revert to category default
 *     quota_is_unlimited_override: boolean | null // null = revert to category default
 *   }
 */
export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const adminId  = decoded.userId

  // ── Only Super Admin may call this endpoint ──────────────────────────────────
  const admin = await getQuery(`
    SELECT r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [adminId]) as { role_name?: string } | undefined

  if (admin?.role_name !== 'super_admin') {
    throw createError({
      statusCode    : 403,
      statusMessage : 'Hanya Super Admin yang dapat mengubah kuota individual user'
    })
  }

  const targetUserId = getRouterParam(event, 'id')
  const body         = await readBody(event)

  // ── Validate target user exists ───────────────────────────────────────────────
  const targetUser = await getQuery(
    'SELECT id, full_name, user_category FROM users WHERE id = ?',
    [targetUserId]
  ) as any
  if (!targetUser) {
    throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan' })
  }

  // ── Validate inputs ───────────────────────────────────────────────────────────
  const { monthly_quota_override, quota_is_unlimited_override } = body

  // monthly_quota_override: must be null or integer 1–999
  let quotaOverride: number | null = null
  if (monthly_quota_override !== null && monthly_quota_override !== undefined) {
    quotaOverride = Number(monthly_quota_override)
    if (isNaN(quotaOverride) || quotaOverride < 1 || quotaOverride > 999) {
      throw createError({
        statusCode    : 400,
        statusMessage : 'monthly_quota_override harus antara 1 dan 999, atau null untuk reset'
      })
    }
  }

  // quota_is_unlimited_override: must be null | 1 | 0 (TINYINT kompatibel MySQL)
  // Kirim null = reset ke default kategori, 1 = unlimited, 0 = tidak unlimited
  let unlimitedOverride: number | null = null
  if (quota_is_unlimited_override !== null && quota_is_unlimited_override !== undefined) {
    unlimitedOverride = quota_is_unlimited_override ? 1 : 0
  }

  // ── Apply update ──────────────────────────────────────────────────────────────
  await runQuery(`
    UPDATE users
    SET monthly_quota_override        = ?,
        quota_is_unlimited_override   = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [quotaOverride, unlimitedOverride, targetUserId])

  // Return updated user snapshot
  const updated = await getQuery(`
    SELECT
      u.id, u.full_name, u.user_category,
      u.monthly_quota_override, u.quota_is_unlimited_override,
      uc.monthly_quota AS cat_monthly_quota,
      uc.is_unlimited  AS cat_is_unlimited
    FROM users u
    LEFT JOIN user_categories uc
      ON UPPER(TRIM(uc.name)) = UPPER(TRIM(u.user_category))
    WHERE u.id = ?
  `, [targetUserId]) as any

  console.log(`[QUOTA OVERRIDE] Admin #${adminId} updated quota for user #${targetUserId}:`, {
    monthly_quota_override: quotaOverride,
    quota_is_unlimited_override: unlimitedOverride
  })

  return {
    message : 'Kuota user berhasil diperbarui',
    user    : updated
  }
})
