<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Pengelola Tema Hero</h1>
      <p class="text-sm sm:text-base text-gray-600">Kelola gambar hero section halaman depan</p>

      <!-- Image Guidelines -->
      <div class="mt-4 p-3.5 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-sm font-semibold text-blue-800 mb-2">Rekomendasi Ukuran Gambar Hero</h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li><strong>Lebar:</strong> 1920px (Full HD)</li>
          <li><strong>Tinggi:</strong> 1080px</li>
          <li><strong>Rasio:</strong> 16:9 (landscape)</li>
          <li><strong>Format:</strong> JPG atau WebP (untuk performa optimal)</li>
          <li><strong>Ukuran file:</strong> Maksimal 2MB</li>
        </ul>
        <h4 class="text-sm font-semibold text-blue-800 mt-3 mb-1">Alasan Rekomendasi</h4>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>Hero container menggunakan min-h-screen (100vh) dengan bg-cover</li>
          <li>Background position: center dengan cover scaling</li>
          <li>Responsivitas: Gambar akan di-crop otomatis untuk berbagai ukuran layar</li>
          <li>Performance: Gambar besar memastikan kualitas pada layar retina/high-DPI</li>
        </ul>
        <h4 class="text-sm font-semibold text-blue-800 mt-3 mb-1">Tips Upload</h4>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>Gunakan gambar horizontal dengan subjek di tengah</li>
          <li>Pastikan teks overlay masih terbaca dengan background apa pun</li>
          <li>Kompresi gambar tanpa kehilangan kualitas signifikan</li>
        </ul>
      </div>
    </div>

    <!-- Add Theme Button -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <button @click="showCreateModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors shadow-sm">
        + Tambah Tema Baru
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <p class="text-gray-500">Loading...</p>
    </div>

    <!-- Themes List -->
    <div v-else-if="themes.length > 0" class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Daftar Tema Hero</h2>
        <span class="text-xs text-gray-500 font-medium">{{ themes.length }} tema</span>
      </div>

      <!-- Mobile Card View (md:hidden) -->
      <div class="md:hidden space-y-3">
        <div 
          v-for="theme in themes" 
          :key="'card-' + theme.id"
          class="bg-white border rounded-xl p-3.5 shadow-sm transition-all"
          :class="theme.is_active ? 'border-green-300 ring-1 ring-green-200' : 'border-gray-200'"
        >
          <div class="flex gap-3 items-start">
            <!-- Thumbnail Image -->
            <div class="relative flex-shrink-0 group cursor-pointer" @click="openPreviewModal(theme)">
              <img 
                :src="resolveThemeImage(theme.image_path)"
                :alt="theme.name"
                class="w-24 h-16 object-cover rounded-lg shadow-xs border border-gray-100"
                @error="handleImageError"
              />
              <div class="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>

            <!-- Info & Status -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-gray-900 leading-snug break-words">{{ theme.name }}</h3>
              <div class="mt-1.5 flex items-center gap-2">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="theme.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="theme.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                  {{ theme.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons Horizontal Bar -->
          <div class="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-end gap-2">
            <button 
              v-if="!theme.is_active" 
              @click="activateTheme(theme.id)" 
              class="px-2.5 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Aktifkan</span>
            </button>
            <button 
              @click="openEditModal(theme)" 
              class="p-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
              title="Edit Tema"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2M4 20h4l10-10a2.828 2.828 0 00-4-4L4 16v4z" />
              </svg>
            </button>
            <button 
              @click="deleteTheme(theme.id)" 
              class="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              title="Hapus Tema"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table View (hidden md:block) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Preview</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="theme in themes" :key="theme.id" class="hover:bg-gray-50/70 transition-colors">
              <td class="px-4 py-3">
                <div class="relative group inline-block">
                  <img 
                    :src="resolveThemeImage(theme.image_path)"
                    :alt="theme.name"
                    class="w-24 h-16 object-cover rounded-lg shadow-xs cursor-pointer hover:shadow-md transition-shadow"
                    @click="openPreviewModal(theme)"
                    @error="handleImageError"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                    <svg class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 font-medium text-gray-900">{{ theme.name }}</td>
              <td class="px-4 py-3">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="theme.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="theme.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                  {{ theme.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button v-if="!theme.is_active" @click="activateTheme(theme.id)" title="Aktifkan" class="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded-md transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button @click="openEditModal(theme)" title="Edit" class="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded-md transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2M4 20h4l10-10a2.828 2.828 0 00-4-4L4 16v4z" />
                    </svg>
                  </button>
                  <button @click="deleteTheme(theme.id)" title="Hapus" class="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-md transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <p class="text-gray-500">Belum ada tema hero. Klik tombol "Tambah Tema Baru" untuk membuat tema pertama!</p>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Tambah Tema Baru</h3>
        <form @submit.prevent="createTheme" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Tema</label>
            <input v-model="newTheme.name" type="text" placeholder="Nama tema" class="w-full border border-gray-300 rounded-md px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
            <input type="file" @change="handleFileChange" accept="image/*" class="w-full border border-gray-300 rounded-md px-3 py-2" required />
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Edit Tema Hero</h3>
        <form @submit.prevent="updateTheme" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Tema</label>
            <input v-model="editTheme.name" type="text" placeholder="Nama tema" class="w-full border border-gray-300 rounded-md px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Saat Ini</label>
            <img
              :src="resolveThemeImage(editTheme.currentImage)"
              alt="Preview tema saat ini"
              class="w-full h-36 object-cover rounded border border-gray-200"
              @error="handleImageError"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ganti Gambar (Opsional)</label>
            <input type="file" @change="handleEditFileChange" accept="image/*" class="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeEditModal" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" @click="showPreviewModal = false">
      <div class="relative max-w-6xl w-full" @click.stop>
        <button 
          @click="showPreviewModal = false"
          class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="bg-white rounded-lg overflow-hidden shadow-2xl">
          <div class="p-4 bg-gray-50 border-b">
            <h3 class="text-lg font-semibold text-gray-900">{{ previewTheme?.name }}</h3>
            <p class="text-sm text-gray-600">
              Status: <span :class="previewTheme?.is_active ? 'text-green-600 font-medium' : 'text-gray-500'">
                {{ previewTheme?.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </p>
          </div>
          <div class="relative">
            <img 
              :src="resolveThemeImage(previewTheme?.image_path)"
              :alt="previewTheme?.name"
              class="w-full h-auto max-h-[70vh] object-contain"
              @error="handleImageError"
            />
          </div>
          <div class="p-4 bg-gray-50 border-t flex justify-between items-center">
            <div class="text-sm text-gray-600">
              <p>Dibuat: {{ formatDate(previewTheme?.created_at) }}</p>
            </div>
            <div class="space-x-2">
              <button
                @click="openEditModal(previewTheme); showPreviewModal = false"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit
              </button>
              <button 
                v-if="!previewTheme?.is_active"
                @click="activateTheme(previewTheme?.id); showPreviewModal = false"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Aktifkan
              </button>
              <button 
                @click="deleteTheme(previewTheme?.id); showPreviewModal = false"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50',
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const themes = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPreviewModal = ref(false)
const previewTheme = ref(null)
const newTheme = ref({ name: '', image: null })
const editTheme = ref({ id: null, name: '', image: null, currentImage: '' })
const toast = ref({ show: false, message: '', type: 'success' })
const fallbackThemeImage = '/images/gereja-stpaulus-hero.jpg'

// Toast notification function
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(async () => {
  await fetchThemes()
})

const fetchThemes = async () => {
  try {
    const response = await $fetch('/api/admin/hero-themes', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    themes.value = response.data
  } catch (error) {
    console.error('Error fetching themes:', error)
    showToast('Gagal memuat daftar tema', 'error')
  } finally {
    loading.value = false
  }
}

const handleFileChange = (event) => {
  newTheme.value.image = event.target.files[0]
}

const handleEditFileChange = (event) => {
  editTheme.value.image = event.target.files[0] || null
}

const normalizeThemeImagePath = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return ''
  }

  const cleaned = imagePath.trim().replace(/\\/g, '/')
  if (!cleaned) {
    return ''
  }

  if (/^https?:\/\//i.test(cleaned) || cleaned.startsWith('//')) {
    return cleaned
  }

  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

const resolveThemeImage = (imagePath) => {
  const normalized = normalizeThemeImagePath(imagePath)
  return normalized || fallbackThemeImage
}

const handleImageError = (event) => {
  const target = event?.target
  if (target && target.src !== fallbackThemeImage) {
    target.src = fallbackThemeImage
  }
}

const createTheme = async () => {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', newTheme.value.name)
    formData.append('image', newTheme.value.image)

    await $fetch('/api/admin/hero-themes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: formData
    })

    showCreateModal.value = false
    newTheme.value = { name: '', image: null }
    showToast('Tema berhasil ditambahkan')
    await fetchThemes()
  } catch (error) {
    console.error('Error creating theme:', error)
    showToast('Gagal menambahkan tema', 'error')
  } finally {
    loading.value = false
  }
}

const openEditModal = (theme) => {
  if (!theme) return

  editTheme.value = {
    id: theme.id,
    name: theme.name,
    image: null,
    currentImage: theme.image_path || ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editTheme.value = { id: null, name: '', image: null, currentImage: '' }
}

const updateTheme = async () => {
  if (!editTheme.value.id) {
    showToast('Tema tidak valid', 'error')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', editTheme.value.name)
    if (editTheme.value.image) {
      formData.append('image', editTheme.value.image)
    }

    await $fetch(`/api/admin/hero-themes/${editTheme.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: formData
    })

    showToast('Tema berhasil diperbarui')
    closeEditModal()
    await fetchThemes()
  } catch (error) {
    console.error('Error updating theme:', error)
    showToast('Gagal memperbarui tema', 'error')
  } finally {
    loading.value = false
  }
}

const activateTheme = async (themeId) => {
  // Save original state for rollback
  const originalThemes = themes.value.map(t => ({ ...t }))
  
  // Optimistic update - instant UI change
  themes.value = themes.value.map(t => ({
    ...t,
    is_active: t.id === themeId
  }))
  
  try {
    await $fetch(`/api/admin/hero-themes/${themeId}/activate`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    showToast('Tema berhasil diaktifkan')
  } catch (error) {
    // Rollback on error
    themes.value = originalThemes
    console.error('Error activating theme:', error)
    showToast('Gagal mengaktifkan tema', 'error')
  }
}

const deleteTheme = async (themeId) => {
  // Confirmation dialog
  if (!confirm('Apakah Anda yakin ingin menghapus tema ini?')) {
    return
  }
  
  // Optimistic update: Remove from UI immediately
  const index = themes.value.findIndex(t => t.id === themeId)
  const deletedTheme = index !== -1 ? { ...themes.value[index] } : null
  
  if (index !== -1) {
    themes.value.splice(index, 1)
  }
  
  try {
    await $fetch(`/api/admin/hero-themes/${themeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    showToast('Tema berhasil dihapus')
  } catch (error) {
    console.error('Error deleting theme:', error)
    showToast('Gagal menghapus tema', 'error')
    
    // Rollback: Re-add the deleted theme
    if (deletedTheme && index !== -1) {
      themes.value.splice(index, 0, deletedTheme)
    }
  }
}

const openPreviewModal = (theme) => {
  previewTheme.value = theme
  showPreviewModal.value = true
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}
</style>
