// plugins/init-auth.client.ts
// Explicit import for TypeScript
import { useAuth } from '#imports'

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp
    return Date.now() >= exp * 1000
  } catch (error) {
    console.warn('[Init Auth Plugin] Failed to decode token, treating as expired')
    return true
  }
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()

  // Initialize auth state on app load if token exists (non-blocking)
  if (process.client) {
    const token = sessionStorage.getItem('admin_access_token')
    if (token) {
      // Check if token is expired before making API call
      if (isTokenExpired(token)) {
        console.log('[Init Auth Plugin] Token expired, clearing...')
        sessionStorage.removeItem('admin_access_token')
        localStorage.removeItem('admin_refresh_token')
      } else {
        console.log('[Init Auth Plugin] Token found, fetching user data...')
        // Fire-and-forget: don't await to avoid blocking plugin initialization
        auth.fetchUserData().then(result => {
          console.log('[Init Auth Plugin] Auth initialized:', {
            success: result.success,
            user: auth.user.value,
            permissionsCount: auth.permissions.value.length
          })
        }).catch(err => {
          console.error('[Init Auth Plugin] Failed to initialize auth:', err)
        })
      }
    } else {
      console.log('[Init Auth Plugin] No token found')
    }
  }

  // Plugin must return something to avoid SSR warning
  return {
    provide: {
      auth
    }
  }
})
