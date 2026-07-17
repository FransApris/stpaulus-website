// composables/useAuth.ts

interface User {
  id: number
  username: string
  email: string
  role: string
  role_id: number
  full_name?: string
  organization_id?: number // For linking ketua/pengurus to their section
}

// In-flight deduplication: store the active promise so concurrent callers
// share a single network request instead of firing separate ones.
let _inflightFetch: Promise<{ success: boolean }> | null = null

// Use Nuxt's useState for global reactive state that persists across components
export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const permissions = useState<string[]>('auth-permissions', () => [])
  const loading = useState<boolean>('auth-loading', () => false)
  // Track which token the cached state belongs to so we can detect token changes
  const cachedToken = useState<string | null>('auth-cached-token', () => null)

  const fetchUserData = async (forceRefresh = false): Promise<{ success: boolean }> => {
    const token = sessionStorage.getItem('admin_access_token')

    if (!token) {
      user.value = null
      permissions.value = []
      cachedToken.value = null
      return { success: false }
    }

    // --- Skip guard: data already loaded for this token and no force refresh ---
    if (!forceRefresh && user.value !== null && cachedToken.value === token) {
      console.log('[useAuth] User data already cached for current token, skipping fetch')
      return { success: true }
    }

    // --- In-flight deduplication: if a fetch is already running, reuse it ---
    if (_inflightFetch) {
      console.log('[useAuth] Fetch already in-flight, reusing existing promise')
      return _inflightFetch
    }

    // Force clear cache if requested
    if (forceRefresh) {
      console.log('[useAuth] Force refresh requested, clearing cache')
      user.value = null
      permissions.value = []
      cachedToken.value = null
    }

    // Start the actual fetch and store the promise for deduplication
    _inflightFetch = (async (): Promise<{ success: boolean }> => {
      try {
        loading.value = true
        console.log('[useAuth] Fetching user data from /api/admin/me')

        const response = await $fetch('/api/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: 'no-cache'
        })

        // Handle both response formats
        if (response && typeof response === 'object') {
          if ('user' in response) {
            // Format 1: {user: {...}, permissions: [...]}
            user.value = (response as any).user
            permissions.value = (response as any).permissions || []
          } else if ('role' in response) {
            // Format 2: {role: 'admin_sekretariat', permissions: [...], id, username, etc}
            user.value = response as any
            permissions.value = (response as any).permissions || []
          } else {
            console.log('[useAuth] Response format unexpected:', response)
            user.value = null
            permissions.value = []
            return { success: false }
          }

          // Mark which token this cache belongs to
          cachedToken.value = token
          console.log('[useAuth] User data cached for token. Role:', (user.value as any)?.role, '| Permissions:', permissions.value.length)
          return { success: true }
        } else {
          user.value = null
          permissions.value = []
          return { success: false }
        }
      } catch (error: any) {
        console.error('[useAuth] Failed to fetch user data:', error)

        if (error.statusCode === 401 || error.status === 401) {
          console.log('[useAuth] Token invalid/expired, clearing and redirecting to login')
          sessionStorage.removeItem('admin_access_token')
          localStorage.removeItem('admin_refresh_token')
          user.value = null
          permissions.value = []
          cachedToken.value = null

          if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login'
          }
        } else {
          user.value = null
          permissions.value = []
        }
        return { success: false }
      } finally {
        loading.value = false
        // Always clear the in-flight reference when done (success or failure)
        _inflightFetch = null
      }
    })()

    return _inflightFetch
  }

  const hasPermission = (permission: string): boolean => {
    return permissions.value.includes(permission)
  }

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(p => permissions.value.includes(p))
  }

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(p => permissions.value.includes(p))
  }

  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')
  const isAdminKomsos = computed(() => user.value?.role === 'admin_komsos')
  const isAdminSekretariat = computed(() => user.value?.role === 'admin_sekretariat')

  const logout = () => {
    sessionStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')
    user.value = null
    permissions.value = []
    cachedToken.value = null
    _inflightFetch = null
  }

  return {
    user: computed(() => user.value),
    permissions: computed(() => permissions.value),
    loading: computed(() => loading.value),
    isSuperAdmin,
    isAdminKomsos,
    isAdminSekretariat,
    fetchUserData,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    logout
  }
}
