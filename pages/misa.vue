<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Jadwal Misa</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Jadwal misa harian dan akhir pekan di Paroki St. Paulus
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Jadwal Misa" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
          <p class="mt-2 text-gray-600 text-sm md:text-base">Memuat jadwal misa...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Jadwal dengan Kategori -->
        <div v-else class="space-y-8 md:space-y-12">
          
          <!-- MISA RUTIN SECTION -->
          <div v-if="groupedSchedules.regular.length > 0" class="bg-white shadow-lg rounded-xl overflow-hidden border border-green-200">
            <div class="bg-gradient-to-r from-green-600 to-green-700 px-4 md:px-6 py-3 md:py-4">
              <h2 class="text-lg md:text-2xl font-cinzel font-bold text-white flex items-center">
                <svg class="w-5 h-5 md:w-6 md:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Misa Rutin
              </h2>
              <p class="text-green-100 text-xs md:text-sm mt-1">Jadwal misa harian dan mingguan</p>
            </div>
            <div class="p-3 md:p-6">
              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-green-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-sm font-bold text-green-800 uppercase">Hari</th>
                      <th class="px-4 py-3 text-center text-sm font-bold text-green-800 uppercase">Waktu</th>
                      <th class="px-4 py-3 text-left text-sm font-bold text-green-800 uppercase">Judul</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr v-for="schedule in groupedSchedules.regular" :key="`regular-${schedule.id}`" class="hover:bg-green-50 transition-colors">
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ schedule.display_date }}</td>
                      <td class="px-4 py-3 text-sm text-center text-gray-700">{{ schedule.display_time }}</td>
                      <td class="px-4 py-3 text-sm text-gray-700">{{ schedule.display_title }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-3">
                <div v-for="schedule in groupedSchedules.regular" :key="`regular-mobile-${schedule.id}`" 
                  class="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-gray-900 text-sm">{{ schedule.display_date }}</span>
                    <span class="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">{{ schedule.display_time }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ schedule.display_title }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- MISA KHUSUS SECTION -->
          <div v-if="groupedSchedules.special.length > 0" class="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-200">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 md:px-6 py-3 md:py-4">
              <h2 class="text-lg md:text-2xl font-cinzel font-bold text-white flex items-center">
                <svg class="w-5 h-5 md:w-6 md:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Misa Khusus
              </h2>
              <p class="text-blue-100 text-xs md:text-sm mt-1">Perayaan liturgi khusus</p>
            </div>
            <div class="p-3 md:p-6">
              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-blue-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-sm font-bold text-blue-800 uppercase">Tanggal</th>
                      <th class="px-4 py-3 text-center text-sm font-bold text-blue-800 uppercase">Waktu</th>
                      <th class="px-4 py-3 text-left text-sm font-bold text-blue-800 uppercase">Judul</th>
                      <th class="px-4 py-3 text-left text-sm font-bold text-blue-800 uppercase">Jenis Liturgi</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr v-for="schedule in groupedSchedules.special" :key="`special-${schedule.id}`" class="hover:bg-blue-50 transition-colors">
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ schedule.display_date }}</td>
                      <td class="px-4 py-3 text-sm text-center text-gray-700">{{ schedule.display_time }}</td>
                      <td class="px-4 py-3 text-sm text-gray-700">{{ schedule.display_title }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600">{{ schedule.liturgy_type?.name || schedule.liturgy_type_name || '' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-3">
                <div v-for="schedule in groupedSchedules.special" :key="`special-mobile-${schedule.id}`" 
                  class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-gray-900 text-xs">{{ schedule.display_date }}</span>
                    <span class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">{{ schedule.display_time }}</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-900 mb-1">{{ schedule.display_title }}</p>
                  <p class="text-xs text-gray-600">{{ schedule.liturgy_type?.name || schedule.liturgy_type_name || '' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- DEVOSI/IBADAT SECTION -->
          <div v-if="groupedSchedules.devotion.length > 0" class="bg-white shadow-lg rounded-xl overflow-hidden border border-purple-200">
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-4 md:px-6 py-3 md:py-4">
              <h2 class="text-lg md:text-2xl font-cinzel font-bold text-white flex items-center">
                <svg class="w-5 h-5 md:w-6 md:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Devosi & Ibadat Lainnya
              </h2>
              <p class="text-purple-100 text-xs md:text-sm mt-1">Doa Rosario, Adorasi, dan kegiatan rohani</p>
            </div>
            <div class="p-3 md:p-6">
              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-purple-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-sm font-bold text-purple-800 uppercase">Hari</th>
                      <th class="px-4 py-3 text-center text-sm font-bold text-purple-800 uppercase">Waktu</th>
                      <th class="px-4 py-3 text-left text-sm font-bold text-purple-800 uppercase">Judul</th>
                      <th class="px-4 py-3 text-left text-sm font-bold text-purple-800 uppercase">Jenis</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr v-for="schedule in groupedSchedules.devotion" :key="`devotion-${schedule.id}`" class="hover:bg-purple-50 transition-colors">
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ schedule.display_date }}</td>
                      <td class="px-4 py-3 text-sm text-center text-gray-700">{{ schedule.display_time }}</td>
                      <td class="px-4 py-3 text-sm text-gray-700">{{ schedule.display_title }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600">{{ schedule.type_name || 'Devosi' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-3">
                <div v-for="schedule in groupedSchedules.devotion" :key="`devotion-mobile-${schedule.id}`" 
                  class="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-gray-900 text-sm">{{ schedule.display_date }}</span>
                    <span class="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">{{ schedule.display_time }}</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-900 mb-1">{{ schedule.display_title }}</p>
                  <p class="text-xs text-gray-600">{{ schedule.type_name || 'Devosi' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="groupedSchedules.regular.length === 0 && groupedSchedules.special.length === 0 && groupedSchedules.devotion.length === 0" 
            class="text-center py-12 bg-white rounded-lg shadow">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-gray-500">Belum ada jadwal misa yang tersedia.</p>
          </div>
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
    </div>
  </div>
</template>

<script setup>
const schedules = ref([])
const specialSchedules = ref([])
const devotions = ref([])
const loading = ref(true)
const error = ref('')

// Fetch regular mass schedules
const fetchSchedules = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await $fetch('/api/regular-mass-schedules')
    // Filter only active schedules
    schedules.value = response.filter(schedule => schedule.is_active)
  } catch (err) {
    error.value = err.data?.message || 'Failed to fetch schedules'
    console.error('Error fetching schedules:', err)
  } finally {
    loading.value = false
  }
}

// Fetch special mass schedules (liturgy schedules)
const fetchSpecialSchedules = async () => {
  try {
    const response = await $fetch('/api/liturgy-schedules')
    // Filter only active schedules
    specialSchedules.value = response.schedules?.filter(schedule => schedule.status === 'active') || []
  } catch (err) {
    console.error('Error fetching special schedules:', err)
  }
}

// Fetch devotions
const fetchDevotions = async () => {
  try {
    console.log('[Misa Page] Fetching devotions...')
    const response = await $fetch('/api/devotions')
    console.log('[Misa Page] Devotions response:', response)
    console.log('[Misa Page] Sample devotion data:', response.data?.[0])
    // API already filters for is_active=1, so just use all returned data
    devotions.value = response.data || []
    console.log('[Misa Page] All devotions:', devotions.value.length, 'items')
  } catch (err) {
    console.error('[Misa Page] Error fetching devotions:', err)
  }
}

// Combine and group all schedules by category
const groupedSchedules = computed(() => {
  console.log('[Misa Page - Computed] Building groupedSchedules...', {
    regularCount: schedules.value.length,
    specialCount: specialSchedules.value.length,
    devotionsCount: devotions.value.length
  })

  const currentDate = new Date()
  const dayOfMonth = currentDate.getDate()
  const isFirstWeek = dayOfMonth >= 1 && dayOfMonth <= 7

  // Regular mass schedules
  const regular = schedules.value
    .filter(schedule => {
      // Special handling: Misa Jumat Pertama hanya di minggu pertama
      if (schedule.mass_type && schedule.mass_type.includes('Jumat Pertama')) {
        // Jika bukan minggu pertama, tambahkan note
        if (!isFirstWeek) {
          schedule.note = ' (Hanya minggu pertama bulan)'
        }
      }
      return true // Tampilkan semua untuk informasi
    })
    .map(schedule => ({
      ...schedule,
      type: 'regular',
      display_date: schedule.day_of_week,
      display_time: formatTime(schedule.time),
      display_title: schedule.mass_type + (schedule.note || ''),
      sort_key: getSortKey(schedule.day_of_week, schedule.time)
    }))
    .sort((a, b) => a.sort_key - b.sort_key)

  // Special mass schedules
  const special = specialSchedules.value
    .map(schedule => ({
      ...schedule,
      type: 'special',
      display_date: formatDate(schedule.date),
      display_time: formatTime(schedule.time),
      display_title: schedule.title,
      liturgy_type_name: schedule.liturgy_type_name,
      sort_key: getSortKeyForSpecial(schedule.date, schedule.time)
    }))
    .sort((a, b) => a.sort_key - b.sort_key)

  // Devotions schedules
  const devotion = devotions.value
    .map(devotionItem => ({
      ...devotionItem,
      type: 'devotion',
      display_date: devotionItem.day_of_week,
      display_time: formatTime(devotionItem.time),
      display_title: devotionItem.title,
      type_name: devotionItem.type_name,
      sort_key: getSortKey(devotionItem.day_of_week, devotionItem.time)
    }))
    .sort((a, b) => a.sort_key - b.sort_key)

  return {
    regular,
    special,
    devotion
  }
})

// Helper function to get sort key for regular schedules
const getSortKey = (dayOfWeek, time) => {
  const dayOrder = {
    'Minggu': 1,
    'Senin': 2,
    'Selasa': 3,
    'Rabu': 4,
    'Kamis': 5,
    'Jumat': 6,
    'Sabtu': 7
  }

  const dayValue = dayOrder[dayOfWeek] || 8
  const timeValue = time ? parseInt(time.replace(':', '')) : 0
  return dayValue * 10000 + timeValue
}

// Helper function to get sort key for special schedules
const getSortKeyForSpecial = (date, time) => {
  const dateValue = date ? new Date(date).getTime() : Date.now()
  const timeValue = time ? parseInt(time.replace(':', '')) : 0
  return dateValue + timeValue
}

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'Tanggal tidak tersedia'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Format tanggal tidak valid'

  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to format time to HH:MM
const formatTime = (timeString) => {
  if (!timeString) return ''

  // Handle different time formats
  // Could be: "9:00", "09:00", "9:00:00", "09:00:00"
  const timeMatch = timeString.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  
  if (!timeMatch) return timeString // Return original if format not recognized

  const hours = timeMatch[1].padStart(2, '0')
  const minutes = timeMatch[2]

  return `${hours}:${minutes}`
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchSchedules(), fetchSpecialSchedules(), fetchDevotions()])
})
</script>
