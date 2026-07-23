<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Layar TV / Signage" />
    <div v-else>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col font-sans p-6 select-none">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <header class="flex flex-col portrait:flex-col landscape:flex-row justify-between items-center portrait:text-center portrait:gap-6 border-b border-gray-700 pb-6 mb-6 flex-shrink-0">
      <div>
        <h1 class="text-5xl portrait:text-4xl font-bold tracking-wider text-blue-400 leading-tight">
          JADWAL PEMESANAN RUANGAN
        </h1>
        <p class="text-2xl portrait:text-xl text-gray-400 mt-2 tracking-wide uppercase">
          Paroki Santo Paulus Juanda
        </p>
      </div>
      <div class="text-right portrait:text-center flex flex-col items-end portrait:items-center">
        <div class="text-6xl portrait:text-5xl font-bold font-mono text-white tracking-widest tabular-nums">
          {{ currentTime }}
        </div>
        <div class="text-2xl portrait:text-xl text-gray-400 mt-2 font-medium tracking-wide capitalize">
          {{ currentDate }}
        </div>
      </div>
    </header>

    <!-- ── Main Content ────────────────────────────────────────────────────── -->
    <main class="flex-grow flex flex-col overflow-hidden min-h-0">

      <!-- API Error State -->
      <div v-if="fetchError"
        class="flex-grow flex flex-col items-center justify-center bg-orange-900/20 rounded-2xl border-2 border-orange-700">
        <span class="text-8xl mb-6">⚠️</span>
        <h2 class="text-4xl font-semibold text-orange-400">Gagal Memuat Data</h2>
        <p class="text-2xl text-gray-400 mt-4">{{ fetchError }}</p>
        <p class="text-xl text-gray-500 mt-3">Sistem akan mencoba lagi secara otomatis.</p>
      </div>

      <!-- Loading State (hanya saat fetch pertama) -->
      <div v-else-if="loading && bookings.length === 0"
        class="flex-grow flex items-center justify-center">
        <div class="flex flex-col items-center">
          <div class="h-20 w-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p class="text-2xl mt-6 text-gray-400 tracking-widest animate-pulse">MEMUAT DATA...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0"
        class="flex-grow flex flex-col items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
        <span class="text-9xl mb-6">📅</span>
        <h2 class="text-4xl font-semibold text-gray-300">Tidak ada jadwal pemesanan</h2>
        <p class="text-2xl text-gray-500 mt-4">Semua ruangan saat ini tersedia.</p>
      </div>

      <!-- ── Data Table ─────────────────────────────────────────────────────── -->
      <div v-else class="flex-grow overflow-hidden flex flex-col bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl min-h-0">
        <div class="overflow-y-auto flex-grow">
          <table class="w-full table-fixed text-left border-collapse">
            <!-- Sticky Header -->
            <thead class="sticky top-0 z-10 bg-gray-950 border-b border-gray-700">
              <tr>
                <th class="p-6 portrait:p-5 pl-[4%] text-xl portrait:text-sm font-bold uppercase tracking-wider text-gray-300 w-[55%] portrait:w-[50%]">Informasi Kegiatan</th>
                <th class="p-6 portrait:p-5 text-xl portrait:text-sm font-bold uppercase tracking-wider text-gray-300 w-[25%] portrait:w-[25%] text-center">Ruangan</th>
                <th class="p-6 portrait:p-5 pr-[4%] text-xl portrait:text-sm font-bold uppercase tracking-wider text-gray-300 w-[20%] portrait:w-[25%] text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700/60">
              <tr
                v-for="booking in bookings"
                :key="booking.id"
                class="hover:bg-gray-700/50 transition-colors duration-200"
                :class="isOngoing(booking) ? 'bg-blue-900/20' : ''"
              >
                <!-- Kolom Kegiatan & Waktu -->
                <td class="p-6 portrait:p-5 pl-[4%] align-top w-[55%] portrait:w-[50%]">
                  <div class="flex flex-col gap-2 portrait:gap-3">
                    <span class="text-4xl portrait:text-2xl font-bold text-white leading-normal line-clamp-3">
                      {{ booking.event_name }}
                    </span>
                    <div class="flex items-center flex-wrap gap-x-4 gap-y-2 mt-1">
                      <span class="text-2xl portrait:text-lg text-blue-300 font-bold font-mono tabular-nums bg-blue-900/20 px-3 py-1 rounded-lg border border-blue-500/30">
                        {{ formatTimeRange(booking.start_time, booking.end_time) }}
                      </span>
                      <span class="text-xl portrait:text-base text-gray-400 font-medium flex items-center gap-2">
                        📅 {{ formatDateOnly(booking.start_time) }}
                      </span>
                      <span v-if="isOngoing(booking)"
                        class="inline-flex items-center gap-1.5 text-base portrait:text-sm text-green-400 font-semibold bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
                        <span class="animate-pulse h-2 w-2 bg-green-400 rounded-full inline-block"></span>
                        Berlangsung
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Kolom Ruangan -->
                <td class="p-6 portrait:p-5 align-top w-[25%] portrait:w-[25%] text-center">
                  <div class="flex items-center justify-center gap-2 portrait:gap-3">
                    <span class="text-3xl portrait:text-2xl mt-0.5">🏢</span>
                    <span class="text-2xl portrait:text-xl text-blue-200 font-semibold leading-normal">
                      {{ booking.room_name }}
                    </span>
                  </div>
                </td>

                <!-- Kolom Status -->
                <td class="p-6 portrait:p-5 pr-[4%] align-top w-[20%] portrait:w-[25%] text-center">
                  <div
                    class="inline-flex items-center justify-center px-4 py-2 portrait:px-3 portrait:py-2 rounded-full font-bold text-lg portrait:text-xs uppercase tracking-wider border-2 whitespace-nowrap"
                    :class="getStatusClasses(booking.status)"
                  >
                    {{ getStatusText(booking.status) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────────── -->
    <footer class="mt-6 pt-4 border-t border-gray-700 flex flex-col portrait:flex-col landscape:flex-row justify-between items-center text-gray-500 text-xl portrait:text-sm flex-shrink-0 portrait:gap-2">
      <div class="flex items-center gap-3">
        <span
          class="h-3 w-3 rounded-full inline-block"
          :class="fetchError ? 'bg-red-500' : 'bg-green-500 animate-pulse'"
        ></span>
        <span :class="fetchError ? 'text-red-400' : ''">
          {{ fetchError ? 'Sistem Tidak Aktif' : 'Live System Berjalan' }}
        </span>
      </div>
      <div class="flex items-center gap-6 portrait:gap-3">
        <span>{{ bookings.length }} jadwal ditampilkan</span>
        <span>Diperbarui: <strong class="text-gray-300 font-mono">{{ lastUpdate || '—' }}</strong></span>
      </div>
    </footer>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('layar-tv')
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: 'signage'
  // No auth middleware!
})

