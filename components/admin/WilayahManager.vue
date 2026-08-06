<template>
    <div>
        <!-- Header with Add Button -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div class="relative flex-1 max-w-md">
                <input v-model="searchQuery" type="text" placeholder="Cari wilayah..."
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
                <span>Tambah Wilayah</span>
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wilayah</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="wilayah in filteredWilayah" :key="wilayah.id" class="hover:bg-gray-50/80 transition-colors">
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-gray-900">{{ wilayah.nama }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500">{{ wilayah.keterangan || '-' }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {{ wilayah.display_order }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2.5 py-0.5 text-xs font-semibold rounded-full',
                                    wilayah.is_visible
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ wilayah.is_visible ? 'Visible' : 'Hidden' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                <button @click="editWilayah(wilayah)"
                                    class="text-[#882f1d] hover:text-[#6b2416] transition-colors p-1.5 rounded hover:bg-orange-50" title="Edit">
                                    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button @click="confirmDelete(wilayah)"
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
                <div v-for="wilayah in filteredWilayah" :key="wilayah.id" class="p-4 space-y-2.5">
                    <div class="flex items-center justify-between gap-2">
                        <h4 class="text-sm font-bold text-gray-900">{{ wilayah.nama }}</h4>
                        <div class="flex items-center gap-1">
                            <span :class="[
                                'px-2 py-0.5 text-xs font-semibold rounded-full',
                                wilayah.is_visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ wilayah.is_visible ? 'Visible' : 'Hidden' }}
                            </span>
                            <button @click="editWilayah(wilayah)" class="p-1 text-[#882f1d] hover:bg-orange-50 rounded">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="confirmDelete(wilayah)" class="p-1 text-red-600 hover:bg-red-50 rounded">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p v-if="wilayah.keterangan" class="text-xs text-gray-600">{{ wilayah.keterangan }}</p>
                    <div class="text-xs text-gray-500 flex items-center gap-2">
                        <span>Urutan: <strong>{{ wilayah.display_order }}</strong></span>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredWilayah.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500 text-sm">Belum ada wilayah yang ditambahkan.</p>
            </div>
        </div>

        <!-- Modal (to be implemented) -->
        <Teleport to="body">
            <div v-if="showModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-lg w-full" @click.stop>
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-800">
                            {{ modalMode === 'create' ? 'Tambah Wilayah' : 'Edit Wilayah' }}
                        </h2>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="saveWilayah" class="p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nama Wilayah <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.nama" type="text" required placeholder="Contoh: Juanda & Waru"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                            <textarea v-model="formData.keterangan" rows="3"
                                placeholder="Deskripsi singkat tentang wilayah..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
                                <input v-model.number="formData.display_order" type="number" placeholder="0"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <div class="flex items-center h-10">
                                    <label class="flex items-center cursor-pointer">
                                        <input v-model="formData.is_visible" type="checkbox" class="sr-only peer" />
                                        <div
                                            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#882f1d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#882f1d]">
                                        </div>
                                        <span class="ml-3 text-sm font-medium text-gray-700">Visible</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeModal"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button type="submit"
                                class="flex-1 bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors">
                                {{ modalMode === 'create' ? 'Tambah' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <div v-if="showDeleteConfirm"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                @click.self="showDeleteConfirm = false">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">
                        Apakah Anda yakin ingin menghapus wilayah <strong>{{ deleteTarget?.nama }}</strong>?
                    </p>
                    <div class="flex gap-3">
                        <button @click="showDeleteConfirm = false"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button @click="deleteWilayah"
                            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Foreign Key Error Info Modal -->
        <Teleport to="body">
            <div v-if="showForeignKeyError"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                @click.self="showForeignKeyError = false">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full" @click.stop>
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-red-50">
                        <div class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 class="text-xl font-bold text-red-900">Tidak Dapat Menghapus Wilayah</h2>
                        </div>
                        <button @click="showForeignKeyError = false" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 space-y-4">
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p class="text-red-800 font-medium mb-2">⚠️ Wilayah "{{ foreignKeyError.wilayahNama }}" masih digunakan</p>
                            <p class="text-red-700">{{ foreignKeyError.message }}</p>
                        </div>

                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Cara Menghapus Wilayah Ini:
                            </h3>
                            <ol class="space-y-2 text-sm text-blue-900">
                                <li class="flex gap-2">
                                    <span class="font-bold min-w-6">1.</span>
                                    <span>Klik tab <strong>"📍 Lingkungan"</strong> di bagian atas halaman</span>
                                </li>
                                <li class="flex gap-2">
                                    <span class="font-bold min-w-6">2.</span>
                                    <span>Cari lingkungan yang kolom <strong>"Wilayah"</strong>-nya menunjukkan <strong>"{{ foreignKeyError.wilayahNama }}"</strong></span>
                                </li>
                                <li class="flex gap-2">
                                    <span class="font-bold min-w-6">3.</span>
                                    <span>Pilih salah satu opsi:</span>
                                </li>
                                <li class="ml-8 space-y-1">
                                    <div class="flex gap-2 items-start">
                                        <span class="text-blue-600">•</span>
                                        <span><strong>Opsi A:</strong> Hapus lingkungan tersebut terlebih dahulu</span>
                                    </div>
                                    <div class="flex gap-2 items-start">
                                        <span class="text-blue-600">•</span>
                                        <span><strong>Opsi B:</strong> Edit lingkungan, ganti wilayahnya ke wilayah lain</span>
                                    </div>
                                </li>
                                <li class="flex gap-2">
                                    <span class="font-bold min-w-6">4.</span>
                                    <span>Kembali ke tab <strong>"🗺️ Wilayah"</strong></span>
                                </li>
                                <li class="flex gap-2">
                                    <span class="font-bold min-w-6">5.</span>
                                    <span>Sekarang baru dapat menghapus wilayah ini</span>
                                </li>
                            </ol>
                        </div>

                        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p class="text-xs text-gray-600">
                                <strong>💡 Mengapa ini terjadi?</strong><br>
                                Sistem melindungi integritas data dengan mencegah penghapusan wilayah yang masih digunakan oleh lingkungan. 
                                Ini mencegah data lingkungan menjadi tidak valid.
                            </p>
                        </div>
                    </div>

                    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                        <button @click="showForeignKeyError = false"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                            Tutup
                        </button>
                        <button @click="switchToLingkunganTab"
                            class="flex-1 bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Buka Tab Lingkungan
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Toast Notification -->
        <Teleport to="body">
            <Transition name="toast">
                <div v-if="toast.show"
                    class="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
                    :class="{
                        'bg-green-500 text-white': toast.type === 'success',
                        'bg-red-500 text-white': toast.type === 'error',
                        'bg-blue-500 text-white': toast.type === 'info'
                    }">
                    <svg v-if="toast.type === 'success'" class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-if="toast.type === 'error'" class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ toast.message }}</span>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from '#imports'

