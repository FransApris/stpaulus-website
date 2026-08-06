<template>
  <div class="space-y-6">
    <!-- Add Category Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Tambah Kategori Pengguna Baru</h2>
      <form @submit.prevent="createCategory" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newCategory.name" type="text" placeholder="Nama Kategori (unik)" class="border p-2 rounded" required />
        <input v-model="newCategory.display_name" type="text" placeholder="Nama Tampilan" class="border p-2 rounded" required />
        <input v-model="newCategory.description" type="text" placeholder="Deskripsi" class="border p-2 rounded" />
        <input v-model.number="newCategory.display_order" type="number" placeholder="Urutan Tampilan" class="border p-2 rounded" />
        <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 md:col-span-2">
          {{ loading ? 'Membuat...' : 'Buat Kategori' }}
        </button>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- Categories List -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Daftar Kategori Pengguna</h2>
      <div v-if="categories.length === 0" class="text-gray-500">Belum ada kategori pengguna.</div>
      <div v-else>
        <div class="mb-3 text-sm text-gray-600">Total: {{ totalItems }} kategori</div>

        <!-- ── Desktop: Tabel standar (md ke atas) ── -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Tampilan</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Urutan</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kuota/Bulan</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in paginatedCategories" :key="category.id" class="border-t">
                <td class="px-4 py-2 text-sm">{{ category.name }}</td>
                <td class="px-4 py-2 text-sm">{{ category.display_name }}</td>
                <td class="px-4 py-2 text-sm">{{ category.description }}</td>
                <td class="px-4 py-2 text-sm">{{ category.display_order }}</td>
                <td class="px-4 py-2">
                  <span :class="category.is_active ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                    {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-4 py-2">
                  <span v-if="category.is_unlimited"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    ♾️ Unlimited
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    📅 {{ category.monthly_quota ?? 3 }}×/bln
                  </span>
                </td>
                <td class="px-4 py-2">
                  <button @click="editCategory(category)" title="Edit" class="text-blue-600 hover:text-blue-800 mr-2 p-1 inline-flex items-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="deleteCategory(category)" title="Hapus" class="text-red-600 hover:text-red-800 p-1 inline-flex items-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ── Mobile: Card layout (di bawah md) ── -->
        <div class="md:hidden space-y-3">
          <div v-for="category in paginatedCategories" :key="category.id"
            class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <!-- Header kartu: nama tampilan + badge status -->
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-semibold text-gray-900">{{ category.display_name }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ category.name }}</p>
              </div>
              <span :class="category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2">
                {{ category.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <!-- Detail rows -->
            <div class="space-y-1.5 text-sm border-t border-gray-100 pt-3">
              <div class="flex justify-between">
                <span class="text-gray-500">Deskripsi</span>
                <span class="text-gray-800 text-right max-w-[60%]">{{ category.description || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Urutan</span>
                <span class="text-gray-800">{{ category.display_order }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Kuota/Bulan</span>
                <span v-if="category.is_unlimited"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  ♾️ Unlimited
                </span>
                <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  📅 {{ category.monthly_quota ?? 3 }}×/bln
                </span>
              </div>
            </div>
            <!-- Tombol aksi -->
            <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button @click="editCategory(category)"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>
              <button @click="deleteCategory(category)"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Hapus
              </button>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-200 pt-4">
          <p class="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Halaman <span class="font-semibold text-gray-800">{{ currentPage }}</span> dari <span class="font-semibold text-gray-800">{{ totalPages }}</span>
          </p>
          <div class="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              class="px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
              <span class="sm:hidden">← Prev</span>
              <span class="hidden sm:inline">Sebelumnya</span>
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              class="min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 sm:px-3 flex items-center justify-center rounded-lg border text-xs sm:text-sm font-medium transition-colors shadow-sm"
              :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'">
              {{ page }}
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
              <span class="sm:hidden">Next →</span>
              <span class="hidden sm:inline">Berikutnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Edit Kategori Pengguna</h3>
        <form @submit.prevent="updateCategory" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="editingCategory.name" type="text" placeholder="Nama Kategori (unik)" class="border p-2 rounded" required />
          <input v-model="editingCategory.display_name" type="text" placeholder="Nama Tampilan" class="border p-2 rounded" required />
          <input v-model="editingCategory.description" type="text" placeholder="Deskripsi" class="border p-2 rounded" />
          <input v-model.number="editingCategory.display_order" type="number" placeholder="Urutan Tampilan" class="border p-2 rounded" />
          <div class="flex items-center">
            <input v-model="editingCategory.is_active" type="checkbox" class="mr-2" />
            <label>Aktif</label>
          </div>

          <!-- Quota Settings -->
          <div class="md:col-span-2 border-t pt-4">
            <h4 class="font-medium text-gray-700 mb-3">⚙️ Pengaturan Kuota Pemesanan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Unlimited Toggle -->
              <div class="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <input
                  id="edit-is-unlimited"
                  v-model="editingCategory.is_unlimited"
                  type="checkbox"
                  class="mt-1 w-4 h-4 accent-purple-600"
                />
                <div>
                  <label for="edit-is-unlimited" class="font-semibold text-purple-800 cursor-pointer">♾️ Kuota Unlimited</label>
                  <p class="text-xs text-purple-600 mt-0.5">Kategori ini tidak dibatasi jumlah pemesanan per bulan (cocok untuk DPP / BGKP)</p>
                </div>
              </div>

              <!-- Monthly Quota -->
              <div :class="editingCategory.is_unlimited ? 'opacity-40 pointer-events-none' : ''"
                   class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label class="block text-sm font-semibold text-blue-800 mb-1">📅 Batas Pemesanan/Bulan</label>
                <input
                  v-model.number="editingCategory.monthly_quota"
                  type="number"
                  min="1"
                  max="999"
                  class="border border-blue-300 p-2 rounded w-full text-sm"
                  :disabled="editingCategory.is_unlimited"
                />
                <p class="text-xs text-blue-600 mt-1">Jumlah booking maksimal per bulan kalender</p>
              </div>
            </div>
          </div>

          <div class="md:col-span-2 flex justify-end space-x-2">
            <button type="button" @click="closeEditModal" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" :disabled="editLoading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {{ editLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
        <p v-if="editMessage" class="mt-2 text-green-600">{{ editMessage }}</p>
        <p v-if="editError" class="mt-2 text-red-600">{{ editError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const categories = useState('admin-user-categories', () => [])
const newCategory = ref({
  name: '',
  display_name: '',
  description: '',
  display_order: 0
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Edit modal
const showEditModal = ref(false)
const editingCategory = ref({
  id: '',
  name: '',
  display_name: '',
  description: '',
  display_order: 0,
  is_active: true,
  is_unlimited: false,
  monthly_quota: 3
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')
const currentPage = useState('admin-user-categories-page', () => 1)
const pageLimit = 10

const totalItems = computed(() => categories.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return categories.value.slice(start, start + pageLimit)
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

// Load categories
const loadCategories = async () => {
  try {
    const data = await $fetch('/api/admin/user-categories', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    // Normalize is_active from MySQL TINYINT (1/0) to boolean
    // Normalize is_unlimited from MySQL TINYINT (1/0) to boolean
    categories.value = (Array.isArray(data) ? data : []).map(cat => ({
      ...cat,
      is_active   : Boolean(cat.is_active),
      is_unlimited: Boolean(cat.is_unlimited),
      monthly_quota: Number(cat.monthly_quota ?? 3)
    }))
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

onMounted(async () => {
  await loadCategories()
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

const createCategory = async () => {
  // Simpan data sebelum clear form
  const categoryData = { ...newCategory.value }
  
  loading.value = true
  message.value = ''
  error.value = ''
  
  // Clear form immediately for better UX
  newCategory.value = {
    name: '',
    display_name: '',
    description: '',
    display_order: 0
  }
  
  try {
    const result = await $fetch('/api/admin/user-categories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: categoryData
    })
    
    // Optimistic update - add to list immediately
    categories.value.unshift(result)
    
    setTimeout(() => {
      message.value = 'Kategori berhasil dibuat'
      setTimeout(() => { message.value = '' }, 3000)
    }, 100)
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal membuat kategori'
    // Rollback - reload on error
    await loadCategories()
  } finally {
    loading.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = {
    ...category,
    // MySQL TINYINT returns 1/0 (integer), must convert to boolean
    is_active   : Boolean(category.is_active),
    is_unlimited: Boolean(category.is_unlimited),
    monthly_quota: Number(category.monthly_quota ?? 3)
  }
  showEditModal.value = true
}

const deleteCategory = async (category) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${category.display_name}"?`)) {
    return
  }
  
  try {
    // Simpan index untuk rollback
    const index = categories.value.findIndex(c => c.id === category.id)
    const deletedCategory = categories.value[index]
    
    // Optimistic update - remove immediately
    categories.value = categories.value.filter(c => c.id !== category.id)
    
    await $fetch(`/api/admin/user-categories/${category.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    
    setTimeout(() => {
      alert('Kategori berhasil dihapus')
    }, 100)
  } catch (err) {
    // Rollback - restore to original position
    if (deletedCategory && index !== -1) {
      categories.value.splice(index, 0, deletedCategory)
    }
    alert('Gagal menghapus kategori: ' + (err.data?.statusMessage || 'Unknown error'))
  }
}

const updateCategory = async () => {
  // Simpan context sebelum close modal
  const categoryId = editingCategory.value.id
  const categoryData = { ...editingCategory.value }
  
  editLoading.value = true
  editMessage.value = ''
  editError.value = ''
  
  // Close modal immediately for better UX
  showEditModal.value = false
  
  try {
    const result = await $fetch(`/api/admin/user-categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: categoryData
    })
    
    // Optimistic update - update in list immediately
    // Normalisasi tipe data (MySQL TINYINT → boolean, quota → number)
    // agar konsisten dengan loadCategories()
    const index = categories.value.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      categories.value[index] = {
        ...result,
        is_active    : Boolean(result.is_active),
        is_unlimited : Boolean(result.is_unlimited),
        monthly_quota: Number(result.monthly_quota ?? 3)
      }
    }
    
    setTimeout(() => {
      editMessage.value = 'Kategori berhasil diperbarui'
      setTimeout(() => { editMessage.value = '' }, 3000)
    }, 100)
  } catch (err) {
    console.error('Failed to update category:', err)
    editError.value = err.data?.statusMessage || 'Gagal memperbarui kategori'
    
    // Rollback - reload on error
    await loadCategories()
  } finally {
    editLoading.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingCategory.value = {
    id: '',
    name: '',
    display_name: '',
    description: '',
    display_order: 0,
    is_active: true,
    is_unlimited: false,
    monthly_quota: 3
  }
  editMessage.value = ''
  editError.value = ''
}
</script>
