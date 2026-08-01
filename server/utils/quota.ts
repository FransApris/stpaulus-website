import { getQuery } from '~/server/database/db'

/**
 * Fallback constants — used when DB lookup fails or category not found.
 * These names are checked case-insensitively as a safety net.
 */
const FALLBACK_UNLIMITED_NAMES = new Set([
  'PARISH_COUNCIL',
  'CATEGORICAL_GROUP',
  'DPP',
  'BGKP',
  'DEWAN PASTORAL PAROKI',
  'BADAN GEREJA KATOLIK PAROKI',
])

const FALLBACK_MAX_MONTHLY = 3

export interface UserQuotaInfo {
  /** Whether user is exempt from monthly booking limits */
  isUnlimited: boolean
  /** Max bookings per calendar month (only relevant when isUnlimited = false) */
  maxMonthly: number
  /** Source of the quota info for debugging */
  source: 'user_override' | 'category_db' | 'fallback'
}

/**
 * Get the effective quota configuration for a given user.
 *
 * Priority order:
 *  1. Per-user override columns (`monthly_quota_override`, `quota_is_unlimited_override`)
 *  2. Category-level settings (`user_categories.is_unlimited`, `user_categories.monthly_quota`)
 *  3. Fallback hardcoded values (for backward compat if migration not yet run)
 */
export async function getUserQuotaInfo(userId: number): Promise<UserQuotaInfo> {
  try {
    // Single query: join users + user_categories
    const row = await getQuery(`
      SELECT
        u.monthly_quota_override,
        u.quota_is_unlimited_override,
        uc.is_unlimited   AS cat_is_unlimited,
        uc.monthly_quota  AS cat_monthly_quota,
        u.user_category
      FROM users u
      LEFT JOIN user_categories uc
        ON UPPER(TRIM(uc.name)) = UPPER(TRIM(u.user_category))
      WHERE u.id = ?
        AND (u.deleted_at IS NULL OR u.deleted_at = '0000-00-00 00:00:00')
    `, [userId]) as any

    if (!row) {
      return { isUnlimited: false, maxMonthly: FALLBACK_MAX_MONTHLY, source: 'fallback' }
    }

    // ── 1. Check per-user overrides ───────────────────────────────────────────
    const hasUnlimitedOverride = row.quota_is_unlimited_override !== null &&
                                  row.quota_is_unlimited_override !== undefined
    const hasQuotaOverride     = row.monthly_quota_override !== null &&
                                  row.monthly_quota_override !== undefined

    if (hasUnlimitedOverride) {
      const isUnlimited = Boolean(row.quota_is_unlimited_override)
      const maxMonthly  = hasQuotaOverride
        ? Number(row.monthly_quota_override)
        : FALLBACK_MAX_MONTHLY
      return { isUnlimited, maxMonthly, source: 'user_override' }
    }

    // ── 2. Check category-level settings from DB ──────────────────────────────
    if (row.cat_is_unlimited !== null && row.cat_is_unlimited !== undefined) {
      const isUnlimited = Boolean(row.cat_is_unlimited)
      const maxMonthly  = isUnlimited
        ? 999
        : (hasQuotaOverride ? Number(row.monthly_quota_override) : Number(row.cat_monthly_quota ?? FALLBACK_MAX_MONTHLY))
      return { isUnlimited, maxMonthly, source: 'category_db' }
    }

    // ── 3. Fallback — category not in DB or migration not run yet ─────────────
    const catUpper    = String(row.user_category || '').toUpperCase().trim()
    const isUnlimited = FALLBACK_UNLIMITED_NAMES.has(catUpper)
    const maxMonthly  = isUnlimited ? 999 : FALLBACK_MAX_MONTHLY
    return { isUnlimited, maxMonthly, source: 'fallback' }

  } catch (err) {
    console.error('[QUOTA UTIL] Error reading quota info for userId', userId, ':', err)
    // Never throw — always return a safe default
    return { isUnlimited: false, maxMonthly: FALLBACK_MAX_MONTHLY, source: 'fallback' }
  }
}

/**
 * Returns true when a user_category name represents an unlimited-quota group.
 * Used during user creation/update to enforce permission checks.
 * Checks DB first, then falls back to hardcoded list.
 */
export async function isCategoryUnlimited(categoryName: string): Promise<boolean> {
  try {
    const row = await getQuery(
      'SELECT is_unlimited FROM user_categories WHERE UPPER(TRIM(name)) = UPPER(TRIM(?)) LIMIT 1',
      [categoryName]
    ) as any
    if (row && row.is_unlimited !== null && row.is_unlimited !== undefined) {
      return Boolean(row.is_unlimited)
    }
  } catch (_) { /* fallthrough */ }

  // Fallback
  return FALLBACK_UNLIMITED_NAMES.has(String(categoryName || '').toUpperCase().trim())
}
