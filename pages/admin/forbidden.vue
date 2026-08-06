<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <div class="mb-6 text-7xl select-none" aria-hidden="true">🚫</div>
    <h1 class="text-3xl font-bold text-gray-800 mb-2">403 — Akses Ditolak</h1>
    <p class="text-gray-500 mb-1 max-w-md">
      Anda tidak memiliki izin untuk mengakses halaman ini.
    </p>
    <p class="text-sm text-gray-400 mb-8">
      Jika Anda merasa ini adalah kesalahan, hubungi Super Admin.
    </p>
    <div class="flex gap-3">
      <NuxtLink
        to="/admin/dashboard"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#882f1d] text-white text-sm font-semibold rounded-lg hover:bg-[#6d2417] transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        Kembali ke Dashboard
      </NuxtLink>
      <button
        @click="$router.back()"
        class="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
      >
        ← Halaman Sebelumnya
      </button>
    </div>

    <!-- Info box: role aktif -->
    <div class="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-xs text-gray-500">
      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Anda login sebagai: <strong>{{ roleLabel }}</strong>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: '403 — Akses Ditolak | Admin CMS'
})

// Ambil role dari state yang sudah diisi oleh admin.vue layout
const adminUser = useState('admin-layout-user')
const roleLabel = computed(() => adminUser.value?.role_display_name || 'Unknown')
</script>
