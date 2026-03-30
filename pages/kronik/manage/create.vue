<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="container mx-auto px-4 max-w-4xl">
            <!-- Header -->
            <div class="mb-6">
                <NuxtLink to="/kronik/manage"
                    class="inline-flex items-center text-paulus-blue hover:text-blue-800 mb-4">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar Kronik
                </NuxtLink>
                <h1 class="text-3xl font-bold text-gray-900">Tambah Kronik Baru</h1>
                <p class="text-gray-600 mt-1">Isi form berikut untuk menambahkan kronik kegiatan paroki</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="onFormSubmit" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <!-- Category & Section -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Kategori <span class="text-red-500">*</span>
                        </label>
                        <select v-model="form.category_id" required :disabled="isCategoryDisabled || loadingUser"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
                            <option value="">{{ loadingUser ? 'Memuat...' : 'Pilih Kategori' }}</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.name }}
                            </option>
                        </select>
                        <p v-if="isCategoryDisabled" class="text-sm text-blue-600 mt-1">
                            ✓ Kategori otomatis dipilih sesuai akses Anda
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Bagian (Opsional)
                        </label>
                        <select v-model="form.section_id" :disabled="!form.category_id || loadingSections"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
                            <option value="">
                                {{ !form.category_id ? 'Pilih kategori terlebih dahulu' :
                                    loadingSections ? 'Memuat bagian...' :
                                        sections.length === 0 ? 'Tidak ada bagian tersedia' :
                                'Pilih Bagian' }}
                            </option>
                            <option v-for="section in sections" :key="section.id" :value="section.id">
                                {{ section.name }}
                            </option>
                        </select>
                        <p v-if="form.category_id && !loadingSections && sections.length === 0"
                            class="text-sm text-amber-600 mt-1">
                            Kategori ini belum memiliki bagian. Anda dapat melanjutkan tanpa memilih bagian.
                        </p>
                    </div>
                </div>

                <!-- WHAT - Apa yang Terjadi -->
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">📝 WHAT - Apa yang Terjadi?</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Judul Kegiatan <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.what_title" type="text" required
                                placeholder="Contoh: Perayaan Ekaristi Pemberkatan Keluarga"
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi Lengkap <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.what_description" rows="5" required
                                placeholder="Jelaskan detail kegiatan yang berlangsung..."
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent"></textarea>
                        </div>

                        <!-- Photo Upload -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Foto Kegiatan (Opsional)
                            </label>
                            <div class="space-y-3">
                                <!-- Featured Image -->
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">Foto Utama</label>
                                    <input type="file" accept="image/*" @change="handleFeaturedImageUpload"
                                        :disabled="uploadingFeatured"
                                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-paulus-blue file:text-white hover:file:bg-blue-800 disabled:opacity-50" />
                                    <p class="text-xs text-gray-500 mt-1">
                                        {{ uploadingFeatured ? 'Mengunggah...' : 'Upload 1 foto utama untuk ditampilkan sebagai thumbnail' }}
                                    </p>
                                    <!-- Preview Featured Image -->
                                    <div v-if="form.featured_image" class="mt-2 relative inline-block">
                                        <img :src="resolveKronikImagePath(form.featured_image)" alt="Preview"
                                            class="h-24 w-auto rounded-lg border border-gray-200" />
                                        <button type="button" @click="removeFeaturedImage"
                                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                                            ×
                                        </button>
                                    </div>
                                </div>

                                <!-- Gallery Images -->
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">Galeri Foto (Maks. 5)</label>
                                    <input type="file" accept="image/*" multiple @change="handleGalleryUpload"
                                        :disabled="uploadingGallery || (form.gallery && form.gallery.length >= 5)"
                                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50" />
                                    <p class="text-xs text-gray-500 mt-1">
                                        {{ uploadingGallery ? 'Mengunggah...' : 
                                           form.gallery && form.gallery.length >= 5 ? 'Maksimal 5 foto' :
                                           `Upload beberapa foto (${form.gallery?.length || 0}/5)` }}
                                    </p>
                                    <!-- Preview Gallery -->
                                    <div v-if="form.gallery && form.gallery.length > 0"
                                        class="mt-2 flex flex-wrap gap-2">
                                        <div v-for="(img, idx) in form.gallery" :key="idx"
                                            class="relative inline-block">
                                            <img :src="resolveKronikImagePath(img)" alt="Gallery"
                                                class="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                                            <button type="button" @click="removeGalleryImage(idx)"
                                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- WHO - Siapa yang Terlibat -->
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">👥 WHO - Siapa yang Terlibat?</h3>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Yang Terlibat
                        </label>
                        <textarea v-model="form.who_involved" rows="3"
                            placeholder="Contoh: Romo Paroki, Ketua DPP, Seluruh umat Lingkungan A"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent"></textarea>
                    </div>
                </div>

                <!-- WHEN - Kapan -->
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">📅 WHEN - Kapan?</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Tanggal & Waktu <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.when_date" type="datetime-local" required
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Durasi
                            </label>
                            <input v-model="form.when_duration" type="text"
                                placeholder="Contoh: 2 jam atau 08.00 - 10.00"
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent" />
                        </div>
                    </div>
                </div>

                <!-- WHERE - Dimana -->
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">📍 WHERE - Dimana?</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Lokasi
                            </label>
                            <input v-model="form.where_location" type="text" placeholder="Contoh: Gereja St. Paulus"
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Alamat Lengkap
                            </label>
                            <textarea v-model="form.where_address" rows="2"
                                placeholder="Contoh: Jl. Juanda No. 123, Sidoarjo"
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent"></textarea>
                        </div>
                    </div>
                </div>

                <!-- WHY - Mengapa -->
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">❓ WHY - Mengapa?</h3>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Tujuan Kegiatan
                        </label>
                        <textarea v-model="form.why_purpose" rows="3"
                            placeholder="Contoh: Dalam rangka menyambut HUT Paroki ke-50"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent"></textarea>
                    </div>
                </div>

                <!-- HOW - Bagaimana -->
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">🔧 HOW - Bagaimana?</h3>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Cara Pelaksanaan
                        </label>
                        <textarea v-model="form.how_process" rows="3"
                            placeholder="Contoh: Kegiatan dilaksanakan dengan protokol kesehatan ketat"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-paulus-blue focus:border-transparent"></textarea>
                    </div>
                </div>

                <!-- AI Generate Narasi -->
                <div class="border-t pt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Generate Narasi dengan AI
                            </h3>
                            <p class="text-sm text-gray-600">
                                Buat narasi kronik otomatis berdasarkan data 5W1H yang sudah diisi. Minimal isi What, When, dan Where terlebih dahulu.
                            </p>
                        </div>
                    </div>
                    
                    <button type="button" @click="generateNarasi" 
                        :disabled="isGenerating || !form.what_title || !form.when_date || !form.where_location"
                        class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <svg v-if="isGenerating" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        {{ isGenerating ? 'Membuat Narasi...' : 'Generate Narasi AI' }}
                    </button>

                    <p v-if="!form.what_title || !form.when_date || !form.where_location" class="text-xs text-amber-600 mt-2">
                        ⚠️ Minimal isi What (Judul), When (Tanggal), dan Where (Lokasi) untuk menggunakan fitur ini
                    </p>
                </div>

                <!-- Submit Buttons -->
                <div class="flex gap-4 pt-6 border-t">
                    <button type="button" @click="handleSubmit('draft')" :disabled="loading"
                        class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50">
                        Simpan sebagai Draft
                    </button>
                    <button type="submit" :disabled="loading"
                        class="flex-1 px-6 py-3 bg-paulus-blue text-white rounded-lg hover:bg-blue-800 transition-colors font-medium disabled:opacity-50">
                        {{ loading ? 'Menyimpan...' : 'Submit untuk Review' }}
                    </button>
                </div>
            </form>

            <!-- Modal Preview Narasi -->
            <div v-if="showNarasiModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                    <!-- Modal Header -->
                    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold flex items-center">
                                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Narasi yang Dihasilkan AI
                            </h3>
                            <button @click="closeNarasiModal" class="text-white hover:text-gray-200 transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <p class="text-sm text-purple-100 mt-2">
                            Review narasi di bawah dan klik "Salin ke Form" untuk menggunakannya
                        </p>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
                        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div class="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                                {{ generatedNarasi }}
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="bg-gray-50 p-6 flex gap-3 border-t">
                        <button @click="generateNarasi"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Regenerate
                        </button>
                        <button @click="copyNarasiToForm"
                            class="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Salin ke Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'user-auth'
})

