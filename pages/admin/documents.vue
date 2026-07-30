<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Dokumen</h1>
      <p class="text-gray-600">Kelola dokumen paroki dan unggah file baru</p>
    </div>

    <!-- Action Buttons -->
    <div class="mb-6 flex flex-wrap gap-2 items-center">
      <button
        @click="openModal()"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tambah Dokumen
      </button>

      <!-- Migrate to Cloud button -->
      <button
        @click="migrateToCloud"
        :disabled="migrating"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center"
        title="Pindahkan semua dokumen yang masih tersimpan di server lokal ke Cloudinary agar tidak hilang saat Railway restart"
      >
        <svg class="w-5 h-5 mr-2" :class="{ 'animate-spin': migrating }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
        {{ migrating ? 'Memigrasikan...' : 'Migrate ke Cloud' }}
      </button>

      <!-- Fix Document Permissions button -->
      <button
        @click="fixDocumentPermissions"
        :disabled="fixing"
        class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors duration-200 flex items-center"
        title="Perbaiki dokumen lama yang tidak bisa dibuka karena tersimpan dengan akses terbatas di Cloudinary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        {{ fixing ? 'Memperbaiki...' : 'Perbaiki Akses Dokumen' }}
      </button>

      <!-- Local docs warning badge -->
      <span v-if="localDocCount > 0" class="text-xs bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full px-3 py-1">
        ⚠ {{ localDocCount }} dokumen belum di cloud
      </span>
      <span v-else-if="documents.length > 0" class="text-xs bg-green-100 text-green-800 border border-green-300 rounded-full px-3 py-1">
        ✓ Semua dokumen sudah di Cloudinary
      </span>
    </div>

    <!-- Filter by Category -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Filter berdasarkan Kategori</label>
      <select
        v-model="selectedCategory"
        @change="fetchDocuments"
        class="rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
      >
        <option value="">Semua Kategori</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Documents Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-2 text-gray-600">Memuat dokumen...</p>
      </div>

      <div v-else-if="documents.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada dokumen</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai dengan mengunggah dokumen pertama.</p>
      </div>

      <div v-else class="w-full overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 min-w-[200px]">
                Judul
              </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ukuran
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal Upload
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Featured
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="document in paginatedDocuments" :key="document.id" class="hover:bg-gray-50">
            <td class="px-4 py-4 w-1/3 min-w-[200px]">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ document.title }}</div>
                
                <!-- Description with expand/collapse -->
                <div v-if="document.description" class="text-sm text-gray-500 mt-1">
                  <div v-if="isDescriptionExpanded(document.id)">
                    {{ document.description }}
                  </div>
                  <div v-else>
                    {{ truncateDescription(document.description, 80) }}
                  </div>
                  
                  <!-- Toggle button for long descriptions -->
                  <button
                    v-if="document.description && document.description.length > 80"
                    @click="toggleDescription(document.id)"
                    class="text-blue-600 hover:text-blue-800 text-xs mt-1 font-medium inline-flex items-center"
                  >
                    {{ isDescriptionExpanded(document.id) ? 'Sembunyikan' : 'Lihat Detail' }}
                    <svg 
                      class="w-3 h-3 ml-1 transition-transform"
                      :class="{ 'rotate-180': isDescriptionExpanded(document.id) }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
                
                <!-- No description indicator -->
                <div v-else class="text-xs text-gray-400 italic mt-1">
                  Tidak ada deskripsi
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 w-3 h-3 rounded mr-2" :style="{ backgroundColor: document.category_color }"></div>
                <span class="text-sm text-gray-900">{{ document.category_name }}</span>
              </div>
            </td>
            <td class="px-4 py-4 max-w-[200px]">
              <div class="text-sm text-gray-900 break-all" :title="document.original_filename">{{ document.original_filename }}</div>
              <div class="text-sm text-gray-500 whitespace-nowrap">{{ document.mime_type }}</div>
              <!-- Storage indicator -->
              <div class="mt-1">
                <span v-if="document.file_path && (document.file_path.startsWith('https://') || document.file_path.startsWith('http://'))" class="inline-flex items-center text-xs text-green-700 bg-green-50 rounded px-1.5 py-0.5">
                  ☁ Cloud
                </span>
                <span v-else class="inline-flex items-center text-xs text-yellow-700 bg-yellow-50 rounded px-1.5 py-0.5">
                  💾 Lokal
                </span>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{{ formatFileSize(document.file_size) }}</span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{{ formatDate(document.created_at) }}</span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  :checked="document.is_featured || false"
                  @change="toggleFeatured(document.id, $event.target.checked)"
                  class="rounded border-gray-300 text-[#882f1d] focus:ring-[#882f1d]"
                />
                <span class="ml-2 text-sm text-gray-900">Featured</span>
              </label>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="openModal(document)"
                title="Edit"
                class="text-blue-600 hover:text-blue-900 mr-3 p-1 inline-flex items-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="deleteDocument(document.id)"
                title="Hapus"
                class="text-red-600 hover:text-red-900 p-1 inline-flex items-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <div class="text-sm text-gray-500">
          Halaman {{ currentPage }} dari {{ totalPages }}
          ({{ (currentPage - 1) * pageLimit + 1 }}–{{ Math.min(currentPage * pageLimit, totalItems) }} dari {{ totalItems }})
        </div>
        <div class="flex items-center space-x-1">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100">
            ‹
          </button>
          <button v-for="p in visiblePages" :key="p" @click="goToPage(p)"
            :class="p === currentPage ? 'bg-[#882f1d] text-white border-[#882f1d]' : 'hover:bg-gray-100 border-gray-300'"
            class="px-3 py-1 rounded border text-sm min-w-[36px]">
            {{ p }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100">
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Dokumen' : 'Tambah Dokumen' }}
          </h3>

          <form @submit.prevent="saveDocument" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Judul Dokumen *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Masukkan judul dokumen"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                v-model="form.category_id"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
              >
                <option value="">Pilih Kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Deskripsi dokumen (opsional)"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                File Dokumen {{ !isEditing ? '*' : '(Opsional - kosongkan jika tidak ingin mengubah)' }}
              </label>
              <input
                ref="fileInput"
                type="file"
                @change="handleFileChange"
                :required="!isEditing"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              />
              <p class="mt-1 text-sm text-gray-500">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, JPEG, PNG
              </p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-[#882f1d] border border-transparent rounded-md hover:bg-[#6b2416] disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const documents = useState('admin-documents', () => [])
const categories = useState('admin-document-categories-docs', () => [])
const loading = ref(false)
const migrating = ref(false)
const showModal = ref(false)

const localDocCount = computed(() =>
  documents.value.filter(d => d.file_path && !d.file_path.startsWith('http')).length
)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref(null)
const selectedCategory = ref('')
const fileInput = ref(null)
const expandedDescriptions = ref(new Set()) // Track expanded descriptions
let fetchDocumentsSeq = 0 // race condition guard

// Pagination state (client-side)
const currentPage = ref(1)
const pageLimit = 20
const totalItems = computed(() => documents.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(documents.value.length / pageLimit)))
const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return documents.value.slice(start, start + pageLimit)
})
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const form = ref({
  title: '',
  description: '',
  category_id: '',
  file: null
})

