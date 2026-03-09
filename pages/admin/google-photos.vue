<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Google Photos Integration</h1>
        <p class="mt-2 text-gray-600">
          Kelola integrasi dengan Google Photos account: pubdok.stpaulusjuanda@gmail.com
        </p>
      </div>

      <!-- Google Photos Manager Component -->
      <GooglePhotosManager />

      <!-- Sync History -->
      <div class="mt-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Sync History</h2>
        
        <div v-if="syncLogs.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Album</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photos Added</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photos Updated</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in syncLogs" :key="log.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ log.albumTitle }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span 
                    class="px-2 py-1 rounded text-xs"
                    :class="log.sync_type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ log.sync_type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ log.photos_added }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ log.photos_updated }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    class="px-2 py-1 rounded text-xs font-semibold"
                    :class="{
                      'bg-green-100 text-green-800': log.status === 'success',
                      'bg-red-100 text-red-800': log.status === 'failed',
                      'bg-yellow-100 text-yellow-800': log.status === 'partial'
                    }"
                  >
                    {{ log.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(log.synced_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <p>No sync history yet</p>
        </div>
      </div>

      <!-- Documentation Link -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-blue-900">Need Help?</h3>
            <p class="mt-1 text-sm text-blue-700">
              Baca dokumentasi lengkap di 
              <a href="/GOOGLE_PHOTOS_HYBRID_GUIDE.md" class="underline font-semibold">
                GOOGLE_PHOTOS_HYBRID_GUIDE.md
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth' // Require authentication
})

const syncLogs = ref<any[]>([])

onMounted(() => {
  loadSyncLogs()
})

async function loadSyncLogs() {
  try {
    const { data } = await useFetch('/api/google-photos/sync-logs')
    if (data.value) {
      syncLogs.value = Array.isArray(data.value) ? data.value : []
    }
  } catch (error) {
    console.error('Failed to load sync logs:', error)
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
