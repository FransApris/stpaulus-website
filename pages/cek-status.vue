<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Cek Status Pesanan" />
    <div v-else>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-md mx-auto px-4">

      <div class="text-center mb-8">
        <GerejaLogo class="mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">Cek Status Akun</h1>
        <p class="text-gray-600 mt-2">Paroki Santo Paulus - Juanda</p>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-600 mb-4">
          Masukkan username atau email yang Anda daftarkan untuk melihat status akun Anda.
        </p>

        <form @submit.prevent="checkStatus" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username atau Email</label>
            <input v-model="input" type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="contoh: johndoe atau johndoe@email.com" required />
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ loading ? 'Memeriksa...' : 'Cek Status' }}
          </button>
        </form>

        <!-- Result -->
        <div v-if="result" class="mt-6 rounded-lg p-4 text-center" :class="{
          'bg-yellow-50 border border-yellow-200': result === 'PENDING',
          'bg-green-50 border border-green-200': result === 'ACTIVE',
          'bg-red-50 border border-red-200': result === 'INACTIVE',
          'bg-gray-50 border border-gray-200': result === 'NOT_FOUND'
        }">

          <template v-if="result === 'PENDING'">
            <div class="text-3xl mb-2">⏳</div>
            <p class="font-semibold text-yellow-800">Menunggu Persetujuan</p>
            <p class="text-sm text-yellow-700 mt-1">Akun Anda sedang diproses oleh admin sekretariat. Anda akan mendapat
              email setelah akun disetujui atau ditolak.</p>
          </template>

          <template v-else-if="result === 'ACTIVE'">
            <div class="text-3xl mb-2">✅</div>
            <p class="font-semibold text-green-800">Akun Aktif</p>
            <p class="text-sm text-green-700 mt-1">Akun Anda telah disetujui. Silakan login untuk membuat pemesanan.</p>
            <nuxt-link to="/booking"
              class="inline-block mt-3 bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
              Login Sekarang
            </nuxt-link>
          </template>

          <template v-else-if="result === 'INACTIVE'">
            <div class="text-3xl mb-2">❌</div>
            <p class="font-semibold text-red-800">Akun Tidak Disetujui</p>
            <p class="text-sm text-red-700 mt-1">Pendaftaran Anda tidak disetujui. Silakan hubungi sekretariat paroki
              untuk informasi lebih lanjut.</p>
          </template>

          <template v-else-if="result === 'NOT_FOUND'">
            <div class="text-3xl mb-2">🔍</div>
            <p class="font-semibold text-gray-700">Akun Tidak Ditemukan</p>
            <p class="text-sm text-gray-600 mt-1">Username atau email tidak terdaftar. Pastikan data yang Anda masukkan
              sudah benar.</p>
            <nuxt-link to="/daftar"
              class="inline-block mt-3 bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
              Daftar Sekarang
            </nuxt-link>
          </template>
        </div>

        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{{ error }}
        </div>
      </div>

      <div class="mt-6 text-center">
        <nuxt-link to="/" class="text-sm text-gray-500 hover:text-gray-700 hover:underline">← Kembali ke
          Beranda</nuxt-link>
      </div>

    </div>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('cek-status')
definePageMeta({ layout: 'default' })

useHead({
  title: 'Cek Status Akun - Paroki Santo Paulus - Juanda',
  meta: [{ name: 'robots', content: 'noindex' }]
})

const input = ref('')
const loading = ref(false)
const result = ref(null)
const error = ref('')

const checkStatus = async () => {
  error.value = ''
  result.value = null
  loading.value = true

  const isEmail = input.value.includes('@')
  const params = isEmail ? { email: input.value.trim() } : { username: input.value.trim() }

  try {
    const data = await $fetch('/api/auth/check-status', { params })
    result.value = data.status
  } catch (err) {
    error.value = err?.data?.statusMessage || 'Gagal memeriksa status. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