// Type definitions
interface Category {
    id: number
    name: string
    slug: string
}

interface Section {
    id: number
    name: string
    slug: string
    category_id: number
}

interface User {
    id: number
    username: string
    full_name?: string
    user_category: string
    role?: string
    unit_name?: string
    organization_type?: string
    organization_id?: number
}

const loading = ref(false)
const loadingSections = ref(false)
const loadingUser = ref(true)
const uploadingFeatured = ref(false)
const uploadingGallery = ref(false)
const isGenerating = ref(false)
const generatedNarasi = ref('')
const showNarasiModal = ref(false)
const user = ref<User | null>(null)
const categories = ref<Category[]>([])
const sections = ref<Section[]>([])

const form = reactive({
    category_id: '' as string | number,
    section_id: '' as string | number,
    what_title: '',
    what_description: '',
    who_involved: '',
    when_date: '',
    when_duration: '',
    where_location: '',
    where_address: '',
    why_purpose: '',
    how_process: '',
    featured_image: '',
    gallery: [] as string[],
    status: 'pending'
})

const resolveKronikImagePath = (value: unknown): string => {
    const text = String(value || '').trim()
    if (!text) return ''
    if (text.startsWith('http://') || text.startsWith('https://')) return text
    if (text.startsWith('/api/kronik/media/')) return text
    if (text.startsWith('/uploads/kronik/')) {
        const filename = text.split('/').pop()
        return filename ? `/api/kronik/media/${encodeURIComponent(filename)}` : ''
    }
    if (text.startsWith('/')) return text
    return `/api/kronik/media/${encodeURIComponent(text)}`
}

