<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb :title="`Artikel Kategori: ${category?.name || slug}`" />

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Artikel Kategori: {{ category?.name || slug }}</h1>
          <p v-if="category?.description" class="text-xl text-gray-600 max-w-3xl mx-auto">{{ category.description }}</p>
        </div>

        <!-- Articles Section -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Memuat artikel...</p>
        </div>
        <div v-else-if="error" class="text-center py-8">
          <div class="text-red-500 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <p class="text-gray-700 font-medium mb-2">Kategori tidak ditemukan</p>
          <p class="text-gray-500 text-sm mb-4">Kategori "{{ slug }}" tidak tersedia atau telah dihapus.</p>
          <NuxtLink to="/artikel" class="inline-block bg-[#882f1d] text-white px-6 py-2 rounded-md hover:bg-[#6b2416] transition-colors">
            Kembali ke Artikel
          </NuxtLink>
        </div>
        <div v-else-if="articles.length === 0" class="text-center py-8">
          <p class="text-gray-500">Belum ada artikel dalam kategori ini.</p>
          <NuxtLink to="/artikel" class="inline-block mt-4 text-[#882f1d] hover:underline">
            Lihat Semua Artikel
          </NuxtLink>
        </div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :title="article.title"
            :description="article.excerpt"
            :date="formatDate(article.published_at)"
            :to="`/artikel/${article.slug}`"
            :link-text="'Baca Selengkapnya →'"
          />
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Artikel Kategori - St. Paulus'
})

const route = useRoute()
const slug = route.params.slug

console.log('[Category Page] Loading articles for slug:', slug)

// Fetch category articles with cache busting
const timestamp = Date.now()
const { data: categoryData, pending: loading, error } = await useAsyncData(
  `category-articles-${slug}`, 
  async () => {
    try {
      return await $fetch(`/api/artikel/kategori/${slug}?_=${timestamp}`)
    } catch (err) {
      console.error('Failed to fetch category articles:', err)
      return { category: null, articles: [] }
    }
  },
  {
    default: () => ({ category: null, articles: [] }),
    transform: (data) => data || { category: null, articles: [] }
  }
)

console.log('[Category Page] Data loaded:', categoryData.value)
console.log('[Category Page] Error:', error.value)

const category = computed(() => categoryData.value?.category || null)
const articles = computed(() => categoryData.value?.articles || [])

// Handle error after data is loaded
watch(error, (newError) => {
  if (newError) {
    console.error('Error loading category articles:', newError)
  }
})

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
</script>

<style scoped>
.prose { color: #374151; }
</style>
