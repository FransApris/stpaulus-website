<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Berita Saya</h2>
        <p class="text-sm text-gray-500 mt-1">Daftar berita kegiatan yang telah Anda kirimkan.</p>
      </div>
      <NuxtLink to="/kontributor/tulis"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#882f1d] hover:bg-[#702517] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d]">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Tulis Berita Baru
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" v-if="stats">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Tulisan</div>
        <div class="text-3xl font-bold text-gray-900">{{ stats.total }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div class="text-sm font-medium text-gray-500 mb-1">Draft / Menunggu Review</div>
        <div class="text-3xl font-bold text-yellow-600">{{ stats.drafts }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div class="text-sm font-medium text-gray-500 mb-1">Sudah Terbit</div>
        <div class="text-3xl font-bold text-green-600">{{ stats.published }}</div>
      </div>
    </div>

    <!-- List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="pending" class="p-8 text-center text-gray-500">
        Memuat data...
      </div>
      <div v-else-if="!newsList || newsList.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
          </path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada berita</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai bagikan kegiatan di wilayah/lingkungan Anda.</p>
        <div class="mt-6">
          <NuxtLink to="/kontributor/tulis"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-[#882f1d] bg-[#882f1d]/10 hover:bg-[#882f1d]/20">
            Tulis Berita Pertama
          </NuxtLink>
        </div>
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="item in newsList" :key="item.id" class="p-4 hover:bg-gray-50 transition-colors sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0 pr-4">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ item.title }}</p>
              <div class="mt-1 flex items-center text-xs text-gray-500 gap-4">
                <span class="flex items-center">
                  <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Dibuat: {{ formatDate(item.created_at) }}
                </span>
                <span v-if="item.published_at" class="flex items-center">
                  <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Terbit: {{ formatDate(item.published_at) }}
                </span>
              </div>
            </div>
            <div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ item.status === 'published' ? 'Terbit' : 'Menunggu Review' }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'kontributor',
  middleware: 'kontributor-auth' // Bug Fix #5: Use dedicated middleware
})

const auth = useAuth()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || ''

// Bug Fix #4: Read token directly from sessionStorage, not from non-existent auth.accessToken
const getToken = () => {
  if (process.client) {
    return sessionStorage.getItem('admin_access_token') || ''
  }
  return ''
}

const { data: newsResponse, pending } = useFetch<any>(`${apiBase}/api/kontributor/news`, {
  server: false, // sessionStorage hanya tersedia di client, bukan SSR
  headers: computed(() => ({
    Authorization: `Bearer ${getToken()}`
  }))
})

const { data: statsResponse } = useFetch<any>(`${apiBase}/api/kontributor/dashboard-stats`, {
  server: false, // sessionStorage hanya tersedia di client, bukan SSR
  headers: computed(() => ({
    Authorization: `Bearer ${getToken()}`
  }))
})

const newsList = computed(() => newsResponse.value?.data || [])
const stats = computed(() => statsResponse.value?.data || null)

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
