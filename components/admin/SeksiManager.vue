<template>
    <div>
        <!-- Header with Add Button -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div class="relative flex-1 max-w-md">
                <input v-model="searchQuery" type="text" placeholder="Cari seksi..."
                    class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#882f1d] focus:border-transparent outline-none bg-white" />
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
            <button @click="openCreateModal"
                class="bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Seksi</span>
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-[#882f1d] border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-gray-600 mt-3 text-sm">Memuat data...</p>
        </div>

        <!-- Table & Mobile Cards -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Desktop Table -->
            <div class="overflow-x-auto hidden sm:block">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seksi</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidang</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="seksi in filteredSeksi" :key="seksi.id" class="hover:bg-gray-50/80 transition-colors">
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-gray-900">{{ seksi.nama }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500">{{ seksi.bidang || '-' }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {{ seksi.display_order }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2.5 py-0.5 text-xs font-semibold rounded-full',
                                    seksi.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ seksi.is_active ? 'Aktif' : 'Non-aktif' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                <button @click="editSeksi(seksi)"
                                    class="text-[#882f1d] hover:text-[#6b2416] transition-colors p-1.5 rounded hover:bg-orange-50" title="Edit">
                                    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button @click="confirmDelete(seksi)"
                                    class="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded hover:bg-red-50" title="Hapus">
                                    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Cards -->
            <div class="sm:hidden divide-y divide-gray-200">
                <div v-for="seksi in filteredSeksi" :key="seksi.id" class="p-4 space-y-2.5">
                    <div class="flex items-center justify-between gap-2">
                        <h4 class="text-sm font-bold text-gray-900">{{ seksi.nama }}</h4>
                        <div class="flex items-center gap-1">
                            <span :class="[
                                'px-2 py-0.5 text-xs font-semibold rounded-full',
                                seksi.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ seksi.is_active ? 'Aktif' : 'Non-aktif' }}
                            </span>
                            <button @click="editSeksi(seksi)" class="p-1 text-[#882f1d] hover:bg-orange-50 rounded">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="confirmDelete(seksi)" class="p-1 text-red-600 hover:bg-red-50 rounded">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="text-xs text-gray-600">
                        Bidang: <span class="font-medium text-gray-800">{{ seksi.bidang || '-' }}</span>
                    </div>
                    <div class="text-xs text-gray-500">
                        Urutan: <strong>{{ seksi.display_order }}</strong>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredSeksi.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500 text-sm">Belum ada seksi yang ditambahkan.</p>
            </div>
        </div>

        <!-- Modal Form -->
        <Teleport to="body">
            <div v-if="showModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-lg w-full" @click.stop>
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-800">
                            {{ isEditing ? 'Edit Seksi' : 'Tambah Seksi' }}
                        </h2>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="submitForm" class="p-6">
                        <div class="space-y-4">
                            <!-- Nama -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Seksi <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.nama" type="text" required placeholder="Contoh: Liturgi"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>

                            <!-- Bidang -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Bidang
                                </label>
                                <input v-model="form.bidang" type="text" placeholder="Contoh: Sumber"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>

                            <!-- Urutan -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Urutan Tampil
                                </label>
                                <input v-model="form.display_order" type="number" min="0"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                <p class="mt-1 text-xs text-gray-500">Angka lebih kecil akan tampil lebih dulu</p>
                            </div>

                            <!-- Status -->
                            <div class="flex items-center gap-3 pt-2">
                                <div class="flex items-center h-5">
                                    <input v-model="form.is_active" id="is_active" type="checkbox"
                                        class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]" />
                                </div>
                                <div class="text-sm">
                                    <label for="is_active" class="font-medium text-gray-700">Aktif</label>
                                    <p class="text-gray-500">Seksi ini dapat dipilih saat membuat berita.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Error Message -->
                        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex gap-2">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ errorMessage }}
                        </div>

                        <!-- Actions -->
                        <div class="mt-6 flex justify-end gap-3">
                            <button type="button" @click="closeModal"
                                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button type="submit" :disabled="submitting"
                                class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors disabled:opacity-50 flex items-center gap-2">
                                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                {{ isEditing ? 'Simpan Perubahan' : 'Tambah Seksi' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <div v-if="deleteModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Hapus Seksi?</h3>
                    <p class="text-gray-500 mb-6">
                        Apakah Anda yakin ingin menghapus seksi <span class="font-semibold text-gray-800">{{
                            seksiToDelete?.nama }}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div class="flex justify-center gap-3">
                        <button @click="deleteModal = false"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button @click="executeDelete" :disabled="deleting"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                            <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { $toast } = useNuxtApp()
const token = useCookie('auth_token')

// State
const loading = ref(true)
const seksiList = ref([])
const searchQuery = ref('')

// Modal State
const showModal = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const deleteModal = ref(false)
const seksiToDelete = ref(null)
const deleting = ref(false)

// Form Data
const form = ref({
    id: null,
    nama: '',
    bidang: '',
    display_order: 0,
    is_active: true
})

// Computed
const filteredSeksi = computed(() => {
    if (!searchQuery.value) return seksiList.value
    const query = searchQuery.value.toLowerCase()
    return seksiList.value.filter(s =>
        s.nama.toLowerCase().includes(query) ||
        (s.bidang && s.bidang.toLowerCase().includes(query))
    )
})

// Fetch Data
const fetchSeksi = async () => {
    loading.value = true
    try {
        const response = await $fetch('/api/admin/seksi', {
            headers: { Authorization: `Bearer ${token.value}` }
        })
        if (response.success) {
            seksiList.value = response.data
        }
    } catch (error) {
        console.error('Failed to fetch seksi:', error)
        $toast?.error?.('Gagal mengambil data seksi')
    } finally {
        loading.value = false
    }
}

// Modal Actions
const openCreateModal = () => {
    isEditing.value = false
    form.value = {
        id: null,
        nama: '',
        bidang: '',
        display_order: seksiList.value.length + 1,
        is_active: true
    }
    errorMessage.value = ''
    showModal.value = true
}

const editSeksi = (seksi) => {
    isEditing.value = true
    form.value = {
        id: seksi.id,
        nama: seksi.nama,
        bidang: seksi.bidang || '',
        display_order: seksi.display_order,
        is_active: !!seksi.is_active
    }
    errorMessage.value = ''
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    errorMessage.value = ''
}

// Form Submission
const submitForm = async () => {
    submitting.value = true
    errorMessage.value = ''

    try {
        const url = isEditing.value ? `/api/admin/seksi/${form.value.id}` : '/api/admin/seksi'
        const method = isEditing.value ? 'PUT' : 'POST'

        const response = await $fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token.value}` },
            body: form.value
        })

        if (response.success) {
            $toast?.success?.(isEditing.value ? 'Seksi berhasil diubah' : 'Seksi berhasil ditambahkan')
            closeModal()
            await fetchSeksi()
        }
    } catch (error) {
        errorMessage.value = error.data?.message || 'Terjadi kesalahan'
    } finally {
        submitting.value = false
    }
}

// Delete Actions
const confirmDelete = (seksi) => {
    seksiToDelete.value = seksi
    deleteModal.value = true
}

const executeDelete = async () => {
    if (!seksiToDelete.value) return

    deleting.value = true
    try {
        const response = await $fetch(`/api/admin/seksi/${seksiToDelete.value.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token.value}` }
        })

        if (response.success) {
            $toast?.success?.('Seksi berhasil dihapus')
            deleteModal.value = false
            await fetchSeksi()
        }
    } catch (error) {
        $toast?.error?.(error.data?.message || 'Gagal menghapus seksi')
    } finally {
        deleting.value = false
    }
}

// Initial fetch
onMounted(() => {
    fetchSeksi()
})
</script>