// Watch category_id changes to filter sections
watch(() => form.category_id, async (newCategoryId: string | number) => {
    form.section_id = '' // Reset section when category changes
    await fetchSections(newCategoryId)
})

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
        }) as any
        user.value = response
    } catch (error) {
        console.error('Failed to fetch user data:', error)
        navigateTo('/?login=required')
    } finally {
        loadingUser.value = false
    }
}

// Fetch categories
const fetchCategories = async () => {
    try {
        const response = await $fetch('/api/kronik/categories') as any
        categories.value = response.data || []

        // Auto-select category based on user_category and organization_type
        if (user.value) {
            let selectedCategoryId: number | null = null

            // Check organization_type first (more specific)
            if (user.value.organization_type) {
                const orgTypeMap: Record<string, number> = {
                    'gereja': 1,        // Gereja
                    'dpp': 2,           // DPP
                    'bgkp': 3,          // BGKP
                    'wilayah': 4,       // Wilayah
                    'lingkungan': 5     // Lingkungan
                }
                selectedCategoryId = orgTypeMap[user.value.organization_type.toLowerCase()] || null
            }

            // Fallback to user_category if no organization_type
            if (!selectedCategoryId) {
                const categoryMap: Record<string, number> = {
                    // Legacy/English category values
                    'PARISH_COUNCIL': 2,    // DPP
                    'CATEGORICAL_GROUP': 3, // BGKP
                    'REGION': 4,            // Wilayah
                    'COMMUNITY': 5,         // Lingkungan
                    'LINGKUNGAN': 5,        // Lingkungan (fallback)
                    // Indonesian category values
                    'DEWAN PASTORAL PAROKI': 2,
                    'KATEGORIAL': 3,
                    'WILAYAH': 4,
                    'KOMUNITAS': 5
                }
                selectedCategoryId = categoryMap[String(user.value.user_category || '').toUpperCase()] || null
            }

            if (selectedCategoryId) {
                form.category_id = selectedCategoryId
                // Trigger section fetch
                await fetchSections(form.category_id)
            }
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

// Fetch sections
const fetchSections = async (categoryId: number | string | null = null) => {
    if (!categoryId) {
        sections.value = []
        return
    }

    loadingSections.value = true
    try {
        console.log('Fetching sections for category:', categoryId)
        const response = await $fetch(`/api/kronik/sections?category_id=${categoryId}`) as any
        console.log('Sections response:', response)
        let availableSections = response.data || []

        // Filter sections based on user's organization_id (if not admin)
        const role = String(user.value?.role || '').toLowerCase()
        const isAdminRole = ['super_admin', 'admin_komsos', 'admin_sekretariat'].includes(role)
        if (user.value && user.value.organization_id && !isAdminRole) {
            // Non-admin users can only see their own section
            availableSections = availableSections.filter((s: Section) => s.id === user.value?.organization_id)
            
            // Auto-select the section if only one available
            if (availableSections.length === 1) {
                form.section_id = availableSections[0].id
            }
        }

        sections.value = availableSections
        console.log('Sections loaded:', sections.value.length, 'filtered for organization:', user.value?.organization_id)
    } catch (error) {
        console.error('Failed to fetch sections:', error)
        sections.value = []
    } finally {
        loadingSections.value = false
    }
}

// Handle featured image upload
const handleFeaturedImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    uploadingFeatured.value = true
    const token = localStorage.getItem('auth_token')

    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await $fetch('/api/kronik/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        }) as any

        if (response.success && response.data.files.length > 0) {
            form.featured_image = response.data.files[0]
        } else {
            alert('Gagal mengunggah foto: ' + (response.error || 'Unknown error'))
        }
    } catch (error) {
        console.error('Failed to upload featured image:', error)
        alert('Gagal mengunggah foto. Silakan coba lagi.')
    } finally {
        uploadingFeatured.value = false
        target.value = '' // Reset input
    }
}

// Handle gallery upload
const handleGalleryUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])
    if (files.length === 0) return

    // Check limit
    const currentCount = form.gallery.length
    const remainingSlots = 5 - currentCount
    if (remainingSlots <= 0) {
        alert('Maksimal 5 foto untuk galeri')
        return
    }

    const filesToUpload = files.slice(0, remainingSlots)

    uploadingGallery.value = true
    const token = localStorage.getItem('auth_token')

    try {
        const formData = new FormData()
        filesToUpload.forEach(file => formData.append('file', file))

        const response = await $fetch('/api/kronik/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        }) as any

        if (response.success && response.data.files.length > 0) {
            form.gallery.push(...response.data.files)
        } else {
            alert('Gagal mengunggah foto: ' + (response.error || 'Unknown error'))
        }
    } catch (error) {
        console.error('Failed to upload gallery images:', error)
        alert('Gagal mengunggah foto. Silakan coba lagi.')
    } finally {
        uploadingGallery.value = false
        target.value = '' // Reset input
    }
}

