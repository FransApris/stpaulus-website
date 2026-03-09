<template>
  <div class="hybrid-gallery">
    <!-- Gallery Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="photo in photos" 
        :key="photo.id"
        class="gallery-item relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
        @click="openLightbox(photo)"
      >
        <!-- Thumbnail - Load cepat dari lokal atau Google -->
        <img 
          :src="photo.thumbnailUrl"
          :alt="photo.title || 'Gallery Photo'"
          class="w-full h-full object-cover transition-transform group-hover:scale-110"
          loading="lazy"
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
          <svg 
            class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
          </svg>
        </div>

        <!-- Source Badge -->
        <div 
          v-if="photo.sourceType === 'google' || photo.sourceType === 'hybrid'"
          class="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1"
          title="Stored in Google Photos"
        >
          <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading gallery...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="photos.length === 0" class="text-center py-12 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <p>No photos in this gallery yet</p>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div 
        v-if="lightboxPhoto"
        class="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
        @click="closeLightbox"
      >
        <button 
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          @click="closeLightbox"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Previous Button -->
        <button 
          v-if="currentPhotoIndex > 0"
          class="absolute left-4 text-white hover:text-gray-300"
          @click.stop="previousPhoto"
        >
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <!-- Image - Load full resolution dari Google Photos atau lokal -->
        <div class="max-w-7xl max-h-screen p-4" @click.stop>
          <img 
            :src="lightboxPhoto.fullUrl"
            :alt="lightboxPhoto.title || 'Gallery Photo'"
            class="max-w-full max-h-screen object-contain"
            @click.stop
          />
          
          <!-- Photo Info -->
          <div class="mt-4 text-white text-center">
            <p v-if="lightboxPhoto.title" class="text-lg font-semibold">{{ lightboxPhoto.title }}</p>
            <p class="text-sm text-gray-300">{{ currentPhotoIndex + 1 }} / {{ photos.length }}</p>
          </div>
        </div>

        <!-- Next Button -->
        <button 
          v-if="currentPhotoIndex < photos.length - 1"
          class="absolute right-4 text-white hover:text-gray-300"
          @click.stop="nextPhoto"
        >
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Photo {
  id: number
  title?: string
  thumbnailUrl: string
  fullUrl: string
  sourceType: 'local' | 'google' | 'hybrid'
}

interface Props {
  albumId?: number
  photos?: Photo[]
}

const props = defineProps<Props>()
const loading = ref(false)
const photos = ref<Photo[]>(props.photos || [])
const lightboxPhoto = ref<Photo | null>(null)
const currentPhotoIndex = ref(0)

// Load photos jika albumId diberikan
if (props.albumId && !props.photos) {
  loadPhotos()
}

async function loadPhotos() {
  loading.value = true
  try {
    const { data } = await useFetch(`/api/gallery/albums/${props.albumId}/photos`)
    if (data.value) {
      photos.value = Array.isArray(data.value) ? data.value.map((photo: any) => ({
        id: photo.id,
        title: photo.title || photo.original_filename,
        // Gunakan thumbnail lokal jika ada, fallback ke Google Photos
        thumbnailUrl: photo.path?.startsWith('/uploads') 
          ? photo.path 
          : photo.thumbnail_url,
        // Full image dari Google Photos atau lokal
        fullUrl: photo.google_url || photo.path,
        sourceType: photo.source_type || 'local'
      })) : []
    }
  } catch (error) {
    console.error('Failed to load photos:', error)
  } finally {
    loading.value = false
  }
}

function openLightbox(photo: Photo) {
  lightboxPhoto.value = photo
  currentPhotoIndex.value = photos.value.findIndex(p => p.id === photo.id)
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxPhoto.value = null
  
  // Restore body scroll
  document.body.style.overflow = ''
}

function nextPhoto() {
  if (currentPhotoIndex.value < photos.value.length - 1) {
    currentPhotoIndex.value++
    lightboxPhoto.value = photos.value[currentPhotoIndex.value] || null
  }
}

function previousPhoto() {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    lightboxPhoto.value = photos.value[currentPhotoIndex.value] || null
  }
}

// Keyboard navigation
if (process.client) {
  document.addEventListener('keydown', (e) => {
    if (!lightboxPhoto.value) return
    
    if (e.key === 'Escape') closeLightbox()
    else if (e.key === 'ArrowRight') nextPhoto()
    else if (e.key === 'ArrowLeft') previousPhoto()
  })
}
</script>

<style scoped>
.gallery-item {
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-4px);
}
</style>