const wilayahList = ref([])
const loading = ref(false)
const searchQuery = ref('')

const showModal = ref(false)
const modalMode = ref('create')
const formData = ref({})

const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)

const showForeignKeyError = ref(false)
const foreignKeyError = ref({
    message: '',
    wilayahNama: '',
    lingkunganCount: 0
})

const toast = ref({
    show: false,
    message: '',
    type: 'success'
})

const emptyForm = {
    nama: '',
    keterangan: '',
    display_order: 0,
    is_visible: true
}

const filteredWilayah = computed(() => {
    if (!searchQuery.value) return wilayahList.value
    const query = searchQuery.value.toLowerCase()
    return wilayahList.value.filter(w =>
        w.nama.toLowerCase().includes(query) ||
        (w.keterangan && w.keterangan.toLowerCase().includes(query))
    )
})

const showToast = (message, type = 'success', duration = 3000) => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, duration)
}

const fetchWilayah = async () => {
    loading.value = true
    try {
        const response = await $fetch('/api/admin/wilayah')
        wilayahList.value = response.data
    } catch (err) {
        console.error('Error fetching wilayah:', err)
        showToast('Gagal memuat data wilayah', 'error')
    } finally {
        loading.value = false
    }
}

const openCreateModal = () => {
    formData.value = { ...emptyForm }
    modalMode.value = 'create'
    showModal.value = true
}

const editWilayah = (wilayah) => {
    formData.value = { ...wilayah }
    modalMode.value = 'edit'
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    formData.value = { ...emptyForm }
}

