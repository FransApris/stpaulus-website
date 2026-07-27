<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Laporan Pemesanan Ruangan</h1>
        <p class="text-gray-500 mt-1 text-sm">Analisa & statistik penggunaan ruangan</p>
      </div>
      <!-- Date filter + Export buttons -->
      <div class="flex flex-wrap items-center gap-2 no-print">
        <input type="date" v-model="filterStart"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <span class="text-gray-500 text-sm">s/d</span>
        <input type="date" v-model="filterEnd"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button @click="loadReport"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
          Terapkan
        </button>
        <button @click="resetFilter"
          class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
          Reset
        </button>
        <div class="w-px h-6 bg-gray-300"></div>
        <button @click="exportXLS" :disabled="!report"
          class="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export Excel
        </button>
        <button @click="exportPDF" :disabled="!report"
          class="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <template v-else-if="report">

      <!-- 1. Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-gray-800">{{ report.summary.total || 0 }}</div>
          <div class="text-sm text-gray-500 mt-1">Total Pemesanan</div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-green-700">{{ report.summary.approved || 0 }}</div>
          <div class="text-sm text-green-600 mt-1">Disetujui</div>
        </div>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-yellow-700">{{ report.summary.pending || 0 }}</div>
          <div class="text-sm text-yellow-600 mt-1">Menunggu</div>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-red-700">{{ report.summary.rejected || 0 }}</div>
          <div class="text-sm text-red-600 mt-1">Ditolak</div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-gray-600">{{ report.summary.cancelled || 0 }}</div>
          <div class="text-sm text-gray-500 mt-1">Dibatalkan</div>
        </div>
      </div>

      <!-- 2. Approval Rate + By Category -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Approval Rate -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Tingkat Persetujuan</h2>
          <div v-if="approvalTotal > 0">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-green-700 font-medium">Disetujui ({{ report.approvalRate.approved }})</span>
              <span class="text-green-700 font-semibold">{{ approvalPct }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-5 mb-3">
              <div class="bg-green-500 h-5 rounded-full transition-all duration-500"
                :style="{ width: approvalPct + '%' }"></div>
            </div>
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-red-600 font-medium">Ditolak ({{ report.approvalRate.rejected }})</span>
              <span class="text-red-600 font-semibold">{{ rejectionPct }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-5">
              <div class="bg-red-400 h-5 rounded-full transition-all duration-500"
                :style="{ width: rejectionPct + '%' }"></div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data keputusan.</p>
        </div>

        <!-- By Category -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Pemesanan per Kategori Pengguna</h2>
          <div v-if="report.byCategory.length > 0" class="space-y-2">
            <div v-for="cat in report.byCategory" :key="cat.category">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-700 font-medium truncate">{{ cat.category }}</span>
                <span class="text-gray-500 ml-2 shrink-0">{{ cat.total }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3">
                <div class="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: pct(cat.total, maxCategory) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data.</p>
        </div>
      </div>

      <!-- 3. Monthly Trend -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Tren Pemesanan per Bulan (12 Bulan Terakhir)</h2>
        <div v-if="report.monthlyTrend.length > 0" class="overflow-x-auto">
          <div class="flex items-end gap-2 min-w-max h-44 border-b border-gray-200 pb-1">
            <div v-for="m in report.monthlyTrend" :key="m.month"
              class="flex flex-col items-center gap-1 w-14">
              <span class="text-xs text-gray-500">{{ m.total }}</span>
              <div class="w-10 flex flex-col justify-end" style="height: 120px">
                <div class="w-full rounded-t transition-all duration-500"
                  :style="{ height: pct(m.total, maxMonthly) * 1.2 + 'px', backgroundColor: '#3b82f6' }"></div>
              </div>
              <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatMonth(m.month) }}</span>
            </div>
          </div>
          <div class="flex gap-4 mt-3 text-xs text-gray-500">
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-blue-500"></span> Total</span>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">Belum ada data tren.</p>
      </div>

      <!-- 4. Room Usage + Day of Week -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Room Usage -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Ruangan Paling Sering Digunakan</h2>
          <div v-if="report.roomUsage.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-500 border-b">
                  <th class="pb-2 font-medium">Ruangan</th>
                  <th class="pb-2 font-medium text-center">Pemesanan</th>
                  <th class="pb-2 font-medium text-center">Disetujui</th>
                  <th class="pb-2 font-medium text-center">Total Jam</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(room, i) in report.roomUsage" :key="room.room_name"
                  class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-2 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">{{ i + 1 }}</span>
                    <div>
                      <div class="font-medium text-gray-800">{{ room.room_name }}</div>
                      <div class="text-xs text-gray-400">{{ room.location }}</div>
                    </div>
                  </td>
                  <td class="py-2 text-center font-semibold text-gray-800">{{ room.total_bookings }}</td>
                  <td class="py-2 text-center text-green-700">{{ room.approved }}</td>
                  <td class="py-2 text-center text-blue-600">{{ room.total_hours }} jam</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data.</p>
        </div>

        <!-- Day of Week -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Pemesanan per Hari (Disetujui)</h2>
          <div v-if="report.byDayOfWeek.length > 0" class="space-y-2">
            <div v-for="d in sortedDays" :key="d.day_num">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-700 font-medium">{{ translateDay(d.day_name) }}</span>
                <span class="text-gray-500">{{ d.total }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3">
                <div class="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: pct(d.total, maxDay) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data.</p>
        </div>
      </div>

      <!-- 5. Hour Distribution -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Jam Pemesanan (Disetujui)</h2>
        <div v-if="report.byHour.length > 0" class="overflow-x-auto">
          <div class="flex items-end gap-1 min-w-max h-32 border-b border-gray-200 pb-1">
            <div v-for="h in report.byHour" :key="h.hour"
              class="flex flex-col items-center gap-1 w-9">
              <span class="text-xs text-gray-400">{{ h.total }}</span>
              <div class="w-7 rounded-t transition-all duration-500 bg-teal-400"
                :style="{ height: pct(h.total, maxHour) * 0.8 + 'px' }"></div>
              <span class="text-xs text-gray-400">{{ h.hour }}:00</span>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">Belum ada data.</p>
      </div>

      <!-- 6. Recent Rejections -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Pemesanan Ditolak Terbaru</h2>
        <div v-if="report.rejections.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 border-b">
                <th class="pb-2 font-medium">Acara</th>
                <th class="pb-2 font-medium">Ruangan</th>
                <th class="pb-2 font-medium">Pemesan</th>
                <th class="pb-2 font-medium">Tanggal</th>
                <th class="pb-2 font-medium">Alasan Penolakan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in report.rejections" :key="r.event_name + r.booking_date"
                class="border-b border-gray-50 hover:bg-red-50">
                <td class="py-2 font-medium text-gray-800">{{ r.event_name }}</td>
                <td class="py-2 text-gray-600">{{ r.room_name }}</td>
                <td class="py-2">
                  <div class="text-gray-700">{{ r.user_name }}</div>
                  <div class="text-xs text-gray-400">{{ r.user_category }}</div>
                </td>
                <td class="py-2 text-gray-500 whitespace-nowrap">{{ r.booking_date }}</td>
                <td class="py-2 text-red-600 text-xs">{{ r.rejection_reason || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-400 text-sm">Tidak ada penolakan dalam periode ini.</p>
      </div>

      <!-- 7. Recent Cancellations with Reasons -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Pemesanan Dibatalkan (dengan Alasan)</h2>
        <div v-if="report.cancellations && report.cancellations.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 border-b">
                <th class="pb-2 font-medium">Acara</th>
                <th class="pb-2 font-medium">Ruangan</th>
                <th class="pb-2 font-medium">Pemesan</th>
                <th class="pb-2 font-medium">Tanggal</th>
                <th class="pb-2 font-medium">Alasan Pembatalan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in report.cancellations" :key="c.id" class="border-b border-gray-50 hover:bg-gray-50">
                <td class="py-2 font-medium text-gray-800">{{ c.event_name }}</td>
                <td class="py-2 text-gray-600">{{ c.room_name }}</td>
                <td class="py-2">
                  <div class="text-gray-700">{{ c.user_name }}</div>
                  <div class="text-xs text-gray-400">{{ c.user_category || '-' }}</div>
                </td>
                <td class="py-2 text-gray-500 whitespace-nowrap">{{ c.booking_date }}</td>
                <td class="py-2 text-gray-700 text-xs bg-gray-50 px-2 rounded">{{ c.cancellation_reason || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-400 text-sm">Tidak ada pembatalan dalam periode ini.</p>
      </div>

    </template>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center">
      {{ error }}
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({ title: 'Laporan Pemesanan - Admin' })

const report = ref(null)
const loading = ref(false)
const error = ref('')

// Default: current month
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const filterStart = ref(firstDay.toISOString().slice(0, 10))
const filterEnd = ref(now.toISOString().slice(0, 10))

const loadReport = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    if (filterStart.value) params.set('startDate', filterStart.value)
    if (filterEnd.value) params.set('endDate', filterEnd.value)
    report.value = await $fetch(`/api/admin/bookings/report?${params}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}` }
    })
  } catch (err) {
    error.value = err?.data?.statusMessage || 'Gagal memuat laporan'
  } finally {
    loading.value = false
  }
}

const resetFilter = () => {
  filterStart.value = ''
  filterEnd.value = ''
  loadReport()
}

onMounted(loadReport)

// Computed helpers
const approvalTotal = computed(() => {
  if (!report.value) return 0
  return (report.value.approvalRate.approved || 0) + (report.value.approvalRate.rejected || 0)
})
const approvalPct = computed(() => {
  if (!approvalTotal.value) return 0
  return Math.round((report.value.approvalRate.approved / approvalTotal.value) * 100)
})
const rejectionPct = computed(() => {
  if (!approvalTotal.value) return 0
  return Math.round((report.value.approvalRate.rejected / approvalTotal.value) * 100)
})
const maxCategory = computed(() => {
  if (!report.value?.byCategory?.length) return 1
  return Math.max(...report.value.byCategory.map(c => c.total))
})
const maxMonthly = computed(() => {
  if (!report.value?.monthlyTrend?.length) return 1
  return Math.max(...report.value.monthlyTrend.map(m => m.total))
})
const maxDay = computed(() => {
  if (!report.value?.byDayOfWeek?.length) return 1
  return Math.max(...report.value.byDayOfWeek.map(d => d.total))
})
const maxHour = computed(() => {
  if (!report.value?.byHour?.length) return 1
  return Math.max(...report.value.byHour.map(h => h.total))
})
const sortedDays = computed(() => {
  if (!report.value?.byDayOfWeek) return []
  // Reorder: Mon(2) to Sun(1) — put Sunday last
  const order = [2, 3, 4, 5, 6, 7, 1]
  return [...report.value.byDayOfWeek].sort((a, b) => order.indexOf(a.day_num) - order.indexOf(b.day_num))
})

const pct = (val, max) => max > 0 ? Math.round((val / max) * 100) : 0

const formatMonth = (ym) => {
  const [y, m] = ym.split('-')
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return names[parseInt(m) - 1] + ' ' + y.slice(2)
}

const DAY_ID = {
  Sunday: 'Minggu', Monday: 'Senin', Tuesday: 'Selasa',
  Wednesday: 'Rabu', Thursday: 'Kamis', Friday: 'Jumat', Saturday: 'Sabtu'
}
const translateDay = (name) => DAY_ID[name] || name

// ---------- Export Excel (xlsx / SheetJS) ----------
const exportXLS = async () => {
  if (!report.value) return
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()

  // Sheet 1: Ringkasan
  const s = report.value.summary
  const summaryData = [
    ['Ringkasan Pemesanan'],
    ['Periode', `${filterStart.value || '-'} s/d ${filterEnd.value || '-'}`],
    [],
    ['Status', 'Jumlah'],
    ['Total', s.total || 0],
    ['Disetujui', s.approved || 0],
    ['Menunggu', s.pending || 0],
    ['Ditolak', s.rejected || 0],
    ['Dibatalkan', s.cancelled || 0],
    [],
    ['Tingkat Persetujuan', approvalPct.value + '%'],
    ['Tingkat Penolakan', rejectionPct.value + '%'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Ringkasan')

  // Sheet 2: Tren Bulanan
  const trendRows = [['Bulan', 'Total', 'Disetujui', 'Ditolak', 'Dibatalkan']]
  for (const m of report.value.monthlyTrend) {
    trendRows.push([formatMonth(m.month), m.total, m.approved, m.rejected, m.cancelled])
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trendRows), 'Tren Bulanan')

  // Sheet 3: Ruangan
  const roomRows = [['No', 'Ruangan', 'Lokasi', 'Total Pemesanan', 'Disetujui', 'Total Jam']]
  report.value.roomUsage.forEach((r, i) => {
    roomRows.push([i + 1, r.room_name, r.location, r.total_bookings, r.approved, r.total_hours])
  })
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(roomRows), 'Ruangan')

  // Sheet 4: Kategori Pengguna
  const catRows = [['Kategori', 'Total Pemesanan', 'Disetujui']]
  for (const c of report.value.byCategory) catRows.push([c.category, c.total, c.approved])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(catRows), 'Per Kategori')

  // Sheet 5: Hari & Jam
  const dayRows = [['Hari', 'Jumlah (Disetujui)']]
  for (const d of sortedDays.value) dayRows.push([translateDay(d.day_name), d.total])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dayRows), 'Per Hari')

  const hourRows = [['Jam', 'Jumlah (Disetujui)']]
  for (const h of report.value.byHour) hourRows.push([h.hour + ':00', h.total])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(hourRows), 'Per Jam')

  // Sheet 6: Penolakan
  const rejRows = [['Acara', 'Ruangan', 'Pemesan', 'Kategori', 'Tanggal', 'Alasan Penolakan']]
  for (const r of report.value.rejections)
    rejRows.push([r.event_name, r.room_name, r.user_name, r.user_category, r.booking_date, r.rejection_reason || ''])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rejRows), 'Penolakan')

  const fileName = `Laporan-Pemesanan_${filterStart.value || 'semua'}_sd_${filterEnd.value || 'semua'}.xlsx`
  XLSX.writeFile(wb, fileName)
}

// ---------- Export PDF (browser print) ----------
const exportPDF = () => {
  window.print()
}
</script>

<style>
@media print {
  /* Hide sidebar, top header bar, filter/export buttons */
  #admin-sidebar,
  #admin-topheader,
  .no-print { display: none !important; }

  /* Remove flex layout so content fills full page */
  .min-h-screen { display: block !important; }

  /* Let main content fill full page width */
  .flex-1 { width: 100% !important; }
  main, body, #__nuxt { width: 100% !important; padding: 8px !important; margin: 0 !important; }

  /* Avoid splitting section cards across pages */
  .space-y-6 > div { break-inside: avoid; }

  /* Ensure colored backgrounds print */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
</style>
