<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-800">Pengumuman Gereja</h1>
                <p class="text-gray-600 mt-1">Kelola pengumuman dan jadwal kegiatan paroki</p>
            </div>
            <button @click="openCreateModal"
                class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6d2517] flex items-center gap-2">
                <span>➕</span>
                <span>Tambah Pengumuman</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d]"></div>
            <p class="mt-4 text-gray-600">Memuat data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            ❌ {{ error.message || 'Gagal memuat data' }}
        </div>

        <!-- Data Table -->
        <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gradient-to-r from-[#882f1d] to-[#a03822] text-white">
                        <tr>
                            <th class="px-4 py-3 text-left text-sm font-semibold">Thumbnail</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold">Acara</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold">Jam</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold">Status</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in localAnnouncements" :key="item.id"
                            class="border-b hover:bg-gray-50 transition-colors"
                            :class="{ 'bg-gray-50/50': i % 2 === 0, 'opacity-50': item._deleting }">
                            <!-- Thumbnail -->
                            <td class="px-4 py-3">
                                <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title"
                                    class="w-16 h-16 object-cover rounded-lg">
                                <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span class="text-gray-400 text-2xl">📋</span>
                                </div>
                            </td>

                            <!-- Acara -->
                            <td class="px-4 py-3">
                                <h3 class="font-semibold text-gray-800">{{ item.title }}</h3>
                                <p class="text-sm text-gray-600 line-clamp-2">{{ item.description }}</p>
                                <span v-if="item.activity_type"
                                    class="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{{
                                        item.activity_type }}</span>
                            </td>

                            <!-- Tanggal -->
                            <td class="px-4 py-3">
                                <span class="font-medium text-gray-700">{{ formatDate(item.event_date) }}</span>
                            </td>

                            <!-- Jam -->
                            <td class="px-4 py-3">
                                <span class="font-medium text-gray-700">{{ item.event_time }}</span>
                            </td>

                            <!-- Status -->
                            <td class="px-4 py-3 text-center">
                                <button @click="toggleStatus(item)" :disabled="item._updating"
                                    class="relative inline-flex items-center cursor-pointer">
                                    <div class="w-11 h-6 rounded-full transition-colors" :class="item.is_active
                                        ? 'bg-green-500'
                                        : 'bg-gray-300'
                                        ">
                                        <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"
                                            :class="{ 'translate-x-5': item.is_active }"></div>
                                    </div>
                                    <span class="ml-2 text-sm font-medium"
                                        :class="item.is_active ? 'text-green-600' : 'text-gray-500'">
                                        {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
                                    </span>
                                </button>
                            </td>

                            <!-- Aksi -->
                            <td class="px-4 py-3 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="openEditModal(item)" :disabled="item._deleting"
                                        class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm disabled:opacity-50">
                                        ✏️ Edit
                                    </button>
                                    <button @click="deleteAnnouncement(item)" :disabled="item._deleting"
                                        class="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50">
                                        {{ item._deleting ? '⏳' : '🗑️' }} Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-if="localAnnouncements.length === 0">
                            <td colspan="6" class="px-4 py-12 text-center text-gray-500">
                                <div class="text-6xl mb-4">📢</div>
                                <p class="text-lg font-medium">Belum ada pengumuman</p>
                                <p class="text-sm mt-2">Klik tombol "Tambah Pengumuman" untuk membuat pengumuman baru
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="closeModal">
            <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">
                        {{ isEditing ? 'Edit Pengumuman' : 'Tambah Pengumuman' }}
                    </h2>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form @submit.prevent="submitForm" class="p-6 space-y-4">
                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Judul Acara *</label>
                        <input v-model="formData.title" type="text" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
                            placeholder="Contoh: Misa Paskah 2026">
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi *</label>
                        <textarea v-model="formData.description" required rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
                            placeholder="Deskripsi singkat tentang acara..."></textarea>
                    </div>

                    <!-- Activity Type -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kegiatan</label>
                        <select v-model="formData.activity_type"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                            <option value="">-- Pilih Jenis --</option>
                            <option value="Misa">Misa</option>
                            <option value="Retret">Retret</option>
                            <option value="Bakti Sosial">Bakti Sosial</option>
                            <option value="Pertemuan">Pertemuan</option>
                            <option value="Perayaan">Perayaan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <!-- Date & Time -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                            <input v-model="formData.event_date" type="date" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Jam *</label>
                            <input v-model="formData.event_time" type="time" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        </div>
                    </div>

                    <!-- Thumbnail URL -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">URL Thumbnail</label>
                        <input v-model="formData.thumbnail" type="url"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
                            placeholder="https://example.com/image.jpg">
                        <p class="text-xs text-gray-500 mt-1">💡 Opsional: Link gambar untuk thumbnail pengumuman</p>
                    </div>

                    <!-- Display Order -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Urutan Tampil</label>
                        <input v-model.number="formData.display_order" type="number" min="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
                            placeholder="0">
                        <p class="text-xs text-gray-500 mt-1">💡 Angka lebih kecil akan tampil lebih dulu</p>
                    </div>

                    <!-- Is Active -->
                    <div class="flex items-center gap-3">
                        <input v-model="formData.is_active" type="checkbox" id="is_active"
                            class="w-5 h-5 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]">
                        <label for="is_active" class="text-sm font-medium text-gray-700">Aktifkan pengumuman ini</label>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" :disabled="saving"
                            class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6d2517] disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ saving ? '⏳ Menyimpan...' : (isEditing ? '💾 Update' : '➕ Tambah') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: ['auth']
})

