<template>
  <div class="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#6b1f10] via-[#882f1d] to-[#3d1108]"></div>

    <!-- Decorative circles -->
    <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
    <div class="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl"></div>

    <!-- Card -->
    <div class="relative w-full max-w-md z-10">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-5 mx-auto shadow-xl">
          <img src="/images/logo-paulus-juanda.png" alt="Logo Paroki" class="h-12 w-auto" />
        </div>
        <h1 class="text-3xl font-cinzel font-bold text-white mb-1">Portal Kontributor</h1>
        <p class="text-white/60 text-sm">Paroki St. Paulus Juanda &mdash; Kontributor Berita</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-white/80 mb-1.5">
              Username atau Email
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40 pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="kontributor-username"
                v-model="form.username"
                type="text"
                name="username"
                autocomplete="username"
                required
                placeholder="Masukkan username Anda"
                class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-white/80 mb-1.5">
              Password
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40 pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="kontributor-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
                required
                placeholder="Masukkan password Anda"
                class="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="fade">
            <div v-if="error" class="flex items-start gap-2.5 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3">
              <svg class="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-red-200 text-sm leading-relaxed">{{ error }}</p>
            </div>
          </Transition>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg"
            :class="loading
              ? 'bg-amber-400/50 text-amber-900/50 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-amber-900 hover:shadow-amber-400/30 hover:shadow-xl active:scale-[0.98]'
            "
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {{ loading ? 'Memverifikasi...' : 'Masuk ke Portal' }}
          </button>
        </form>

        <!-- Info -->
        <div class="mt-6 pt-5 border-t border-white/10">
          <p class="text-center text-xs text-white/40 leading-relaxed">
            Halaman ini khusus untuk <span class="text-white/60 font-medium">Kontributor Berita</span> Paroki St. Paulus Juanda.<br/>
            Berita Anda akan ditinjau oleh Admin Komsos sebelum tayang.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-white/30 mt-6">
        &copy; {{ new Date().getFullYear() }} Paroki St. Paulus Juanda &mdash; Portal Internal
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false, // Fully standalone, no layout wrapping
})

useSeoMeta({
  title: 'Login Portal Kontributor — Paroki St. Paulus Juanda',
  robots: 'noindex, nofollow' // Don't index this page
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || ''

const form = ref({ username: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    error.value = 'Username dan password tidak boleh kosong.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Use the dedicated contributor login API — NOT the admin one
    const response = await $fetch<{
      accessToken: string
      refreshToken: string
      user: { id: number; username: string; role: string }
    }>(`${apiBase}/api/kontributor/login`, {
      method: 'POST',
      body: {
        username: form.value.username,
        password: form.value.password
      }
    })

    // Store tokens
    if (response.accessToken) {
      sessionStorage.setItem('admin_access_token', response.accessToken)
      localStorage.setItem('admin_refresh_token', response.refreshToken)
    }

    // Fetch user data and redirect
    const auth = useAuth()
    await auth.fetchUserData(true)

    await navigateTo('/kontributor')

  } catch (err: any) {
    error.value = err.data?.statusMessage
      || err.message
      || 'Login gagal. Periksa username dan password Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
