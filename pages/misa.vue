<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb (NEW) -->
        <Breadcrumb title="Jadwal Misa" />

        <!-- Tombol Top -->
        <!-- <BackButton position="top" /> -->

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Jadwal Misa Paroki St. Paulus</h1>
          <p class="text-xl text-gray-600">Jadwal misa harian dan akhir pekan. Datanglah dan ikuti perayaan Ekaristi.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
          <p class="mt-2 text-gray-600">Memuat jadwal misa...</p>
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

        <!-- Tabel Jadwal -->
        <div v-else class="overflow-x-auto">
          <table class="w-4/5 mx-auto bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr class="bg-[#882f1d] text-white">
                <th class="px-4 py-2">Hari/Tanggal</th>
                <th class="px-4 py-2">Waktu</th>
                <th class="px-4 py-2">Judul</th>
                <th class="px-4 py-2">Kategori</th>
                <th class="px-4 py-2">Jenis Liturgi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule in allSchedules" :key="`${schedule.type}-${schedule.id}`" class="border-t">
                <td class="px-4 py-2 text-center">{{ schedule.display_date }}</td>
                <td class="px-4 py-2 text-center">{{ schedule.display_time }}</td>
                <td class="px-4 py-2 text-center">{{ schedule.display_title }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="{
                    'bg-blue-100 text-blue-800': schedule.type === 'special',
                    'bg-green-100 text-green-800': schedule.type === 'regular',
                    'bg-purple-100 text-purple-800': schedule.type === 'devotion'
                  }" class="px-2 py-1 rounded-full text-xs font-medium">
                    <template v-if="schedule.type === 'special'">Misa Khusus</template>
                    <template v-else-if="schedule.type === 'devotion'">Devosi</template>
                    <template v-else>Misa Rutin</template>
                  </span>
                </td>
                <td class="px-4 py-2 text-center">
                  <template v-if="schedule.type === 'special'">{{ schedule.liturgy_type?.name ||
                    schedule.liturgy_type_name || '' }}</template>
                  <template v-else-if="schedule.type === 'devotion'">{{ schedule.type_name || 'Devosi' }}</template>
                </td>
              </tr>
              <tr v-if="allSchedules.length === 0" class="border-t">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                  Belum ada jadwal misa yang tersedia.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tombol Bottom -->
        <BackButton position="bottom" />
      </div>
    </section>
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

// Combine and sort all schedules
const allSchedules = computed(() => {
  console.log('[Misa Page - Computed] Building allSchedules...', {
    regularCount: schedules.value.length,
    specialCount: specialSchedules.value.length,
    devotionsCount: devotions.value.length
  })

  const currentDate = new Date()
  const dayOfMonth = currentDate.getDate()
  const isFirstWeek = dayOfMonth >= 1 && dayOfMonth <= 7

  const regular = schedules.value
    .filter(schedule => {
      // Special handling: Misa Jumat Pertama hanya di minggu pertama
      if (schedule.mass_type && schedule.mass_type.includes('Jumat Pertama')) {
        // Jika bukan minggu pertama, tambahkan note
        if (!isFirstWeek) {
          schedule.note = '(Hanya minggu pertama bulan)'
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

  const special = specialSchedules.value.map(schedule => ({
    ...schedule,
    type: 'special',
    display_date: formatDate(schedule.date),
    display_time: formatTime(schedule.time),
    display_title: schedule.title,
    liturgy_type_name: schedule.liturgy_type_name,
    sort_key: getSortKeyForSpecial(schedule.date, schedule.time)
  }))

  const devotionSchedules = devotions.value.map(devotion => ({
    ...devotion,
    type: 'devotion',
    display_date: devotion.day_of_week,
    display_time: formatTime(devotion.time),
    display_title: devotion.title,
    type_name: devotion.type_name,
    sort_key: getSortKey(devotion.day_of_week, devotion.time)
  }))

  // Combine and sort by date/time
  return [...regular, ...special, ...devotionSchedules].sort((a, b) => a.sort_key - b.sort_key)
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
