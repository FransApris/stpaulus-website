<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-center h-16 px-4 bg-[#882f1d]">
          <h1 class="text-xl font-cinzel text-white">Jadwal Misa</h1>
        </div>

        <!-- Time Period Navigation -->
        <nav class="flex-1 px-4 py-6">
          <div class="space-y-2">
            <button
              @click="selectTimePeriod('all')"
              :class="selectedPeriod === 'all'
                ? 'w-full flex items-center px-4 py-3 text-sm font-medium bg-[#882f1d] text-white rounded-md'
                : 'w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Semua Jadwal
            </button>

            <button
              @click="selectTimePeriod('misa-pagi')"
              :class="selectedPeriod === 'misa-pagi'
                ? 'w-full flex items-center px-4 py-3 text-sm font-medium bg-[#882f1d] text-white rounded-md'
                : 'w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Misa Pagi
            </button>

            <button
              @click="selectTimePeriod('misa-minggu')"
              :class="selectedPeriod === 'misa-minggu'
                ? 'w-full flex items-center px-4 py-3 text-sm font-medium bg-[#882f1d] text-white rounded-md'
                : 'w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Misa Minggu
            </button>

            <button
              @click="selectTimePeriod('misa-sabtu')"
              :class="selectedPeriod === 'misa-sabtu'
                ? 'w-full flex items-center px-4 py-3 text-sm font-medium bg-[#882f1d] text-white rounded-md'
                : 'w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              Misa Sabtu
            </button>

            <button
              @click="selectTimePeriod('misa-jumat-pertama')"
              :class="selectedPeriod === 'misa-jumat-pertama'
                ? 'w-full flex items-center px-4 py-3 text-sm font-medium bg-[#882f1d] text-white rounded-md'
                : 'w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              Misa Jumat Pertama
            </button>
          </div>
        </nav>

        <!-- Legend -->
        <div class="p-4 border-t">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Keterangan Jenis Misa</h3>
          <div class="space-y-2">
            <div
              v-for="type in liturgyTypes"
              :key="type.id"
              class="flex items-center space-x-2 text-xs"
            >
              <span class="text-sm">{{ type.icon }}</span>
              <span class="text-gray-700">{{ type.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-cinzel text-gray-900">{{ getPeriodTitle() }}</h2>
              <p class="text-sm text-gray-600">{{ getPeriodDescription() }}</p>
            </div>
            <div class="text-sm text-gray-500">
              {{ schedules.length }} jadwal ditemukan
            </div>
          </div>
        </div>
      </header>

      <!-- Date Filters -->
      <div class="bg-white shadow-sm border-b">
        <div class="px-6 py-4">
          <div class="flex items-center space-x-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                v-model="filters.startDate"
                @change="fetchSchedules"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                v-model="filters.endDate"
                @change="fetchSchedules"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              >
            </div>
            <div class="flex items-end">
              <button
                @click="clearDateFilters"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Reset Tanggal
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Regular Mass Schedules -->
      <div class="bg-white shadow-sm border-b">
        <div class="px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Jadwal Misa Rutin</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Misa</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-if="regularSchedules.length > 0">
                  <tr v-for="schedule in regularSchedules" :key="schedule.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ schedule.day_of_week }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ schedule.time }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ schedule.mass_type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="schedule.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ schedule.is_active ? 'Aktif' : 'Tidak Aktif' }}
                      </span>
                    </td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada jadwal misa rutin yang tersedia.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Special Schedules List -->
      <main class="flex-1 p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Memuat jadwal...</p>
        </div>

        <div v-else-if="schedules.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada jadwal {{ getPeriodTitle().toLowerCase() }}</h3>
          <p class="mt-1 text-sm text-gray-500">Belum ada jadwal untuk periode yang dipilih.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="schedule in schedules"
            :key="schedule.id"
            class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg">{{ schedule.liturgy_type.icon }}</span>
                  <h4 class="text-lg font-medium text-gray-900">{{ schedule.title }}</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <strong>Tanggal:</strong> {{ formatDate(schedule.date) }}
                  </div>
                  <div>
                    <strong>Jam:</strong> {{ schedule.time }}
                  </div>
                  <div>
                    <strong>Lokasi:</strong> {{ schedule.location }}
                  </div>
                  <div>
                    <strong>Bahasa:</strong> {{ schedule.language }}
                  </div>
                  <div v-if="schedule.priest_name">
                    <strong>Romo:</strong> {{ schedule.priest_name }}
                  </div>
                </div>
                <div v-if="schedule.notes" class="mt-2 text-sm text-gray-500">
                  <strong>Catatan:</strong> {{ schedule.notes }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const liturgyTypes = ref([])
const schedules = ref([])
const regularSchedules = ref([])
const loading = ref(false)
const selectedPeriod = ref('all')

const filters = ref({
  typeId: '',
  status: '',
  startDate: '',
  endDate: ''
})

// Time period mapping to liturgy type slugs
const periodMapping = {
  'misa-pagi': 'misa-pagi',
  'misa-minggu': 'misa-minggu',
  'misa-sabtu': 'misa-sabtu',
  'misa-jumat-pertama': 'misa-jumat-pertama'
}

// Fetch data
const fetchLiturgyTypes = async () => {
  try {
    const response = await $fetch('/api/liturgy/types')
    liturgyTypes.value = response.types
  } catch (error) {
    console.error('Failed to fetch liturgy types:', error)
  }
}

const fetchRegularSchedules = async () => {
  try {
    const response = await $fetch('/api/regular-mass-schedules')
    regularSchedules.value = response
  } catch (error) {
    console.error('Failed to fetch regular mass schedules:', error)
  }
}

const fetchSchedules = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()

    // Apply period filter
    if (selectedPeriod.value !== 'all') {
      const typeSlug = periodMapping[selectedPeriod.value]
      const type = liturgyTypes.value.find(t => t.slug === typeSlug)
      if (type) {
        params.append('type', type.id.toString())
      }
    }

    // Apply date filters
    if (filters.value.startDate) params.append('start_date', filters.value.startDate)
    if (filters.value.endDate) params.append('end_date', filters.value.endDate)

    // Add cache busting timestamp
    const timestamp = Date.now()
    params.append('_', timestamp.toString())

    const response = await $fetch(`/api/liturgy/schedules?${params}`)
    schedules.value = response.schedules
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  } finally {
    loading.value = false
  }
}

