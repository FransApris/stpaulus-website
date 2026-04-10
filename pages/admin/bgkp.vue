<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 mb-1">Kelola BGKP Paroki</h1>
                <p class="text-gray-600">Manajemen data Badan Gereja Katolik Paroki</p>
            </div>
            <button @click="openCreateModal"
                class="bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Anggota
            </button>
        </div>

        <!-- Filters & Search -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
                    <input v-model="filters.search" type="text" placeholder="Cari nama anggota..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                    <select v-model="filters.position_type"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua Jabatan</option>
                        <option value="ketua">Ketua</option>
                        <option value="wakil_ketua">Wakil Ketua</option>
                        <option value="sekretaris">Sekretaris</option>
                        <option value="bendahara">Bendahara</option>
                        <option value="anggota">Anggota</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="filters.is_active"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua Status</option>
                        <option value="true">Aktif</option>
                        <option value="false">Tidak Aktif</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Urutkan</label>
                    <select v-model="filters.sort"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="display_order">Urutan Tampil</option>
                        <option value="name">Nama</option>
                        <option value="created_at">Tanggal Dibuat</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-[#882f1d] border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-gray-600 mt-3">Memuat data...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <strong>Error:</strong> {{ error }}
        </div>

        <!-- BGKP Table -->
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jabatan
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa
                            Jabatan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Urutan</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="member in paginatedMembers" :key="member.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                            <div v-if="member.is_ex_officio" class="text-xs text-[#882f1d] font-semibold">Ex Officio
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                getPositionTypeClass(member.position_type)
                            ]">
                                {{ getPositionTypeName(member.position_type) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ member.position_level || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div v-if="member.period_start_date">
                                {{ formatDate(member.period_start_date) }} -
                                {{ member.period_end_date ? formatDate(member.period_end_date) : 'Sekarang' }}
                            </div>
                            <div v-else>-</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                member.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ member.is_active ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ member.display_order }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button @click="editMember(member)"
                                class="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="confirmDelete(member)"
                                class="text-red-600 hover:text-red-800 transition-colors p-1" title="Hapus">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="displayedMembers.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500 mb-4">Belum ada data anggota BGKP yang ditambahkan.</p>
                <button @click="openCreateModal"
                    class="inline-flex items-center gap-2 bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Anggota Pertama
                </button>
            </div>

            <div v-if="displayedMembers.length > pageLimit" class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p class="text-sm text-gray-600">
                    Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-
                    {{ Math.min(currentPage * pageLimit, displayedMembers.length) }}
                    dari {{ displayedMembers.length }} anggota
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
                                ? 'bg-[#882f1d] text-white border-[#882f1d]'
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

        <!-- Create/Edit Modal -->
        <Teleport to="body">
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                @click.self="closeModal">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div
                        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-800">
                            {{ modalMode === 'create' ? 'Tambah Anggota BGKP' : 'Edit Anggota BGKP' }}
                        </h2>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="saveMember" class="p-6 space-y-4">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.name" type="text" required placeholder="Nicolaus Yosep Smith"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                        </div>

                        <!-- Position -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Jabatan Lengkap <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.position" type="text" required placeholder="Ketua Harian"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                        </div>

                        <!-- Position Type & Level -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Tipe Jabatan <span class="text-red-500">*</span>
                                </label>
                                <select v-model="formData.position_type" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option value="ketua">Ketua</option>
                                    <option value="wakil_ketua">Wakil Ketua</option>
                                    <option value="sekretaris">Sekretaris</option>
                                    <option value="bendahara">Bendahara</option>
                                    <option value="anggota">Anggota</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Level (optional)</label>
                                <input v-model="formData.position_level" type="text" placeholder="I, II, III"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                <p class="text-xs text-gray-500 mt-1">Untuk Sekretaris/Bendahara I, II, III</p>
                            </div>
                        </div>

                        <!-- Ex Officio & Display Order -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="flex items-center gap-2">
                                    <input v-model="formData.is_ex_officio" type="checkbox"
                                        class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]" />
                                    <span class="text-sm font-medium text-gray-700">Ex Officio (Jabatan Otomatis)</span>
                                </label>
                                <p class="text-xs text-gray-500 mt-1">Contoh: Romo sebagai Ketua/Wakil</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil <span
                                        class="text-red-500">*</span></label>
                                <input v-model.number="formData.display_order" type="number" required placeholder="0"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Period Dates -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                <input v-model="formData.period_start_date" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                <input v-model="formData.period_end_date" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Decree Info -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nomor SK</label>
                                <input v-model="formData.decree_number" type="text" placeholder="465/G.113/V/2025"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal SK</label>
                                <input v-model="formData.decree_date" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Notes -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                            <textarea v-model="formData.notes" rows="3" placeholder="Catatan tambahan..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="flex items-center gap-2">
                                <input v-model="formData.is_active" type="checkbox"
                                    class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]" />
                                <span class="text-sm font-medium text-gray-700">Status Aktif</span>
                            </label>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" @click="closeModal"
                                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button type="submit" :disabled="saving"
                                class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors disabled:opacity-50">
                                {{ saving ? 'Menyimpan...' : (modalMode === 'create' ? 'Tambah' : 'Simpan') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <ConfirmDialog v-if="showDeleteConfirm" title="Hapus Anggota BGKP?"
            :message="`Apakah Anda yakin ingin menghapus ${memberToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`"
            confirmText="Hapus" @confirm="deleteMember" @cancel="showDeleteConfirm = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from '#imports'

definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

// State
const members = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const showDeleteConfirm = ref(false)
const memberToDelete = ref<any>(null)
const currentPage = ref(1)
const pageLimit = 10

// Filters
const filters = ref({
    search: '',
    position_type: 'all',
    is_active: 'all',
    sort: 'display_order'
})

// Form Data
const formData = ref({
    id: null as number | null,
    name: '',
    position: '',
    position_type: 'anggota',
    position_level: '',
    is_ex_officio: false,
    display_order: 0,
    period_start_date: '',
    period_end_date: '',
    decree_number: '',
    decree_date: '',
    notes: '',
    is_active: true
})

// Computed - Filtered Members
const filteredMembers = computed(() => {
    let result = [...members.value]

    // Search filter
    if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        result = result.filter(m =>
            m.name.toLowerCase().includes(search) ||
            m.position.toLowerCase().includes(search)
        )
    }

    // Position type filter
    if (filters.value.position_type !== 'all') {
        result = result.filter(m => m.position_type === filters.value.position_type)
    }

    // Active filter
    if (filters.value.is_active !== 'all') {
        const isActive = filters.value.is_active === 'true'
        result = result.filter(m => m.is_active === isActive)
    }

    // Sort
    result.sort((a, b) => {
        if (filters.value.sort === 'display_order') {
            return (a.display_order || 0) - (b.display_order || 0)
        } else if (filters.value.sort === 'name') {
            return a.name.localeCompare(b.name)
        } else if (filters.value.sort === 'created_at') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return 0
    })

    return result
})

// Computed - displayed members for template
const displayedMembers = computed(() => filteredMembers.value)

const totalPages = computed(() => {
    const pages = Math.ceil(displayedMembers.value.length / pageLimit)
    return pages > 0 ? pages : 1
})

const paginatedMembers = computed(() => {
    const start = (currentPage.value - 1) * pageLimit
    return displayedMembers.value.slice(start, start + pageLimit)
})

const visiblePages = computed(() => {
    const pages: number[] = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + 4)

    for (let page = start; page <= end; page++) {
        pages.push(page)
    }

    return pages
})

