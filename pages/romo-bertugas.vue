<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Romo Bertugas" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Romo yang Bertugas</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Para Romo yang telah memberikan pelayanan dan dedikasi luar biasa di paroki ini
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Romo yang Bertugas" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Statistics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12 max-w-4xl mx-auto">
          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{{ totalPastors }}</div>
            <div class="text-xs md:text-sm text-blue-800 font-medium">Total Romo</div>
          </div>

          <div
            class="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="text-3xl md:text-4xl font-bold text-green-600 mb-1">{{ activePastors }}</div>
            <div class="text-xs md:text-sm text-green-800 font-medium">Sedang Bertugas</div>
          </div>

          <div
            class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="text-3xl md:text-4xl font-bold text-purple-600 mb-1">{{ alumniPastors }}</div>
            <div class="text-xs md:text-sm text-purple-800 font-medium">Alumni</div>
          </div>

          <div
            class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="text-3xl md:text-4xl font-bold text-orange-600 mb-1">{{ averageYears.toFixed(1) }}</div>
            <div class="text-xs md:text-sm text-orange-800 font-medium">Rata-rata Tahun</div>
          </div>
        </div>

        <!-- Pastor Cards Grid -->
        <div class="max-w-6xl mx-auto">
          <div v-if="pastors.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <PastorProfileCard v-for="pastor in pastors" :key="pastor.id" :pastor="pastor" />
          </div>

          <!-- Enhanced Empty State -->
          <div v-else class="text-center py-16">
            <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Data Romo Belum Tersedia</h3>
            <p class="text-gray-500 mb-6">Informasi para romo yang pernah bertugas akan segera ditampilkan di sini.</p>
            <NuxtLink to="/contact-us"
              class="inline-flex items-center gap-2 bg-[#882f1d] text-white px-6 py-3 rounded-lg hover:bg-[#6b2416] transition-colors font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Hubungi Kami
            </NuxtLink>
          </div>
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('romo-bertugas')
import { computed, ref } from '#imports'

// Page meta & SEO
definePageMeta({
  title: 'Romo yang Bertugas - St. Paulus'
})

useHead({
  title: 'Romo-Romo yang Pernah Bertugas - Paroki St. Paulus Juanda',
  meta: [
    {
      name: 'description',
      content: 'Daftar lengkap para Romo yang telah dan sedang bertugas di Paroki St. Paulus Juanda Sidoarjo dengan dedikasi dan pelayanan luar biasa.'
    },
    {
      property: 'og:title',
      content: 'Romo yang Bertugas - Paroki St. Paulus Juanda'
    },
    {
      property: 'og:description',
      content: 'Mengenal para Romo yang telah memberikan pelayanan pastoral di Paroki St. Paulus Juanda'
    }
  ]
})

// Fetch pastors from API
const { data: response, pending, error } = await useFetch('/api/pastors', {
  default: () => ({ data: [] }),
  transform: (data) => data || { data: [] }
})

// Convert API response to match component props
const pastors = computed(() => {
  if (!response.value?.data) return []

  return response.value.data.map(p => ({
    id: p.id,
    name: p.name,
    startYear: p.start_year,
    endYear: p.end_year ? String(p.end_year) : 'Sekarang',
    photoUrl: p.photo_url || '/images/default-pastor.svg',
    bio: p.bio,
    quote: p.quote,
    achievements: p.achievements
  }))
})

// Computed Statistics
const totalPastors = computed(() => pastors.value.length)

const activePastors = computed(() =>
  pastors.value.filter(p => {
    const endYear = String(p.endYear || '').toLowerCase()
    return endYear === 'sekarang' || !p.endYear
  }).length
)

const alumniPastors = computed(() =>
  pastors.value.filter(p => {
    const endYear = String(p.endYear || '').toLowerCase()
    return endYear !== 'sekarang' && p.endYear
  }).length
)

const averageYears = computed(() => {
  if (pastors.value.length === 0) return 0

  const totalYears = pastors.value.reduce((sum, pastor) => {
    const start = parseInt(pastor.startYear)
    const endYear = String(pastor.endYear || '').toLowerCase()
    const end = endYear === 'sekarang' || !pastor.endYear
      ? new Date().getFullYear()
      : parseInt(pastor.endYear)
    return sum + (end - start)
  }, 0)

  return totalYears / pastors.value.length
})
</script>

<style scoped>
.prose {
  color: #374151;
}
</style>
