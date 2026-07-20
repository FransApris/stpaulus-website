<script setup>
const { isMaintenance } = useMaintenance('pemesanan-ruang')
// Redirect to booking page
await navigateTo('/booking', { redirectCode: 301 })
</script>

<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Pemesanan Alternatif" />
    <div v-else>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Mengarahkan ke halaman pemesanan...</p>
    </div>
  </div>
    </div>
  </div>
</template>
