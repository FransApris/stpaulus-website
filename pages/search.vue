<template>
  <div class="min-h-screen pt-20 bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <Breadcrumb title="Hasil Pencarian" />

      <!-- Search Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Hasil Pencarian</h1>

        <!-- Search Input -->
        <div class="max-w-md mx-auto relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari artikel, berita, agenda..."
            class="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
            @input="handleSearchInput"
          />
          <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Search Stats -->
        <div v-if="searchQuery && searchQuery.length >= 2" class="mt-4 text-gray-600">
          <p v-if="isSearching">Mencari...</p>
          <p v-else-if="searchResults.length > 0">
            Menampilkan {{ ((currentPage - 1) * perPage) + 1 }}-{{ Math.min(currentPage * perPage, totalResults) }} 
            dari {{ totalResults }} hasil untuk "{{ searchQuery }}"
          </p>
          <p v-else-if="!isSearching">Tidak ada hasil untuk "{{ searchQuery }}"</p>
        </div>
      </div>

      <!-- ✅ FASE 3: Advanced Filters -->
      <div v-if="searchQuery && searchQuery.length >= 2" class="max-w-4xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Pencarian
            </h3>
            <button 
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-xs text-[#882f1d] hover:text-[#6b2416] font-medium"
            >
              Reset Filter
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Filter by Type -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Tipe Konten</label>
              <select 
                v-model="selectedType"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
              >
                <option value="">Semua Tipe</option>
                <option value="article">Artikel</option>
                <option value="news">Berita</option>
                <option value="agenda">Agenda</option>
                <option value="document">Dokumen</option>
              </select>
            </div>

            <!-- Filter by Date Range -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal Dari</label>
              <input 
                v-model="dateFrom"
                type="date"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal Sampai</label>
              <input 
                v-model="dateTo"
                type="date"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
              />
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="hasActiveFilters" class="mt-3 pt-3 border-t border-gray-100">
            <div class="flex flex-wrap gap-2">
              <span class="text-xs text-gray-600">Filter aktif:</span>
              <span v-if="selectedType" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#882f1d] text-white">
                {{ getTypeLabel(selectedType) }}
                <button @click="selectedType = ''" class="ml-1 hover:text-gray-200">×</button>
              </span>
              <span v-if="dateFrom" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Dari: {{ formatDate(dateFrom) }}
                <button @click="dateFrom = ''" class="ml-1 hover:text-blue-600">×</button>
              </span>
              <span v-if="dateTo" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Sampai: {{ formatDate(dateTo) }}
                <button @click="dateTo = ''" class="ml-1 hover:text-blue-600">×</button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto mb-4"></div>
        <p class="text-gray-500">Memuat hasil pencarian...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="searchError" class="text-center py-12">
        <p class="text-red-500 mb-4">{{ searchError }}</p>
        <button
          @click="retrySearch"
          class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Search Results -->
      <div v-else-if="searchResults.length > 0" class="max-w-4xl mx-auto">
        <!-- ✅ FASE 3: Quick Stats & Sort Options -->
        <div class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- Quick Stats -->
            <div class="flex items-center gap-4 flex-wrap">
              <span class="text-sm font-medium text-gray-700">Hasil:</span>
              <div class="flex gap-2">
                <button
                  v-for="stat in resultStats"
                  :key="stat.type"
                  @click="filterByType(stat.type)"
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    selectedType === stat.type 
                      ? 'bg-[#882f1d] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ stat.icon }} {{ stat.count }} {{ stat.label }}
                </button>
              </div>
            </div>

            <!-- Sort Options -->
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Urutkan:</span>
              <select
                v-model="selectedSort"
                class="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
              >
                <option value="relevance">Paling Relevan</option>
                <option value="date_desc">Terbaru</option>
                <option value="date_asc">Terlama</option>
                <option value="title_asc">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div
            v-for="result in searchResults"
            :key="`${result.type}-${result.id}`"
            class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div class="p-6">
              <!-- Type Badge and Date -->
              <div class="flex items-center justify-between mb-3">
                <span
                  :class="getTypeBadgeClasses(result.type)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ getTypeLabel(result.type) }}
                </span>
                <span class="text-sm text-gray-500">{{ result.formatted_date }}</span>
              </div>

              <!-- Title -->
              <h2 class="text-xl font-bold text-gray-900 mb-3">
                <NuxtLink
                  :to="result.url"
                  class="hover:text-[#882f1d] transition-colors"
                  v-html="highlightText(result.title, searchQuery)"
                ></NuxtLink>
              </h2>

              <!-- Excerpt -->
              <p v-if="result.excerpt" class="text-gray-600 mb-4" v-html="highlightText(result.excerpt, searchQuery)"></p>

              <!-- Meta Information -->
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center space-x-4">
                  <span v-if="result.author">Oleh: {{ result.author }}</span>
                  <span v-if="result.location">Lokasi: {{ result.location }}</span>
                  <span v-if="result.category_name && result.category_color" class="flex items-center">
                    <div
                      class="w-3 h-3 rounded-full mr-2"
                      :style="{ backgroundColor: result.category_color }"
                    ></div>
                    {{ result.category_name }}
                  </span>
                </div>

                <NuxtLink
                  :to="result.url"
                  class="text-[#882f1d] font-medium hover:text-[#6b2416] transition-colors"
                >
                  Baca Selengkapnya →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ FASE 2: Pagination UI -->
        <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center space-x-2">
          <!-- Previous Button -->
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="!hasPrevPage"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              hasPrevPage 
                ? 'bg-white text-[#882f1d] border border-[#882f1d] hover:bg-[#882f1d] hover:text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            ← Sebelumnya
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center space-x-1">
            <button
              v-for="pageNum in visiblePages"
              :key="pageNum"
              @click="typeof pageNum === 'number' && goToPage(pageNum)"
              :class="[
                'w-10 h-10 rounded-lg font-medium transition-colors',
                pageNum === currentPage
                  ? 'bg-[#882f1d] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ pageNum }}
            </button>
          </div>

          <!-- Next Button -->
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="!hasNextPage"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              hasNextPage 
                ? 'bg-white text-[#882f1d] border border-[#882f1d] hover:bg-[#882f1d] hover:text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            Selanjutnya →
          </button>
        </div>

        <!-- Results Per Page Info -->
        <div v-if="totalResults > 0" class="mt-4 text-center text-sm text-gray-500">
          Halaman {{ currentPage }} dari {{ totalPages }} • {{ perPage }} hasil per halaman
        </div>
      </div>

      <!-- No Results State -->
      <div v-else-if="searchQuery && searchQuery.length >= 2 && !isSearching" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Tidak ada hasil ditemukan</h3>
        <p class="text-gray-500 mb-6">Coba kata kunci yang berbeda atau periksa ejaan Anda.</p>
        <button
          @click="clearSearch"
          class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors"
        >
          Hapus Pencarian
        </button>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Mulai pencarian</h3>
        <p class="text-gray-500">Ketik minimal 2 karakter untuk mencari artikel, berita, atau agenda.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearch } from '~/composables/useSearch'

