import { getQuery as getOne } from '~/server/database/db'

const ADMIN_ROLES = new Set(['super_admin', 'admin_komsos', 'admin_sekretariat'])
// Case-insensitive valid user categories (lowercase comparison)
const KRONIK_USER_CATEGORIES = new Set([
    'kategorial',
    'wilayah',
    'lingkungan',
    'komunitas',
    'seksi',
    'dewan pastoral paroki',
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
    const hasAdminRole = ADMIN_ROLES.has(role) || ((user.role_id || 0) > 0)
    if (hasAdminRole) {
        throw createError({
            statusCode: 403,
            message: 'Akun admin CMS tidak dapat mengakses fitur kronik user'
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
