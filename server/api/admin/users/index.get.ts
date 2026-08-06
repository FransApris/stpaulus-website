import { allQuery } from '../../../database/db'
import { requireAuth, requireUserManagementPermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const userId = decoded.userId

    // Check permissions using RBAC
    await requireUserManagementPermission(event)

    // Get current user's role
    const currentUserResult = await allQuery(`
      SELECT r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [userId])

    const currentUser = currentUserResult[0] as { role_name?: string } | undefined

    // JOIN ke user_categories menggunakan nama kategori (users.user_category = uc.name)
    // agar dapat fallback kuota default dari kategori bila tidak ada override individual
    let query = `
      SELECT
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.contact_phone,
        u.user_category,
        u.unit_name,
        u.role,
        u.role_id,
        u.account_status,
        r.name as role_name,
        r.display_name as role_display_name,
        u.created_at,
        u.monthly_quota_override,
        u.quota_is_unlimited_override,
        uc.monthly_quota as category_monthly_quota,
        uc.is_unlimited as category_is_unlimited
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_categories uc ON u.user_category = uc.name
    `

    const params: any[] = []

    // Filter users based on requester's role
    if (currentUser?.role_name === 'admin_sekretariat') {
      // Admin sekretariat hanya bisa lihat user biasa (bukan admin)
      query += ` WHERE (u.role_id IS NULL OR u.role_id = 0) AND (u.role = 'user' OR u.role IS NULL)`
    } else if (currentUser?.role_name === 'admin_komsos') {
      // Admin komsos can see users with role 'user' and 'kontributor_berita'
      query += ` WHERE (r.name IN ('user', 'kontributor_berita') OR (r.name IS NULL AND u.role = 'user'))`
    }
    // Super admin can see all users (no additional WHERE clause)

    query += ` ORDER BY u.created_at DESC`

    console.log('[GET /api/admin/users] Executing query:', query)
    console.log('[GET /api/admin/users] Params:', params)

    const rawUsers = await allQuery(query, params)

    console.log('[GET /api/admin/users] Found', rawUsers.length, 'users')

    // ── Hitung calculated_quota dengan logika prioritas ──────────────────────────
    // Logika ini ditangani di JS (bukan COALESCE SQL) agar bisa membedakan antara:
    //   null  = unlimited (override individual ATAU is_unlimited dari kategori)
    //   number = batas kuota per bulan
    //   undefined = tidak ada informasi kuota (user admin / kategori tidak ditemukan)
    //
    // Prioritas:
    //   1. quota_is_unlimited_override = true/1 → null (unlimited, override individu)
    //   2. monthly_quota_override != null         → angka (override individu)
    //   3. category_is_unlimited = true/1         → null (unlimited dari kategori)
    //   4. category_monthly_quota != null         → angka (default kategori)
    //   5. Tidak ada data sama sekali             → undefined
    //
    // quota_source: 'override' | 'category' | 'none'
    //   Berguna di frontend untuk menampilkan tanda bintang (*) pada override individu
    const users = (rawUsers as any[]).map(u => {
      let calculated_quota: number | null | undefined
      let quota_source: 'override' | 'category' | 'none' = 'none'

      // Hanya user non-admin yang punya kuota booking
      const isNonAdmin = !u.role_id || Number(u.role_id) === 0

      if (isNonAdmin) {
        if (u.quota_is_unlimited_override === true || u.quota_is_unlimited_override === 1) {
          // Prioritas 1: override unlimited individual
          calculated_quota = null
          quota_source = 'override'
        } else if (u.monthly_quota_override !== null && u.monthly_quota_override !== undefined) {
          // Prioritas 2: override angka individual
          calculated_quota = Number(u.monthly_quota_override)
          quota_source = 'override'
        } else if (u.category_is_unlimited === true || u.category_is_unlimited === 1) {
          // Prioritas 3: unlimited dari default kategori
          calculated_quota = null
          quota_source = 'category'
        } else if (u.category_monthly_quota !== null && u.category_monthly_quota !== undefined) {
          // Prioritas 4: kuota angka dari default kategori
          calculated_quota = Number(u.category_monthly_quota)
          quota_source = 'category'
        } else {
          // Prioritas 5: tidak ada info kuota
          calculated_quota = undefined
          quota_source = 'none'
        }
      }
      // Admin: calculated_quota = undefined (tidak ditampilkan)

      return {
        ...u,
        calculated_quota,
        quota_source
      }
    })

    const pendingCount = users.filter(u => u.account_status === 'PENDING').length

    return {
      users,
      total: users.length,
      pendingCount
    }
  } catch (error: any) {
    console.error('[GET /api/admin/users] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch users'
    })
  }
})
