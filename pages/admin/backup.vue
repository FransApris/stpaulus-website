<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Database Backup</h1>
      <p class="mt-2 text-sm text-gray-600">
        Backup seluruh database ke file SQL yang bisa di-restore kapan saja
      </p>
    </div>

    <!-- Backup Card -->
    <div class="max-w-2xl">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-medium text-gray-900">Backup Database</h3>
            <p class="mt-2 text-sm text-gray-500">
              Backup akan mencakup semua tabel, struktur, dan data dalam format SQL standar.
            </p>

            <!-- Stats -->
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Database</div>
                <div class="text-sm font-medium text-gray-900">{{ dbName }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Last Backup</div>
                <div class="text-sm font-medium text-gray-900">{{ lastBackup }}</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex gap-3">
              <button @click="downloadBackup" :disabled="isDownloading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="!isDownloading" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <svg v-else class="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ isDownloading ? 'Membuat Backup...' : 'Download Backup Sekarang' }}
              </button>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="mt-4 rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-4 rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="mt-6 bg-blue-50 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-blue-800">Cara Restore Backup</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p class="mb-2">Untuk restore database dari file backup:</p>
              <code class="block bg-blue-100 rounded px-3 py-2 text-xs">
                mysql -u root -p stpaulus_cms_db &lt; stpaulus_backup_TIMESTAMP.sql
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const dbName = ref('stpaulus_cms_db')
const lastBackup = ref('Belum ada')
const isDownloading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const downloadBackup = async () => {
  isDownloading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Get token from localStorage
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login ulang.')
    }

    console.log('[Backup] Starting download, token exists:', !!token)
    
    // Call API endpoint with proper authorization
    const response = await $fetch('/api/admin/backup/database', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    })

    console.log('[Backup] Response received, size:', response.size || response.length)

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `stpaulus_backup_${timestamp}.sql`

    // Download file
    const blob = response instanceof Blob ? response : new Blob([response], { type: 'application/sql' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    // Update last backup time
    const now = new Date()
    lastBackup.value = now.toLocaleString('id-ID')
    localStorage.setItem('lastBackupTime', now.toISOString())

    // Show success message
    const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2)
    successMessage.value = `✅ Backup berhasil diunduh: ${filename} (${sizeInMB} MB)`

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)

  } catch (error) {
    console.error('[Backup] Error:', error)
    errorMessage.value = error.message || error.data?.message || 'Terjadi kesalahan saat membuat backup'
    
    // Clear error message after 10 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 10000)
  } finally {
    isDownloading.value = false
  }
}

// Load last backup time from localStorage
onMounted(() => {
  const saved = localStorage.getItem('lastBackupTime')
  if (saved) {
    lastBackup.value = new Date(saved).toLocaleString('id-ID')
  }
})

// Save backup time to localStorage
watch(lastBackup, (newValue) => {
  if (newValue !== 'Belum ada') {
    localStorage.setItem('lastBackupTime', new Date().toISOString())
  }
})
</script>
