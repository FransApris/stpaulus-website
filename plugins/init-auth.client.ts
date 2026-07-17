// plugins/init-auth.client.ts
// Initializes auth state on app load so that user/permissions are available
// before the first middleware run (avoids a flash of unauthenticated state).
//
// fetchUserData() has built-in skip-guard and in-flight deduplication, so
// calling it here is always safe — it will only hit the network when needed.
import { useAuth } from '#imports'

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    console.warn('[Init Auth Plugin] Failed to decode token, treating as expired')
    return true
  }
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()

  if (!process.client) {
    return { provide: { auth } }
  }

  const token = sessionStorage.getItem('admin_access_token')

  if (!token) {
    console.log('[Init Auth Plugin] No token found, skipping init')
    return { provide: { auth } }
  }

  if (isTokenExpired(token)) {
    console.log('[Init Auth Plugin] Token expired, clearing...')
    sessionStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')
    return { provide: { auth } }
  }

  // fetchUserData() is safe to call unconditionally:
  //  • If user data is already in state (e.g. HMR / fast-nav), it returns immediately.
  //  • If another caller (middleware) is already fetching, this reuses that promise.
  //  • Only fires a real network request on a cold first load.
  console.log('[Init Auth Plugin] Token valid, initializing auth state...')
  auth.fetchUserData().then(result => {
    if (result.success) {
      console.log('[Init Auth Plugin] Auth ready | role:', (auth.user.value as any)?.role, '| perms:', auth.permissions.value.length)
    } else {
      console.warn('[Init Auth Plugin] Auth init failed')
    }
  }).catch(err => {
    console.error('[Init Auth Plugin] Unexpected error during auth init:', err)
  })

  return { provide: { auth } }
})
