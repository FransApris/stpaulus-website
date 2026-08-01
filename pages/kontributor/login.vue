<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-16 w-auto" src="/images/logo-paulus-juanda.png" alt="Paroki St. Paulus Juanda" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 font-cinzel">
        Portal Kontributor
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Masuk untuk mengirim berita kegiatan
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username atau Email
            </label>
            <div class="mt-1">
              <input id="username" v-model="form.username" name="username" type="text" autocomplete="username" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative">
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" name="password" autocomplete="current-password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <span class="text-gray-500 hover:text-gray-700">{{ showPassword ? 'Sembunyikan' : 'Lihat' }}</span>
              </button>
            </div>
          </div>

          <!-- TOTP / Backup Code fallback if required -->
          <div v-if="requires2FA">
            <label for="totp" class="block text-sm font-medium text-gray-700">Kode Verifikasi (2FA)</label>
            <input type="text" id="totp" v-model="form.totp_code" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 p-3 rounded-md">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#882f1d] hover:bg-[#702517] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] disabled:opacity-50">
              {{ loading ? 'Masuk...' : 'Masuk' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty', // No header/footer
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || ''

const form = ref({
  username: '',
  password: '',
  totp_code: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const requires2FA = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const payload: any = {
      username: form.value.username,
      password: form.value.password
    }
    if (requires2FA.value) {
      payload.totp_code = form.value.totp_code
    }

    const response = await $fetch(`${apiBase}/api/admin/login`, {
      method: 'POST',
      body: payload
    })

    if (response.requires2FA) {
      requires2FA.value = true
      loading.value = false
      return
    }

    if (response.accessToken) {
      sessionStorage.setItem('admin_access_token', response.accessToken)
      localStorage.setItem('admin_refresh_token', response.refreshToken)
    }

    const auth = useAuth()
    await auth.fetchUserData(true)

    // Redirect rule
    if (auth.user.value?.role === 'kontributor_berita') {
      navigateTo('/kontributor')
    } else {
      // If admin logs in here by mistake, send to admin dashboard
      navigateTo('/admin/dashboard')
    }

  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Login gagal. Periksa username dan password Anda.'
  } finally {
    loading.value = false
  }
}
</script>
