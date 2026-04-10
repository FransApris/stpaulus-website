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

// Use Nuxt's useState for global reactive state that persists across components
export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const permissions = useState<string[]>('auth-permissions', () => [])
  const loading = useState<boolean>('auth-loading', () => false)
  const fetchUserData = async (forceRefresh = false): Promise<{ success: boolean }> => {
    try {
      loading.value = true

      // Force clear cache if requested
      if (forceRefresh) {
        console.log('[useAuth] Force refresh requested, clearing cache')
        user.value = null
        permissions.value = []
      }

      const token = sessionStorage.getItem('admin_access_token')

      console.log('[useAuth] Fetching user data, token exists:', !!token)

      if (!token) {
        console.log('[useAuth] No token found')
        user.value = null
        permissions.value = []
        return { success: false }
      }

      const response = await $fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        // Force fresh request, no cache
        cache: 'no-cache'
      })

      console.log('[useAuth] API response:', response)

      // Handle both response formats
      if (response && typeof response === 'object') {
        if ('user' in response) {
          // Format 1: {user: {...}, permissions: [...]}
          user.value = (response as any).user
          permissions.value = (response as any).permissions || []
          console.log('[useAuth] User data set (format 1):', user.value)
          console.log('[useAuth] Permissions set:', permissions.value)
          return { success: true }
        } else if ('role' in response) {
          // Format 2: {role: 'admin_sekretariat', permissions: [...], id, username, etc}
          // The response IS the user object
          user.value = response as any
          permissions.value = (response as any).permissions || []
          console.log('[useAuth] User data set (format 2):', user.value)
          console.log('[useAuth] Permissions set:', permissions.value)
          return { success: true }
        } else {
          console.log('[useAuth] Response format unexpected:', response)
          user.value = null
          permissions.value = []
          return { success: false }
        }
      } else {
        console.log('[useAuth] Invalid response:', response)
        user.value = null
        permissions.value = []
        return { success: false }
      }
    } catch (error: any) {
      console.error('[useAuth] Failed to fetch user data:', error)

      // If token is invalid or expired, clear it and redirect to login
      if (error.statusCode === 401 || error.status === 401) {
        console.log('[useAuth] Token invalid/expired, clearing and redirecting to login')
        sessionStorage.removeItem('admin_access_token')
        localStorage.removeItem('admin_refresh_token')
        user.value = null
        permissions.value = []

        // Only redirect if we're not already on login page
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
    }
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
