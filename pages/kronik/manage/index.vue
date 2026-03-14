<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="container mx-auto px-4 max-w-7xl">
            <!-- Success Message -->
            <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-sm">
                <div class="flex items-center">
                    <svg class="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-green-800 font-medium">{{ successMessage }}</p>
                    <button @click="clearSuccess" class="ml-auto text-green-800 hover:text-green-900">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Kelola Kronik Paroki</h1>
                        <p class="text-gray-600 mt-1">Isi dan kelola kronik kegiatan {{ userCategory }}</p>
                    </div>
                    <NuxtLink to="/kronik/manage/create"
                        class="inline-flex items-center px-6 py-3 bg-paulus-blue text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Kronik Baru
                    </NuxtLink>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select v-model="filters.status"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent">
                        <option value="">Semua Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending Review</option>
                    </select>

                    <select v-model="filters.category_id"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent">
                        <option value="">Semua Kategori</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>

                    <input v-model="filters.search" type="text" placeholder="Cari kronik..."
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent" />
                </div>
            </div>

            <!-- Kronik List -->
            <div v-if="loading" class="text-center py-12">
                <div
                    class="inline-block w-8 h-8 border-4 border-paulus-blue border-t-transparent rounded-full animate-spin">
                </div>
                <p class="text-gray-600 mt-4">Memuat kronik...</p>
            </div>

            <div v-else-if="entries.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Belum Ada Kronik</h3>
                <p class="text-gray-600 mb-6">Mulai dengan menambahkan kronik kegiatan pertama Anda</p>
                <NuxtLink to="/kronik/manage/create"
                    class="inline-flex items-center px-6 py-3 bg-paulus-blue text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kronik
                </NuxtLink>
            </div>

            <div v-else class="space-y-4">
                <div v-for="entry in paginatedEntries" :key="entry.id"
                    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                    <div class="flex items-start gap-4">
                        <!-- Thumbnail -->
                        <div v-if="entry.featured_image" class="flex-shrink-0">
                            <img :src="entry.featured_image" :alt="entry.what_title"
                                class="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                        </div>
                        <div v-else class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-3 mb-2">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-medium',
                                    entry.status === 'published' ? 'bg-green-100 text-green-800' :
                                        entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                ]">
                                    {{ getStatusLabel(entry.status) }}
                                </span>
                                <span class="text-sm text-gray-600">{{ entry.category_name }}</span>
                            </div>

                            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ entry.what_title }}</h3>
                            <p class="text-gray-600 line-clamp-2 mb-3">{{ entry.what_description }}</p>

                            <div class="flex items-center gap-4 text-sm text-gray-500">
                                <div class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ formatDate(entry.when_date) }}
                                </div>
                                <div v-if="entry.where_location" class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {{ entry.where_location }}
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2 flex-shrink-0">
                            <NuxtLink :to="`/kronik/manage/edit/${entry.id}`"
                                class="px-4 py-2 text-paulus-blue hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium text-center">
                                Edit
                            </NuxtLink>
                            <button v-if="entry.status === 'draft' || entry.status === 'pending'"
                                @click="deleteEntry(entry.id)"
                                class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="entries.length > pageLimit" class="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p class="text-sm text-gray-600">
                        Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-
                        {{ Math.min(currentPage * pageLimit, entries.length) }}
                        dari {{ entries.length }} kronik
                    </p>
                    <div class="flex items-center gap-2">
                        <button
                            @click="goToPage(currentPage - 1)"
                            :disabled="currentPage === 1"
                            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Sebelumnya
                        </button>
                        <button
                            v-for="page in visiblePages"
                            :key="page"
                            @click="goToPage(page)"
                            :class="[
                                'px-3 py-1.5 rounded-lg border text-sm',
                                currentPage === page
                                    ? 'bg-paulus-blue text-white border-paulus-blue'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            ]"
                        >
                            {{ page }}
                        </button>
                        <button
                            @click="goToPage(currentPage + 1)"
                            :disabled="currentPage >= totalPages"
                            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Berikutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'user-auth'
})

const user = ref(null)
const entries = ref([])
const categories = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageLimit = 10

const filters = reactive({
    status: '',
    category_id: '',
    search: ''
})

const successMessage = ref('')
const route = useRoute()

const userCategory = computed(() => {
    if (!user.value) return ''
    return user.value.unit_name || user.value.user_category || 'Anda'
})

const totalPages = computed(() => {
    const pages = Math.ceil(entries.value.length / pageLimit)
    return pages > 0 ? pages : 1
})

const paginatedEntries = computed(() => {
    const start = (currentPage.value - 1) * pageLimit
    return entries.value.slice(start, start + pageLimit)
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

const clearSuccess = () => {
    successMessage.value = ''
    // Remove query param from URL without reloading
    navigateTo('/kronik/manage', { replace: true })
}

// Fetch user data
const fetchUserData = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
        navigateTo('/?login=required')
        return
    }

    try {
        const response = await $fetch('/api/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
        user.value = response
    } catch (error) {
        console.error('Failed to fetch user data:', error)
        navigateTo('/?login=required')
    }
}

// Fetch categories
const fetchCategories = async () => {
    try {
        const response = await $fetch('/api/kronik/categories')
        categories.value = response.data || []
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

// Fetch entries
const fetchEntries = async () => {
    loading.value = true
    const token = localStorage.getItem('auth_token')

    try {
        const params = new URLSearchParams()
        if (filters.status) params.append('status', filters.status)
        if (filters.category_id) params.append('category_id', filters.category_id)
        if (filters.search) params.append('search', filters.search)
        params.append('author_only', 'true') // Only show user's own entries

        const response = await $fetch(`/api/kronik/entries?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        entries.value = response.data || []
    } catch (error) {
        console.error('Failed to fetch entries:', error)
        entries.value = []
    } finally {
        loading.value = false
    }
}

// Delete entry
const deleteEntry = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kronik ini?')) return

    const token = localStorage.getItem('auth_token')
    try {
        await $fetch(`/api/kronik/entries/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        await fetchEntries()
    } catch (error) {
        console.error('Failed to delete entry:', error)
        alert('Gagal menghapus kronik')
    }
}

const getStatusLabel = (status) => {
    const labels = {
        published: 'Published',
        draft: 'Draft',
        pending: 'Pending Review',
        archived: 'Archived'
    }
    return labels[status] || status
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date)
}

// Watch filters
watch(filters, () => {
    currentPage.value = 1
    fetchEntries()
}, { deep: true })

watch(totalPages, (pages) => {
    if (currentPage.value > pages) {
        currentPage.value = pages
    }
})

// Check for success message from query params
const checkSuccessMessage = () => {
    const success = route.query.success
    if (success) {
        successMessage.value = success.toString()
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (successMessage.value) {
                clearSuccess()
            }
        }, 5000)
    }
}

onMounted(async () => {
    await fetchUserData()
    await fetchCategories()
    await fetchEntries()
    checkSuccessMessage()
})

// Refetch data when user returns to this page (e.g., after creating/editing)
onActivated(async () => {
    await fetchEntries()
    checkSuccessMessage()
})
</script>

<style scoped>
.paulus-blue {
    background-color: #1e40af;
}

.bg-paulus-blue {
    background-color: #1e40af;
}

.text-paulus-blue {
    color: #1e40af;
}

.hover\:bg-blue-800:hover {
    background-color: #1e3a8a;
}

.focus\:ring-paulus-blue:focus {
    --tw-ring-color: #1e40af;
}
</style>
