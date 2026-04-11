<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Pengumuman Gereja</h1>
        <p class="text-gray-600 mt-1">Kelola pengumuman yang ditampilkan di beranda</p>
      </div>
      <button @click="openCreateModal"
        class="px-6 py-3 bg-[#882f1d] text-white rounded-lg hover:bg-[#6d2517] transition flex items-center gap-2 shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="font-medium">Tambah Pengumuman</span>
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="mb-4 flex flex-col md:flex-row gap-4">
      <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Cari pengumuman..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
    </div>

    <!-- Loading State -->
    <div v-if="loading && (!announcements || !announcements.length)" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d]"></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && (!announcements || !announcements.length)"
      class="text-center py-12 bg-gray-50 rounded-lg">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada pengumuman</h3>
      <p class="mt-2 text-gray-600">Mulai dengan menambahkan pengumuman baru</p>
    </div>

    <!-- Table - Desktop -->
    <div v-else class="hidden md:block bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acara</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="announcement in (Array.isArray(announcements) ? announcements : [])" :key="announcement?.id"
            class="hover:bg-gray-50">
            <td v-if="announcement" class="px-6 py-4">
              <div class="flex items-center">
                <img v-if="announcement.thumbnail" :src="announcement.thumbnail" :alt="announcement.title"
                  class="h-12 w-12 rounded-lg object-cover mr-3" />
                <div class="h-12 w-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center" v-else>
                  <span class="text-2xl">{{ announcement.activity_type === 'Sakramen' ? '✝️' : '📢' }}</span>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">{{ announcement.title }}</div>
                  <div class="text-sm text-gray-500 line-clamp-1">{{ announcement.description }}</div>
                  <div v-if="announcement.agenda_title"
                    class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ announcement.agenda_title }}
                  </div>
                </div>
              </div>
            </td>
            <td v-if="announcement" class="px-6 py-4 whitespace-nowrap">
              <span :class="announcement.activity_type === 'Sakramen'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
                " class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ announcement.activity_type || 'Kegiatan' }}
              </span>
            </td>
            <td v-if="announcement" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(announcement.event_date) }}
            </td>
            <td v-if="announcement" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatTime(announcement.event_time) }}
            </td>
            <td v-if="announcement" class="px-6 py-4 whitespace-nowrap">
              <span :class="announcement.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
                " class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ announcement.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td v-if="announcement" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openDetailModal(announcement)" class="text-blue-600 hover:text-blue-900 mr-3"
                title="Lihat Detail">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button @click="openEditModal(announcement)" class="text-indigo-600 hover:text-indigo-900 mr-3"
                title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="confirmDelete(announcement)" class="text-red-600 hover:text-red-900" title="Hapus">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards - Mobile -->
    <div class="md:hidden space-y-4">
      <template v-for="announcement in announcements" :key="announcement?.id">
        <div v-if="announcement" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-4">
            <div class="flex items-start gap-3 mb-3">
              <img v-if="announcement.thumbnail" :src="announcement.thumbnail" :alt="announcement.title"
                class="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
              <div class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0" v-else>
                <span class="text-3xl">{{ announcement.activity_type === 'Sakramen' ? '✝️' : '📢' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">{{ announcement.title }}</h3>
                <span :class="announcement.activity_type === 'Sakramen'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
                  " class="inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1">
                  {{ announcement.activity_type || 'Kegiatan' }}
                </span>
                <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ announcement.description }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm mb-3">
              <div class="flex items-center gap-4">
                <span class="text-gray-700">📅 {{ formatDate(announcement.event_date) }}</span>
                <span class="text-gray-700">🕐 {{ formatTime(announcement.event_time) }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span :class="announcement.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
                " class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ announcement.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
              <div class="flex gap-2">
                <button @click="openDetailModal(announcement)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button @click="openEditModal(announcement)"
                  class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="confirmDelete(announcement)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex justify-center">
      <nav class="flex items-center gap-2">
        <button @click="currentPage > 1 && loadAnnouncements(currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          ← Prev
        </button>
        <span class="px-4 py-2 text-gray-700">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button @click="currentPage < totalPages && loadAnnouncements(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          Next →
        </button>
      </nav>
    </div>

    <!-- Modal Create/Edit -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>

          <div
            class="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-900">
                {{ isEditMode ? 'Edit Pengumuman' : 'Tambah Pengumuman' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Acara *</label>
                <input v-model="formData.title" type="text" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
                  placeholder="Contoh: Misa Pembukaan Tahun Liturgi" />
              </div>

              <!-- Activity Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kegiatan *</label>
                <select v-model="formData.activity_type" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Sakramen">Sakramen</option>
                </select>
              </div>

              <!-- Link Agenda (opsional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Berdasarkan Agenda
                  <span class="text-gray-400 font-normal">(opsional)</span>
                </label>
                <select v-model="formData.agenda_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                  <option :value="null">— Tidak terkait agenda —</option>
                  <option v-for="ag in agendaOptions" :key="ag.id" :value="ag.id">
                    {{ ag.title }} ({{ formatDate(ag.start_date) }})
                  </option>
                </select>
                <p v-if="formData.agenda_id" class="mt-1 text-xs text-blue-600">
                  Pengumuman ini akan ditautkan ke agenda tersebut.
                </p>
              </div>

              <!-- Event Date & Time -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Acara *</label>
                  <input v-model="formData.event_date" type="date" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jam Acara *</label>
                  <input v-model="formData.event_time" type="time" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea v-model="formData.description" rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
                  placeholder="Deskripsi lengkap acara..."></textarea>
              </div>

              <!-- Thumbnail Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>

                <!-- Preview -->
                <div v-if="formData.thumbnail" class="mb-3">
                  <img :src="formData.thumbnail" alt="Preview"
                    class="h-32 w-auto rounded-lg border border-gray-300 object-cover" />
                  <button type="button" @click="formData.thumbnail = ''"
                    class="mt-2 text-sm text-red-600 hover:text-red-800">
                    Hapus gambar
                  </button>
                </div>

                <!-- File Upload -->
                <div>
                  <input ref="fileInput" type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    @change="handleFileUpload" class="hidden" />
                  <button type="button" @click="triggerFileInput" :disabled="uploading"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ uploading ? 'Mengupload...' : 'Upload dari Komputer' }}
                  </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Max 5MB. Format: JPEG, PNG, WEBP, GIF</p>
              </div>

              <!-- Display Order & Active Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampilan</label>
                  <input v-model.number="formData.display_order" type="number" min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"
                    placeholder="0" />
                </div>
                <div class="flex items-center pt-7">
                  <label class="flex items-center cursor-pointer">
                    <input v-model="formData.is_active" type="checkbox" class="mr-2 h-5 w-5 text-[#882f1d]" />
                    <span class="text-sm font-medium text-gray-700">Aktifkan Pengumuman</span>
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-4 border-t mt-4">
                <button type="button" @click="closeModal"
                  class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
                  Batal
                </button>
                <button type="submit" :disabled="submitting"
                  class="px-6 py-2.5 bg-[#882f1d] text-white rounded-lg hover:bg-[#6d2517] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md">
                  {{ submitting ? 'Menyimpan...' : (isEditMode ? 'Update' : 'Simpan') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Detail -->
    <Teleport to="body">
      <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeDetailModal">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeDetailModal"></div>

          <div
            class="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-900">Detail Pengumuman</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div v-if="selectedAnnouncement" class="space-y-4">
              <!-- Thumbnail -->
              <div v-if="selectedAnnouncement.thumbnail" class="w-full h-64 rounded-lg overflow-hidden">
                <img :src="selectedAnnouncement.thumbnail" :alt="selectedAnnouncement.title"
                  class="w-full h-full object-cover" />
              </div>

              <!-- Title -->
              <h2 class="text-2xl font-bold text-gray-900">{{ selectedAnnouncement.title }}</h2>

              <!-- Date & Time -->
              <div class="flex flex-wrap gap-4 text-gray-700">
                <div class="flex items-center gap-2">
                  <span class="text-xl">📅</span>
                  <span>{{ formatDate(selectedAnnouncement.event_date) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xl">🕐</span>
                  <span>{{ formatTime(selectedAnnouncement.event_time) }}</span>
                </div>
                <div>
                  <span :class="selectedAnnouncement.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    " class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ selectedAnnouncement.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div class="pt-4 border-t">
                <h3 class="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                <p class="text-gray-700 whitespace-pre-line">
                  {{ selectedAnnouncement.description || 'Tidak ada deskripsi' }}
                </p>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t mt-6">
              <button @click="closeDetailModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface Announcement {
  id: number
  title: string
  description?: string
  activity_type?: string
  thumbnail?: string
  event_date: string
  event_time: string
  is_active: boolean
  display_order: number
  agenda_id?: number | null
  agenda_title?: string | null
  created_at: string
  updated_at: string
}

interface AgendaOption {
  id: number
  title: string
  start_date: string
}

// State
const announcements = ref<Announcement[]>([])
const agendaOptions = ref<AgendaOption[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const route = useRoute()

// Modal states
const showModal = ref(false)
const showDetailModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const uploading = ref(false)
const selectedAnnouncement = ref<Announcement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Form data interface
interface FormData {
  id: number | null
  title: string
  description: string
  activity_type: string
  thumbnail: string
  event_date: string
  event_time: string
  is_active: boolean
  display_order: number
  agenda_id: number | null
}

// Form data
const formData = ref<FormData>({
  id: null,
  title: '',
  description: '',
  activity_type: 'Kegiatan',
  thumbnail: '',
  event_date: '',
  event_time: '',
  is_active: true,
  display_order: 0,
  agenda_id: null
})

// Load agenda options for dropdown (semua agenda, tidak cuma mendatang)
const loadAgendaOptions = async () => {
  try {
    const res = await $fetch<any>('/api/agenda/all')
    agendaOptions.value = (Array.isArray(res) ? res : (res.data || [])).map((a: any) => ({
      id: a.id,
      title: a.title,
      start_date: a.start_date
    }))
  } catch {
    agendaOptions.value = []
  }
}

// Load data
const loadAnnouncements = async (page = 1) => {
  loading.value = true
  try {
    const response = await $fetch<any>('/api/admin/announcements', {
      params: {
        page,
        limit: 20,
        search: searchQuery.value
      }
    })
    console.log('[Admin Announcements] Response:', response)
    announcements.value = response.data || []
    currentPage.value = response.page
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('Error loading announcements:', error)
    announcements.value = []
    alert('Gagal memuat data pengumuman')
  } finally {
    loading.value = false
  }
}

// Search handler with debounce
let searchTimeout: NodeJS.Timeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadAnnouncements(1)
  }, 500)
}

// File upload handler
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    alert('Tipe file tidak didukung. Gunakan JPEG, PNG, WEBP, atau GIF.')
    return
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert('Ukuran file terlalu besar. Maksimal 5MB.')
    return
  }

  uploading.value = true
  try {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const response = await $fetch<any>('/api/admin/announcements/upload', {
      method: 'POST',
      body: uploadFormData
    })

    if (response.success && response.url) {
      // Set thumbnail URL
      formData.value.thumbnail = response.url
      console.log('[Upload] Success:', response.url)
    }
  } catch (error: any) {
    console.error('[Upload] Error:', error)
    alert(error.data?.message || 'Gagal mengupload gambar')
  } finally {
    uploading.value = false
    // Reset input
    if (target) target.value = ''
  }
}

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Modal handlers
const openCreateModal = (prefill?: Partial<FormData>) => {
  isEditMode.value = false
  formData.value = {
    id: null,
    title: prefill?.title || '',
    description: prefill?.description || '',
    activity_type: 'Kegiatan',
    thumbnail: '',
    event_date: prefill?.event_date || '',
    event_time: prefill?.event_time || '',
    is_active: true,
    display_order: 0,
    agenda_id: prefill?.agenda_id || null
  }
  showModal.value = true
}

const openEditModal = (announcement: Announcement) => {
  isEditMode.value = true

  // Format event_date to YYYY-MM-DD for input type="date"
  let formattedDate = announcement.event_date
  if (formattedDate) {
    const date = new Date(formattedDate)
    formattedDate = date.toISOString().split('T')[0]
  }

  formData.value = {
    id: announcement.id,
    title: announcement.title,
    description: announcement.description || '',
    activity_type: announcement.activity_type || 'Kegiatan',
    thumbnail: announcement.thumbnail || '',
    event_date: formattedDate,
    event_time: announcement.event_time,
    is_active: announcement.is_active,
    display_order: announcement.display_order,
    agenda_id: announcement.agenda_id || null
  }
  showModal.value = true
}

const openDetailModal = (announcement: Announcement) => {
  selectedAnnouncement.value = announcement
  showDetailModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedAnnouncement.value = null
}

// Submit handler with optimistic update
const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditMode.value) {
      // Optimistic update
      const index = announcements.value.findIndex(a => a && a.id === formData.value.id)

      if (index === -1) {
        throw new Error('Pengumuman tidak ditemukan')
      }

      const oldData = { ...announcements.value[index] }

      if (formData.value.id) {
        announcements.value[index] = {
          ...announcements.value[index],
          title: formData.value.title,
          description: formData.value.description,
          activity_type: formData.value.activity_type,
          thumbnail: formData.value.thumbnail,
          event_date: formData.value.event_date,
          event_time: formData.value.event_time,
          is_active: formData.value.is_active,
          display_order: formData.value.display_order
        }
      }

      try {
        const { data } = await $fetch<any>(`/api/admin/announcements/${formData.value.id}`, {
          method: 'PUT',
          body: formData.value
        })
        // Update with server response
        if (data && data.data) {
          announcements.value[index] = data.data
        }
      } catch (error) {
        // Rollback on error
        announcements.value[index] = oldData
        throw error
      }
    } else {
      // Optimistic insert
      const tempId = Date.now()
      const optimisticItem: Announcement = {
        id: tempId,
        title: formData.value.title,
        description: formData.value.description,
        activity_type: formData.value.activity_type,
        thumbnail: formData.value.thumbnail,
        event_date: formData.value.event_date,
        event_time: formData.value.event_time,
        is_active: formData.value.is_active,
        display_order: formData.value.display_order,
        agenda_id: formData.value.agenda_id,
        agenda_title: agendaOptions.value.find(a => a.id === formData.value.agenda_id)?.title || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      announcements.value.unshift(optimisticItem)

      try {
        const response = await $fetch<any>('/api/admin/announcements', {
          method: 'POST',
          body: formData.value
        })
        // Replace temp item with real data
        const index = announcements.value.findIndex(a => a && a.id === tempId)
        if (index !== -1 && response && response.data) {
          announcements.value[index] = response.data
        }
      } catch (error) {
        // Remove temp item on error
        const index = announcements.value.findIndex(a => a && a.id === tempId)
        if (index !== -1) {
          announcements.value.splice(index, 1)
        }
        throw error
      }
    }

    closeModal()
  } catch (error: any) {
    console.error('Error saving announcement:', error)
    alert(error.data?.message || 'Gagal menyimpan pengumuman')
  } finally {
    submitting.value = false
  }
}