// Get search query from URL
const route = useRoute()
const router = useRouter()

// Composables - get debouncedSearch from composable
const { 
  searchQuery, 
  searchResults, 
  isSearching, 
  searchError, 
  clearSearch,
  searchMetadata, // ✅ FASE 2: Get pagination metadata
  debouncedSearch // ✅ FASE 3: Get search function
} = useSearch()

// ✅ FASE 3: Filter state
const selectedType = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedSort = ref('relevance')

// ✅ FASE 3: Computed for active filters
const hasActiveFilters = computed(() => {
  return selectedType.value || dateFrom.value || dateTo.value
})

// ✅ FASE 3: Quick Stats - Calculate result distribution by type
const resultStats = computed(() => {
  if (!searchResults.value || searchResults.value.length === 0) return []
  
  const stats = {
    article: { count: 0, label: 'Artikel', icon: '📄', type: 'article' },
    news: { count: 0, label: 'Berita', icon: '📰', type: 'news' },
    agenda: { count: 0, label: 'Agenda', icon: '📅', type: 'agenda' },
    document: { count: 0, label: 'Dokumen', icon: '📁', type: 'document' }
  }
  
  searchResults.value.forEach((result) => {
    const type = result.type as 'article' | 'news' | 'agenda' | 'document'
    if (stats[type]) {
      stats[type].count++
    }
  })
  
  // Only return types with results
  return Object.values(stats).filter(s => s.count > 0)
})

// ✅ FASE 3: Filter by type from stats
const filterByType = (type: string) => {
  if (selectedType.value === type) {
    selectedType.value = '' // Toggle off if already selected
  } else {
    selectedType.value = type
  }
}

// ✅ FASE 3: Clear all filters
const clearFilters = () => {
  selectedType.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  selectedSort.value = 'relevance'
}

// ✅ FASE 3: Format date for display
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

