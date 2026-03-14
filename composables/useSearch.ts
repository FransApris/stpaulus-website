export interface SearchResult {
  type: 'article' | 'news' | 'agenda' | 'document'
  id: number
  title: string
  excerpt: string
  slug: string
  date: string
  formatted_date: string
  author: string
  location: string
  category_name: string
  category_color: string
  url: string
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
  total: number
  page: number           // ✅ FASE 2
  perPage: number        // ✅ FASE 2
  totalPages: number     // ✅ FASE 2
  hasNextPage: boolean   // ✅ FASE 2
  hasPrevPage: boolean   // ✅ FASE 2
  queryTime: number
  cached?: boolean
}

export const useSearch = () => {
  const route = useRoute() // ✅ FASE 2: Get current route for page number
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null
  
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const searchMetadata = ref<Omit<SearchResponse, 'results'> | null>(null) // ✅ FASE 2: Store pagination metadata
  const isSearching = ref(false)
  const searchError = ref<string | null>(null)
  const abortController = ref<AbortController | null>(null)

  // ✅ FASE 3: Enhanced search function with filters
  interface SearchFilters {
    type?: string
    dateFrom?: string
    dateTo?: string
    sort?: string
  }

  const runSearch = async (query: string, page: number = 1, filters?: SearchFilters) => {
    if (!query.trim() || query.trim().length < 2) {
      searchResults.value = []
      searchMetadata.value = null
      isSearching.value = false
      return
    }

    // Cancel previous request if still pending
    if (abortController.value) {
      abortController.value.abort()
    }

    // Create new abort controller for this request
    abortController.value = new AbortController()

    try {
      isSearching.value = true
      searchError.value = null

      // ✅ FASE 3: Build query with filters
      const queryParams: any = { 
        q: query.trim(),
        page: String(page)
      }
      
      if (filters?.type) queryParams.type = filters.type
      if (filters?.dateFrom) queryParams.dateFrom = filters.dateFrom
      if (filters?.dateTo) queryParams.dateTo = filters.dateTo
      if (filters?.sort) queryParams.sort = filters.sort

      const response = await $fetch<SearchResponse>('/api/search', {
        method: 'GET',
        query: queryParams,
        signal: abortController.value.signal
      })

      searchResults.value = response.results
      
      // ✅ FASE 2: Store pagination metadata
      searchMetadata.value = {
        query: response.query,
        total: response.total,
        page: response.page,
        perPage: response.perPage,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
        queryTime: response.queryTime,
        cached: response.cached
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error)
        searchError.value = 'Terjadi kesalahan saat mencari. Silakan coba lagi.'
        searchResults.value = []
        searchMetadata.value = null
      }
    } finally {
      isSearching.value = false
    }
  }

  // Debounced search function
  const debouncedSearch = (query: string, page: number = 1, filters?: SearchFilters) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    debounceTimeout = setTimeout(() => {
      debounceTimeout = null
      void runSearch(query, page, filters)
    }, 300)
  }

  // ✅ FASE 2: Watch both search query AND page number changes
  watch([searchQuery, () => route.query.page], ([newQuery, newPage]) => {
    const pageNum = typeof newPage === 'string' ? parseInt(newPage) : 1
    debouncedSearch(newQuery, pageNum || 1)
  })

  // Clear search
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    searchMetadata.value = null // ✅ FASE 2
    searchError.value = null
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (abortController.value) {
      abortController.value.abort()
    }
  })

  return {
    searchQuery, // ✅ Return writable ref (not readonly!)
    searchResults: readonly(searchResults),
    searchMetadata: readonly(searchMetadata), // ✅ FASE 2: Expose pagination metadata
    isSearching: readonly(isSearching),
    searchError: readonly(searchError),
    clearSearch,
    debouncedSearch, // ✅ FASE 3: Expose search function for manual triggering
    // Allow direct setting of search query for programmatic control
    setSearchQuery: (query: string) => {
      searchQuery.value = query
    }
  }
}
