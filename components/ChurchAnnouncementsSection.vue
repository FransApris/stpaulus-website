<template>
    <section class="py-8 md:py-12 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-12">
                <div class="flex items-center justify-center mb-3">
                    <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
                </div>
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">
                    Pengumuman Gereja
                </h2>
                <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                    Jadwal kegiatan dan acara terbaru Paroki St. Paulus
                </p>
            </div>

            <!-- Loading State -->
            <div v-if="pending" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d]"></div>
            </div>

            <!-- Table View (Desktop & Mobile Friendly) -->
            <div v-else-if="announcements && announcements.length > 0"
                class="bg-white rounded-xl shadow-lg overflow-hidden">
                <!-- Desktop Table -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gradient-to-r from-[#882f1d] to-[#a63b24] text-white">
                                <th class="px-6 py-4 text-left text-sm font-semibold">Gambar</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold">Jam</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold">Acara</th>
                                <th class="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(announcement, index) in paginatedAnnouncements" :key="announcement.id" :class="[
                                'border-b border-gray-100 hover:bg-amber-50 transition-colors duration-200',
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            ]">
                                <td class="px-6 py-4">
                                    <div v-if="announcement.thumbnail" class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                        <img :src="announcement.thumbnail" :alt="announcement.title"
                                            class="w-full h-full object-cover" @error="handleImageError" />
                                    </div>
                                    <div v-else class="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                        <span class="text-2xl">📢</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <span class="text-2xl">📅</span>
                                        <div>
                                            <div class="font-semibold text-gray-900">
                                                {{ formatDate(announcement.event_date) }}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {{ formatDayName(announcement.event_date) }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xl">🕐</span>
                                        <span class="font-medium text-gray-700">
                                            {{ formatTime(announcement.event_time) }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="font-semibold text-gray-900 text-base">
                                        {{ announcement.title }}
                                    </div>
                                    <div v-if="announcement.description"
                                        class="text-sm text-gray-600 mt-1 line-clamp-1">
                                        {{ announcement.description }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <button @click="openModal(announcement)"
                                        class="inline-flex items-center gap-2 px-4 py-2 bg-[#882f1d] hover:bg-[#6d2517] text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Mobile Cards -->
                <div class="md:hidden divide-y divide-gray-200">
                    <div v-for="announcement in paginatedAnnouncements" :key="announcement.id"
                        class="p-4 hover:bg-amber-50 transition-colors duration-200">
                        <!-- Thumbnail -->
                        <div v-if="announcement.thumbnail" class="mb-3 rounded-lg overflow-hidden">
                            <img :src="announcement.thumbnail" :alt="announcement.title"
                                class="w-full h-40 object-cover" @error="handleImageError" />
                        </div>
                        
                        <div class="flex items-start justify-between gap-3 mb-3">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="text-xl">📅</span>
                                    <div>
                                        <div class="font-semibold text-gray-900 text-sm">
                                            {{ formatDate(announcement.event_date) }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            {{ formatDayName(announcement.event_date) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">🕐</span>
                                    <span class="font-medium text-gray-700 text-sm">
                                        {{ formatTime(announcement.event_time) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h3 class="font-bold text-gray-900 text-base mb-2">
                            {{ announcement.title }}
                        </h3>

                        <p v-if="announcement.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
                            {{ announcement.description }}
                        </p>

                        <button @click="openModal(announcement)"
                            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#882f1d] hover:bg-[#6d2517] text-white text-sm font-medium rounded-lg transition-colors duration-200">
                            Lihat Detail
                        </button>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="px-4 py-4 md:px-6 border-t border-gray-200 bg-gray-50">
                    <div class="flex items-center justify-between gap-3 flex-wrap">
                        <p class="text-sm text-gray-600">
                            Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-
                            {{ Math.min(currentPage * pageLimit, announcements.length) }}
                            dari {{ announcements.length }} pengumuman
                        </p>

                        <div class="flex items-center gap-1 md:gap-2">
                            <button
                                @click="goToPage(currentPage - 1)"
                                :disabled="currentPage === 1"
                                class="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                            >
                                Sebelumnya
                            </button>

                            <button
                                v-for="page in visiblePages"
                                :key="page"
                                @click="goToPage(page)"
                                :class="[
                                    'px-3 py-2 rounded-md text-sm font-medium border transition-colors',
                                    page === currentPage
                                        ? 'bg-[#882f1d] text-white border-[#882f1d]'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                ]"
                            >
                                {{ page }}
                            </button>

                            <button
                                @click="goToPage(currentPage + 1)"
                                :disabled="currentPage === totalPages"
                                class="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                            >
                                Berikutnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 bg-white rounded-xl shadow-lg">
                <span class="text-6xl mb-4 block">📭</span>
                <p class="text-gray-500 text-lg">Belum ada pengumuman terbaru</p>
            </div>
        </div>

        <!-- Modal Detail -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="selectedAnnouncement"
                    class="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
                    @click.self="closeModal">
                    <div class="modal-content-box bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mt-auto sm:my-auto transition-all duration-300">
                        <!-- Modal Header -->
                        <div
                            class="sticky top-0 bg-gradient-to-r from-[#882f1d] to-[#a63b24] text-white px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
                            <h3 class="text-xl font-bold">Detail Pengumuman</h3>
                            <button @click="closeModal"
                                class="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Modal Body -->
                        <div class="p-6">
                            <!-- Thumbnail (if exists) -->
                            <div v-if="selectedAnnouncement.thumbnail" class="mb-6 rounded-xl overflow-hidden">
                                <img :src="selectedAnnouncement.thumbnail" :alt="selectedAnnouncement.title"
                                    class="w-full h-64 object-cover" @error="handleImageError" />
                            </div>

                            <!-- Title -->
                            <h4 class="text-2xl font-cinzel font-bold text-gray-900 mb-4">
                                {{ selectedAnnouncement.title }}
                            </h4>

                            <!-- Date & Time Info -->
                            <div class="flex flex-wrap gap-4 mb-6 p-4 bg-amber-50 rounded-lg">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">📅</span>
                                    <div>
                                        <div class="text-xs text-gray-500 uppercase">Tanggal</div>
                                        <div class="font-semibold text-gray-900">
                                            {{ formatDate(selectedAnnouncement.event_date) }}
                                        </div>
                                        <div class="text-xs text-gray-600">
                                            {{ formatDayName(selectedAnnouncement.event_date) }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">🕐</span>
                                    <div>
                                        <div class="text-xs text-gray-500 uppercase">Waktu</div>
                                        <div class="font-semibold text-gray-900">
                                            {{ formatTime(selectedAnnouncement.event_time) }} WIB
                                        </div>
                                    </div>
                                </div>

                                <div v-if="selectedAnnouncement.activity_type" class="flex items-center gap-2">
                                    <span class="text-2xl">🏷️</span>
                                    <div>
                                        <div class="text-xs text-gray-500 uppercase">Jenis Kegiatan</div>
                                        <div class="font-semibold text-gray-900">
                                            {{ selectedAnnouncement.activity_type }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div v-if="selectedAnnouncement.description" class="prose prose-sm max-w-none">
                                <h5 class="text-lg font-semibold text-gray-900 mb-3">Deskripsi Acara</h5>
                                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {{ selectedAnnouncement.description }}
                                </p>
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl border-t">
                            <button @click="closeModal"
                                class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </section>
</template>

<script setup>
const selectedAnnouncement = ref(null)
const currentPage = ref(1)
const pageLimit = 5

// Fetch announcements with proper error handling
const { data, pending, error } = useFetch('/api/church-announcements', {
    query: { limit: 100, upcoming: 'true' },
    lazy: true,
    server: false,
    default: () => ({ data: [], count: 0 }),
    transform: (response) => response || { data: [], count: 0 }
})

const announcements = computed(() => {
    if (error.value) {
        console.error('[ChurchAnnouncements] Fetch error:', error.value)
        return []
    }
    return data.value?.data || []
})

const totalPages = computed(() => {
    const pages = Math.ceil(announcements.value.length / pageLimit)
    return pages > 0 ? pages : 1
})

const paginatedAnnouncements = computed(() => {
    const start = (currentPage.value - 1) * pageLimit
    return announcements.value.slice(start, start + pageLimit)
})

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + 4)

    for (let page = start; page <= end; page++) {
        pages.push(page)
    }

    return pages
})

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
}

watch(announcements, () => {
    currentPage.value = 1
})

watch(totalPages, (pages) => {
    if (currentPage.value > pages) {
        currentPage.value = pages
    }
})

// Format date: "1 Februari 2026"
const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
}

// Format day name: "Sabtu"
const formatDayName = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { weekday: 'long' })
}

// Format time: "07:00"
const formatTime = (timeStr) => {
    if (!timeStr) return '-'
    return timeStr.substring(0, 5) // HH:MM from HH:MM:SS
}

// Modal functions
const openModal = (announcement) => {
    selectedAnnouncement.value = announcement
    document.body.style.overflow = 'hidden'
}

const closeModal = () => {
    selectedAnnouncement.value = null
    document.body.style.overflow = ''
}

// Handle image error - hide broken image and show parent placeholder
const handleImageError = (event) => {
    const img = event.target
    img.style.display = 'none'
    const parent = img.parentElement
    if (parent && !parent.querySelector('.img-placeholder')) {
        const placeholder = document.createElement('div')
        placeholder.className = 'img-placeholder w-full h-full flex items-center justify-center bg-amber-50'
        placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>'
        parent.appendChild(placeholder)
    }
}

// Cleanup on unmount
onUnmounted(() => {
    document.body.style.overflow = ''
})
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-content-box,
.modal-leave-active .modal-content-box {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (max-width: 639px) {
    /* Mobile Bottom Sheet */
    .modal-enter-from .modal-content-box,
    .modal-leave-to .modal-content-box {
        transform: translateY(100%);
        opacity: 0;
    }
}

@media (min-width: 640px) {
    /* Desktop Zoom-in */
    .modal-enter-from .modal-content-box,
    .modal-leave-to .modal-content-box {
        transform: scale(0.95) translateY(10px);
        opacity: 0;
    }
}
</style>
