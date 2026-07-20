<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Agenda Paroki" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Detail Agenda</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Informasi lengkap tentang agenda Paroki St. Paulus Juanda
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
            <NuxtLink to="/agenda" class="text-gray-500 hover:text-[#882f1d]">Agenda Paroki</NuxtLink>
            <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li class="flex items-center">
            <span class="text-gray-700">{{ agendaData?.title }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
      <p class="mt-4 text-gray-600">Memuat detail agenda...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Agenda tidak ditemukan</h3>
      <p class="mt-2 text-gray-500">Agenda yang Anda cari tidak tersedia atau telah dihapus.</p>
      <NuxtLink to="/agenda" class="mt-4 inline-block bg-[#882f1d] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
        Kembali ke Agenda
      </NuxtLink>
    </div>

    <!-- Agenda Detail -->
    <div v-else-if="agendaData" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-8">
          <!-- Category Badge -->
          <div class="flex items-center space-x-3 mb-6">
            <span
              :style="getCategoryStyle(agendaData)"
              class="inline-flex px-4 py-2 text-sm font-semibold rounded-full"
            >
              {{ agendaData?.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-6">{{ agendaData.title }}</h1>

          <!-- Date and Time -->
          <div class="flex items-center text-gray-600 mb-6">
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <span class="font-medium">{{ formatDate(agendaData.start_date) }}</span>
              <span v-if="agendaData.end_date" class="mx-2">-</span>
              <span v-if="agendaData.end_date">{{ formatTime(agendaData.end_date) }}</span>
            </div>
          </div>

          <!-- Location -->
          <div class="flex items-center text-gray-600 mb-6">
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{{ agendaData.location }}</span>
          </div>

          <!-- Description -->
          <div v-if="agendaData.description" class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h3>
            <div class="prose prose-lg max-w-none">
              <p class="whitespace-pre-line text-gray-700 leading-relaxed">{{ agendaData.description }}</p>
            </div>
          </div>

          <!-- Contact Person -->
          <div v-if="agendaData.contact_person" class="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Informasi Kontak</h3>
            <div class="flex items-center text-gray-600">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span class="text-sm">Narahubung: {{ agendaData.contact_person }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              to="/agenda"
              class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Kembali ke Agenda
            </NuxtLink>
            <button
              @click="shareAgenda"
              class="inline-flex items-center justify-center px-6 py-3 bg-[#882f1d] text-white rounded-lg font-medium hover:bg-[#a55e1f] transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              Bagikan Agenda
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('agenda')
definePageMeta({
  title: 'Detail Agenda - St. Paulus'
})

// Get agenda ID from route
const route = useRoute()
const agendaId = route.params.id

// Fetch agenda data
const { data: agenda, pending, error } = await useAsyncData(`agenda-${agendaId}`, 
  async () => {
    try {
      return await $fetch(`/api/agenda/${agendaId}`)
    } catch (err) {
      console.error('Failed to fetch agenda detail:', err)
      return null
    }
  },
  {
    default: () => null,
    transform: (data) => data || null
  }
)

// Computed property to unwrap the ref for safe access in helpers
const agendaData = computed(() => agenda.value)

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

const getCategoryStyle = (agendaRef) => {
  // Unwrap the ref to get the actual data
  const agenda = unref(agendaRef)

  // Add null check to prevent SSR crash
  if (!agenda || !agenda.category_color) {
    return {
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      color: '#6B7280',
      border: '1px solid #D1D5DB'
    }
  }

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

const shareAgenda = () => {
  if (navigator.share) {
    navigator.share({
      title: agendaData.value.title,
      text: `Agenda: ${agendaData.value.title} - ${formatDate(agendaData.value.start_date)}`,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link agenda berhasil disalin ke clipboard!')
    })
  }
}
</script>

<style scoped>
/* Custom prose styles for description */
.prose p {
  margin-bottom: 1rem;
}

.prose p:last-child {
  margin-bottom: 0;
}
</style>