// Time period selection
const selectTimePeriod = (period) => {
  selectedPeriod.value = period
  fetchSchedules()
}

// Helper functions for titles and descriptions
const getPeriodTitle = () => {
  switch (selectedPeriod.value) {
    case 'all': return 'Semua Jadwal Misa'
    case 'misa-pagi': return 'Jadwal Misa Pagi'
    case 'misa-minggu': return 'Jadwal Misa Minggu'
    case 'misa-sabtu': return 'Jadwal Misa Sabtu'
    case 'misa-jumat-pertama': return 'Jadwal Misa Jumat Pertama'
    default: return 'Jadwal Misa'
  }
}

const getPeriodDescription = () => {
  switch (selectedPeriod.value) {
    case 'all': return 'Semua jadwal misa dan ibadat paroki'
    case 'misa-pagi': return 'Misa pagi hari Senin-Jumat'
    case 'misa-minggu': return 'Misa hari Minggu'
    case 'misa-sabtu': return 'Misa hari Sabtu'
    case 'misa-jumat-pertama': return 'Misa khusus Jumat pertama setiap bulan'
    default: return 'Manajemen jadwal misa rutin dan khusus paroki'
  }
}

const clearDateFilters = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  fetchSchedules()
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'Berulang'
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Check authentication and fetch data on mount
onMounted(async () => {
  await fetchLiturgyTypes()
  await fetchRegularSchedules()
  fetchSchedules()
})

// SEO
useHead({
  title: 'Jadwal Misa - Paroki St. Paulus Juanda',
  meta: [
    {
      name: 'description',
      content: 'Jadwal misa di Paroki St. Paulus Juanda. Temukan jadwal misa harian, minggu, dan kegiatan rohani lainnya.'
    }
  ]
})
</script>
