<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Kategori Agenda</h1>
      <p class="text-gray-600">Kelola kategori untuk mengorganisir agenda paroki</p>
    </div>

    <!-- Search Bar & Add Button -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="text"
          placeholder="Cari kategori..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm"
        />
        <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button @click="clearSearch" class="text-gray-400 hover:text-gray-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Add Button -->
      <button
        @click="openModal()"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center whitespace-nowrap"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tambah Kategori
      </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-2 text-gray-600">Memuat kategori...</p>
      </div>

      <div v-else-if="categories.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ searchQuery ? 'Kategori tidak ditemukan' : 'Belum ada kategori' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery ? `Tidak ada kategori yang cocok dengan "${searchQuery}"` : 'Mulai dengan membuat kategori pertama untuk mengorganisir agenda.' }}
        </p>
        <div v-if="!searchQuery" class="mt-6">
          <button
            @click="openModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#882f1d] hover:bg-[#6b2416] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d]"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Tambah Kategori Pertama
          </button>
        </div>
        <div v-else class="mt-6">
          <button
            @click="clearSearch"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Hapus Pencarian
          </button>
        </div>
      </div>

      <div v-else>
        <div class="px-6 py-3 bg-gray-50 border-b">
            <span class="text-sm text-gray-600">Total: <span class="font-semibold">{{ totalItems }}</span> kategori</span>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  @click="sortBy('name')"
                  class="flex items-center gap-1 hover:text-[#882f1d] transition-colors"
                >
                  Nama Kategori
                  <span v-if="sortField === 'name'" class="text-[#882f1d]">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                  <span v-else class="text-gray-400">⇅</span>
                </button>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warna
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Digunakan
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-4 h-4 rounded mr-3" :style="{ backgroundColor: category.color }"></div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                    <div class="text-sm text-gray-500">{{ category.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ category.color }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ category.description || '-' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ category.agenda_count || 0 }} agenda
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openPreview(category)"
                  :disabled="deleting === category.id"
                  class="text-[#882f1d] hover:text-[#6b2416] mr-3 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                  title="Lihat Preview"
                >
                  <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="openModal(category)"
                  :disabled="deleting === category.id"
                  title="Edit"
                  class="text-[#882f1d] hover:text-[#6b2416] mr-3 disabled:opacity-50 disabled:cursor-not-allowed p-1 inline-flex items-center"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="showDeleteConfirm(category)"
                  :disabled="deleting === category.id"
                  :title="deleting === category.id ? 'Menghapus...' : 'Hapus'"
                  class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed p-1 inline-flex items-center"
                >
                  <svg class="w-5 h-5" :class="deleting === category.id ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="totalPages > 1" class="px-6 py-4 border-t flex items-center justify-between">
          <p class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }}</p>
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
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="showPreview && previewCategory"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closePreview"
    >
      <div class="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-lg bg-white" @click.stop>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Preview Kategori</h3>
          <button @click="closePreview" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Badge Preview -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-600 mb-2">Badge Preview:</label>
          <div class="flex flex-wrap gap-2">
            <span 
              :style="{ 
                backgroundColor: previewCategory.color, 
                color: getContrastColor(previewCategory.color) 
              }"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
            >
              {{ previewCategory.name }}
            </span>
          </div>
        </div>

        <!-- Details -->
        <dl class="space-y-3">
          <div>
            <dt class="text-sm font-medium text-gray-600">Nama Kategori:</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ previewCategory.name }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-600">Slug:</dt>
            <dd class="mt-1 text-sm text-gray-500">{{ previewCategory.slug }}</dd>
          </div>
          <div v-if="previewCategory.description">
            <dt class="text-sm font-medium text-gray-600">Deskripsi:</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ previewCategory.description }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-600">Warna:</dt>
            <dd class="mt-1 flex items-center gap-2">
              <div class="w-6 h-6 rounded border" :style="{ backgroundColor: previewCategory.color }"></div>
              <span class="text-sm text-gray-900">{{ previewCategory.color }}</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-600">Digunakan di:</dt>
            <dd class="mt-1">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ previewCategory.agenda_count || 0 }} agenda
              </span>
            </dd>
          </div>
        </dl>

        <!-- Actions -->
        <div class="mt-6 flex gap-2 justify-end">
          <button
            @click="editCategory(previewCategory); closePreview()"
            class="px-4 py-2 bg-[#882f1d] text-white rounded-md hover:bg-[#6b2416] transition-colors"
          >
            Edit Kategori
          </button>
          <button
            @click="closePreview"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Tutup
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
            {{ isEditing ? 'Edit Kategori' : 'Tambah Kategori' }}
          </h3>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Kategori *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Warna Kategori *
              </label>
              
              <!-- Color Presets -->
              <div class="grid grid-cols-8 gap-2 mb-3">
                <button
                  v-for="color in colorPresets"
                  :key="color"
                  type="button"
                  @click="form.color = color"
                  :class="[
                    'w-8 h-8 rounded border-2 transition-all',
                    form.color === color 
                      ? 'border-gray-900 ring-2 ring-offset-2 ring-[#882f1d]' 
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  :style="{ backgroundColor: color }"
                  :title="color"
                />
              </div>
              
              <!-- Custom Color Picker -->
              <div class="flex items-center space-x-2">
                <input
                  v-model="form.color"
                  type="color"
                  required
                  class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  v-model="form.color"
                  type="text"
                  required
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                  placeholder="#FF5733"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Deskripsi kategori (opsional)"
              ></textarea>
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
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#882f1d] border border-transparent rounded-md hover:bg-[#6b2416] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg 
                  v-if="saving" 
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ saving ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :show="confirmDelete.show"
      title="Hapus Kategori"
      :message="`Apakah Anda yakin ingin menghapus kategori '${confirmDelete.categoryName}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @confirm="deleteCategory"
      @cancel="cancelDelete"
    />

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
  layout: 'admin',
  middleware: 'auth'
})

