<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-md mx-auto px-4">

      <div class="text-center mb-8">
        <GerejaLogo class="mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2">Paroki St. Paulus, Juanda</p>
      </div>

      <!-- Invalid / missing token -->
      <div v-if="!token || !email" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow">
        <div class="text-5xl mb-4">❌</div>
        <h2 class="text-xl font-semibold text-red-800 mb-3">Link Tidak Valid</h2>
        <p class="text-red-700 mb-5">Link reset password tidak valid atau sudah kadaluarsa.</p>
        <nuxt-link to="/lupa-password"
          class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Minta Link Baru
        </nuxt-link>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-semibold text-green-800 mb-3">Password Berhasil Direset!</h2>
        <p class="text-green-700 mb-5">Silakan login dengan password baru Anda.</p>
        <nuxt-link to="/booking"
          class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Login Sekarang
        </nuxt-link>
      </div>

      <!-- Form -->
      <div v-else class="bg-white rounded-xl shadow p-6">
        <p class="text-gray-600 text-sm mb-5">
          Masukkan password baru untuk akun <strong>{{ email }}</strong>.
        </p>
        <form @submit.prevent="handleReset" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password Baru <span class="text-red-500">*</span>
            </label>
            <input v-model="password" type="password" required minlength="6" autocomplete="new-password"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Minimal 6 karakter" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password Baru <span class="text-red-500">*</span>
            </label>
            <input v-model="confirmPassword" type="password" required autocomplete="new-password"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              :class="{ 'border-red-400': confirmPassword && password !== confirmPassword }"
              placeholder="Ulangi password baru" />
            <p v-if="confirmPassword && password !== confirmPassword" class="mt-1 text-xs text-red-600">
              Password tidak cocok
            </p>
          </div>

          <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {{ errorMsg }}
            <div v-if="tokenExpired" class="mt-2">
              <nuxt-link to="/lupa-password" class="text-red-700 font-semibold underline">
                Minta link reset baru →
              </nuxt-link>
            </div>
          </div>

          <button type="submit" :disabled="loading || password !== confirmPassword"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ loading ? 'Menyimpan...' : 'Simpan Password Baru' }}
          </button>
        </form>
      </div>

      <div class="mt-6 text-center">
        <nuxt-link to="/" class="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          ← Kembali ke Beranda
        </nuxt-link>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
useHead({
  title: 'Reset Password - Paroki St. Paulus, Juanda',
  meta: [{ name: 'description', content: 'Reset password akun pemesanan ruangan Paroki St. Paulus, Juanda' }]
})

const route = useRoute()
const token = route.query.token as string | undefined
const email = route.query.email as string | undefined

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')
const tokenExpired = ref(false)
const success = ref(false)

const handleReset = async () => {
  errorMsg.value = ''
  tokenExpired.value = false
  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token, email, password: password.value }
    })
    success.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || 'Terjadi kesalahan. Silakan coba lagi.'
    if (errorMsg.value.includes('kadaluarsa')) tokenExpired.value = true
  } finally {
    loading.value = false
  }
}
</script>
