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

        <!-- STEP 1: LOGIN USERNAME & PASSWORD -->
        <form v-if="!requires2FA" @submit.prevent="handleLogin" class="space-y-6">
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
              <span v-if="loading">Sedang memproses...</span>
              <span v-else>Lanjut Login</span>
            </button>
          </div>
        </form>

        <!-- STEP 2: VERIFIKASI 2FA (TOTP / RECOVERY CODE) -->
        <form v-else @submit.prevent="handleLogin" class="space-y-6">
          <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 text-sm text-amber-800 rounded">
            🔒 <strong>Autentikasi 2-Langkah (2FA) Aktif</strong>
            <p class="mt-1 text-xs">Buka aplikasi Authenticator Anda (Google Authenticator / Authy) dan masukkan kode 6-digit.</p>
          </div>

          <div v-if="!useBackupCode">
            <label for="totp_code" class="block text-sm font-medium text-gray-700">
              Kode 6-Digit Authenticator
            </label>
            <div class="mt-1">
              <input
                id="totp_code"
                name="totp_code"
                type="text"
                maxlength="6"
                required
                v-model="form.totp_code"
                class="appearance-none block w-full px-3 py-2 text-center text-xl tracking-widest font-mono border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                placeholder="123456"
                autocomplete="off"
              />
            </div>
          </div>

          <div v-else>
            <label for="backup_code" class="block text-sm font-medium text-gray-700">
              Recovery Backup Code
            </label>
            <div class="mt-1">
              <input
                id="backup_code"
                name="backup_code"
                type="text"
                required
                v-model="form.backup_code"
                class="appearance-none block w-full px-3 py-2 text-center font-mono border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                placeholder="xxxx-xxxx"
                autocomplete="off"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>

          <div class="flex flex-col space-y-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#882f1d] hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] disabled:opacity-50"
            >
              <span v-if="loading">Verifikasi...</span>
              <span v-else>Verifikasi & Masuk</span>
            </button>

            <button
              type="button"
              @click="toggleBackupMode"
              class="text-xs text-[#882f1d] hover:underline text-center mt-2"
            >
              {{ useBackupCode ? 'Gunakan kode 6-digit Authenticator' : 'Gunakan Kode Pemulihan (Backup Code)' }}
            </button>

            <button
              type="button"
              @click="resetLoginForm"
              class="text-xs text-gray-500 hover:underline text-center mt-1"
            >
              ← Kembali ke form awal
            </button>
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          <p>Pengelolaan Konten Website St. Paulus — Juanda</p>
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
  password: '',
  totp_code: '',
  backup_code: ''
})

const requires2FA = ref(false)
const useBackupCode = ref(false)
const loading = ref(false)
const error = ref('')

const toggleBackupMode = () => {
  useBackupCode.value = !useBackupCode.value
  form.value.totp_code = ''
  form.value.backup_code = ''
  error.value = ''
}

const resetLoginForm = () => {
  requires2FA.value = false
  useBackupCode.value = false
  form.value.totp_code = ''
  form.value.backup_code = ''
  error.value = ''
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    if (!requires2FA.value) {
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_refresh_token')
      const auth = useAuth()
      auth.logout()
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    const payload = {
      username: form.value.username,
      password: form.value.password
    }

    if (requires2FA.value) {
      if (useBackupCode.value) {
        payload.backup_code = form.value.backup_code
      } else {
        payload.totp_code = form.value.totp_code
      }
    }

    const response = await $fetch(`${apiBase}/api/admin/login`, {
      method: 'POST',
      body: payload
    })

    // Cek jika akun butuh verifikasi 2FA
    if (response.requires2FA) {
      requires2FA.value = true
      error.value = ''
      loading.value = false
      return
    }

    // Login Berhasil
    if (response.accessToken) {
      sessionStorage.setItem('admin_access_token', response.accessToken)
      localStorage.setItem('admin_refresh_token', response.refreshToken)
    }

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 150))

    const auth = useAuth()
    await auth.fetchUserData(true)

    if (auth.user.value?.role === 'kontributor_berita') {
      await navigateTo('/kontributor')
    } else {
      await navigateTo('/admin/dashboard')
    }
  } catch (err) {
    // Nuxt $fetch membungkus H3Error dalam err.data:
    //   err.data?.statusMessage → pesan dari createError({ statusMessage: '...' })
    //   err.data?.message      → format error lain
    //   err.statusMessage      → fallback langsung di object error
    //   err.message            → error JavaScript standar
    error.value =
      err.data?.statusMessage ||
      err.data?.message ||
      err.statusMessage ||
      err.message ||
      'Login gagal. Periksa koneksi atau hubungi Tim IT Paroki.'
    if (!requires2FA.value) {
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_refresh_token')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const accessToken = sessionStorage.getItem('admin_access_token')
  const route = useRoute()

  if (route.query.expired === 'true') {
    error.value = 'Sesi Anda telah berakhir. Silakan login kembali.'
  }

  if (accessToken) {
    navigateTo('/admin/dashboard')
  } else {
    const auth = useAuth()
    auth.logout()
  }
})
</script>

