<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Laporan Konten</h1>
        <p class="text-gray-500 mt-1 text-sm">Statistik artikel, berita, galeri & kronik</p>
      </div>
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
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-blue-700">{{ report.articleSummary.total || 0 }}</div>
          <div class="text-xs text-blue-600 mt-1">Total Artikel</div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-green-700">{{ report.articleSummary.published || 0 }}</div>
          <div class="text-xs text-green-600 mt-1">Artikel Published</div>
        </div>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-yellow-700">{{ report.articleSummary.draft || 0 }}</div>
          <div class="text-xs text-yellow-600 mt-1">Artikel Draft</div>
        </div>
        <div class="bg-purple-50 border border-purple-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-purple-700">{{ report.newsSummary.published || 0 }}</div>
          <div class="text-xs text-purple-600 mt-1">Berita Published</div>
        </div>
        <div class="bg-teal-50 border border-teal-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-teal-700">{{ report.gallerySummary.total_albums || 0 }}</div>
          <div class="text-xs text-teal-600 mt-1">Album Galeri</div>
        </div>
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg shadow p-4 text-center">
          <div class="text-3xl font-bold text-indigo-700">{{ report.gallerySummary.total_photos || 0 }}</div>
          <div class="text-xs text-indigo-600 mt-1">Total Foto</div>
        </div>
      </div>

      <!-- 2. Monthly Trend -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Tren Publikasi per Bulan (12 Bulan Terakhir)</h2>
        <div v-if="report.monthlyTrend.length > 0" class="overflow-x-auto">
          <!-- Bar chart -->
          <div class="flex items-end gap-2 min-w-max pb-1" style="height: 160px; border-bottom: 1px solid #e5e7eb;">
            <div v-for="m in report.monthlyTrend" :key="m.month" class="flex gap-1 items-end">
              <!-- Articles bar -->
              <div class="flex flex-col items-center w-8">
                <span class="text-xs text-blue-500 mb-0.5">{{ m.articles }}</span>
                <div class="w-full rounded-t bg-blue-400 transition-all duration-500"
                  :style="{ height: pct(m.articles, maxMonthly) * 1.2 + 'px' }"></div>
              </div>
              <!-- News bar -->
              <div class="flex flex-col items-center w-8">
                <span class="text-xs text-purple-500 mb-0.5">{{ m.news }}</span>
                <div class="w-full rounded-t bg-purple-400 transition-all duration-500"
                  :style="{ height: pct(m.news, maxMonthly) * 1.2 + 'px' }"></div>
              </div>
            </div>
          </div>
          <!-- X labels -->
          <div class="flex gap-2 min-w-max mt-2">
            <div v-for="m in report.monthlyTrend" :key="'lbl-' + m.month" class="w-16 text-center text-xs text-gray-400">
              {{ formatMonth(m.month) }}
            </div>
          </div>
          <div class="flex gap-4 mt-3 text-xs text-gray-500">
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-blue-400"></span> Artikel</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-purple-400"></span> Berita</span>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">Belum ada data tren.</p>
      </div>

      <!-- 3. Articles by Category + Gallery by Category -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Articles by Category -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Artikel per Kategori</h2>
          <div v-if="report.articlesByCategory.length > 0" class="space-y-2">
            <div v-for="cat in report.articlesByCategory" :key="cat.category">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-700 font-medium truncate">{{ cat.category }}</span>
                <span class="text-gray-500 ml-2 shrink-0">{{ cat.total }} ({{ cat.published }} published)</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3">
                <div class="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: pct(cat.total, maxArticleCat) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data.</p>
        </div>

        <!-- Gallery by Category -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Galeri per Kategori</h2>
          <div v-if="report.galleryByCategory.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-500 border-b">
                  <th class="pb-2 font-medium">Kategori</th>
                  <th class="pb-2 font-medium text-center">Album</th>
                  <th class="pb-2 font-medium text-center">Foto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in report.galleryByCategory" :key="cat.category"
                  class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-2 flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: cat.color }"></span>
                    <span class="text-gray-700">{{ cat.category }}</span>
                  </td>
                  <td class="py-2 text-center font-semibold text-teal-700">{{ cat.total_albums }}</td>
                  <td class="py-2 text-center text-indigo-600">{{ cat.total_photos }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data.</p>
        </div>
      </div>

      <!-- 4. Top Authors + Kronik by Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Top Authors -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Penulis Paling Aktif</h2>
          <div v-if="report.topAuthors.length > 0" class="space-y-2">
            <div v-for="(a, i) in report.topAuthors" :key="a.author" class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold shrink-0">
                {{ i + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between text-sm mb-0.5">
                  <span class="text-gray-700 font-medium truncate">{{ a.author }}</span>
                  <span class="text-gray-500 ml-2 shrink-0">{{ a.total }}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                  <div class="bg-blue-400 h-2 rounded-full" :style="{ width: pct(a.total, maxAuthor) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data.</p>
        </div>

        <!-- Kronik by Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Entri Kronik per Seksi</h2>
          <div v-if="report.kronikBySection.length > 0" class="space-y-2">
            <div v-for="s in report.kronikBySection" :key="s.section">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-700 font-medium truncate">{{ s.section }}</span>
                <span class="text-gray-500 ml-2 shrink-0">{{ s.total }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3">
                <div class="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: pct(s.total, maxKronik) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada data kronik.</p>
        </div>
      </div>

      <!-- 5. Stale Drafts + FAQ Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Stale Drafts -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-1">Draft Artikel Menunggu Tindakan</h2>
          <p class="text-xs text-gray-400 mb-4">Draft yang belum dipublish lebih dari 30 hari</p>
          <div v-if="report.staleDrafts.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-500 border-b">
                  <th class="pb-2 font-medium">Judul</th>
                  <th class="pb-2 font-medium">Penulis</th>
                  <th class="pb-2 font-medium text-center">Usia (hari)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in report.staleDrafts" :key="d.id"
                  class="border-b border-gray-50 hover:bg-yellow-50">
                  <td class="py-2 text-gray-800 font-medium max-w-xs truncate">{{ d.title }}</td>
                  <td class="py-2 text-gray-500">{{ d.author || '-' }}</td>
                  <td class="py-2 text-center">
                    <span class="px-2 py-0.5 rounded-full text-xs"
                      :class="d.days_old > 90 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'">
                      {{ d.days_old }} hari
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-green-600 text-sm">Tidak ada draft lama. Semua artikel sudah ditindaklanjuti.</p>
        </div>

        <!-- FAQ Stats -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Statistik FAQ Chatbot</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-green-700">{{ report.faqStats.active || 0 }}</div>
              <div class="text-xs text-green-600 mt-1">FAQ Aktif</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-gray-500">{{ report.faqStats.inactive || 0 }}</div>
              <div class="text-xs text-gray-400 mt-1">FAQ Nonaktif</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 text-center col-span-2">
              <div class="text-3xl font-bold text-blue-700">{{ report.faqStats.total_usage || 0 }}</div>
              <div class="text-xs text-blue-600 mt-1">Total Penggunaan Chatbot</div>
            </div>
          </div>
          <!-- Mini berita stats -->
          <div class="mt-4 pt-4 border-t">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Ringkasan Berita</h3>
            <div class="flex gap-3 text-sm">
              <span class="text-gray-500">Total: <strong class="text-gray-800">{{ report.newsSummary.total || 0 }}</strong></span>
              <span class="text-green-600">Published: <strong>{{ report.newsSummary.published || 0 }}</strong></span>
              <span class="text-yellow-600">Draft: <strong>{{ report.newsSummary.draft || 0 }}</strong></span>
            </div>
          </div>
        </div>
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

useHead({ title: 'Laporan Konten - Admin' })

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
    report.value = await $fetch(`/api/admin/content-report?${params}`, {
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

// Computed max values for bar charts
const maxMonthly = computed(() => {
  if (!report.value?.monthlyTrend?.length) return 1
  return Math.max(...report.value.monthlyTrend.flatMap(m => [Number(m.articles), Number(m.news)]))
})
const maxArticleCat = computed(() => {
  if (!report.value?.articlesByCategory?.length) return 1
  return Math.max(...report.value.articlesByCategory.map(c => c.total))
})
const maxAuthor = computed(() => {
  if (!report.value?.topAuthors?.length) return 1
  return Math.max(...report.value.topAuthors.map(a => a.total))
})
const maxKronik = computed(() => {
  if (!report.value?.kronikBySection?.length) return 1
  return Math.max(...report.value.kronikBySection.map(s => s.total))
})

const pct = (val, max) => max > 0 ? Math.round((Number(val) / Number(max)) * 100) : 0

const formatMonth = (ym) => {
  if (!ym) return ''
  const [y, m] = ym.split('-')
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return names[parseInt(m) - 1] + ' ' + y.slice(2)
}

// ---------- Export Excel ----------
const exportXLS = async () => {
  if (!report.value) return
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()
  const r = report.value

  // Sheet 1: Ringkasan
  const summaryData = [
    ['Laporan Konten'],
    ['Periode', `${filterStart.value || '-'} s/d ${filterEnd.value || '-'}`],
    [],
    ['=== ARTIKEL ==='],
    ['Total Artikel', r.articleSummary.total || 0],
    ['Published', r.articleSummary.published || 0],
    ['Draft', r.articleSummary.draft || 0],
    ['Archived', r.articleSummary.archived || 0],
    [],
    ['=== BERITA ==='],
    ['Total Berita', r.newsSummary.total || 0],
    ['Published', r.newsSummary.published || 0],
    ['Draft', r.newsSummary.draft || 0],
    [],
    ['=== GALERI ==='],
    ['Total Album', r.gallerySummary.total_albums || 0],
    ['Album Published', r.gallerySummary.published_albums || 0],
    ['Total Foto', r.gallerySummary.total_photos || 0],
    [],
    ['=== FAQ CHATBOT ==='],
    ['FAQ Aktif', r.faqStats.active || 0],
    ['FAQ Nonaktif', r.faqStats.inactive || 0],
    ['Total Penggunaan', r.faqStats.total_usage || 0],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Ringkasan')

  // Sheet 2: Tren Bulanan
  const trendRows = [['Bulan', 'Artikel', 'Berita']]
  for (const m of r.monthlyTrend) trendRows.push([formatMonth(m.month), m.articles, m.news])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trendRows), 'Tren Bulanan')

  // Sheet 3: Artikel per Kategori
  const catRows = [['Kategori', 'Total', 'Published']]
  for (const c of r.articlesByCategory) catRows.push([c.category, c.total, c.published])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(catRows), 'Artikel per Kategori')

  // Sheet 4: Galeri per Kategori
  const galRows = [['Kategori', 'Total Album', 'Total Foto']]
  for (const c of r.galleryByCategory) galRows.push([c.category, c.total_albums, c.total_photos])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(galRows), 'Galeri per Kategori')

  // Sheet 5: Penulis
  const authorRows = [['Penulis', 'Total Konten']]
  for (const a of r.topAuthors) authorRows.push([a.author, a.total])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(authorRows), 'Penulis')

  // Sheet 6: Draft Lama
  const draftRows = [['Judul', 'Penulis', 'Dibuat', 'Usia (hari)']]
  for (const d of r.staleDrafts) draftRows.push([d.title, d.author || '-', d.created_at, d.days_old])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(draftRows), 'Draft Lama')

  const fileName = `Laporan-Konten_${filterStart.value || 'semua'}_sd_${filterEnd.value || 'semua'}.xlsx`
  XLSX.writeFile(wb, fileName)
}

// ---------- Export PDF ----------
const exportPDF = () => window.print()
</script>

<style>
@media print {
  #admin-sidebar,
  #admin-topheader,
  .no-print { display: none !important; }
  .min-h-screen { display: block !important; }
  .flex-1 { width: 100% !important; }
  main, body, #__nuxt { width: 100% !important; padding: 8px !important; margin: 0 !important; }
  .space-y-6 > div { break-inside: avoid; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
</style>
