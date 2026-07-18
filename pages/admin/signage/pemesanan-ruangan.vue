<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col font-sans p-6">
    
    <!-- Header: Menyesuaikan Portrait Mode (1080x1920) -->
    <header class="flex justify-between items-center border-b border-gray-700 pb-6 mb-8">
      <div>
        <h1 class="text-5xl font-bold tracking-wider text-blue-400">JADWAL PEMESANAN RUANGAN</h1>
        <p class="text-2xl text-gray-400 mt-2 tracking-wide uppercase">Paroki Santo Paulus Juanda</p>
      </div>
      <div class="text-right flex flex-col items-end">
        <div class="text-6xl font-bold font-mono text-white tracking-widest">{{ currentTime }}</div>
        <div class="text-2xl text-gray-400 mt-2 font-medium tracking-wide uppercase">{{ currentDate }}</div>
      </div>
    </header>

    <!-- Main Content Table -->
    <main class="flex-grow flex flex-col overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading && bookings.length === 0" class="flex-grow flex items-center justify-center">
        <div class="animate-pulse flex flex-col items-center">
          <div class="h-20 w-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p class="text-2xl mt-6 text-gray-400 tracking-widest">MEMUAT DATA...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="flex-grow flex flex-col items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
        <span class="text-8xl mb-6">📅</span>
        <h2 class="text-4xl font-semibold text-gray-300">Tidak ada jadwal pemesanan</h2>
        <p class="text-2xl text-gray-500 mt-4">Ruangan saat ini tersedia.</p>
      </div>

      <!-- Data Table -->
      <div v-else class="flex-grow overflow-hidden flex flex-col bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
        <div class="overflow-x-auto h-full">
          <table class="w-full text-left border-collapse h-full flex flex-col">
            <thead class="bg-gray-950 text-gray-300 w-full table table-fixed">
              <tr>
                <th class="p-6 text-2xl font-bold uppercase tracking-wider border-b border-gray-700 w-2/12">Waktu</th>
                <th class="p-6 text-2xl font-bold uppercase tracking-wider border-b border-gray-700 w-3/12">Kegiatan</th>
                <th class="p-6 text-2xl font-bold uppercase tracking-wider border-b border-gray-700 w-2/12">Ruangan</th>
                <th class="p-6 text-2xl font-bold uppercase tracking-wider border-b border-gray-700 w-3/12">Pemesan</th>
                <th class="p-6 text-2xl font-bold uppercase tracking-wider border-b border-gray-700 w-2/12">Status</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-700 overflow-y-auto block flex-grow w-full">
              <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-700 transition-colors duration-200 table w-full table-fixed">
                <td class="p-6 text-2xl font-medium w-2/12 text-gray-100">
                  <div class="flex flex-col">
                    <span>{{ formatBookingDateOnly(booking.start_time) }}</span>
                    <span class="text-blue-300 font-bold mt-1 text-3xl">{{ formatBookingTimeOnly(booking.start_time, booking.end_time) }}</span>
                  </div>
                </td>
                <td class="p-6 text-3xl font-bold text-white w-3/12">
                  <span class="line-clamp-2 leading-snug">{{ booking.event_name }}</span>
                </td>
                <td class="p-6 text-2xl text-blue-200 font-semibold w-2/12">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl">🏢</span>
                    <span class="leading-snug">{{ booking.room_name }}</span>
                  </div>
                </td>
                <td class="p-6 text-2xl text-gray-300 w-3/12">
                  <div class="flex flex-col">
                    <span class="font-bold text-white truncate">{{ booking.user_name }}</span>
                    <span class="text-xl text-gray-500 mt-1 truncate">{{ booking.user_category || booking.unit_name || '-' }}</span>
                  </div>
                </td>
                <td class="p-6 w-2/12">
                  <div class="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-xl uppercase tracking-wider border-2"
                       :class="getStatusClasses(booking.status)">
                    {{ getStatusText(booking.status) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Footer Banner / Info -->
    <footer class="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center text-gray-500 text-xl">
      <div class="flex items-center gap-4">
        <span class="animate-pulse h-4 w-4 bg-green-500 rounded-full inline-block"></span>
        <span>Live System Berjalan</span>
      </div>
      <div>
        Update terakhir: {{ lastUpdate }}
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: 'signage',
  middleware: ['auth', 'signage-auth']
})

// State
const bookings = ref([])
const loading = ref(true)
const currentTime = ref('')
const currentDate = ref('')
const lastUpdate = ref('')
let timerInterval = null
let refreshInterval = null

// Functions - DateTime Formatting
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/:/g, ' : ')
  
  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const toUtcDate = (s) => {
  if (!s) return new Date(NaN)
  const str = String(s)
  if (str.includes('Z') || str.includes('+')) return new Date(str)
  return new Date(str.replace(' ', 'T') + 'Z')
}

const formatBookingDateOnly = (startTime) => {
  const date = toUtcDate(startTime)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

const formatBookingTimeOnly = (startTime, endTime) => {
  const start = toUtcDate(startTime)
  const end = toUtcDate(endTime)
  const startStr = start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const endStr = end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${startStr} - ${endStr}`
}

const getStatusClasses = (status) => {
  const map = {
    'APPROVED': 'bg-green-900/40 text-green-400 border-green-500/50',
    'PENDING': 'bg-yellow-900/40 text-yellow-400 border-yellow-500/50'
  }
  return map[status] || 'bg-gray-800 text-gray-400 border-gray-600'
}

const getStatusText = (status) => {
  if (status === 'APPROVED') return 'Disetujui'
  if (status === 'PENDING') return 'Menunggu'
  return status
}

// Data Fetching
const fetchBookings = async () => {
  try {
    const accessToken = sessionStorage.getItem('admin_access_token')
    if (!accessToken) return

    // Kita panggil endpoint API admin bookings, batasi ke beberapa hari ke depan saja
    // dan hanya yang berstatus APPROVED.
    const response = await $fetch('/api/admin/bookings?days=14&past_days=0&status=APPROVED', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response && response.bookings) {
      // Filter out bookings that have already ended
      const now = new Date()
      const upcomingAndOngoing = response.bookings.filter(b => {
        const end = toUtcDate(b.end_time)
        return end >= now
      })
      
      // Limit to 20 to avoid extreme scrolling in signage, though it scrolls automatically
      bookings.value = upcomingAndOngoing.slice(0, 20)
    }
    
    // Update timestamp
    const now = new Date()
    lastUpdate.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch (error) {
    console.error('Failed to fetch signage bookings:', error)
  } finally {
    loading.value = false
  }
}

// Scroll Automation (Optional but good for signage)
const setupAutoScroll = () => {
  // If the list is long, we can add a subtle auto-scroll script here.
  // For now, relying on standard display is fine.
}

// Lifecycle Hooks
onMounted(() => {
  // Initial load
  updateClock()
  fetchBookings()

  // Start clocks
  timerInterval = setInterval(updateClock, 1000)

  // Start auto-refresh data (every 1 minute)
  refreshInterval = setInterval(fetchBookings, 60000)
  
  setupAutoScroll()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
/* Sembunyikan scrollbar bawaan agar layar rapi */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
