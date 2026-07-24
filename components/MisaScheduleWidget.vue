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
import { ref, computed, onMounted } from '#imports'

const isVisible = ref(true)
const loading = ref(true)
const error = ref(false)
const scheduleData = ref([])
const specialSchedules = ref([])
const devotions = ref([])

// Nama hari — diisi setelah mount agar tidak SSR-mismatch
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const todayDayIndex = ref(0)   // 0 = Minggu
const todayDateStr = ref('')   // 'YYYY-MM-DD' dalam WIB

// currentDay ditampilkan di header widget
const currentDay = computed(() => dayNames[todayDayIndex.value])

// Helper: Format time ke "HH:MM" dari berbagai format DB
const formatTime = (timeString) => {
  if (!timeString) return ''
  const match = String(timeString).match(/(\d{1,2}):(\d{2})/)
  if (!match) return String(timeString)
  return `${match[1].padStart(2, '0')}:${match[2]}`
}

// Helper: Label Pagi/Siang/Sore/Malam — aman terhadap null
const getTimeLabel = (time) => {
  if (!time) return 'Misa'
  const hour = parseInt(String(time).split(':')[0])
  if (isNaN(hour)) return 'Misa'
  if (hour < 12) return 'Pagi'
  if (hour < 15) return 'Siang'
  if (hour < 18) return 'Sore'
  return 'Malam'
}

// Computed jadwal misa hari ini — hanya dijalankan di client
const todaySchedule = computed(() => {
  // Pastikan data sudah diisi dan tanggal sudah diset (client-only)
  if (!todayDateStr.value) return []

  const today = dayNames[todayDayIndex.value]
  const dayOfMonth = new Date(todayDateStr.value).getDate()
  const isFirstWeek = dayOfMonth >= 1 && dayOfMonth <= 7

  // Regular schedules hari ini
  const regularToday = scheduleData.value
    .filter(s => {
      if (s.day_of_week !== today || !s.is_active) return false
      if (s.mass_type && s.mass_type.includes('Jumat Pertama')) return isFirstWeek
      return true
    })
    .map(s => ({
      label: getTimeLabel(s.time),
      time: formatTime(s.time),
      rawTime: String(s.time || ''),   // untuk sorting akurat
      type: s.mass_type || 'Misa',
      source: 'regular',
      isSpecial: false,
      isDevotion: false
    }))

  // Special / liturgy schedules hari ini
  const specialToday = specialSchedules.value
    .filter(s => {
      if (!s.date || s.status !== 'active') return false
      // Normalize: bisa 'YYYY-MM-DD' atau ISO string
      const scheduleDate = typeof s.date === 'string' && s.date.includes('T')
        ? s.date.split('T')[0]
        : String(s.date).slice(0, 10)
      return scheduleDate === todayDateStr.value
    })
    .map(s => ({
      label: s.title || getTimeLabel(s.time),
      time: formatTime(s.time),
      rawTime: String(s.time || ''),
      type: s.liturgy_type_name || 'Misa Khusus',
      source: 'special',
      isSpecial: true,
      isDevotion: false
    }))

  // Devotions hari ini
  const devotionsToday = devotions.value
    .filter(d => d.day_of_week === today)
    .map(d => ({
      label: d.title,
      time: formatTime(d.time),
      rawTime: String(d.time || ''),
      type: d.type_name || 'Devosi',
      source: 'devotion',
      isSpecial: false,
      isDevotion: true
    }))

  // Gabung dan sort berdasarkan rawTime (format DB asli, lebih akurat)
  return [...regularToday, ...specialToday, ...devotionsToday]
    .sort((a, b) => a.rawTime.localeCompare(b.rawTime))
})

const fetchSchedule = async () => {
  loading.value = true
  error.value = false
  try {
    const [regularData, specialData, devotionData] = await Promise.all([
      $fetch('/api/regular-mass-schedules').catch(() => []),
      $fetch('/api/liturgy-schedules').catch(() => ({ schedules: [] })),
      $fetch('/api/devotions').catch(() => ({ data: [] }))
    ])

    scheduleData.value = regularData || []
    specialSchedules.value = specialData?.schedules || (Array.isArray(specialData) ? specialData : [])
    devotions.value = devotionData?.data || (Array.isArray(devotionData) ? devotionData : [])

  } catch (err) {
    console.error('[MisaWidget] Error fetching schedule:', err)
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
  // Inisialisasi tanggal & hari di client (bukan SSR) agar timezone WIB akurat
  // Menggunakan 'sv-SE' locale untuk mendapatkan format YYYY-MM-DD yang konsisten
  const now = new Date()
  todayDayIndex.value = now.getDay()
  todayDateStr.value = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' })

  if (process.client) {
    const wasClosed = localStorage.getItem('misaWidgetClosed')
    if (wasClosed === 'true') isVisible.value = false
  }

  fetchSchedule()
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