// ── State ──────────────────────────────────────────────────────────────────
const bookings     = ref([])
const loading      = ref(true)
const currentTime  = ref('')
const currentDate  = ref('')
const lastUpdate   = ref('')
const fetchError   = ref('')

let timerInterval   = null
let refreshInterval = null

// ── Helpers: DateTime ──────────────────────────────────────────────────────
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).replace(/:/g, ' : ')

  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  })
}

const toUtcDate = (s) => {
  if (!s) return new Date(NaN)
  const str = String(s)
  if (str.includes('Z') || str.includes('+')) return new Date(str)
  return new Date(str.replace(' ', 'T') + 'Z')
}

const formatDateOnly = (startTime) =>
  toUtcDate(startTime).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' })

const formatTimeRange = (startTime, endTime) => {
  const s = toUtcDate(startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const e = toUtcDate(endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${s} – ${e}`
}

const isOngoing = (booking) => {
  const now = new Date()
  return toUtcDate(booking.start_time) <= now && toUtcDate(booking.end_time) >= now
}

// ── Helpers: Status ────────────────────────────────────────────────────────
const getStatusClasses = (status) => ({
  'APPROVED': 'bg-green-600 text-white border-green-300 font-extrabold shadow-lg shadow-green-900/50',
  'PENDING':  'bg-amber-600 text-white border-amber-300 font-extrabold shadow-lg shadow-amber-900/50'
}[status] || 'bg-gray-700 text-white border-gray-500')


const getStatusText = (status) =>
  ({ 'APPROVED': 'Disetujui', 'PENDING': 'Menunggu' }[status] || status)

// ── Data Fetching ──────────────────────────────────────────────────────────
const fetchBookings = async () => {
  const now = new Date()

  try {
    fetchError.value = ''

    // Panggil API publik yang baru dibuat (tanpa parameter status karena sudah di-hardcode di API)
    const response = await $fetch('/api/public/signage-bookings')

    if (response && response.bookings) {
      // Hanya tampilkan booking yang belum berakhir (sudah berlangsung atau akan datang)
      const activeBookings = response.bookings.filter(b => toUtcDate(b.end_time) >= now)

      // Batasi ke 20 baris agar layar tetap bersih
      bookings.value = activeBookings.slice(0, 20)
    }

    lastUpdate.value = now.toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  } catch (error) {
    console.error('[Signage] Failed to fetch bookings:', error)
    fetchError.value = error?.data?.message || error?.statusMessage || 'Server tidak dapat dihubungi.'
  } finally {
    loading.value = false
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  updateClock()
  fetchBookings()

  timerInterval   = setInterval(updateClock, 1000)
  refreshInterval = setInterval(fetchBookings, 60_000)
})

onUnmounted(() => {
  if (timerInterval)   clearInterval(timerInterval)
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
/* Scrollbar halus agar layar terlihat rapi */
::-webkit-scrollbar        { width: 6px; }
::-webkit-scrollbar-track  { background: #1f2937; border-radius: 3px; }
::-webkit-scrollbar-thumb  { background: #4b5563; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #6b7280; }
</style>
