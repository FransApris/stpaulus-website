import { getQuery as getOne } from '~/server/database/db'

const ADMIN_ROLES = new Set(['super_admin', 'admin_komsos', 'admin_sekretariat'])
// Kontributor tidak boleh mengakses fitur kronik user (Broken Function Level Auth fix)
const KONTRIBUTOR_ROLES = new Set(['kontributor_berita', 'user_kontributor'])
// Case-insensitive valid user categories (lowercase comparison)
const KRONIK_USER_CATEGORIES = new Set([
    'kategorial',
    'wilayah',
    'lingkungan',
    'komunitas',
    'seksi',
    'dewan pastoral paroki',
    // Legacy/English codes for backward compatibility
    'parish_council',
    'categorical_group',
    'region',
    'community',
    'admin'
])

type KronikUser = {
    id: number
    user_category?: string | null
    role?: string | null
    role_id?: number | null
}

export const requireKronikUserAccess = async (userId: number): Promise<KronikUser> => {
    const user = await getOne(
        'SELECT id, user_category, role, role_id FROM users WHERE id = ?',
        [userId]
    ) as KronikUser | undefined

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Invalid user'
        })
    }

    const role = (user.role || '').toLowerCase()

    // Blokir Admin CMS group
    const hasAdminRole = ADMIN_ROLES.has(role) || ((user.role_id || 0) > 0)
    if (hasAdminRole) {
        throw createError({
            statusCode: 403,
            message: 'Akun admin CMS tidak dapat mengakses fitur kronik user'
        })
    }

    // Blokir Kontributor Berita (celah BFLA — mereka tidak boleh bypass via API langsung)
    if (KONTRIBUTOR_ROLES.has(role)) {
        throw createError({
            statusCode: 403,
            message: 'Akun kontributor tidak dapat mengakses fitur kronik user'
        })
    }

    const normalizedCategory = (user.user_category || '').toLowerCase().trim()
    if (!KRONIK_USER_CATEGORIES.has(normalizedCategory)) {
        throw createError({
            statusCode: 403,
            message: 'You do not have permission to access kronik entries'
        })
    }

    return user
}