// Fetch data
const { data: announcements, pending, error, refresh } = await useFetch('/api/admin/church-announcements', {
    headers: useRequestHeaders(['cookie']),
    default: () => ({ data: [] }),
    transform: (data) => data || { data: [] }
})

// Local state with optimistic updates
const localAnnouncements = ref([])
watch(() => announcements.value, (newVal) => {
    if (newVal?.data) {
        localAnnouncements.value = JSON.parse(JSON.stringify(newVal.data))
    }
}, { immediate: true })

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const formData = ref({
    id: null,
    title: '',
    description: '',
    activity_type: '',
    event_date: '',
    event_time: '',
    thumbnail: '',
    display_order: 0,
    is_active: true
})

// Open create modal
const openCreateModal = () => {
    isEditing.value = false
    formData.value = {
        id: null,
        title: '',
        description: '',
        activity_type: '',
        event_date: '',
        event_time: '',
        thumbnail: '',
        display_order: 0,
        is_active: true
    }
    showModal.value = true
}

// Open edit modal
const openEditModal = (item) => {
    isEditing.value = true
    formData.value = { ...item }
    showModal.value = true
}

// Close modal
const closeModal = () => {
    showModal.value = false
    formData.value = {
        id: null,
        title: '',
        description: '',
        activity_type: '',
        event_date: '',
        event_time: '',
        thumbnail: '',
        display_order: 0,
        is_active: true
    }
}

// Submit form
const submitForm = async () => {
    saving.value = true
    try {
        if (isEditing.value) {
            // Update existing
            const { data } = await $fetch(`/api/admin/church-announcements/${formData.value.id}`, {
                method: 'PUT',
                body: formData.value,
                headers: useRequestHeaders(['cookie'])
            })

            // Optimistic update
            const index = localAnnouncements.value.findIndex(a => a.id === formData.value.id)
            if (index !== -1) {
                localAnnouncements.value[index] = { ...data.data }
            }

            alert('✅ Pengumuman berhasil diupdate!')
        } else {
            // Create new
            const { data } = await $fetch('/api/admin/church-announcements', {
                method: 'POST',
                body: formData.value,
                headers: useRequestHeaders(['cookie'])
            })

            // Optimistic update - add to top
            localAnnouncements.value.unshift(data.data)

            alert('✅ Pengumuman berhasil ditambahkan!')
        }

        closeModal()
        await refresh()
    } catch (err) {
        console.error('Error saving announcement:', err)
        alert('❌ Gagal menyimpan: ' + (err.data?.message || err.message))
    } finally {
        saving.value = false
    }
}

// Toggle status with optimistic update
const toggleStatus = async (item) => {
    // Optimistic update
    const oldValue = item.is_active
    item._updating = true
    item.is_active = !item.is_active

    try {
        await $fetch(`/api/admin/church-announcements/${item.id}`, {
            method: 'PUT',
            body: { ...item, is_active: item.is_active },
            headers: useRequestHeaders(['cookie'])
        })
    } catch (err) {
        // Rollback on error
        item.is_active = oldValue
        alert('❌ Gagal mengubah status')
    } finally {
        item._updating = false
    }
}

// Delete with optimistic update
const deleteAnnouncement = async (item) => {
    if (!confirm(`Hapus pengumuman "${item.title}"?`)) return

    // Optimistic delete
    item._deleting = true
    const index = localAnnouncements.value.findIndex(a => a.id === item.id)

    try {
        await $fetch(`/api/admin/church-announcements/${item.id}`, {
            method: 'DELETE',
            headers: useRequestHeaders(['cookie'])
        })

        // Remove from local state
        if (index !== -1) {
            localAnnouncements.value.splice(index, 1)
        }

        alert('✅ Pengumuman berhasil dihapus!')
    } catch (err) {
        // Rollback on error
        item._deleting = false
        alert('❌ Gagal menghapus: ' + (err.data?.message || err.message))
    }
}

// Format date helper
const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}
</script>
