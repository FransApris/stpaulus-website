<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Agenda Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Jadwal kegiatan, misa, rapat, dan acara lainnya di Paroki St. Paulus
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav class="text-sm font-cinzel">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <NuxtLink to="/" class="text-gray-500 hover:text-[#882f1d]">Beranda</NuxtLink>
            <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li class="flex items-center">
            <span class="text-gray-700">Agenda Paroki</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Info Banner -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-blue-800">Agenda Mendatang</h3>
            <p class="text-sm text-blue-700">Menampilkan agenda yang akan datang (hari ini dan seterusnya)</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              v-model="filters.category"
              @change="fetchAgendas"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
            >
              <option value="">Semua Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select
              v-model="filters.month"
              @change="fetchAgendas"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
            >
              <option value="">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select
              v-model="filters.year"
              @change="fetchAgendas"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
            >
              <option value="">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-4 text-gray-600">Memuat agenda...</p>
      </div>

      <!-- Agenda List -->
      <div v-else-if="agendas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(agenda, index) in paginatedAgendas"
          :key="agenda.id"
          @click="navigateTo(`/agenda/${agenda.id}`)"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer p-6 relative"
        >
          <div
            class="absolute top-0 left-0 h-full w-2 flex flex-col items-center justify-center bg-[#882f1d] z-10"
          >
            <span class="text-white font-bold text-sm">{{ (currentPage - 1) * pageLimit + index + 1 }}</span>
          </div>

          <div class="ml-4 pl-4">
            <div class="mb-2">
              <span
                :style="getCategoryStyle(agenda)"
                class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
              >
                {{ agenda.category }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ agenda.title }}</h3>

            <div class="text-sm font-medium text-gray-600 mb-2">
              {{ formatDate(agenda.start_date) }}
            </div>

            <div class="flex items-center text-gray-600 mb-2">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="font-medium">{{ formatTime(agenda.start_date) }}</span>
              <span v-if="agenda.end_date" class="mx-2">-</span>
              <span v-if="agenda.end_date">{{ formatTime(agenda.end_date) }}</span>
            </div>

            <div class="flex items-center text-gray-600 mb-3">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ agenda.location }}</span>
            </div>

            <div v-if="agenda.description" class="text-gray-700 mb-3">
              <p class="whitespace-pre-line line-clamp-3">{{ agenda.description }}</p>
            </div>

            <div v-if="agenda.contact_person" class="flex items-center text-gray-600 mb-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span class="text-sm">Kontak: {{ agenda.contact_person }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
          class="rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
          Sebelumnya
        </button>
        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
          class="rounded border px-3 py-2 text-sm"
          :class="page === currentPage ? 'border-[#882f1d] bg-[#882f1d] text-white' : 'hover:bg-gray-50'">
          {{ page }}
        </button>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
          Berikutnya
        </button>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Tidak ada agenda</h3>
        <p class="mt-2 text-gray-500">Belum ada agenda yang dijadwalkan untuk periode ini.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Agenda Paroki - St. Paulus'
})

const agendas = useState('public-agendas', () => [])
const categories = useState('public-agenda-categories', () => [])
const loading = ref(false)
const currentPage = useState('public-agenda-page', () => 1)
const pageLimit = 10

const filters = ref({
  category: '',
  month: '',
  year: ''
})

const totalPages = computed(() => Math.max(1, Math.ceil(agendas.value.length / pageLimit)))
const paginatedAgendas = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return agendas.value.slice(start, start + pageLimit)
})
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let page = start; page <= end; page++) pages.push(page)
  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/agenda/categories')
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchAgendas = async () => {
  const hasCache = agendas.value.length > 0
  if (!hasCache) {
    loading.value = true
  }
  try {
    const params = new URLSearchParams()
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.month) params.append('month', filters.value.month)
    if (filters.value.year) params.append('year', filters.value.year)

    const response = await $fetch(`/api/agenda?${params}`)
    agendas.value = response
  } catch (error) {
    console.error('Failed to fetch agendas:', error)
  } finally {
    loading.value = false
  }
}

watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryStyle = (agenda) => {
  if (agenda.category_color) {
    // Convert hex to RGB for background with opacity
    const hex = agenda.category_color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      color: agenda.category_color,
      border: `1px solid ${agenda.category_color}`
    }
  }
  return {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    color: '#6B7280',
    border: '1px solid #D1D5DB'
  }
}

const colorClasses = [
  'bg-red-600',    // Merah
  'bg-orange-500', // Oranye
  'bg-blue-800',   // Biru Gelap
  'bg-gray-500'    // Abu-abu
];

const getRibbonColorClass = (index) => {
  return colorClasses[index % colorClasses.length];
};

// Opsional: Jika Anda ingin mengambil warna Hex untuk elemen lain (misal: border)
const getRibbonColorHex = (index) => {
  const hexes = [
    '#DC2626', // Red-600
    '#F97316', // Orange-500
    '#1E40AF', // Blue-800
    '#6B7280'  // Gray-500
  ];
  return hexes[index % hexes.length];
}

// Set default year to current year
onMounted(async () => {
  // Scroll-to-top sudah ditangani secara global oleh router.options.ts
  const currentYear = new Date().getFullYear().toString()
  filters.value.year = currentYear
  await fetchCategories()
  fetchAgendas()
})


</script>
