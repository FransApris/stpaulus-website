<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-md mx-auto px-4">

      <div class="text-center mb-8">
        <GerejaLogo class="mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">Lupa Password</h1>
        <p class="text-gray-600 mt-2">Paroki St. Paulus, Juanda</p>
      </div>

      <!-- Success state -->
      <div v-if="sent" class="bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow">
        <div class="text-5xl mb-4">📧</div>
        <h2 class="text-xl font-semibold text-green-800 mb-3">Email Terkirim</h2>
        <p class="text-green-700">
          Jika email Anda terdaftar dan aktif, link reset password telah dikirim.
          Silakan cek kotak masuk (dan folder <em>spam</em>) Anda.
        </p>
        <p class="text-green-600 text-sm mt-3">Link berlaku selama 1 jam.</p>
        <nuxt-link to="/booking"
          class="inline-block mt-5 text-green-700 hover:underline text-sm font-medium">
          ← Kembali ke halaman login
        </nuxt-link>
      </div>

      <!-- Form -->
      <div v-else class="bg-white rounded-xl shadow p-6">
        <p class="text-gray-600 text-sm mb-5">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.
        </p>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input v-model="email" type="email" required autocomplete="email"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="email@contoh.com" />
          </div>

          <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {{ errorMsg }}
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ loading ? 'Mengirim...' : 'Kirim Link Reset Password' }}
          </button>
        </form>

        <div class="mt-4 text-center text-sm text-gray-600">
          Ingat password?
          <nuxt-link to="/booking" class="text-green-600 hover:underline font-medium">Login di sini</nuxt-link>
        </div>
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
  title: 'Lupa Password - Paroki St. Paulus, Juanda',
  meta: [{ name: 'description', content: 'Reset password akun pemesanan ruangan Paroki St. Paulus, Juanda' }]
})

const email = ref('')
const loading = ref(false)
const errorMsg = ref('')
const sent = ref(false)

const handleSubmit = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    sent.value = true
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
