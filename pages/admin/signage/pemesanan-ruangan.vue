<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col font-sans p-6 select-none">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <header class="flex justify-between items-center border-b border-gray-700 pb-6 mb-6 flex-shrink-0">
      <div>
        <h1 class="text-5xl font-bold tracking-wider text-blue-400 leading-tight">
          JADWAL PEMESANAN RUANGAN
        </h1>
        <p class="text-2xl text-gray-400 mt-2 tracking-wide uppercase">
          Paroki Santo Paulus Juanda
        </p>
      </div>
      <div class="text-right flex flex-col items-end">
        <div class="text-6xl font-bold font-mono text-white tracking-widest tabular-nums">
          {{ currentTime }}
        </div>
        <div class="text-2xl text-gray-400 mt-2 font-medium tracking-wide capitalize">
          {{ currentDate }}
        </div>
      </div>
    </header>

    <!-- ── Main Content ────────────────────────────────────────────────────── -->
    <main class="flex-grow flex flex-col overflow-hidden min-h-0">

      <!-- Fix #2: Session Expired State -->
      <div v-if="sessionExpired"
        class="flex-grow flex flex-col items-center justify-center bg-red-900/20 rounded-2xl border-2 border-red-700">
        <span class="text-8xl mb-6">🔒</span>
        <h2 class="text-4xl font-semibold text-red-400">Sesi Telah Berakhir</h2>
        <p class="text-2xl text-gray-400 mt-4">Silakan login ulang sebagai admin untuk melanjutkan.</p>
        <p class="text-xl text-gray-500 mt-3">URL: <span class="font-mono text-gray-300">/admin/login</span></p>
      </div>

      <!-- Fix #5: API Error State -->
      <div v-else-if="fetchError"
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
      <!-- Fix #4: Ganti pendekatan flex+table-fixed dengan sticky thead yang standar -->
      <div v-else class="flex-grow overflow-hidden flex flex-col bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl min-h-0">
        <div class="overflow-y-auto flex-grow">
          <table class="w-full table-fixed text-left border-collapse">
            <!-- Sticky Header -->
            <thead class="sticky top-0 z-10 bg-gray-950 border-b border-gray-700">
              <tr>
                <th class="p-6 text-xl font-bold uppercase tracking-wider text-gray-300 w-[22%]">Waktu</th>
                <th class="p-6 text-xl font-bold uppercase tracking-wider text-gray-300 w-[30%]">Kegiatan</th>
                <th class="p-6 text-xl font-bold uppercase tracking-wider text-gray-300 w-[20%]">Ruangan</th>
                <th class="p-6 text-xl font-bold uppercase tracking-wider text-gray-300 w-[18%]">Pemesan</th>
                <th class="p-6 text-xl font-bold uppercase tracking-wider text-gray-300 w-[10%]">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700/60">
              <tr
                v-for="booking in bookings"
                :key="booking.id"
                class="hover:bg-gray-700/50 transition-colors duration-200"
                :class="isOngoing(booking) ? 'bg-blue-900/20' : ''"
              >
                <!-- Kolom Waktu -->
                <td class="p-6 align-top w-[22%]">
                  <div class="flex flex-col gap-1">
                    <span class="text-xl text-gray-400 font-medium">
                      {{ formatDateOnly(booking.start_time) }}
                    </span>
                    <span class="text-3xl text-blue-300 font-bold font-mono tabular-nums">
                      {{ formatTimeRange(booking.start_time, booking.end_time) }}
                    </span>
                    <span v-if="isOngoing(booking)"
                      class="mt-1 inline-flex items-center gap-1.5 text-base text-green-400 font-semibold">
                      <span class="animate-pulse h-2 w-2 bg-green-400 rounded-full inline-block"></span>
                      Sedang Berlangsung
                    </span>
                  </div>
                </td>

                <!-- Kolom Kegiatan -->
                <td class="p-6 align-top w-[30%]">
                  <span class="text-3xl font-bold text-white leading-snug line-clamp-3 block">
                    {{ booking.event_name }}
                  </span>
                </td>

                <!-- Kolom Ruangan -->
                <td class="p-6 align-top w-[20%]">
                  <div class="flex items-start gap-3">
                    <span class="text-3xl mt-0.5">🏢</span>
                    <span class="text-2xl text-blue-200 font-semibold leading-snug">
                      {{ booking.room_name }}
                    </span>
                  </div>
                </td>

                <!-- Kolom Pemesan -->
                <td class="p-6 align-top w-[18%]">
                  <div class="flex flex-col gap-1">
                    <span class="text-2xl font-bold text-white truncate">{{ booking.user_name }}</span>
                    <span class="text-lg text-gray-500 truncate">
                      {{ booking.user_category || booking.unit_name || '-' }}
                    </span>
                  </div>
                </td>

                <!-- Kolom Status -->
                <td class="p-6 align-top w-[10%]">
                  <div
                    class="inline-flex items-center justify-center px-4 py-2 rounded-full font-bold text-lg uppercase tracking-wider border-2 whitespace-nowrap"
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
    <footer class="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-gray-500 text-xl flex-shrink-0">
      <div class="flex items-center gap-3">
        <span
          class="h-3 w-3 rounded-full inline-block"
          :class="fetchError || sessionExpired ? 'bg-red-500' : 'bg-green-500 animate-pulse'"
        ></span>
        <span :class="fetchError || sessionExpired ? 'text-red-400' : ''">
          {{ fetchError || sessionExpired ? 'Sistem Tidak Aktif' : 'Live System Berjalan' }}
        </span>
      </div>
      <div class="flex items-center gap-6">
        <span>{{ bookings.length }} jadwal ditampilkan</span>
        <span>Diperbarui: <strong class="text-gray-300 font-mono">{{ lastUpdate || '—' }}</strong></span>
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