// Helper functions for description display
const toggleDescription = (docId) => {
  if (expandedDescriptions.value.has(docId)) {
    expandedDescriptions.value.delete(docId)
  } else {
    expandedDescriptions.value.add(docId)
  }
  // Force reactivity update
  expandedDescriptions.value = new Set(expandedDescriptions.value)
}

const isDescriptionExpanded = (docId) => {
  return expandedDescriptions.value.has(docId)
}

const truncateDescription = (text, maxLength = 80) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      navigateTo('/admin')
      return
    }

    const response = await $fetch('/api/admin/document-categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    
    // Handle token errors
    if (error.statusCode === 401 || error.data?.message?.includes('token')) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      navigateTo('/admin')
    }
  }
}

// Fetch documents
const fetchDocuments = async () => {
  const mySeq = ++fetchDocumentsSeq
  const hasCache = documents.value.length > 0
  if (!hasCache) loading.value = true
  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      navigateTo('/admin')
      return
    }

    const categoryParam = selectedCategory.value ? `?category_id=${selectedCategory.value}` : ''
    const response = await $fetch(`/api/admin/documents${categoryParam}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    // Only update if this is still the latest request
    if (mySeq === fetchDocumentsSeq) {
      documents.value = response
    }
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    
    // Handle token errors
    if (error.statusCode === 401 || error.data?.message?.includes('token')) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      navigateTo('/admin')
    } else if (!hasCache) {
      alert('Gagal memuat dokumen')
    }
  } finally {
    if (mySeq === fetchDocumentsSeq) {
      loading.value = false
    }
  }
}

// Modal functions
const openModal = (document = null) => {
  if (document) {
    isEditing.value = true
    editingId.value = document.id
    form.value = {
      title: document.title,
      description: document.description || '',
      category_id: document.category_id,
      file: null
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = {
      title: '',
      description: '',
      category_id: '',
      file: null
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    title: '',
    description: '',
    category_id: '',
    file: null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Handle file change
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.file = file
  }
}

// Save document
const saveDocument = async () => {
  saving.value = true
  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    console.log('Token from localStorage:', token ? 'EXISTS' : 'MISSING')
    
    if (!token) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      navigateTo('/admin')
      return
    }

    if (isEditing.value) {
      // For UPDATE: Send JSON (PUT expects JSON body)
      await $fetch(`/api/admin/documents/${editingId.value}`, {
        method: 'PUT',
        body: {
          title: form.value.title,
          description: form.value.description || '',
          category_id: parseInt(form.value.category_id)
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    } else {
      // For CREATE: Send FormData (POST needs file upload)
      const formData = new FormData()
      formData.append('title', form.value.title)
      formData.append('description', form.value.description || '')
      formData.append('category_id', form.value.category_id)

      if (form.value.file) {
        formData.append('file', form.value.file)
      }

      console.log('Sending POST with Authorization:', `Bearer ${token.substring(0, 20)}...`)

      await $fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }

    alert(isEditing.value ? 'Dokumen berhasil diupdate' : 'Dokumen berhasil ditambahkan')
    closeModal()
    
    // Add small delay to ensure database commit completed
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Fetch with cache busting to get fresh data
    await fetchDocuments()
  } catch (error) {
    console.error('Failed to save document:', error)
    
    // Handle token errors
    if (error.statusCode === 401 || error.data?.message?.includes('token')) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      navigateTo('/admin')
      return
    }
    
    alert(error.data?.message || 'Gagal menyimpan dokumen')
  } finally {
    saving.value = false
  }
}

// Delete document
const deleteDocument = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
    return
  }

  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      navigateTo('/admin')
      return
    }

    await $fetch(`/api/admin/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    alert('Dokumen berhasil dihapus')
    // Update local state to remove the deleted document immediately
    documents.value = documents.value.filter(doc => doc.id !== id)
  } catch (error) {
    console.error('Failed to delete document:', error)
    
    // Handle token errors
    if (error.statusCode === 401 || error.data?.message?.includes('token')) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      navigateTo('/admin')
      return
    }
    
    alert(error.data?.message || 'Gagal menghapus dokumen')
  }
}

