// Middleware untuk user web publik (bukan admin panel)
// Cek token 'auth_token' yang disimpan saat login via LoginModal

let userDataCache: { data: any; timestamp: number; token: string } | null = null
const CACHE_DURATION = 5000 // 5 seconds

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

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        const authToken = localStorage.getItem('auth_token')

        if (!authToken) {
            // Redirect ke homepage dengan notifikasi perlu login
            return navigateTo('/?login=required')
        }

        const now = Date.now()
        let userData

        try {
            // Check cache first
            if (userDataCache &&
                userDataCache.token === authToken &&
                (now - userDataCache.timestamp) < CACHE_DURATION) {
                userData = userDataCache.data
            } else {
                // Fetch user data from API
                const response = await fetch('/api/me', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                })

                if (!response.ok) {
                    if (response.status === 401) {
                        userDataCache = null
                        localStorage.removeItem('auth_token')
                        return navigateTo('/?login=required')
                    }
                    throw new Error('Failed to fetch user data')
                }

                userData = await response.json()
                userDataCache = {
                    data: userData,
                    timestamp: now,
                    token: authToken
                }
            }

            // Check if user has valid category for kronik access
            const category = (userData.user_category || '').toLowerCase()
            const hasKronikAccess = KRONIK_VALID_CATEGORIES.some((cat: string) => category.includes(cat))

            // If accessing kronik routes, check access
            if (to.path.startsWith('/user/kronik') && !hasKronikAccess) {
                console.log('[USER-AUTH] ❌ User does not have kronik access')
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
    }
})
