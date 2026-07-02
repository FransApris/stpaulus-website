<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 mb-1">Kelola Romo Bertugas</h1>
                <p class="text-gray-600">Manajemen data para romo yang bertugas di paroki</p>
            </div>
            <button @click="openCreateModal"
                class="bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Romo
            </button>
        </div>

        <!-- Filters & Search -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
                    <input v-model="filters.search" type="text" placeholder="Cari nama romo..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                    <select v-model="filters.position_type"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua Jabatan</option>
                        <option value="kepala_paroki">Kepala Paroki</option>
                        <option value="rekan">Rekan</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="filters.status"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="alumni">Alumni</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Visibilitas</label>
                    <select v-model="filters.is_visible"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua</option>
                        <option value="true">Visible</option>
                        <option value="false">Hidden</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Urutkan</label>
                    <select v-model="filters.sort"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="display_order">Urutan Tampil</option>
                        <option value="start_year">Tahun Mulai</option>
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

        <!-- Pastors Table -->
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jabatan
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa
                            Bertugas</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Urutan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visible</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="pastor in paginatedPastors" :key="pastor.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <img :src="pastor.photo_url || '/images/default-pastor.svg'" :alt="pastor.name"
                                class="w-12 h-12 rounded-full object-cover"
                                @error="(e) => { e.target.src = '/images/default-pastor.svg' }" />
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ pastor.name }}</div>
                            <div class="text-sm text-gray-500">{{ pastor.full_name }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                pastor.position_type === 'kepala_paroki'
                                    ? 'bg-[#882f1d] text-white'
                                    : 'bg-blue-100 text-blue-800'
                            ]">
                                {{ pastor.position_type === 'kepala_paroki' ? 'Kepala Paroki' : 'Rekan' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ pastor.start_year }} - {{ pastor.end_year || 'Sekarang' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                pastor.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ pastor.status === 'active' ? 'Aktif' : 'Alumni' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ pastor.display_order }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                pastor.is_visible
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                            ]">
                                {{ pastor.is_visible ? 'Ya' : 'Tidak' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button @click="editPastor(pastor)"
                                class="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="confirmDelete(pastor)"
                                class="text-red-600 hover:text-red-800 transition-colors" title="Hapus">
                                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="totalPages > 1" class="px-6 py-4 border-t flex items-center justify-between">
                <p class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }} • {{ totalItems }} romo</p>
                <div class="flex items-center gap-2">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                        Sebelumnya
                    </button>
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                        class="px-3 py-1 rounded border text-sm"
                        :class="page === currentPage ? 'bg-[#882f1d] text-white border-[#882f1d]' : 'hover:bg-gray-50'">
                        {{ page }}
                    </button>
                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                        Berikutnya
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="pastors.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500 mb-4">Belum ada data romo yang ditambahkan.</p>
                <button @click="openCreateModal"
                    class="inline-flex items-center gap-2 bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Romo Pertama
                </button>
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
                            {{ modalMode === 'create' ? 'Tambah Romo Baru' : 'Edit Romo' }}
                        </h2>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="savePastor" class="p-6 space-y-4">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap dengan Gelar <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.name" type="text" required
                                placeholder="Romo Andreas Budi Prasetyo, Pr"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                        </div>

                        <!-- Full Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap (tanpa
                                gelar)</label>
                            <input v-model="formData.full_name" type="text" placeholder="Andreas Budi Prasetyo"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                        </div>

                        <!-- Title & Position Type -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Gelar</label>
                                <input v-model="formData.title" type="text" placeholder="Pr, MSC, SJ"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Jabatan <span class="text-red-500">*</span>
                                </label>
                                <select v-model="formData.position_type" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option value="kepala_paroki">Kepala Paroki</option>
                                    <option value="rekan">Rekan</option>
                                </select>
                            </div>
                        </div>

                        <!-- Years -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Tahun Mulai <span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.start_year" type="text" required placeholder="2024"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tahun Selesai</label>
                                <input v-model="formData.end_year" type="text" placeholder="Sekarang atau 2025"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Status & Visibility -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select v-model="formData.status"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option value="active">Aktif</option>
                                    <option value="alumni">Alumni</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
                                <input v-model.number="formData.display_order" type="number" placeholder="0"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Photo URL with Upload -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Foto Pastor</label>

                            <!-- Preview Current Photo -->
                            <div v-if="formData.photo_url" class="mb-3">
                                <img :src="formData.photo_url" alt="Preview"
                                    class="h-32 w-32 object-cover rounded-lg border-2 border-gray-200" />
                            </div>

                            <!-- Upload Button -->
                            <div class="flex gap-2 mb-2">
                                <label class="flex-1">
                                    <input ref="photoInput" type="file" accept="image/*" @change="handlePhotoUpload"
                                        class="hidden" />
                                    <div
                                        class="w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                                        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        {{ uploadingPhoto ? 'Mengupload...' : 'Upload Foto' }}
                                    </div>
                                </label>
                                <button v-if="formData.photo_url" @click="formData.photo_url = ''" type="button"
                                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Manual URL Input (Optional) -->
                            <input v-model="formData.photo_url" type="text"
                                placeholder="/images/pastor-name.jpg atau URL eksternal"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent text-sm" />
                            <p class="text-xs text-gray-500 mt-1">Upload foto atau masukkan URL manual</p>
                        </div>

                        <!-- Bio -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Biografi</label>
                            <textarea v-model="formData.bio" rows="3" placeholder="Riwayat hidup singkat..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <!-- Quote -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kutipan/Motto</label>
                            <textarea v-model="formData.quote" rows="2"
                                placeholder="Kutipan favorit atau motto hidup..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <!-- Achievements -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pencapaian</label>
                            <textarea v-model="formData.achievements" rows="2"
                                placeholder="Pencapaian atau tanggung jawab khusus..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <!-- Contact -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input v-model="formData.email" type="email" placeholder="email@example.com"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                                <input v-model="formData.phone" type="text" placeholder="08123456789"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Birth Information -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                                <input v-model="formData.birth_place" type="text" placeholder="Yogyakarta"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                <input v-model="formData.birth_date" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Ordination Date -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Imamat (Tahbisan)</label>
                            <input v-model="formData.ordination_date" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            <p class="text-xs text-gray-500 mt-1">Tanggal ditahbiskan menjadi imam</p>
                        </div>

                        <!-- Visibility Toggle -->
                        <div class="flex items-center gap-2">
                            <input v-model="formData.is_visible" type="checkbox" id="is_visible"
                                class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]" />
                            <label for="is_visible" class="text-sm font-medium text-gray-700">
                                Tampilkan di halaman publik
                            </label>
                        </div>

                        <!-- Buttons -->
                        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button type="button" @click="closeModal"
                                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                Batal
                            </button>
                            <button type="submit" :disabled="saving"
                                class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                <span v-if="saving"
                                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {{ saving ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <ConfirmDialog v-if="showDeleteConfirm" title="Hapus Romo"
            :message="`Apakah Anda yakin ingin menghapus ${deleteTarget?.name}? Tindakan ini tidak dapat dibatalkan.`"
            confirm-text="Hapus" cancel-text="Batal" confirm-color="red" @confirm="deletePastor"
            @cancel="showDeleteConfirm = false" />

        <!-- Toast Notification -->
        <Teleport to="body">
            <Transition name="toast">
                <div v-if="toast.show" class="fixed bottom-4 right-4 z-[100000] max-w-sm">
                    <div :class="[
                        'rounded-lg shadow-lg px-6 py-4 flex items-center gap-3',
                        toast.type === 'success' ? 'bg-green-500 text-white' :
                            toast.type === 'error' ? 'bg-red-500 text-white' :
                                'bg-blue-500 text-white'
                    ]">
                        <!-- Icon -->
                        <svg v-if="toast.type === 'success'" class="w-6 h-6 flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <svg v-else-if="toast.type === 'error'" class="w-6 h-6 flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <svg v-else class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        <!-- Message -->
                        <span class="font-medium">{{ toast.message }}</span>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, watch } from '#imports'

definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

// State
const pastors = ref([])
const loading = ref(false)
const error = ref(null)
const saving = ref(false)
const currentPage = useState('admin-pastors-page', () => 1)
const pageLimit = 10

const totalItems = computed(() => pastors.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedPastors = computed(() => {
    const start = (currentPage.value - 1) * pageLimit
    return pastors.value.slice(start, start + pageLimit)
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

// Modal State
const showModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const formData = ref({})

// Delete State
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)

// Filters
const filters = ref({
    search: '',
    position_type: 'all',
    status: 'all',
    is_visible: 'all',
    sort: 'display_order'
})

// Photo Upload State
const uploadingPhoto = ref(false)
const photoInput = ref(null)

// Toast Notification State
const toast = ref({
    show: false,
    message: '',
    type: 'success' // 'success' | 'error' | 'info'
})

// Show toast helper
const showToast = (message, type = 'success', duration = 3000) => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, duration)
}

// Initialize empty form
const emptyForm = {
    name: '',
    full_name: '',
    title: '',
    position_type: 'kepala_paroki',
    start_year: '',
    end_year: '',
    status: 'alumni',
    photo_url: '',
    bio: '',
    quote: '',
    achievements: '',
    email: '',
    phone: '',
    birth_place: '',
    birth_date: '',
    ordination_date: '',
    display_order: 0,
    is_visible: true
}

