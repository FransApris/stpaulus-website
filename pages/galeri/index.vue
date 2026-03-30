<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Galeri Foto</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Lihat momen-momen indah dari kegiatan paroki kami. Dari misa hingga retret rohani
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav class="text-sm font-cinzel">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <NuxtLink to="/" class="text-gray-500 hover:text-[#882f1d]">Beranda</NuxtLink>
            <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center">
            <span class="text-gray-700">Galeri Foto</span>
          </li>
        </ol>
      </nav>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="pending" class="text-center text-gray-500">
        Memuat daftar album...
      </div>
      <div v-else-if="error" class="text-center text-red-500">
        Gagal memuat album. Coba lagi nanti.
      </div>
      <div v-else-if="albums && albums.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <a v-for="album in paginatedAlbums" :key="album.id" :href="album.share_url" target="_blank"
          rel="noopener noreferrer"
          class="album-card bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl cursor-pointer">
          <!-- Album Thumbnail -->
          <div
            class="album-preview relative bg-gradient-to-br from-[#882f1d] to-[#6b2416] h-64 flex items-center justify-center">
            <img v-if="album.thumbnail_url" :src="album.thumbnail_url" :alt="album.title"
              class="w-full h-full object-cover" @error="handleAlbumImageError" />
            <div v-else class="text-center text-white p-6">
              <svg class="w-20 h-20 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd" />
              </svg>
              <p class="text-lg font-semibold">{{ album.title }}</p>
              <p class="text-sm opacity-75 mt-1">Klik untuk membuka album</p>
            </div>
            <!-- Google Photos Badge -->
            <div
              class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 .5a11.5 11.5 0 0 1 11.5 11.5A11.5 11.5 0 0 1 12 23.5 11.5 11.5 0 0 1 .5 12 11.5 11.5 0 0 1 12 .5zm3.5 4.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
              </svg>
              Google Photos
            </div>
          </div>

          <!-- Album Info -->
          <div class="p-6">
            <h3 class="text-2xl font-cinzel text-[#882f1d] mb-2 group-hover:text-[#6b2416]">{{ album.title }}</h3>
            <div v-if="album.created_at" class="text-sm text-gray-500 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd" />
              </svg>
              {{ formatDate(album.created_at) }}
            </div>
            <p v-if="album.description" class="text-gray-600 line-clamp-3 mb-4">{{ album.description }}</p>

            <!-- View Album Button -->
            <div class="inline-flex items-center text-[#882f1d] hover:text-[#6b2416] font-medium transition-colors">
              <span>Buka Album</span>
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </a>

      </div>
      <div v-if="albums && albums.length > pageLimit"
        class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p class="text-sm text-gray-600">
          Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-{{ Math.min(currentPage * pageLimit, albums.length) }}
          dari {{ albums.length }} album
        </p>
        <div class="flex items-center gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Sebelumnya
          </button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
            'px-3 py-1.5 rounded-lg border text-sm',
            currentPage === page
              ? 'bg-[#882f1d] text-white border-[#882f1d]'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          ]">
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Berikutnya
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-12">
        <p class="text-xl mb-2">Belum ada album yang tersedia.</p>
        <p class="text-sm">Album akan muncul di sini setelah admin menambahkannya.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const currentPage = ref(1)
const pageLimit = 9

// Mengambil data shared albums dari API
const { data: albums, pending, error } = await useAsyncData('shared-albums',
  async () => {
    try {
      const response = await $fetch('/api/shared-albums?active=true')
      return response.data || []
    } catch (err) {
      console.error('Failed to fetch shared albums:', err)
      return []
    }
  },
  {
    default: () => []
  }
);

const totalPages = computed(() => {
  const total = albums.value?.length || 0
  const pages = Math.ceil(total / pageLimit)
  return pages > 0 ? pages : 1
})

const paginatedAlbums = computed(() => {
  const list = albums.value || []
  const start = (currentPage.value - 1) * pageLimit
  return list.slice(start, start + pageLimit)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Fungsi untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleAlbumImageError = (event) => {
  const img = event?.target
  if (!img || typeof img.src !== 'string') return

  if (img.src.includes('/images/default-gallery.jpg')) return
  img.src = '/images/default-gallery.jpg'
}
</script>

<style scoped>
.album-preview {
  background: #f5f5f5;
  min-height: 256px;
  position: relative;
  overflow: hidden;
}

.album-preview img {
  transition: transform 0.3s ease;
}

.album-card:hover .album-preview img {
  transform: scale(1.05);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>