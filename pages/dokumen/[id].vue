<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16">
      <div class="container mx-auto px-4 max-w-5xl">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-4 text-gray-600">Memuat dokumen...</p>
        </div>

        <!-- Document Content -->
        <div v-else-if="document" class="bg-white shadow-lg rounded-lg overflow-hidden">
          <Breadcrumb 
            :title="document.title" 
            parentTitle="Dokumen Paroki" 
            parentPath="/dokumen-paroki" 
          />

          <div class="p-8">
            <!-- Category Badge -->
            <div v-if="document.category_name" class="mb-4">
              <div class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                <div 
                  class="w-3 h-3 rounded-full mr-2" 
                  :style="{ backgroundColor: document.category_color || '#888' }"
                ></div>
                <span class="text-sm font-medium text-gray-700">{{ document.category_name }}</span>
              </div>
            </div>

            <!-- Title -->
            <h1 class="text-4xl font-cinzel text-[#882f1d] mb-6">{{ document.title }}</h1>

            <!-- File Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p class="text-xs text-gray-500">Nama File</p>
                  <p class="text-sm font-medium text-gray-900">{{ document.original_filename }}</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                </svg>
                <div>
                  <p class="text-xs text-gray-500">Ukuran File</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatFileSize(document.file_size) }}</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p class="text-xs text-gray-500">Diunggah</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(document.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="document.description" class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-3">Deskripsi</h2>
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ document.description }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 mb-8">
              <button
                @click="viewDocument"
                class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Lihat Dokumen
              </button>
              
              <button
                @click="printDocument"
                class="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
                Cetak
              </button>
              
              <button
                @click="downloadDocument"
                class="flex items-center px-6 py-3 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors duration-200 shadow-md"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download
              </button>
            </div>

            <!-- Back Button -->
            <div class="pt-6 border-t border-gray-200">
              <NuxtLink 
                to="/dokumen-paroki" 
                class="inline-flex items-center text-[#882f1d] hover:text-[#6b2416] font-medium transition-colors duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Kembali ke Dokumen Paroki
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else class="bg-white shadow-lg rounded-lg p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Dokumen Tidak Ditemukan</h2>
          <p class="text-gray-600 mb-6">Dokumen dengan ID: {{ id }} tidak ditemukan atau telah dihapus.</p>
          <NuxtLink 
            to="/dokumen-paroki" 
            class="inline-flex items-center px-6 py-3 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Kembali ke Dokumen Paroki
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id

// Page meta
definePageMeta({
  title: 'Detail Dokumen - St. Paulus'
})

// Fetch document data
const { data: document, pending: loading, error } = await useAsyncData(
  `dokumen-${id}`,
  async () => {
    try {
      return await $fetch(`/api/documents/${id}`)
    } catch (err) {
      console.error('Failed to fetch document detail:', err)
      return null
    }
  },
  {
    default: () => null,
    transform: (data) => data || null
  }
)

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format file size helper
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Document actions
const viewDocument = () => {
  if (document.value?.id) {
    window.open(`/api/documents/${document.value.id}/download?mode=inline`, '_blank')
  }
}

const printDocument = () => {
  if (document.value?.id) {
    const printWindow = window.open(`/api/documents/${document.value.id}/download?mode=inline`, '_blank')
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }
}

const downloadDocument = () => {
  if (document.value?.id) {
    const link = window.document.createElement('a')
    link.href = `/api/documents/${document.value.id}/download?mode=attachment`
    link.download = document.value.original_filename || 'document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// SEO
useHead(() => ({
  title: document.value ? `${document.value.title} - Dokumen Paroki St. Paulus` : 'Detail Dokumen',
  meta: [
    { 
      name: 'description', 
      content: document.value?.description || 'Dokumen resmi Gereja St. Paulus Juanda' 
    }
  ]
}))
</script>

<style scoped>
/* Additional styling if needed */
</style>
