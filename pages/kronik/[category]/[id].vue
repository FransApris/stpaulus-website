<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <!-- Header Section -->
    <section v-if="entry" class="bg-white border-b py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <Breadcrumb 
          :title="entry.what_title || 'Detail Kronik'" 
          parentTitle="Kronik Paroki" 
          parentPath="/kronik" 
        />
        <h1 class="text-3xl md:text-4xl font-cinzel text-gray-900 mb-4">{{ entry.what_title || 'Detail Kronik' }}</h1>
        <div class="flex items-center gap-4 text-gray-600">
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatDate(entry.when_date) }}
          </span>
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            {{ entry.category_name }}
          </span>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container mx-auto px-4 py-12 max-w-4xl">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Memuat data...</p>
      </div>

      <div v-else-if="entry" class="bg-white rounded-lg shadow-md p-8">
        <!-- Featured Image -->
        <div v-if="entry.featured_image" class="mb-8 rounded-lg overflow-hidden">
          <img :src="entry.featured_image" :alt="entry.what_title" class="w-full h-auto" />
        </div>

        <!-- Gallery Images -->
        <div v-if="entry.gallery && entry.gallery.length > 0" class="mb-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="(image, index) in entry.gallery" :key="index" class="rounded-lg overflow-hidden">
            <img :src="image" :alt="`Gallery ${index + 1}`" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>

        <!-- Narasi/Deskripsi Kegiatan -->
        <div class="prose prose-lg max-w-none">
          <!-- Narasi/Deskripsi — sanitized with DOMPurify to prevent Stored XSS -->
          <div v-if="entry.what_description" class="text-gray-700 leading-relaxed whitespace-pre-wrap" v-html="sanitizedDescription"></div>
          <p v-else class="text-gray-500 italic">Belum ada deskripsi untuk kegiatan ini.</p>
        </div>

        <!-- Back Button -->
        <div class="mt-8 pt-8 border-t">
          <NuxtLink 
            :to="{ path: `/kronik/${categorySlug}` }"
            class="inline-flex items-center text-[#c58229] hover:text-[#882f1d] font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Kembali ke {{ entry.category_name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg mb-4">Kronik tidak ditemukan</p>
        <NuxtLink to="/kronik" class="text-[#c58229] hover:text-[#882f1d] font-medium">
          Kembali ke Kronik Paroki
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import DOMPurify from 'dompurify'
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const entryId = String(route.params.id || '')
const categorySlug = String(route.params.category || '')

// Scroll-to-top sudah ditangani secara global oleh router.options.ts

console.log('[Kronik Detail] Loading entry:', entryId, 'from category:', categorySlug)

const { data: response, pending: loading, error } = await useFetch(`/api/kronik/entries/detail/${entryId}`)

const entry = computed(() => {
  const data = response.value?.data || null
  if (error.value) {
    console.error('[Kronik Detail] Error:', error.value)
  } else if (data) {
    console.log('[Kronik Detail] Entry loaded:', data.what_title)
  } else {
    console.warn('[Kronik Detail] No entry data found')
  }
  return data
})

// ✅ SECURITY: Sanitize description with DOMPurify to prevent Stored XSS
// what_description may contain admin-authored HTML (e.g., bold, italic, line breaks)
const sanitizedDescription = computed(() => {
  if (!entry.value?.what_description) return ''
  if (process.server) return entry.value.what_description
  return DOMPurify.sanitize(entry.value.what_description, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li',
                   'h2', 'h3', 'h4', 'blockquote', 'a', 'span', 'hr'],
    ALLOWED_ATTR: ['href', 'title', 'class', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  })
})

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
  title: computed(() => entry.value ? `${entry.value.what_title} - Kronik Paroki` : 'Kronik Detail'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => entry.value?.what_description?.substring(0, 160) || 'Detail kronik Paroki St. Paulus Juanda') 
    }
  ]
})
</script>
