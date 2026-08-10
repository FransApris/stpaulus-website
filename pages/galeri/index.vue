<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Galeri Foto" />
    <div v-else>
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
      <!-- Loading State (Skeleton Mobile-First) -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col h-[400px]">
          <!-- Skeleton Thumbnail -->
          <div class="h-56 bg-gray-200 flex-shrink-0"></div>
          <!-- Skeleton Info -->
          <div class="p-5 flex flex-col flex-1">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6 mb-auto"></div>
            <!-- Action bar skeleton -->
            <div class="mt-4 pt-3 border-t border-gray-100 flex gap-2">
              <div class="h-8 bg-gray-200 rounded-full w-16"></div>
              <div class="h-8 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="error" class="text-center text-red-500">
        Gagal memuat album. Coba lagi nanti.
      </div>
      <div v-else-if="albums && albums.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <div v-for="album in paginatedAlbums" :key="album.id"
          class="album-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">

          <!-- Album Thumbnail (clickable → Google Photos) -->
          <a :href="album.share_url" target="_blank" rel="noopener noreferrer" class="block flex-shrink-0">
            <div
              class="album-preview relative bg-gradient-to-br from-[#882f1d] to-[#6b2416] h-56 flex items-center justify-center">
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
          </a>

          <!-- Album Info -->
          <div class="p-5 flex flex-col flex-1">
            <h3 class="text-xl font-cinzel text-[#882f1d] mb-1 line-clamp-2">{{ album.title }}</h3>
            <div v-if="album.created_at" class="text-sm text-gray-500 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd" />
              </svg>
              {{ formatDate(album.created_at) }}
            </div>
            <p v-if="album.description" class="text-gray-600 line-clamp-2 mb-3 text-sm">{{ album.description }}</p>

            <!-- Buka Album link -->
            <a :href="album.share_url" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center text-[#882f1d] hover:text-[#6b2416] font-medium text-sm transition-colors mb-4">
              <span>Buka Album</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <!-- ── Like / Share / Copy action bar ─────────────────── -->
            <div class="action-bar mt-auto pt-3 border-t border-gray-100 flex items-center gap-1">

              <!-- Like -->
              <button
                :id="`btn-like-${album.id}`"
                class="action-btn"
                :class="{ 'liked': likedAlbums.has(album.id) }"
                :aria-label="likedAlbums.has(album.id) ? 'Batal suka' : 'Suka album ini'"
                :aria-pressed="likedAlbums.has(album.id)"
                @click.prevent="toggleLike(album)"
              >
                <svg class="action-icon" viewBox="0 0 24 24" :fill="likedAlbums.has(album.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Like</span>
                <span class="action-count">{{ likeCounts[album.id] ?? 0 }}</span>
              </button>

              <!-- Divider -->
              <span class="action-divider" aria-hidden="true">|</span>

              <!-- Share -->
              <button
                :id="`btn-share-${album.id}`"
                class="action-btn"
                aria-label="Bagikan album ini"
                @click.prevent="shareAlbum(album)"
              >
                <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                </svg>
                <span>Share</span>
                <span class="action-count">{{ shareCounts[album.id] ?? 0 }}</span>
              </button>

              <!-- Divider -->
              <span class="action-divider" aria-hidden="true">|</span>

              <!-- Copy Link -->
              <button
                :id="`btn-copy-${album.id}`"
                class="action-btn"
                aria-label="Salin tautan album"
                @click.prevent="copyLink(album)"
              >
                <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                <span>Copy</span>
              </button>

            </div>
            <!-- ── end action bar ──────────────────────────────────── -->
          </div>
        </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMaintenance } from '~/composables/useMaintenance'
import { useToast } from '~/composables/useToast'

const { isMaintenance } = useMaintenance('galeri')
const { success, info } = useToast()
const currentPage = ref(1)
const pageLimit = 9

// ── Like / Share / Copy state ─────────────────────────────────
const likedAlbums = ref(new Set() as Set<number | string>)
const likeCounts = ref({} as Record<string | number, number>)
const shareCounts = ref({} as Record<string | number, number>)

function toggleLike(album: any) {
  const id = album.id
  if (likedAlbums.value.has(id)) {
    likedAlbums.value.delete(id)
    likeCounts.value[id] = Math.max(0, (likeCounts.value[id] ?? 1) - 1)
    info('Kamu membatalkan suka pada album ini.')
  } else {
    likedAlbums.value.add(id)
    likeCounts.value[id] = (likeCounts.value[id] ?? 0) + 1
    success('❤️ Terima kasih sudah menyukai album ini!')
  }
  // Trigger reactivity for Set
  likedAlbums.value = new Set(likedAlbums.value)
}

async function shareAlbum(album: any) {
  const id = album.id
  const url = album.share_url || window.location.href
  const title = album.title || 'Album Galeri Paroki St. Paulus'

  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      shareCounts.value[id] = (shareCounts.value[id] ?? 0) + 1
      success('Album berhasil dibagikan! 🎉')
    } catch (_e) {
      // User cancelled — no toast needed
    }
  } else {
    // Fallback: copy to clipboard
    await copyToClipboard(url)
    shareCounts.value[id] = (shareCounts.value[id] ?? 0) + 1
    success('Tautan album disalin — siap dibagikan! 🔗')
  }
}

async function copyLink(album: any) {
  const url = album.share_url || window.location.href
  await copyToClipboard(url)
  success('Tautan berhasil disalin ke clipboard! 📋')
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}
// ─────────────────────────────────────────────────────────────

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

onMounted(() => {
  // Scroll-to-top sudah ditangani secara global oleh router.options.ts
})
</script>

<style scoped>
.album-preview {
  background: #f5f5f5;
  min-height: 224px;
  position: relative;
  overflow: hidden;
}

.album-preview img {
  transition: transform 0.3s ease;
}

.album-card:hover .album-preview img {
  transform: scale(1.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Action Bar ─────────────────────────────────────── */
.action-bar {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease, transform 0.1s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}

.action-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.action-btn:active {
  transform: scale(0.94);
}

/* Liked state */
.action-btn.liked {
  color: #dc2626;
}

.action-btn.liked:hover {
  background: #fef2f2;
}

.action-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn.liked .action-icon {
  transform: scale(1.15);
}

.action-count {
  font-size: 12px;
  color: #9ca3af;
  min-width: 14px;
  text-align: left;
}

.action-btn.liked .action-count {
  color: #dc2626;
}

.action-divider {
  color: #e5e7eb;
  font-size: 14px;
  user-select: none;
  padding: 0 2px;
}
</style>