const categories = useState('admin-agenda-categories', () => [])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref(null)
const deleting = ref(null)

// Search state
const searchQuery = ref('')

// Preview state
const showPreview = ref(false)
const previewCategory = ref(null)

// Confirm dialog state
const confirmDelete = ref({
  show: false,
  categoryId: null,
  categoryName: ''
})

// Toast notification state
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Sorting state
const sortField = ref('name')
const sortOrder = ref('asc')
const currentPage = useState('admin-agenda-categories-page', () => 1)
const pageLimit = 10

// Color presets
const colorPresets = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#6366F1', '#84CC16', '#F43F5E', '#06B6D4',
  '#A855F7', '#22C55E', '#EAB308', '#DC2626'
]

const form = ref({
  name: '',
  color: '#6B7280',
  description: ''
})

// Show toast notification
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Sorted categories computed property
const sortedCategories = computed(() => {
  if (!categories.value || categories.value.length === 0) return []
  
  const sorted = [...categories.value].sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]
    
    // Handle null/undefined values
    if (!aValue) aValue = ''
    if (!bValue) bValue = ''
    
    // Convert to lowercase for case-insensitive sorting
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()
    
    // Compare
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
})

const totalItems = computed(() => sortedCategories.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return sortedCategories.value.slice(start, start + pageLimit)
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

// Sort function
const sortBy = (field) => {
  if (sortField.value === field) {
    // Toggle order if same field
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New field - reset to ascending
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

watch([sortField, sortOrder], () => {
  currentPage.value = 1
})

// Fetch categories
let searchTimeout = null

const fetchCategories = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    const response = await $fetch(`/api/admin/agenda/categories?${params}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    showToast('Gagal memuat kategori', 'error')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openModal = (category = null) => {
  if (category) {
    isEditing.value = true
    editingId.value = category.id
    form.value = {
      name: category.name,
      color: category.color,
      description: category.description || ''
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = {
      name: '',
      color: '#6B7280',
      description: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    name: '',
    color: '#6B7280',
    description: ''
  }
}

// Save category
const saveCategory = async () => {
  saving.value = true
  
  // Simpan context sebelum optimistic update
  const wasEditing = isEditing.value
  const currentEditingId = editingId.value
  const formData = { ...form.value }
  const originalCategories = [...categories.value]
  
  try {
    // Close modal immediately for better UX
    closeModal()
    
    // Optimistic update - Update UI FIRST
    if (wasEditing) {
      // Update existing category optimistically
      const index = categories.value.findIndex(c => c.id === currentEditingId)
      if (index !== -1) {
        categories.value[index] = {
          ...categories.value[index],
          ...formData,
          slug: formData.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }
      }
    } else {
      // Add new category optimistically (with temporary ID)
      const tempId = Date.now()
      const optimisticCategory = {
        id: tempId,
        ...formData,
        slug: formData.name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      categories.value.unshift(optimisticCategory)
    }

    // Now make API call
    const url = wasEditing
      ? `/api/admin/agenda/categories/${currentEditingId}`
      : '/api/admin/agenda/categories'
    const method = wasEditing ? 'PUT' : 'POST'

    const result = await $fetch(url, {
      method,
      body: formData,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    // Replace optimistic data with real data from server
    if (wasEditing) {
      const index = categories.value.findIndex(c => c.id === currentEditingId)
      if (index !== -1) {
        categories.value[index] = result
      }
    } else {
      // Replace temp category with real one
      const tempIndex = categories.value.findIndex(c => c.id >= Date.now() - 1000)
      if (tempIndex !== -1) {
        categories.value[tempIndex] = result
      }
    }

    showToast(wasEditing ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan', 'success')
  } catch (error) {
    console.error('Failed to save category:', error)
    
    // Rollback on error
    categories.value = originalCategories
    
    // Show specific error message
    let errorMessage = 'Gagal menyimpan kategori'
    if (error.statusCode === 400) {
      errorMessage = error.statusMessage || errorMessage
    }
    
    showToast(errorMessage, 'error')
  } finally {
    saving.value = false
  }
}

// Delete category
const showDeleteConfirm = (category) => {
  confirmDelete.value = {
    show: true,
    categoryId: category.id,
    categoryName: category.name
  }
}

const cancelDelete = () => {
  confirmDelete.value = {
    show: false,
    categoryId: null,
    categoryName: ''
  }
}

const deleteCategory = async () => {
  const id = confirmDelete.value.categoryId
  
  // Close dialog
  cancelDelete()
  
  // Set deleting state
  deleting.value = id
  
  // Save for rollback
  const index = categories.value.findIndex(c => c.id === id)
  const deletedCategory = categories.value[index]
  const originalCategories = [...categories.value]
  
  // Optimistic update - remove from UI immediately
  categories.value = categories.value.filter(c => c.id !== id)

  try {
    await $fetch(`/api/admin/agenda/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    showToast('Kategori berhasil dihapus', 'success')
  } catch (error) {
    console.error('Failed to delete category:', error)
    
    // Rollback on error
    categories.value = originalCategories
    
    let errorMessage = 'Gagal menghapus kategori'
    if (error.statusCode === 400) {
      errorMessage = error.statusMessage || 'Kategori sedang digunakan oleh agenda'
    }
    
    showToast(errorMessage, 'error')
  } finally {
    deleting.value = null
  }
}

// Search functions
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchCategories()
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  fetchCategories()
}

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

// Preview functions
const openPreview = (category) => {
  previewCategory.value = category
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  previewCategory.value = null
}

const editCategory = (category) => {
  openModal(category)
}

// Get contrast color for badge text
const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Initialize
onMounted(async () => {
  const token = sessionStorage.getItem('admin_access_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await fetchCategories()
})
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