// Fetch pastors
const fetchPastors = async () => {
    loading.value = true
    error.value = null

    try {
        const query = new URLSearchParams()
        if (filters.value.search) query.append('search', filters.value.search)
        if (filters.value.position_type !== 'all') query.append('position_type', filters.value.position_type)
        if (filters.value.status !== 'all') query.append('status', filters.value.status)
        if (filters.value.is_visible !== 'all') query.append('is_visible', filters.value.is_visible)
        if (filters.value.sort) query.append('sort', filters.value.sort)

        const response = await $fetch(`/api/admin/pastors?${query.toString()}`)
        pastors.value = response.data
    } catch (err) {
        error.value = err.message || 'Failed to fetch pastors'
        console.error('Error fetching pastors:', err)
    } finally {
        loading.value = false
    }
}

// Watch filters for changes
watch(filters, () => {
    currentPage.value = 1
    fetchPastors()
}, { deep: true })

watch(totalPages, (pageCount) => {
    if (currentPage.value > pageCount) {
        currentPage.value = pageCount
    }
})

// Handle Photo Upload
const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        alert('Tipe file tidak valid. Hanya JPEG, PNG, GIF, dan WebP yang diperbolehkan.')
        return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.')
        return
    }

    uploadingPhoto.value = true

    try {
        // Create FormData
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', 'pastors')

        // Upload
        const response = await $fetch('/api/admin/pastors/upload', {
            method: 'POST',
            body: formDataUpload
        })

        if (response.success && response.url) {
            formData.value.photo_url = response.url
            console.log('[Pastor Photo] Upload successful:', response.url)
        }
    } catch (err) {
        console.error('[Pastor Photo] Upload error:', err)
        alert('Gagal mengupload foto: ' + (err.message || 'Unknown error'))
    } finally {
        uploadingPhoto.value = false
        // Reset input
        if (photoInput.value) {
            photoInput.value.value = ''
        }
    }
}

// Modal actions
const openCreateModal = () => {
    formData.value = { ...emptyForm }
    modalMode.value = 'create'
    showModal.value = true
}

const editPastor = (pastor) => {
    formData.value = { ...pastor }
    modalMode.value = 'edit'
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    formData.value = { ...emptyForm }
}

