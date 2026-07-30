<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Kronik Gereja" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Kronik Paroki St. Paulus Juanda</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Catatan kegiatan dan peristiwa penting di Paroki St. Paulus Juanda Sidoarjo
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Kronik Paroki" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Categories Grid -->
      <section class="mb-12 max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Kategori Kronik</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="category in categories" :key="category.id"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-[#c58229] transform hover:-translate-y-1 cursor-pointer"
            @click="() => navigateTo('/kronik/' + category.slug)">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-[#c58229]/10 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-[#c58229]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">{{ category.name }}</h2>
              </div>
              <p class="text-gray-600 mb-4">{{ category.description }}</p>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">
                  <span class="font-semibold text-[#882f1d]">{{ category.entries_count || 0 }}</span> Kronik
                </span>
                <span class="text-[#c58229] font-medium flex items-center">Lihat Detail <svg class="w-4 h-4 ml-1"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!categories || categories.length === 0" class="text-center py-12">
          <p class="text-gray-500">Belum ada kategori kronik</p>
        </div>
      </section>

      <!-- All Entries Table -->
      <section class="mb-12 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Semua Kronik Terbaru</h2>

          <!-- Export Buttons -->
          <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button @click="exportToPDF"
              class="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-xs sm:text-sm font-medium"
              title="Export ke PDF">
              <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              <span>Export PDF</span>
            </button>
            <button @click="printTable"
              class="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors shadow-sm text-xs sm:text-sm font-medium"
              title="Cetak Tabel">
              <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                </path>
              </svg>
              <span>Cetak</span>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loadingEntries" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-4 text-gray-600">Memuat kronik...</p>
        </div>

        <!-- Table -->
        <div v-else-if="allEntries && allEntries.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div id="kronik-table-container" class="overflow-x-auto">
            <table id="kronik-table" class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[#882f1d]">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Judul</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Kategori</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Bagian</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Lokasi</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="entry in allEntries" :key="entry.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(entry.when_date) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="font-medium">{{ entry.what_title }}</div>
                    <div class="text-gray-500 line-clamp-1">{{ stripHtml(entry.what_description) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#c58229]/10 text-[#882f1d]">
                      {{ entry.category_name }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ entry.section_name || '-' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ entry.where_location || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <NuxtLink :to="`/kronik/${entry.category_slug}/${entry.id}`"
                      class="text-[#c58229] hover:text-[#882f1d] font-medium">
                      Lihat Detail
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-gray-50 px-4 sm:px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Menampilkan <span class="font-medium">{{ ((currentPage - 1) * pageSize) + 1 }}</span>
              sampai <span class="font-medium">{{ Math.min(currentPage * pageSize, totalEntries) }}</span>
              dari <span class="font-medium">{{ totalEntries }}</span> kronik
            </div>
            <div class="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'"
                aria-label="Halaman Sebelumnya">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="hidden sm:inline">Sebelumnya</span>
              </button>

              <template v-for="page in visiblePages" :key="page">
                <button v-if="page !== '...'" @click="goToPage(page)"
                  class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                  :class="page === currentPage ? 'bg-[#882f1d] text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'">
                  {{ page }}
                </button>
                <span v-else class="px-1.5 text-gray-500 text-xs sm:text-sm">...</span>
              </template>

              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'"
                aria-label="Halaman Selanjutnya">
                <span class="hidden sm:inline">Selanjutnya</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-white rounded-lg shadow-md">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p class="text-gray-500 text-lg">Belum ada kronik yang dipublikasikan</p>
        </div>
      </section>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('kronik-gereja')
definePageMeta({
  layout: 'default'
})

const currentPage = ref(1)
const pageSize = 10

const { data: response } = await useFetch('/api/kronik/categories')
const categories = computed(() => response.value?.data || [])

const { data: entriesResponse, pending: loadingEntries, refresh } = await useFetch(() => `/api/kronik/entries/all?page=${currentPage.value}&limit=${pageSize}`)

const allEntries = computed(() => entriesResponse.value?.data || [])
const totalEntries = computed(() => entriesResponse.value?.pagination?.total || 0)
const totalPages = computed(() => Math.ceil(totalEntries.value / pageSize))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    refresh()
    if (process.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Strip HTML tags from text
const stripHtml = (html) => {
  if (!html) return ''
  // Remove HTML tags
  const stripped = html.replace(/<[^>]*>/g, '')
  // Decode HTML entities
  const decoded = stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  return decoded.trim()
}

// Export to PDF function
const exportToPDF = () => {
  if (process.client) {
    const printWindow = window.open('', '', 'height=800,width=1000')
    if (!printWindow) return

    const tableContent = document.getElementById('kronik-table-container')?.innerHTML || ''
    const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    const styles = [
      'body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }',
      'h1 { color: #882f1d; text-align: center; margin-bottom: 10px; font-size: 20px; }',
      '.subtitle { text-align: center; color: #666; margin-bottom: 20px; font-size: 11px; }',
      'table { width: 100%; border-collapse: collapse; margin-top: 10px; }',
      'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }',
      'th { background-color: #882f1d; color: white; font-weight: bold; }',
      'tr:nth-child(even) { background-color: #f9f9f9; }',
      '.badge { display: inline-block; padding: 2px 8px; border-radius: 12px; background-color: #fef3e8; color: #882f1d; font-size: 9px; font-weight: 600; }',
      '.footer { margin-top: 20px; text-align: center; font-size: 9px; color: #666; }'
    ].join('')

    const htmlParts = [
      '<!DOCTYPE html><html><head>',
      '<title>Kronik Paroki St. Paulus Juanda</title>',
      '<style>' + styles + '</style>',
      '</head><body>',
      '<h1>Kronik Paroki St. Paulus Juanda</h1>',
      '<div class="subtitle">Dicetak pada: ' + currentDate + '</div>',
      tableContent.replace(/class="text-\[#c58229\][^"]*"/g, 'style="display:none"'),
      '<div class="footer"><p>Paroki St. Paulus Juanda Sidoarjo | Jl. Pahlawan No. 1, Sidoarjo</p></div>',
      '</body></html>'
    ]

    printWindow.document.write(htmlParts.join(''))
    printWindow.document.close()

    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

// Print table function
const printTable = () => {
  if (process.client) {
    const printWindow = window.open('', '', 'height=800,width=1000')
    if (!printWindow) return

    const tableContent = document.getElementById('kronik-table-container')?.innerHTML || ''
    const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    const styles = [
      '@media print { body { margin: 0; } .no-print { display: none; } }',
      'body { font-family: Arial, sans-serif; padding: 20px; font-size: 11px; }',
      'h1 { color: #882f1d; text-align: center; margin-bottom: 10px; font-size: 18px; }',
      '.subtitle { text-align: center; color: #666; margin-bottom: 20px; font-size: 10px; }',
      'table { width: 100%; border-collapse: collapse; margin-top: 10px; }',
      'th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 9px; }',
      'th { background-color: #882f1d !important; color: white !important; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
      'tr:nth-child(even) { background-color: #f9f9f9; }',
      '.badge { display: inline-block; padding: 2px 6px; border-radius: 10px; background-color: #fef3e8; color: #882f1d; font-size: 8px; font-weight: 600; }',
      '.footer { margin-top: 20px; text-align: center; font-size: 9px; color: #666; page-break-after: avoid; }'
    ].join('')

    const scriptTag = document.createElement('script')
    scriptTag.textContent = 'window.onload = function() { window.print(); }'

    const htmlParts = [
      '<!DOCTYPE html><html><head>',
      '<title>Kronik Paroki St. Paulus Juanda</title>',
      '<style>' + styles + '</style>',
      '</head><body>',
      '<h1>Kronik Paroki St. Paulus Juanda</h1>',
      '<div class="subtitle">Dicetak pada: ' + currentDate + '</div>',
      tableContent.replace(/class="text-\[#c58229\][^"]*"/g, 'style="display:none"'),
      '<div class="footer"><p>Paroki St. Paulus Juanda Sidoarjo | Jl. Pahlawan No. 1, Sidoarjo</p></div>',
      '</body></html>'
    ]

    printWindow.document.write(htmlParts.join(''))
    printWindow.document.head.appendChild(scriptTag)
    printWindow.document.close()
  }
}

useHead({
  title: 'Kronik Paroki - Paroki St. Paulus Juanda',
  meta: [
    {
      name: 'description',
      content: 'Catatan kegiatan dan peristiwa penting di Paroki St. Paulus Juanda Sidoarjo'
    }
  ]
})
</script>
