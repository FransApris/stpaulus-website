<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Kronik Gereja" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Kronik Gereja</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Perjalanan sejarah dan peristiwa penting Paroki St. Paulus Juanda
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Kronik Gereja" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Kronik Gereja Section -->
        <div class="mt-8 md:mt-16 w-full md:max-w-[85%] lg:max-w-[75%] mx-auto">
          <!-- Action Buttons -->
          <div class="flex justify-center items-center gap-2 md:gap-3 mb-6 md:mb-8">
            <button @click="exportToPDF"
              class="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-[#882f1d] bg-white border-2 border-[#882f1d] hover:bg-[#882f1d] hover:text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              title="Ekspor ke PDF">
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              <span class="hidden sm:inline">Ekspor PDF</span>
              <span class="sm:hidden">PDF</span>
            </button>
            <button @click="printKronik"
              class="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-[#882f1d] bg-white border-2 border-[#882f1d] hover:bg-[#882f1d] hover:text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              title="Cetak">
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                </path>
              </svg>
              <span class="hidden sm:inline">Cetak</span>
              <span class="sm:hidden">Print</span>
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#882f1d] border-t-transparent mx-auto">
            </div>
            <p class="mt-4 text-sm md:text-base text-gray-500">Memuat kronik...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="kronikItems.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 md:w-20 md:h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            <p class="text-gray-500 text-sm md:text-base">Belum ada kronik tersedia.</p>
          </div>

          <!-- Timeline Content -->
          <Timeline v-else :items="kronikItems" />

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-8 md:mt-12">
            <nav class="flex items-center gap-2">
              <!-- Previous Button -->
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
                class="px-3 py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span class="hidden sm:inline">Sebelumnya</span>
                <span class="sm:hidden">←</span>
              </button>

              <!-- Page Numbers -->
              <div class="flex items-center gap-1">
                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                  'px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors',
                  page === currentPage
                    ? 'bg-[#882f1d] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                ]">
                  {{ page }}
                </button>
              </div>

              <!-- Next Button -->
              <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages"
                class="px-3 py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span class="hidden sm:inline">Selanjutnya</span>
                <span class="sm:hidden">→</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8 md:mt-12">
          <BackButton position="bottom" />
        </div>
      </div>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('kronik-gereja')
// Page meta
definePageMeta({
  title: 'Kronik Gereja - St. Paulus'
})

// Dynamic import for Timeline component (only loaded when needed)
const Timeline = defineAsyncComponent(() => import('~/components/Timeline.vue'))

const kronikItems = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 10

const fetchKronik = async (page = 1) => {
  loading.value = true
  try {
    const response = await $fetch(`/api/kronik?page=${page}&limit=${limit}`)
    kronikItems.value = response.items
    totalPages.value = response.totalPages
    currentPage.value = response.page
  } catch (error) {
    console.error('Failed to fetch kronik:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (process.client) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
  fetchKronik()
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchKronik(page)
  }
}

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const exportToPDF = () => {
  // Simple PDF export using browser print to PDF
  window.print()
}

const printKronik = () => {
  window.print()
}
</script>

<style scoped>
.prose {
  color: #374151;
}
</style>
