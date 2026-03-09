<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb 
          :title="categoryName" 
          parentTitle="Kronik Paroki" 
          parentPath="/kronik" 
        />

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">{{ categoryName }}</h1>
          <p v-if="categoryDescription" class="text-xl text-gray-600 max-w-3xl mx-auto">{{ categoryDescription }}</p>
        </div>

    <!-- Entries List -->
    <section class="max-w-7xl mx-auto">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500">Memuat data...</p>
      </div>

      <div v-else-if="entries && entries.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="entry in entries"
          :key="entry.id"
          :to="`/kronik/${categorySlug}/${entry.id}`"
          class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 block no-underline"
          style="text-decoration: none; color: inherit;"
        >
          <div v-if="entry.featured_image" class="h-48 overflow-hidden">
            <img :src="entry.featured_image" :alt="entry.what_title || 'Kronik'" class="w-full h-full object-cover" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ entry.what_title || 'Tanpa Judul' }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-3">{{ stripHtml(entry.what_description || '') }}</p>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(entry.when_date) }}
              </span>
              <span class="text-[#c58229] font-medium flex items-center">
                Lihat Detail 
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="text-gray-500 text-lg">Belum ada kronik untuk kategori ini</p>
      </div>
    </section>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const categorySlug = String(route.params.category || '')

console.log('[Kronik Category Page] Category slug:', categorySlug)

const { data: response, pending: loading } = await useFetch(`/api/kronik/category/${categorySlug}`)

const entries = computed(() => {
  const data = response.value?.data || []
  console.log('[Kronik Category] Entries:', data.length, 'items')
  if (data.length > 0) {
    console.log('[Kronik Category] First entry:', { id: data[0].id, title: data[0].what_title })
  }
  return data
})
const categoryName = computed(() => response.value?.category?.name || categorySlug)
const categoryDescription = computed(() => response.value?.category?.description || '')

// Strip HTML tags from text
const stripHtml = (html) => {
  if (!html) return ''
  // Remove HTML tags
  const stripped = html.replace(/<[^>]*>/g, '')
  // Decode HTML entities
  const decoded = stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  return decoded.trim()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

useHead({
  title: computed(() => `${categoryName.value} - Kronik Paroki St. Paulus Juanda`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => categoryDescription.value || `Kronik ${categoryName.value} Paroki St. Paulus Juanda`) 
    }
  ]
})
</script>