// ✅ FASE 2: Pagination state
const currentPage = computed(() => searchMetadata.value?.page || 1)
const totalPages = computed(() => searchMetadata.value?.totalPages || 0)
const totalResults = computed(() => searchMetadata.value?.total || 0)
const perPage = computed(() => searchMetadata.value?.perPage || 20)
const hasNextPage = computed(() => searchMetadata.value?.hasNextPage || false)
const hasPrevPage = computed(() => searchMetadata.value?.hasPrevPage || false)

// ✅ FASE 2: Calculate visible page numbers (max 5 pages)
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 5) {
    // Show all pages if <= 5
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate range around current page
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add pages around current
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (end < total - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

// Initialize search from URL query parameter
onMounted(() => {
  const urlQuery = route.query.q
  if (typeof urlQuery === 'string' && urlQuery) {
    searchQuery.value = urlQuery
  }
  
  // ✅ FASE 3: Initialize filters from URL
  if (route.query.type) {
    selectedType.value = route.query.type as string
  }
  if (route.query.dateFrom) {
    dateFrom.value = route.query.dateFrom as string
  }
  if (route.query.dateTo) {
    dateTo.value = route.query.dateTo as string
  }
  if (route.query.sort) {
    selectedSort.value = route.query.sort as string
  }
})

// Watch for URL query changes (from navigation)
watch(() => route.query.q, (newQuery) => {
  const queryString = typeof newQuery === 'string' ? newQuery : ''
  if (queryString !== searchQuery.value) {
    searchQuery.value = queryString
  }
}, { immediate: false })

// ✅ FASE 2: Watch for page changes in URL
watch(() => route.query.page, (newPage) => {
  // Page change is handled in composable via URL param
}, { immediate: false })

// ✅ FASE 3: Watch filters and update URL + trigger search
watch([selectedType, dateFrom, dateTo, selectedSort], () => {
  if (!searchQuery.value || searchQuery.value.length < 2) return
  
  // Build query params with filters
  const queryParams: any = {
    q: searchQuery.value,
    page: '1' // Reset to page 1 when filters change
  }
  
  if (selectedType.value) {
    queryParams.type = selectedType.value
  }
  if (dateFrom.value) {
    queryParams.dateFrom = dateFrom.value
  }
  if (dateTo.value) {
    queryParams.dateTo = dateTo.value
  }
  if (selectedSort.value && selectedSort.value !== 'relevance') {
    queryParams.sort = selectedSort.value
  }
  
  // Update URL and trigger search with filters
  router.push({ query: queryParams })
  
  // Trigger search immediately with filters
  debouncedSearch(searchQuery.value, 1, {
    type: selectedType.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    sort: selectedSort.value
  })
}, { deep: true })

// Watch searchQuery changes to update URL (avoid circular updates)
let isUpdatingFromUrl = false
watch(searchQuery, (newQuery) => {
  if (isUpdatingFromUrl) return
  
  // Update URL when search query changes (reset to page 1)
  if (newQuery && newQuery.trim().length >= 2) {
    isUpdatingFromUrl = true
    router.push({ query: { q: newQuery.trim(), page: '1' } }).finally(() => {
      isUpdatingFromUrl = false
    })
  } else if (route.query.q) {
    isUpdatingFromUrl = true
    router.push({ query: {} }).finally(() => {
      isUpdatingFromUrl = false
    })
  }
})

// ✅ FASE 2: Pagination methods
const goToPage = (page: number) => {
  if (typeof page !== 'number' || page < 1 || page > totalPages.value) return
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  // Update URL with new page
  router.push({ 
    query: { 
      q: searchQuery.value, 
      page: String(page) 
    } 
  })
}

// Methods
const handleSearchInput = () => {
  // Search is now handled by watch on searchQuery
  // No need to do anything here
}

const retrySearch = () => {
  if (searchQuery.value) {
    // Force re-trigger by clearing and setting again
    const query = searchQuery.value
    searchQuery.value = ''
    nextTick(() => {
      searchQuery.value = query
    })
  }
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    article: 'Artikel',
    news: 'Berita',
    agenda: 'Agenda',
    document: 'Dokumen'
  }
  return labels[type] || type
}

const getTypeBadgeClasses = (type: string) => {
  const classes: Record<string, string> = {
    article: 'bg-blue-100 text-blue-800',
    news: 'bg-green-100 text-green-800',
    agenda: 'bg-purple-100 text-purple-800',
    document: 'bg-orange-100 text-orange-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const highlightText = (text: string, query: string) => {
  if (!query || !text) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}
</script>

<style scoped>
mark {
  background-color: #fef3c7;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>