const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
}

// Methods
const fetchMembers = async () => {
    try {
        loading.value = true
        error.value = ''

        const token = sessionStorage.getItem('admin_access_token')
        const response = await $fetch('/api/admin/bgkp', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }) as any

        if (response.success) {
            members.value = response.data
        }
    } catch (err: any) {
        console.error('Error fetching BGKP members:', err)
        error.value = err.message || 'Gagal memuat data anggota BGKP'
    } finally {
        loading.value = false
    }
}

const openCreateModal = () => {
    modalMode.value = 'create'
    formData.value = {
        id: null,
        name: '',
        position: '',
        position_type: 'anggota',
        position_level: '',
        is_ex_officio: false,
        display_order: members.value.length,
        period_start_date: '',
        period_end_date: '',
        decree_number: '',
        decree_date: '',
        notes: '',
        is_active: true
    }
    showModal.value = true
}

const editMember = (member: any) => {
    modalMode.value = 'edit'
    formData.value = {
        id: member.id,
        name: member.name,
        position: member.position,
        position_type: member.position_type,
        position_level: member.position_level || '',
        is_ex_officio: Boolean(member.is_ex_officio),
        display_order: member.display_order || 0,
        period_start_date: member.period_start_date || '',
        period_end_date: member.period_end_date || '',
        decree_number: member.decree_number || '',
        decree_date: member.decree_date || '',
        notes: member.notes || '',
        is_active: Boolean(member.is_active)
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const saveMember = async () => {
    try {
        saving.value = true
        error.value = ''

        const url = modalMode.value === 'create'
            ? '/api/admin/bgkp'
            : `/api/admin/bgkp/${formData.value.id}`

        const method = modalMode.value === 'create' ? 'POST' : 'PUT'

        const token = sessionStorage.getItem('admin_access_token')
        const response = await $fetch(url, {
            method,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData.value
        }) as any

        if (response.success) {
            await fetchMembers()
            closeModal()
        }
    } catch (err: any) {
        console.error('Error saving BGKP member:', err)
        error.value = err.message || 'Gagal menyimpan data anggota BGKP'
    } finally {
        saving.value = false
    }
}

const confirmDelete = (member: any) => {
    memberToDelete.value = member
    showDeleteConfirm.value = true
}

const deleteMember = async () => {
    try {
        const token = sessionStorage.getItem('admin_access_token')
        const response = await $fetch(`/api/admin/bgkp/${memberToDelete.value.id}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }) as any

        if (response.success) {
            await fetchMembers()
            showDeleteConfirm.value = false
            memberToDelete.value = null
        }
    } catch (err: any) {
        console.error('Error deleting BGKP member:', err)
        error.value = err.message || 'Gagal menghapus anggota BGKP'
    }
}

const getPositionTypeName = (type: string) => {
    const names: any = {
        'ketua': 'Ketua',
        'wakil_ketua': 'Wakil Ketua',
        'sekretaris': 'Sekretaris',
        'bendahara': 'Bendahara',
        'anggota': 'Anggota'
    }
    return names[type] || type
}

const getPositionTypeClass = (type: string) => {
    const classes: any = {
        'ketua': 'bg-[#882f1d] text-white',
        'wakil_ketua': 'bg-purple-100 text-purple-800',
        'sekretaris': 'bg-blue-100 text-blue-800',
        'bendahara': 'bg-green-100 text-green-800',
        'anggota': 'bg-gray-100 text-gray-800'
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Lifecycle
onMounted(() => {
    fetchMembers()
})

watch(
    () => [
        filters.value.search,
        filters.value.position_type,
        filters.value.is_active,
        filters.value.sort
    ],
    () => {
        currentPage.value = 1
    }
)

watch(totalPages, (pages: number) => {
    if (currentPage.value > pages) {
        currentPage.value = pages
    }
})
</script>
