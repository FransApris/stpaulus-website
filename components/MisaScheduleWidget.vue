<template>
  <Transition name="slide-fade">
    <div v-if="isVisible" ref="widgetRef" class="fixed z-40 hidden lg:block"
      :style="{ right: '5%', bottom: '120px' }">
      <div class="bg-white rounded-lg shadow-lg border border-[#882f1d] overflow-hidden" style="width: 168px;">
        <div class="bg-gradient-to-r from-[#882f1d] to-[#6b2416] p-1.5 flex items-center justify-between">
          <div class="flex items-center space-x-0.5 text-white">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="font-bold text-xs">Misa Hari Ini</h3>
          </div>
          <button @click="closeWidget" class="text-white hover:text-gray-200 transition-colors" aria-label="Tutup">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-2">
          <div class="mb-1.5 text-center">
            <div class="text-xs text-[#882f1d] font-semibold">{{ currentDay }}</div>
          </div>
          <div v-if="loading" class="space-y-1.5">
            <div v-for="i in 2" :key="i" class="animate-pulse">
              <div class="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div v-else-if="error" class="text-center py-2">
            <p class="text-xs text-red-600">Error</p>
          </div>
          <div v-else-if="todaySchedule && todaySchedule.length > 0" class="space-y-1.5">
            <div v-for="(schedule, index) in todaySchedule" :key="index" :class="[
              'p-1.5 rounded transition-colors',
              schedule.isSpecial
                ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100'
                : schedule.isDevotion
                  ? 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                  : 'bg-gray-50 hover:bg-gray-100'
            ]">
              <div class="flex items-center justify-between mb-0.5">
                <div class="flex-1 min-w-0 mr-1">
                  <div class="flex items-center gap-1">
                    <div :class="[
                      'font-semibold text-xs truncate',
                      schedule.isSpecial ? 'text-amber-900' : schedule.isDevotion ? 'text-purple-900' : 'text-gray-900'
                    ]">
                      {{ schedule.label }}
                    </div>
                    <span v-if="schedule.isSpecial" class="text-[10px]">⭐</span>
                    <span v-else-if="schedule.isDevotion" class="text-[10px]">📿</span>
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <div :class="[
                    'font-bold text-xs',
                    schedule.isSpecial ? 'text-amber-700' : schedule.isDevotion ? 'text-purple-700' : 'text-[#882f1d]'
                  ]">
                    {{ schedule.time }}
                  </div>
                </div>
              </div>
              <div v-if="schedule.type" :class="[
                'text-[10px] leading-tight truncate',
                schedule.isSpecial ? 'text-amber-700 font-medium' : schedule.isDevotion ? 'text-purple-700 font-medium' : 'text-gray-600'
              ]">
                {{ schedule.type }}
              </div>
            </div>
          </div>
          <div v-else class="text-center py-3">
            <p class="text-xs text-gray-500">Tidak ada</p>
          </div>
          <NuxtLink to="/misa"
            class="block mt-2 text-center text-white bg-[#882f1d] py-1.5 rounded hover:bg-[#6b2416] transition-colors text-xs font-semibold">
            📅 Lengkap
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
  <button v-if="!isVisible" @click="openWidget"
    class="fixed bottom-28 right-4 z-40 bg-[#882f1d] text-white p-3 rounded-full shadow-lg hover:bg-[#6b2416] transition-all hover:scale-110 hidden lg:block"
    aria-label="Buka jadwal misa">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from '#imports'

const isVisible = ref(true)
const loading = ref(true)
const error = ref(false)
const scheduleData = ref([])
const specialSchedules = ref([])
const devotions = ref([])
const widgetRef = ref(null)

const now = new Date()
const dayOfWeek = now.getDay()
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const currentDay = computed(() => dayNames[dayOfWeek])