// Save pastor (create or update) with Optimistic Update
const savePastor = async () => {
    saving.value = true

    // Store original data for rollback
    const originalPastors = [...pastors.value]
    const isEdit = modalMode.value === 'edit'
    const pastorId = formData.value.id
    const pastorName = formData.value.name

    // IMPORTANT: Clone formData before closing modal (which resets formData)
    const pastorData = { ...formData.value }

    try {
        // OPTIMISTIC UPDATE: Update UI immediately
        if (isEdit) {
            // Update existing pastor in list
            const index = pastors.value.findIndex(p => p.id === pastorId)
            if (index !== -1) {
                pastors.value[index] = { ...pastorData }
                console.log('[Pastor Update] Optimistic update applied')
            }
        } else {
            // Add new pastor to list (with temporary ID)
            const tempPastor = {
                ...pastorData,
                id: `temp-${Date.now()}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            pastors.value.unshift(tempPastor)
            pastors.value.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
            console.log('[Pastor Create] Optimistic add applied')
        }

        // Close modal immediately for better UX
        closeModal()

        // Show instant feedback
        showToast(
            isEdit ? `Memperbarui ${pastorName}...` : `Menambahkan ${pastorName}...`,
            'info',
            2000
        )

        // Now do the actual API call in background with cloned data
        let response
        if (isEdit) {
            response = await $fetch(`/api/admin/pastors/${pastorId}`, {
                method: 'PUT',
                body: pastorData
            })
        } else {
            response = await $fetch('/api/admin/pastors', {
                method: 'POST',
                body: pastorData
            })
        }

        // After API success, sync with real data
        if (!isEdit && response.data) {
            // Replace temp pastor with real data from server
            const tempIndex = pastors.value.findIndex(p => typeof p.id === 'string' && p.id.startsWith('temp-'))
            if (tempIndex !== -1) {
                pastors.value[tempIndex] = response.data
                pastors.value.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                console.log('[Pastor Create] Synced with server data')
            }
        } else {
            console.log('[Pastor Update] Server confirmed update')
        }

        // Show success toast
        showToast(
            isEdit ? `${pastorName} berhasil diperbarui!` : `${pastorName} berhasil ditambahkan!`,
            'success'
        )

    } catch (err) {
        // ROLLBACK on error
        console.error('[Pastor Save] Error, rolling back:', err)
        pastors.value = originalPastors

        // Show error toast
        showToast(
            'Gagal menyimpan: ' + (err.data?.message || err.message || 'Unknown error'),
            'error',
            5000
        )
    } finally {
        saving.value = false
    }
}

// Delete actions
const confirmDelete = (pastor) => {
    deleteTarget.value = pastor
    showDeleteConfirm.value = true
}

const deletePastor = async () => {
    const pastorId = deleteTarget.value.id
    const pastorName = deleteTarget.value.name

    // Store original data for rollback
    const originalPastors = [...pastors.value]

    // Close dialog immediately
    showDeleteConfirm.value = false

    try {
        // OPTIMISTIC UPDATE: Remove from UI immediately
        pastors.value = pastors.value.filter(p => p.id !== pastorId)
        console.log(`[Pastor Delete] Optimistic remove: ${pastorName}`)

        // Clear delete target
        deleteTarget.value = null

        // Show instant feedback
        showToast(`Menghapus ${pastorName}...`, 'info', 2000)

        // Do actual API call in background
        await $fetch(`/api/admin/pastors/${pastorId}`, {
            method: 'DELETE'
        })

        console.log(`[Pastor Delete] Server confirmed deletion: ${pastorName}`)

        // Show success toast
        showToast(`${pastorName} berhasil dihapus!`, 'success')

    } catch (err) {
        // ROLLBACK on error
        console.error('[Pastor Delete] Error, rolling back:', err)
        pastors.value = originalPastors

        // Show error toast
        showToast(
            'Gagal menghapus: ' + (err.data?.message || err.message || 'Unknown error'),
            'error',
            5000
        )
    }
}

// Initial fetch
onMounted(() => {
    fetchPastors()
})
</script>

<style scoped>
/* Smooth transitions for list updates */
.hover\:bg-gray-50:hover {
    transition: background-color 0.15s ease;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

/* Fade in animation for new items */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Fade out animation for deleted items */
@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }

    to {
        opacity: 0;
        transform: translateX(20px);
    }
}

/* Pending state for optimistic updates */
.pastor-row-pending {
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

/* Success state after API confirms */
.pastor-row-success {
    animation: pulse 0.5s ease;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
        background-color: rgba(34, 197, 94, 0.1);
    }
}

/* Modal transitions */
.modal-content {
    animation: modalSlideIn 0.2s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
