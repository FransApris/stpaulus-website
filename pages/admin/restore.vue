<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Database Restore</h1>
      <p class="text-sm sm:text-base text-gray-600">
        Restore database dari file backup SQL
      </p>
    </div>

    <!-- Warning Alert -->
    <div class="w-full max-w-3xl">
      <div class="bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 rounded-r-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-amber-800">Peringatan!</h3>
            <div class="mt-1 text-xs sm:text-sm text-amber-700 space-y-1">
              <p>Restore database akan <strong>menghapus semua data yang ada</strong> dan menggantinya dengan data dari file backup.</p>
              <p>Pastikan Anda sudah membuat backup database saat ini sebelum melakukan restore!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Restore Card -->
    <div class="w-full max-w-3xl">
      <div class="bg-white rounded-lg shadow p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">
          <div class="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-xl bg-green-50 text-green-600 items-center justify-center">
            <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 sm:block">
              <div class="sm:hidden flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Upload File Backup</h3>
            </div>
            <p class="mt-1 text-xs sm:text-sm text-gray-500">
              Pilih file SQL backup untuk di-restore ke database.
            </p>

            <!-- File Upload Area -->
            <div class="mt-4">
              <div
                @drop="handleDrop"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @click="$refs.fileInput?.click()"
                :class="[
                  'border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors',
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
                  selectedFile ? 'bg-green-50 border-green-500' : ''
                ]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept=".sql"
                  @change="handleFileSelect"
                  class="hidden"
                />
                
                <div v-if="!selectedFile">
                  <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p class="mt-2 text-xs sm:text-sm text-gray-600">
                    <span class="font-semibold text-blue-600">Klik untuk pilih file</span> atau drag & drop
                  </p>
                  <p class="text-xs text-gray-500 mt-1">File SQL backup (maksimal 50MB)</p>
                </div>

                <div v-else class="flex items-center justify-between gap-2 overflow-hidden">
                  <div class="flex items-center min-w-0 flex-1">
                    <svg class="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-left min-w-0 flex-1">
                      <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ selectedFile.name }}</p>
                      <p class="text-[11px] sm:text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                    </div>
                  </div>
                  <button
                    @click.stop="clearFile"
                    type="button"
                    class="flex-shrink-0 text-red-600 hover:text-red-800 p-1"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- File info -->
              <div v-if="selectedFile" class="mt-2 text-xs text-gray-600">
                <p>✓ File siap untuk di-upload</p>
              </div>
            </div>

            <!-- Restore Button -->
            <div class="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                @click="restoreDatabase"
                :disabled="!selectedFile || isRestoring"
                class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="!isRestoring" class="mr-2 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="animate-spin mr-2 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ isRestoring ? 'Restoring Database...' : 'Restore Database' }}
              </button>

              <NuxtLink
                to="/admin/backup"
                class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <svg class="mr-2 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Backup Database Dulu
              </NuxtLink>
            </div>

            <!-- Success Message with stats -->
            <div v-if="successMessage" class="mt-4 rounded-lg bg-green-50 p-3 sm:p-4 border border-green-200">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <p class="text-xs sm:text-sm font-semibold text-green-800">{{ successMessage }}</p>
                  
                  <!-- Restore Stats -->
                  <div v-if="restoreStats" class="mt-2 text-xs text-green-700 space-y-1">
                    <p>Total statements: {{ restoreStats.totalStatements }}</p>
                    <p>Success: {{ restoreStats.successCount }}</p>
                    <p v-if="restoreStats.errorCount > 0" class="text-orange-700">
                      Errors: {{ restoreStats.errorCount }}
                    </p>
                    
                    <!-- Show errors if any -->
                    <div v-if="restoreStats.errors && restoreStats.errors.length > 0" class="mt-2">
                      <p class="font-medium text-orange-800">Beberapa error yang terjadi:</p>
                      <ul class="list-disc list-inside mt-1 text-orange-700 overflow-x-auto space-y-1">
                        <li v-for="(error, i) in restoreStats.errors" :key="i" class="break-words">
                          {{ error }}
                        </li>
                      </ul>
                    </div>
                  </div>
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
            <h3 class="text-xs sm:text-sm font-semibold text-blue-800">Catatan Penting</h3>
            <div class="mt-1 text-xs sm:text-sm text-blue-700">
              <ul class="list-disc list-inside space-y-1">
                <li>Pastikan file backup dalam format SQL yang valid</li>
                <li>File backup harus dari database yang sama (stpaulus_cms_db)</li>
                <li>Proses restore akan menghapus semua data yang ada</li>
                <li>Backup database saat ini terlebih dahulu sebagai pengaman</li>
                <li>Jangan tutup browser selama proses restore berlangsung</li>
              </ul>
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

const selectedFile = ref(null)
const isRestoring = ref(false)
const isDragging = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const restoreStats = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  // Check file extension
  if (!file.name.endsWith('.sql')) {
    errorMessage.value = 'File harus berformat .sql'
    return
  }

  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    errorMessage.value = 'File terlalu besar. Maksimal 50MB'
    return
  }

  selectedFile.value = file
  errorMessage.value = ''
  successMessage.value = ''
  restoreStats.value = null
}

const clearFile = () => {
  selectedFile.value = null
  errorMessage.value = ''
  successMessage.value = ''
  restoreStats.value = null
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const restoreDatabase = async () => {
  if (!selectedFile.value) return

  isRestoring.value = true
  successMessage.value = ''
  errorMessage.value = ''
  restoreStats.value = null

  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login ulang.')
    }

    console.log('[Restore] Starting restore, file:', selectedFile.value.name)

    // Create FormData
    const formData = new FormData()
    formData.append('sqlFile', selectedFile.value)

    // Upload and restore
    const response = await $fetch('/api/admin/restore/database', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    console.log('[Restore] Success:', response)
    
    successMessage.value = response.message || 'Database berhasil di-restore!'
    restoreStats.value = response.stats
    
    // Clear file after success
    setTimeout(() => {
      clearFile()
    }, 3000)

  } catch (error) {
    console.error('[Restore] Error:', error)
    errorMessage.value = error.data?.message || error.message || 'Gagal restore database'
    
    // Show error details if available
    if (error.data?.data?.errors) {
      console.error('[Restore] Errors:', error.data.data.errors)
    }
  } finally {
    isRestoring.value = false
  }
}
</script>
