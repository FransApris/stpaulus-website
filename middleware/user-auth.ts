// Middleware untuk user web publik (bukan admin panel & bukan kontributor)
// Cek token 'auth_token' yang disimpan saat login via LoginModal

const KRONIK_VALID_CATEGORIES = [
    // Legacy values
    'parish_council',
    'categorical_group',
    'region',
    'community',
    // Current Indonesian values
    'dewan pastoral paroki',
    'kategorial',
    'wilayah',
    'lingkungan',
    'komunitas',
    // Organization/unit aliases
    'dpp',
    'bgkp',
    'seksi'
]

const ADMIN_ROLES = ['super_admin', 'admin_komsos', 'admin_sekretariat', 'admin']
const KONTRIBUTOR_ROLES = ['kontributor_berita', 'user_kontributor']

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!process.client) return

    const authToken = localStorage.getItem('auth_token')

    if (!authToken) {
        // Redirect ke homepage dengan notifikasi login diperlukan
        return navigateTo('/?login=required')
    }

    try {
        // Fetch user data directly (stateless per-request check)
        const response = await fetch('/api/me', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('auth_token')
                return navigateTo('/?login=required')
            }
            throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        const userRole = (userData.role || '').toLowerCase()
        const hasAdminRoleId = userData.role_id !== null && userData.role_id !== undefined && Number(userData.role_id) > 0

        // 1. Blokir Admin Group dari rute user/kronik
        if (ADMIN_ROLES.includes(userRole) || hasAdminRoleId) {
            // Jika akun ini adalah kontributor, tangani di bawah
            if (!KONTRIBUTOR_ROLES.includes(userRole)) {
                console.log('[USER-AUTH] ❌ Admin role blocked from user routes')
                return navigateTo('/admin/dashboard')
            }
        }

        // 2. Blokir Kontributor dari rute user/kronik
        if (KONTRIBUTOR_ROLES.includes(userRole)) {
            console.log('[USER-AUTH] ❌ Kontributor role blocked from user/kronik routes')
            return navigateTo('/kontributor')
        }

        // 3. Validasi hak akses Kronik untuk user biasa
        const category = (userData.user_category || '').toLowerCase()
        const unitName = (userData.unit_name || '').toLowerCase()
        const hasKronikAccess = KRONIK_VALID_CATEGORIES.some((cat: string) => category.includes(cat)) || unitName.length > 0

        if ((to.path.startsWith('/kronik/manage') || to.path.startsWith('/user/kronik')) && !hasKronikAccess) {
            console.log('[USER-AUTH] ❌ User does not have kronik category permission')
            return navigateTo('/?error=no-kronik-access')
        }

        console.log('[USER-AUTH] ✅ Access granted:', {
            user: userData.username,
            category: userData.user_category,
            hasKronikAccess
        })

        return
    } catch (error) {
        console.error('[USER-AUTH] Error:', error)
        localStorage.removeItem('auth_token')
        return navigateTo('/?login=required')
    }
})