// Download document
const downloadDocument = async (document) => {
  try {
    const response = await $fetch(`/api/admin/documents/${document.id}/download`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', document.original_filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Failed to download document:', error)
    alert('Gagal mengunduh dokumen')
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID')
}

// Toggle featured status
const toggleFeatured = async (id, isFeatured) => {
  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      navigateTo('/admin')
      return
    }

    await $fetch(`/api/admin/documents/${id}/toggle-featured`, {
      method: 'PUT',
      body: { is_featured: isFeatured },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // Update local state
    const doc = documents.value.find(d => d.id === id)
    if (doc) {
      doc.is_featured = isFeatured
    }
  } catch (error) {
    console.error('Failed to toggle featured status:', error)
    
    // Handle token errors
    if (error.statusCode === 401 || error.data?.message?.includes('token')) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      navigateTo('/admin')
      return
    }
    
    alert('Gagal mengubah status featured')
    // Revert checkbox
    fetchDocuments()
  }
}

// Migrate local documents to Cloudinary
const fixing = ref(false)

// Fix existing documents yang berstatus 'authenticated' di Cloudinary agar bisa diakses publik
const fixDocumentPermissions = async () => {
  if (!confirm('Perbaiki semua dokumen yang tidak bisa dibuka? Proses ini akan mengubah setting akses di Cloudinary.')) return

  fixing.value = true
  try {
    const token = sessionStorage.getItem('admin_access_token')
    const result = await $fetch('/api/admin/fix-document-permissions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token }
    })

    let msg = result.message + '\n'
    if (result.results && result.results.length) {
      const fixed = result.results.filter(r => r.status === 'fixed')
      const failed = result.results.filter(r => r.status === 'failed')
      if (fixed.length) msg += '\nBerhasil: ' + fixed.map(r => r.filename).join(', ')
      if (failed.length) msg += '\nGagal: ' + failed.map(r => r.filename + ' (' + r.error + ')').join(', ')
    }
    alert(msg)
    await fetchDocuments()
  } catch (error) {
    const msg = error?.data?.statusMessage || error?.data?.message || error?.message || 'Gagal memperbaiki akses dokumen'
    alert('Error: ' + msg)
  } finally {
    fixing.value = false
  }
}

const migrateToCloud = async () => {
  if (localDocCount.value === 0) {
    alert('Semua dokumen sudah tersimpan di Cloudinary.')
    return
  }
  if (!confirm(`Migrasi ${localDocCount.value} dokumen dari server lokal ke Cloudinary? Proses ini tidak bisa dibatalkan.`)) return

  migrating.value = true
  try {
    const token = sessionStorage.getItem('admin_access_token')
    const result = await $fetch('/api/admin/documents/migrate-to-cloud', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    alert(result.message)
    await fetchDocuments()
  } catch (error) {
    const msg = error?.data?.message || error?.message || 'Gagal melakukan migrasi'
    alert(`Error: ${msg}`)
  } finally {
    migrating.value = false
  }
}

// Initialize
onMounted(async () => {
  const token = sessionStorage.getItem('admin_access_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await Promise.all([fetchCategories(), fetchDocuments()])
})

// Reset to page 1 when category filter changes
watch(selectedCategory, () => {
  currentPage.value = 1
})
</script>
