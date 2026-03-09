<template>
  <div class="google-photos-manager p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-6">Google Photos Integration</h2>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="font-semibold">{{ successMessage }}</p>
      </div>
      <button @click="successMessage = null" class="text-green-600 hover:text-green-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Connection Status -->
    <div v-if="connectionStatus" class="mb-6">
      <div 
        class="flex items-center gap-3 p-4 rounded-lg"
        :class="connectionStatus.connected ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'"
      >
        <svg 
          v-if="connectionStatus.connected" 
          class="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg 
          v-else 
          class="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <div>
          <p class="font-semibold">
            {{ connectionStatus.connected ? 'Connected to Google Photos' : 'Not Connected' }}
          </p>
          <p class="text-sm" v-if="connectionStatus.email">{{ connectionStatus.email }}</p>
        </div>
      </div>
    </div>

    <!-- Connect Button -->
    <div v-if="!connectionStatus?.connected" class="mb-6">
      <button 
        @click="connectGooglePhotos"
        :disabled="loading"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
        </svg>
        {{ loading ? 'Connecting...' : 'Connect Google Photos' }}
      </button>
    </div>

    <!-- Albums Grid -->
    <div v-if="connectionStatus?.connected">
      <!-- Actions Bar -->
      <div class="flex gap-3 mb-6">
        <button 
          @click="loadAlbums"
          :disabled="loading"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : 'Refresh Albums' }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading albums...</p>
      </div>

      <!-- Albums Grid -->
      <div v-else-if="albums.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="album in albums" 
          :key="album.id"
          class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Album Cover -->
          <div class="aspect-video bg-gray-100 relative">
            <img 
              v-if="album.coverPhotoUrl"
              :src="album.coverPhotoUrl" 
              :alt="album.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <!-- Album Info -->
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ album.title }}</h3>
            <p class="text-sm text-gray-600 mb-4">
              {{ album.mediaItemsCount }} photos
            </p>

            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="syncAlbum(album)"
                :disabled="syncing === album.id"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {{ syncing === album.id ? 'Syncing...' : 'Sync to Website' }}
              </button>
              <a 
                :href="album.productUrl" 
                target="_blank"
                class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p>No albums found in your Google Photos</p>
      </div>
    </div>

    <!-- Sync Modal -->
    <div 
      v-if="showSyncModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeSyncModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Sync Album to Website</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Gallery Album
          </label>
          <select 
            v-model="selectedAlbumId"
            class="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Create New Album</option>
            <option v-for="album in localAlbums" :key="album.id" :value="album.id">
              {{ album.title }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="flex items-center gap-2">
            <input 
              type="checkbox" 
              v-model="downloadThumbnails"
              class="rounded"
            />
            <span class="text-sm">Download thumbnails to server (recommended)</span>
          </label>
        </div>

        <div class="flex gap-3">
          <button 
            @click="confirmSync"
            :disabled="!!syncing"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ syncing ? 'Syncing...' : 'Start Sync' }}
          </button>
          <button 
            @click="closeSyncModal"
            :disabled="!!syncing"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <!-- Sync Progress -->
        <div v-if="syncResult" class="mt-4 p-3 rounded" :class="syncResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
          <p class="font-semibold">{{ syncResult.message }}</p>
          <p v-if="syncResult.photosAdded" class="text-sm">Added: {{ syncResult.photosAdded }} photos</p>
          <p v-if="syncResult.photosUpdated" class="text-sm">Updated: {{ syncResult.photosUpdated }} photos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Album {
  id: string
  title: string
  mediaItemsCount: number
  coverPhotoUrl: string | null
  productUrl: string
}

interface LocalAlbum {
  id: number
  title: string
}

const route = useRoute()
const loading = ref(false)
const syncing = ref<string | null>(null)
const connectionStatus = ref<{ connected: boolean; email?: string } | null>(null)
const albums = ref<Album[]>([])
const showSyncModal = ref(false)
const selectedGoogleAlbum = ref<Album | null>(null)
const selectedAlbumId = ref<number | string>('')
const downloadThumbnails = ref(true)
const localAlbums = ref<LocalAlbum[]>([])
const syncResult = ref<any>(null)
const successMessage = ref<string | null>(null)

onMounted(async () => {
  // Check if redirected back from OAuth
  if (route.query.success === 'true') {
    successMessage.value = 'Google Photos berhasil terhubung! ✅'
    
    // Force update connection status immediately
    connectionStatus.value = {
      connected: true,
      email: 'pubdok.stpaulusjuanda@gmail.com'
    }
    
    // Load albums
    await loadAlbums()
    
    // Hapus success message setelah 5 detik
    setTimeout(() => {
      successMessage.value = null
    }, 5000)
  } else {
    // Normal check
    checkConnection()
  }
})

async function checkConnection() {
  try {
    // Check if connected by trying to load albums
    const data = await $fetch('/api/google-photos/albums')
    if (data?.success) {
      connectionStatus.value = {
        connected: true,
        email: 'pubdok.stpaulusjuanda@gmail.com'
      }
      albums.value = data.albums || []
    }
  } catch (error) {
    connectionStatus.value = {
      connected: false
    }
  }
}

async function connectGooglePhotos() {
  loading.value = true
  try {
    const data = await $fetch('/api/google-photos/auth-url')
    if (data?.authUrl) {
      // Redirect ke Google OAuth
      window.location.href = data.authUrl
    }
  } catch (error: any) {
    alert('Failed to connect: ' + error.message)
  } finally {
    loading.value = false
  }
}

async function loadAlbums() {
  loading.value = true
  try {
    const data = await $fetch('/api/google-photos/albums')
    if (data?.success) {
      albums.value = data.albums || []
    }
  } catch (error: any) {
    alert('Failed to load albums: ' + error.message)
  } finally {
    loading.value = false
  }
}

async function syncAlbum(album: Album) {
  selectedGoogleAlbum.value = album
  
  // Load local albums untuk pilihan
  try {
    const data = await $fetch('/api/gallery/albums')
    if (data) {
      localAlbums.value = Array.isArray(data) ? data : []
    }
  } catch (error) {
    console.error('Failed to load local albums:', error)
  }
  
  showSyncModal.value = true
  syncResult.value = null
}

async function confirmSync() {
  if (!selectedGoogleAlbum.value) return
  
  syncing.value = selectedGoogleAlbum.value.id
  try {
    const data = await $fetch('/api/google-photos/sync', {
      method: 'POST',
      body: {
        googleAlbumId: selectedGoogleAlbum.value.id,
        albumId: selectedAlbumId.value || null,
        downloadThumbnails: downloadThumbnails.value
      }
    })
    
    syncResult.value = data
    
    // Refresh albums setelah delay
    setTimeout(() => {
      showSyncModal.value = false
      selectedGoogleAlbum.value = null
      selectedAlbumId.value = ''
    }, 3000)
    
  } catch (error: any) {
    syncResult.value = {
      success: false,
      message: error.message || 'Sync failed'
    }
  } finally {
    syncing.value = null
  }
}

function closeSyncModal() {
  if (!syncing.value) {
    showSyncModal.value = false
    selectedGoogleAlbum.value = null
    selectedAlbumId.value = ''
    syncResult.value = null
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
