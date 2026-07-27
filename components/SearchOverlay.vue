<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-[100000] flex items-start justify-center pt-4 px-4"
      @click="closeOverlay"
    >
      <!-- Modal Content -->
      <div
        class="bg-white w-full max-w-md rounded-lg shadow-xl max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center p-4 border-b border-gray-200">
          <button
            @click="closeOverlay"
            class="p-2 -m-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Search Input -->
          <div class="flex-1 ml-3 relative">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Cari artikel, berita, agenda..."
              class="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0 text-lg"
              @keydown.enter="handleSearchSubmit"
            />
            <svg class="w-5 h-5 absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 20l-4.35-4.35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <!-- Search Results -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="isSearching" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#882f1d]"></div>
            <span class="ml-2 text-gray-500">Mencari...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="searchError" class="p-4 text-center text-red-500">
            {{ searchError }}
          </div>

          <!-- No Results -->
          <div v-else-if="searchQuery && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching" class="p-4 text-center text-gray-500">
            Tidak ada hasil untuk "{{ searchQuery }}"
          </div>

          <!-- Results List -->
          <div v-else-if="searchResults.length > 0" class="divide-y divide-gray-100">
            <div
              v-for="result in searchResults"
              :key="`${result.type}-${result.id}`"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="navigateToResult(result)"
            >
              <div class="flex items-start space-x-3">
                <!-- Type Badge -->
                <div class="flex-shrink-0">
                  <span
                    :class="getTypeBadgeClasses(result.type)"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getTypeLabel(result.type) }}
                  </span>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    <span v-html="highlightText(result.title, searchQuery)"></span>
                  </h3>

                  <p v-if="result.excerpt" class="text-sm text-gray-600 line-clamp-2 mb-2">
                    <span v-html="highlightText(result.excerpt, searchQuery)"></span>
                  </p>

                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span v-if="result.author">Oleh {{ result.author }}</span>
                    <span v-if="result.formatted_date">{{ result.formatted_date }}</span>
                    <span v-if="result.location">• {{ result.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Initial State -->
          <div v-else class="p-8 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 20l-4.35-4.35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p>Ketik minimal 2 karakter untuk mencari</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useSearch } from '~/composables/useSearch'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Composables
const { searchQuery, searchResults, isSearching, searchError, setSearchQuery } = useSearch()

// Refs
const searchInput = ref(null)

// Methods
const closeOverlay = () => {
  emit('close')
  setSearchQuery('')
}

const handleSearchSubmit = () => {
  // Could navigate to full search page if needed
  // For now, we keep results in overlay
}

const navigateToResult = (result) => {
  navigateTo(result.url)
  closeOverlay()
}

const getTypeLabel = (type) => {
  const labels = {
    article: 'Artikel',
    news: 'Berita',
    agenda: 'Agenda',
    document: 'Dokumen'
  }
  return labels[type] || type
}

const getTypeBadgeClasses = (type) => {
  const classes = {
    article: 'bg-blue-100 text-blue-800',
    news: 'bg-green-100 text-green-800',
    agenda: 'bg-purple-100 text-purple-800',
    document: 'bg-orange-100 text-orange-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const highlightText = (text, query) => {
  if (!query || !text) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

// Focus input when overlay opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && searchInput.value) {
    nextTick(() => {
      searchInput.value.focus()
    })
  }
})

// Close on escape key
onMounted(() => {
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && props.isOpen) {
      closeOverlay()
    }
  }
  document.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
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
</style>
