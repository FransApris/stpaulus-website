<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Database Backup</h1>
      <p class="text-sm sm:text-base text-gray-600">
        Backup seluruh database ke file SQL yang bisa di-restore kapan saja
      </p>
    </div>

    <!-- Backup Card -->
    <div class="w-full max-w-3xl">
      <div class="bg-white rounded-lg shadow p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">
          <div class="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 text-blue-600 items-center justify-center">
            <svg class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 sm:block">
              <div class="sm:hidden flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Backup Database</h3>
            </div>
            <p class="mt-1 text-xs sm:text-sm text-gray-500">
              Backup akan mencakup semua tabel, struktur, dan data dalam format SQL standar.
            </p>

            <!-- Stats -->
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div class="text-[11px] sm:text-xs text-gray-500">Database</div>
                <div class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ dbName }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div class="text-[11px] sm:text-xs text-gray-500">Last Backup</div>
                <div class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ lastBackup }}</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-col sm:flex-row gap-3">
              <button @click="downloadBackup" :disabled="isDownloading"
                class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg v-if="!isDownloading" class="mr-2 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <svg v-else class="animate-spin mr-2 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ isDownloading ? 'Membuat Backup...' : 'Download Backup Sekarang' }}
              </button>

              <NuxtLink
                to="/admin/restore"
                class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <svg class="mr-2 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restore Database
              </NuxtLink>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="mt-4 rounded-lg bg-green-50 p-3 sm:p-4 border border-green-200">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 min-w-0 flex-1">
                  <p class="text-xs sm:text-sm font-semibold text-green-800 break-words">{{ successMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-4 rounded-lg bg-red-50 p-3 sm:p-4 border border-red-200">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 min-w-0 flex-1">
                  <p class="text-xs sm:text-sm font-medium text-red-800 break-words">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <h3 class="text-xs sm:text-sm font-semibold text-blue-800">Cara Restore Backup</h3>
            <div class="mt-1 text-xs sm:text-sm text-blue-700">
              <p class="mb-2">Untuk restore database dari file backup via CLI:</p>
              <code class="block bg-blue-100 rounded px-2.5 py-1.5 text-[11px] sm:text-xs font-mono break-all">
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