// Remove featured image
const removeFeaturedImage = () => {
    form.featured_image = ''
}

// Remove gallery image
const removeGalleryImage = (index: number) => {
    form.gallery.splice(index, 1)
}

// Form submit handler
const onFormSubmit = () => {
    handleSubmit()
}

const handleSubmit = async (status = 'pending') => {
    loading.value = true
    const token = localStorage.getItem('auth_token')

    try {
        // Validate required fields before submitting
        if (!form.category_id) {
            alert('Kategori harus diisi!')
            loading.value = false
            return
        }
        if (!form.what_title) {
            alert('Judul kegiatan harus diisi!')
            loading.value = false
            return
        }
        if (!form.when_date) {
            alert('Tanggal & waktu kegiatan harus diisi!')
            loading.value = false
            return
        }

        const payload = {
            ...form,
            status: status || form.status,
            // Convert empty strings to null
            section_id: form.section_id || null,
            who_involved: form.who_involved || null,
            when_duration: form.when_duration || null,
            where_location: form.where_location || null,
            where_address: form.where_address || null,
            why_purpose: form.why_purpose || null,
            how_process: form.how_process || null,
            // Handle photos - convert to JSON for gallery
            featured_image: form.featured_image || null,
            gallery: form.gallery.length > 0 ? JSON.stringify(form.gallery) : null
        }

        const response = await $fetch('/api/kronik/entries', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: payload
        }) as any

        // Navigate with success message
        const message = status === 'draft' 
            ? 'Kronik berhasil disimpan sebagai draft' 
            : 'Kronik berhasil disubmit untuk direview oleh admin'
        navigateTo(`/kronik/manage?success=${encodeURIComponent(message)}`)
    } catch (error: any) {
        console.error('Failed to create kronik:', error)
        const errorMsg = error.data?.message || error.message || 'Gagal menyimpan kronik. Silakan coba lagi.'
        alert(errorMsg)
    } finally {
        loading.value = false
    }
}

