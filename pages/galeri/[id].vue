<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <!-- Header Section - Changed from bg-paulus-blue to bg-white -->
    <section v-if="album" class="bg-white text-gray-800 py-20 border-b">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-cinzel mb-4">{{ album.title }}</h1>
        <p class="text-xl max-w-2xl mx-auto text-gray-600">
          {{ album.description }}
        </p>
        
        <!-- Album Info -->
        <div class="flex justify-center items-center gap-6 mt-6 text-sm">
          <!-- Category Badge -->
          <div 
            v-if="album.category"
            :style="{ backgroundColor: album.category.color }"
            class="px-4 py-2 rounded-full text-white font-medium"
          >
            {{ album.category.name }}
          </div>
          
          <!-- Photo Count -->
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{{ album.photos?.length || 0 }} Foto</span>
          </div>
          
          <!-- Date -->
          <div v-if="album.tanggal_peristiwa" class="flex items-center gap-2 text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>{{ formatDate(album.tanggal_peristiwa) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Breadcrumb -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <nav class="text-sm font-cinzel">
          <ol class="list-none p-0 inline-flex">
            <li class="flex items-center">
              <NuxtLink to="/galeri" class="text-gray-500 hover:text-paulus-blue">Galeri Foto</NuxtLink>
              <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center">
              <span class="text-gray-700">{{ album ? album.title : 'Loading...' }}</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <!-- Photos Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <!-- Loading State -->
        <div v-if="pending" class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-paulus-blue"></div>
          <p class="mt-4 text-gray-500">Memuat foto...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error || !album" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Album Tidak Ditemukan</h3>
          <p class="text-gray-500 mb-6">Maaf, album yang Anda cari tidak tersedia.</p>
          <NuxtLink to="/galeri" class="inline-flex items-center gap-2 bg-paulus-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Kembali ke Galeri
          </NuxtLink>
        </div>
        
        <!-- Photos Grid -->
        <div v-else-if="album.photos && album.photos.length > 0">
          <PhotoGrid :photos="album.photos" />
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Belum Ada Foto</h3>
          <p class="text-gray-500">Album ini belum memiliki foto.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Dynamic import for PhotoGrid component (only loaded when needed)
const PhotoGrid = defineAsyncComponent(() => import('~/components/PhotoGrid.vue'))

const route = useRoute();
const albumId = route.params.id;

// Fetch album detail from new API endpoint
const { data: album, pending, error } = await useAsyncData(
  `album-detail-${albumId}`,
  async () => {
    try {
      return await $fetch(`/api/galeri/${albumId}`)
    } catch (err) {
      console.error('Failed to fetch album detail:', err)
      return null
    }
  },
  {
    default: () => null,
    transform: (data) => data || null
  }
);

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

</script>