// Computed: jadwal misa untuk hari ini dari database (regular + special)
const todaySchedule = computed(() => {
  const currentDate = new Date()
  const dayOfMonth = currentDate.getDate()
  const today = dayNames[dayOfWeek]
  const todayDateString = currentDate.toISOString().split('T')[0] // YYYY-MM-DD

  // Cek apakah hari ini adalah minggu pertama (tanggal 1-7)
  const isFirstWeek = dayOfMonth >= 1 && dayOfMonth <= 7

  // Filter regular schedules
  const regularToday = scheduleData.value
    .filter(s => {
      // Filter by day and active status
      if (s.day_of_week !== today || !s.is_active) return false

      // Special handling: Misa Jumat Pertama hanya di minggu pertama
      if (s.mass_type && s.mass_type.includes('Jumat Pertama')) {
        return isFirstWeek // Hanya tampil jika minggu pertama
      }

      return true
    })
    .map(s => ({
      label: getTimeLabel(s.time),
      time: formatTime(s.time),
      type: s.mass_type || 'Misa',
      source: 'regular'
    }))

  // Filter special schedules untuk hari ini
  console.log('=== SPECIAL SCHEDULES DEBUG ===')
  console.log('Today date string (todayDateString):', todayDateString)
  console.log('All special schedules raw:', specialSchedules.value)

  const specialToday = specialSchedules.value
    .filter(s => {
      console.log('Checking special schedule:', {
        title: s.title,
        date: s.date,
        dateType: typeof s.date,
        dateRaw: s.date,
        status: s.status,
        matches: s.date === todayDateString,
        statusOK: s.status === 'active'
      })

      if (!s.date || s.status !== 'active') return false
      // Handle both date string formats: 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss.sssZ'
      const scheduleDate = typeof s.date === 'string' && s.date.includes('T')
        ? s.date.split('T')[0]  // ISO format with time
        : s.date                 // Plain YYYY-MM-DD format
      return scheduleDate === todayDateString
    })
    .map(s => ({
      label: s.title || getTimeLabel(s.time),
      time: formatTime(s.time),
      type: s.liturgy_type_name || 'Misa Khusus',
      source: 'special',
      isSpecial: true
    }))

  console.log('Filtered special schedules for today:', specialToday)
  console.log('================================')

  // Filter devotions untuk hari ini
  console.log('All devotions:', devotions.value)
  console.log('Today day name:', today)

  const devotionsToday = devotions.value
    .filter(d => {
      console.log('Checking devotion:', {
        title: d.title,
        day: d.day_of_week,
        is_active: d.is_active,
        type_of_is_active: typeof d.is_active,
        matches_day: d.day_of_week === today
      })
      // API already filters for is_active=1, so we don't need to check it again
      // Just filter by day
      return d.day_of_week === today
    })
    .map(d => ({
      label: d.title,
      time: formatTime(d.time),
      type: d.type_name || 'Devosi',
      source: 'devotion',
      isDevotion: true
    }))

  console.log('Filtered devotions for today:', devotionsToday)

  // Gabungkan dan sort by time
  const combined = [...regularToday, ...specialToday, ...devotionsToday]
    .sort((a, b) => a.time.localeCompare(b.time))

  console.log('Widget - Regular schedules today:', regularToday.length)
  console.log('Widget - Special schedules today:', specialToday.length)
  console.log('Widget - Devotions today:', devotionsToday.length)
  console.log('Widget - Combined schedules:', combined)

  return combined
})

// Helper: Format time to HH:MM
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

// Helper: Generate label dari waktu (Pagi/Siang/Sore)
const getTimeLabel = (time) => {
  const hour = parseInt(time.split(':')[0])
  if (hour < 12) return 'Pagi'
  if (hour < 15) return 'Siang'
  if (hour < 18) return 'Sore'
  return 'Malam'
}

const fetchSchedule = async () => {
  loading.value = true
  error.value = false
  try {
    // Fetch regular mass schedules, special schedules, dan devotions secara parallel
    const [regularData, specialData, devotionData] = await Promise.all([
      $fetch('/api/regular-mass-schedules').catch(() => []),
      $fetch('/api/liturgy-schedules').catch(() => ({ schedules: [] })),
      $fetch('/api/devotions').catch(() => ({ data: [] }))
    ])

    scheduleData.value = regularData || []
    specialSchedules.value = specialData.schedules || specialData || []
    devotions.value = devotionData.data || devotionData || []

    // Debug: Log data yang diterima
    const currentDate = new Date()
    const dayOfMonth = currentDate.getDate()
    const isFirstWeek = dayOfMonth >= 1 && dayOfMonth <= 7

    console.log('=== WIDGET DEBUG ===')
    console.log('Total regular schedules:', scheduleData.value.length)
    console.log('Total special schedules:', specialSchedules.value.length)
    console.log('Total devotions:', devotions.value.length)
    console.log('Today:', dayNames[dayOfWeek])
    console.log('Date:', dayOfMonth, '/', currentDate.getMonth() + 1)
    console.log('Is First Week:', isFirstWeek ? 'YES (Jumat Pertama shown)' : 'NO (Jumat Pertama hidden)')
    console.log('Today schedules:', todaySchedule.value)
    console.log('===================')
  } catch (err) {
    console.error('Error fetching schedule:', err)
    error.value = true
    scheduleData.value = []
    specialSchedules.value = []
    devotions.value = []
  } finally {
    loading.value = false
  }
}

const closeWidget = () => {
  isVisible.value = false
  if (process.client) localStorage.setItem('misaWidgetClosed', 'true')
}

const openWidget = () => {
  isVisible.value = true
  if (process.client) localStorage.removeItem('misaWidgetClosed')
}

onMounted(() => {
  if (process.client) {
    const wasClosed = localStorage.getItem('misaWidgetClosed')
    if (wasClosed === 'true') isVisible.value = false
  }
  fetchSchedule()
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

.cursor-move {
  user-select: none;
}
</style>
