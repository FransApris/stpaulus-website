<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="text-3xl font-cinzel text-[#882f1d] mb-2">CMS Admin</h2>
        <p class="text-gray-600">Masuk ke panel administrasi</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                v-model="form.username"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                v-model="form.password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#882f1d] hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] disabled:opacity-50"
            >
              <span v-if="loading">Sedang masuk...</span>
              <span v-else>Masuk</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          <p>Pengelolan Konten Website St. Paulus - Juanda</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || ''

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // IMPORTANT: Clear any existing tokens and auth state BEFORE login
    // This prevents token mixing between different users
    console.log('[Login] Clearing old tokens before new login')
    sessionStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')
    
    // Clear useState auth state
    const auth = useAuth()
    auth.logout()
    
    // Wait longer to ensure cleanup completes and old tokens are cleared from memory
    await new Promise(resolve => setTimeout(resolve, 300))

    // IMPORTANT: Use /api/admin/login for admin panel login
    // NOT /api/auth/login (that's for booking users)
    console.log('[Login] Attempting login for:', form.value.username)
    const response = await $fetch(`${apiBase}/api/admin/login`, {
      method: 'POST',
      body: form.value
    })

    console.log('[Login] Login successful, response:', {
      hasAccessToken: !!response.accessToken,
      user: response.user
    })
    
    // Store NEW tokens in localStorage (persistent across sessions)
    console.log('[Login] Storing new tokens')
    sessionStorage.setItem('admin_access_token', response.accessToken)
    localStorage.setItem('admin_refresh_token', response.refreshToken)

    // Wait for localStorage to commit (critical for token update)
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))

    // Verify tokens are stored
    const storedToken = sessionStorage.getItem('admin_access_token')
    console.log('[Login] Token stored successfully:', !!storedToken, 'Length:', storedToken?.length)

    // Fetch user data with NEW token
    console.log('[Login] Fetching user data with new token...')
    await auth.fetchUserData(true) // Force refresh to clear cache
    console.log('[Login] User data fetched:', {
      username: auth.user.value?.username,
      role: auth.user.value?.role,
      id: auth.user.value?.id
    })

    // Small delay to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify token is set before redirect with additional checks
    const accessToken = sessionStorage.getItem('admin_access_token')
    const refreshToken = localStorage.getItem('admin_refresh_token')

    if (accessToken && refreshToken && auth.user.value) {
      // Additional validation: ensure tokens are properly formatted and user data loaded
      try {
        const accessParts = accessToken.split('.')
        const refreshParts = refreshToken.split('.')
        if (accessParts.length === 3 && refreshParts.length === 3) {
          // Tokens appear valid and user data loaded, redirect to dashboard
          console.log('[Login] All checks passed, redirecting to dashboard')
          await navigateTo('/admin/dashboard')
          return
        }
      } catch (error) {
        console.warn('[Login] Token validation failed during login')
      }
    }

    throw new Error('Token storage, user data fetch, or validation failed')
  } catch (err) {
    error.value = err.data?.message || err.message || 'Login gagal'
    // Clear any partially stored tokens on failure
    sessionStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in, but also clear old state
onMounted(() => {
  const accessToken = sessionStorage.getItem('admin_access_token')
  const route = useRoute()
  
  // Check if redirected due to token expiration
  if (route.query.expired === 'true') {
    error.value = 'Sesi Anda telah berakhir. Silakan login kembali.'
  }
  
  if (accessToken) {
    // Already logged in, redirect to dashboard
    navigateTo('/admin/dashboard')
  } else {
    // Not logged in, ensure clean state
    const auth = useAuth()
    auth.logout()
    console.log('[Login Page] Mounted - clean state ensured')
  }
})
</script>
