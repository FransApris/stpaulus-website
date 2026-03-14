<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Pull to Refresh Indicator -->
    <div
      v-if="pullState.isPulling || pullState.isRefreshing"
      class="fixed top-20 left-0 right-0 z-40 bg-[#882f1d] text-white text-center py-2 transition-transform duration-200"
      :style="{ transform: `translateY(${Math.max(0, pullState.pullDistance - 20)}px)` }"
    >
      <div class="flex items-center justify-center space-x-2">
        <div v-if="pullState.isRefreshing" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span class="text-sm font-medium">
          {{ pullState.isRefreshing ? 'Memuat ulang...' : pullState.canRefresh ? 'Lepaskan untuk memuat ulang' : 'Tarik ke bawah untuk memuat ulang' }}
        </span>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Berita Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Update terbaru tentang kegiatan dan acara gereja kami
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Berita" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <p class="text-gray-500">Memuat berita...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">Error memuat berita: {{ error.message }}</p>
      <NuxtLink to="/berita" class="mt-4 inline-block text-blue-500 hover:underline">Coba Lagi</NuxtLink>
    </div>

    <!-- Daftar Berita (Grid Card) -->
    <div
      v-else-if="posts && posts.length > 0"
      ref="contentRef"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ArticleCard
        v-for="post in paginatedPosts"
        :key="post.id"
        :image="post.image"
        image-type="url"
        :title="post.title"
        :description="post.excerpt"
        :date="post.date"
        :to="`/berita/${post.slug}`"
        class="touch-manipulation"
      />
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

      <!-- State Kosong -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg">Belum ada berita tersedia. Silakan cek lagi nanti!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const currentPage = useState('public-news-page', () => 1)
const pageLimit = 10

// Fetch data dinamis dari API
const { data: posts, pending, error, refresh } = await useAsyncData('posts', 
  async () => {
    try {
      return await $fetch('/api/berita')
    } catch (err) {
      console.error('Failed to fetch news:', err)
      return []
    }
  },
  {

const totalPages = computed(() => Math.max(1, Math.ceil((posts.value?.length || 0) / pageLimit)))
const paginatedPosts = computed(() => {
  const list = posts.value || []
  const start = (currentPage.value - 1) * pageLimit
  return list.slice(start, start + pageLimit)
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

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})
    default: () => [],
    transform: (data) => data || []
  }
);

// Pull to refresh setup
const contentRef = ref(null)
let pullToRefreshInstance = null

// Initialize pull state as reactive ref
const pullState = ref({
  isPulling: false,
  pullDistance: 0,
  isRefreshing: false,
  canRefresh: false
})

// Update pull to refresh element reference when component mounts
onMounted(() => {
  if (contentRef.value) {
    // Initialize pull to refresh with the actual element
    pullToRefreshInstance = usePullToRefresh(contentRef.value, {
      threshold: 80,
      onRefresh: async () => {
        await refresh()
      }
    })
    // Update the reactive state reference
    pullState.value = pullToRefreshInstance.pullState
  }
})
</script>