// Delete with optimistic update
const confirmDelete = async (announcement: Announcement) => {
  if (!confirm(`Yakin ingin menghapus pengumuman "${announcement.title}"?`)) return

  const index = announcements.value.findIndex(a => a.id === announcement.id)
  const oldData = [...announcements.value]

  // Optimistic delete
  if (index !== -1) {
    announcements.value.splice(index, 1)
  }

  try {
    await $fetch(`/api/admin/announcements/${announcement.id}`, {
      method: 'DELETE'
    })
  } catch (error) {
    // Rollback on error
    announcements.value = oldData
    console.error('Error deleting announcement:', error)
    alert('Gagal menghapus pengumuman')
  }
}

// Format helpers
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return '-'
  return timeStr.substring(0, 5) // HH:MM
}

// Initial load
onMounted(() => {
  loadAnnouncements()
  loadAgendaOptions()
  // Auto-open create modal dari shortcut halaman Agenda
  const { from_agenda, agenda_id, agenda_title, event_date, event_time } = route.query
  if (from_agenda) {
    openCreateModal({
      title: agenda_title ? String(agenda_title) : '',
      event_date: event_date ? String(event_date) : '',
      event_time: event_time ? String(event_time) : '',
      agenda_id: agenda_id ? Number(agenda_id) : null
    })
  }
})
</script>