// ── State ──────────────────────────────────────────────────────────────────
const bookings     = ref([])
const loading      = ref(true)
const currentTime  = ref('')
const currentDate  = ref('')
const lastUpdate   = ref('')
const sessionExpired = ref(false)  // Fix #2: state khusus sesi habis
const fetchError   = ref('')       // Fix #5: state error API

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
  'APPROVED': 'bg-green-900/40 text-green-400 border-green-500/50',
  'PENDING':  'bg-yellow-900/40 text-yellow-400 border-yellow-500/50'
}[status] || 'bg-gray-800 text-gray-400 border-gray-600')

const getStatusText = (status) =>
  ({ 'APPROVED': 'Disetujui', 'PENDING': 'Menunggu' }[status] || status)

// ── Data Fetching ──────────────────────────────────────────────────────────
const fetchBookings = async () => {
  // Fix #1: Deklarasikan 'now' di paling atas agar tidak TDZ
  const now = new Date()

  // Fix #2: Cek token dan tampilkan pesan di layar jika sesi habis
  const accessToken = sessionStorage.getItem('admin_access_token')
  if (!accessToken) {
    sessionExpired.value = true
    loading.value = false
    return
  }

  try {
    fetchError.value = ''

    // Fix #3: past_days=1 agar booking lintas tengah malam tetap muncul
    const response = await $fetch('/api/admin/bookings?days=14&past_days=1&status=APPROVED', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (response && response.bookings) {
      // Hanya tampilkan booking yang belum berakhir (sudah berlangsung atau akan datang)
      // Fix #1: Menggunakan 'now' yang sudah dideklarasikan di atas
      const activeBookings = response.bookings.filter(b => toUtcDate(b.end_time) >= now)

      // Batasi ke 20 baris agar layar tetap bersih
      bookings.value = activeBookings.slice(0, 20)
    }

    lastUpdate.value = now.toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  } catch (error) {
    // Fix #5: Tampilkan pesan error di layar, bukan hanya di console
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