// Check if category dropdown should be disabled
const isCategoryDisabled = computed(() => {
    if (!user.value) return false
    const normalized = String(user.value.user_category || '').toUpperCase()
    return [
        'PARISH_COUNCIL',
        'CATEGORICAL_GROUP',
        'REGION',
        'COMMUNITY',
        'LINGKUNGAN',
        'DEWAN PASTORAL PAROKI',
        'KATEGORIAL',
        'WILAYAH',
        'KOMUNITAS'
    ].includes(normalized)
})

// AI Generate Narasi Functions
const generateNarasi = async () => {
    // Validasi 5W1H minimal
    if (!form.what_title || !form.when_date || !form.where_location) {
        alert('Minimal isi What (Judul), When (Tanggal), dan Where (Lokasi) terlebih dahulu untuk generate narasi.')
        return
    }

    try {
        isGenerating.value = true
        generatedNarasi.value = ''
        const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_access_token')

        const response = await $fetch('/api/kronik/generate-narasi', {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: {
                what: `${form.what_title}\n${form.what_description}`,
                when: form.when_date + (form.when_duration ? ` (Durasi: ${form.when_duration})` : ''),
                where: form.where_location + (form.where_address ? ` - ${form.where_address}` : ''),
                who: form.who_involved || '',
                why: form.why_purpose || '',
                how: form.how_process || ''
            }
        }) as any

        if (response.success && response.narasi) {
            generatedNarasi.value = response.narasi
            showNarasiModal.value = true
        } else {
            throw new Error('Gagal generate narasi')
        }

    } catch (error: any) {
        console.error('Error generating narasi:', error)
        alert(error.data?.message || error.message || 'Gagal generate narasi dengan AI. Pastikan API Key Gemini sudah dikonfigurasi.')
    } finally {
        isGenerating.value = false
    }
}

const copyNarasiToForm = () => {
    // Tambahkan narasi ke what_description jika kosong, atau replace jika sudah ada
    if (!form.what_description || confirm('Replace deskripsi yang ada dengan narasi AI?')) {
        form.what_description = generatedNarasi.value
    }
    showNarasiModal.value = false
    alert('Narasi berhasil disalin! Anda bisa mengeditnya lebih lanjut.')
}

const closeNarasiModal = () => {
    showNarasiModal.value = false
}

onMounted(async () => {
    await fetchUserData()
    await fetchCategories()
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

.hover\:text-blue-800:hover {
    color: #1e3a8a;
}

.focus\:ring-paulus-blue:focus {
    --tw-ring-color: #1e40af;
}
</style>