const saveWilayah = async () => {
    // Validation
    if (!formData.value.nama) {
        showToast('Nama wilayah harus diisi!', 'error')
        return
    }

    const isEdit = modalMode.value === 'edit'
    const editId = formData.value.id // Store ID before any changes

    const wilayahData = {
        nama: formData.value.nama?.trim(),
        keterangan: formData.value.keterangan?.trim() || '',
        display_order: parseInt(formData.value.display_order) || 0,
        is_visible: formData.value.is_visible ? 1 : 0
    }

    // Close modal immediately BEFORE optimistic update
    closeModal()

    // Save for toast and API
    const savedName = wilayahData.nama

    // Optimistic update with proper reactivity
    if (isEdit) {
        // Update existing item optimistically using splice for reactivity
        const index = wilayahList.value.findIndex(w => w.id === editId)
        if (index !== -1) {
            const optimisticData = {
                ...wilayahList.value[index],
                ...wilayahData,
                id: editId,
                updated_at: new Date().toISOString()
            }
            wilayahList.value.splice(index, 1, optimisticData) // Use splice for reactivity
        }
    } else {
        // Add new item optimistically at the top
        const tempId = `temp_${Date.now()}`
        const optimisticData = {
            id: tempId,
            ...wilayahData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        wilayahList.value.unshift(optimisticData)
    }

    try {
        if (isEdit) {
            const response = await $fetch(`/api/admin/wilayah/${editId}`, {
                method: 'PUT',
                body: wilayahData
            })
            showToast(`Wilayah "${savedName}" berhasil diperbarui!`, 'success')

            // Update with real server data
            if (response.data) {
                const index = wilayahList.value.findIndex(w => w.id === editId)
                if (index !== -1) {
                    wilayahList.value.splice(index, 1, response.data)
                }
            }
        } else {
            const response = await $fetch('/api/admin/wilayah', {
                method: 'POST',
                body: wilayahData
            })
            showToast(`Wilayah "${savedName}" berhasil ditambahkan!`, 'success')

            // Replace temp ID with real data from server
            if (response.data) {
                const index = wilayahList.value.findIndex(w => typeof w.id === 'string' && w.id.startsWith('temp_'))
                if (index !== -1) {
                    wilayahList.value.splice(index, 1, response.data)
                }
            }
        }
    } catch (err) {
        console.error('Error saving wilayah:', err)
        
        // Extract error message from various possible locations
        // Nuxt's createError might put the message in different places
        const errorMessage = err?.response?._data?.message || err?.data?.message || err?.message || err?.statusMessage || 'Unknown error'
        showToast('Gagal: ' + errorMessage, 'error', 6000)

        // Revert optimistic update on error
        await fetchWilayah()
    }
}

const confirmDelete = (wilayah) => {
    deleteTarget.value = wilayah
    showDeleteConfirm.value = true
}

const deleteWilayah = async () => {
    const deletedItem = { ...deleteTarget.value }
    const deletedIndex = wilayahList.value.findIndex(w => w.id === deletedItem.id)

    // Store deleted item for potential revert
    const backupItem = deletedIndex !== -1 ? { ...wilayahList.value[deletedIndex] } : null

    // Close dialog immediately
    showDeleteConfirm.value = false
    deleteTarget.value = null

    // Optimistic delete - remove from UI immediately
    if (deletedIndex !== -1) {
        wilayahList.value.splice(deletedIndex, 1)
    }

    try {
        await $fetch(`/api/admin/wilayah/${deletedItem.id}`, {
            method: 'DELETE'
        })
        showToast(`Wilayah ${deletedItem.nama} berhasil dihapus!`)
    } catch (err) {
        console.error('Error deleting wilayah:', err)
        
        // Extract error message from various possible locations
        const errorMessage = err?.response?._data?.message || err?.data?.message || err?.message || err?.statusMessage || 'Unknown error'
        
        // Check if it's a foreign key constraint error
        if (errorMessage.includes('lingkungan') && errorMessage.includes('still using')) {
            // Extract the count of lingkungan using this wilayah
            const countMatch = errorMessage.match(/(\d+)\s+lingkungan/)
            const count = countMatch ? parseInt(countMatch[1]) : 0
            
            // Show detailed information modal
            foreignKeyError.value = {
                message: errorMessage,
                wilayahNama: deletedItem.nama,
                lingkunganCount: count
            }
            showForeignKeyError.value = true
        } else {
            // Show regular error toast for other errors
            showToast('Gagal: ' + errorMessage, 'error', 6000)
        }

        // Revert optimistic delete on error - restore item
        if (backupItem && deletedIndex !== -1) {
            wilayahList.value.splice(deletedIndex, 0, backupItem)
        }
    }
}

const switchToLingkunganTab = () => {
    showForeignKeyError.value = false
    // Emit event to parent component to switch tabs
    // Parent component (teritorial.vue) will handle the tab switch
    const event = new CustomEvent('switch-to-lingkungan')
    window.dispatchEvent(event)
}

onMounted(() => {
    fetchWilayah()
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.toast-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>
