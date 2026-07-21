<template>
  <div>
    <!-- Jika error 503 (Maintenance Mode dari Server Middleware) -->
    <PageMaintenance 
      v-if="error?.statusCode === 503"
      pageTitle="Layanan Sedang Dalam Perbaikan"
      :message="error?.message || 'Halaman ini sedang dalam tahap penyempurnaan.'"
    />
    
    <!-- Tampilan Error Umum untuk Error Lainnya (404, 500, dll) -->
    <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-lg w-full text-center">
        <div class="text-[120px] font-bold text-gray-200 leading-none mb-4 font-cinzel">
          {{ error?.statusCode }}
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2 font-cinzel">
          {{ error?.statusMessage || 'Terjadi Kesalahan' }}
        </h1>
        <p class="text-gray-500 mb-8">
          {{ error?.message || 'Maaf, kami tidak dapat menemukan apa yang Anda cari.' }}
        </p>
        <button 
          @click="handleError"
          class="inline-flex items-center justify-center gap-2 bg-[#882f1d] hover:bg-[#6b2416] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>
