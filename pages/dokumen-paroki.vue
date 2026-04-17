<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Dokumen Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Koleksi dokumen resmi dan informasi penting Gereja St. Paulus Juanda
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Dokumen Paroki" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Category Filter -->
      <div class="mb-8">
        <div class="flex flex-wrap justify-center gap-4">
          <button @click="selectedCategory = ''" :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            selectedCategory === ''
              ? 'bg-[#882f1d] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            Semua Dokumen
          </button>
          <button v-for="category in categories" :key="category.id" @click="selectedCategory = category.id" :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center',
            selectedCategory === category.id
              ? 'bg-[#882f1d] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            <div class="w-3 h-3 rounded mr-2" :style="{ backgroundColor: category.color }"></div>
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Documents Grid -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-4 text-gray-600">Memuat dokumen...</p>
      </div>

      <div v-else-if="filteredDocuments.length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
          </path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Tidak ada dokumen ditemukan</h3>
        <p class="mt-2 text-gray-500">Belum ada dokumen yang tersedia untuk kategori ini.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doc in paginatedDocuments" :key="doc.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
          <div class="p-6">
            <!-- Category Badge -->
            <div class="flex items-center mb-3">
              <div class="flex-shrink-0 w-4 h-4 rounded mr-2" :style="{ backgroundColor: doc.category_color }"></div>
              <span class="text-sm font-medium text-gray-600">{{ doc.category_name }}</span>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ doc.title }}</h3>

            <!-- Description -->
            <p v-if="doc.description" class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ doc.description }}
            </p>

            <!-- File Info -->
            <div class="text-sm text-gray-500 mb-2">
              {{ doc.original_filename }} • {{ formatFileSize(doc.file_size) }}
            </div>

            <!-- Upload Date and Action Buttons Row -->
            <div class="flex items-center justify-between">
              <!-- Upload Date -->
              <div class="text-xs text-gray-400">
                Diunggah: {{ formatDate(doc.created_at) }}
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-1">
                <button @click="viewDocument(doc)"
                  :disabled="loadingDocId === doc.id"
                  class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
                  title="Lihat Dokumen">
                  <svg v-if="loadingDocId === doc.id" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                    </path>
                  </svg>
                </button>
                <button @click="printDocument(doc)"
                  :disabled="loadingDocId === doc.id"
                  class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
                  title="Cetak (buka PDF lalu Ctrl+P)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                    </path>
                  </svg>
                </button>
                <button @click="downloadDocument(doc)"
                  class="p-2 text-gray-600 hover:text-[#882f1d] hover:bg-red-50 rounded-md transition-colors duration-200"
                  title="Download Dokumen">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
          class="rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
          Sebelumnya
        </button>
        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
          class="rounded border px-3 py-2 text-sm"
          :class="page === currentPage ? 'border-[#882f1d] bg-[#882f1d] text-white' : 'hover:bg-gray-50'">
          {{ page }}
        </button>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
          Berikutnya
        </button>
      </div>

      <!-- Back Button -->
      <BackButton position="bottom" />
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Dokumen Paroki - St. Paulus'
})

// Reactive data
const categories = useState('public-document-categories', () => [])
const documents = useState('public-documents', () => [])
const loading = ref(false)
const loadingDocId = ref(null)
const selectedCategory = ref('')
const currentPage = useState('public-documents-page', () => 1)
const pageLimit = 10

// Computed filtered documents
const filteredDocuments = computed(() => {
  if (!selectedCategory.value) {
    return documents.value
  }
  // Use == (not ===) to handle potential number/string mismatch from API
  return documents.value.filter(doc => doc.category_id == selectedCategory.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredDocuments.value.length / pageLimit)))
const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return filteredDocuments.value.slice(start, start + pageLimit)
})
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let page = start; page <= end; page++) pages.push(page)
  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/document-categories')
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Fetch documents
const fetchDocuments = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/documents', { server: false })
    documents.value = response
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  } finally {
    loading.value = false
  }
}

const getDocumentUrl = (docId, mode = 'attachment') => `/api/documents/${docId}/download?mode=${mode}`

// Buka dokumen lewat API server lalu tampilkan sebagai blob URL
// Cara ini 100% same-origin, tidak ada masalah cross-origin/chrome-error
const openDocumentAsBlob = async (doc) => {
  if (!process.client) return
  // Buka tab baru dulu (synchronous) agar popup blocker tidak aktif
  const newTab = globalThis.window.open('', '_blank')
  loadingDocId.value = doc.id
  try {
    const response = await fetch(getDocumentUrl(doc.id, 'attachment'))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    if (newTab) {
      newTab.location.href = blobUrl
    } else {
      globalThis.window.open(blobUrl, '_blank', 'noopener')
    }
    // Bersihkan blob URL setelah 60 detik
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
  } catch (error) {
    console.error('Failed to open document:', error)
    if (newTab) newTab.close()
    alert('Gagal membuka dokumen. Silakan coba lagi.')
  } finally {
    loadingDocId.value = null
  }
}

const viewDocument = (doc) => openDocumentAsBlob(doc)
const printDocument = (doc) => openDocumentAsBlob(doc)

const downloadDocument = (doc) => {
  if (process.client) {
    try {
      const a = globalThis.document.createElement('a')
      a.href = getDocumentUrl(doc.id, 'attachment')
      a.download = doc.original_filename
      globalThis.document.body.appendChild(a)
      a.click()
      globalThis.document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download document:', error)
      alert('Gagal mengunduh dokumen')
    }
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Initialize
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchDocuments()])
})

watch(selectedCategory, () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
