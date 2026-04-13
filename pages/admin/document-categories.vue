<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Kategori Dokumen</h1>
      <p class="text-gray-600">Kelola kategori untuk mengorganisir dokumen paroki</p>
    </div>

    <!-- Add Category Button -->
    <div class="mb-6">
      <button
        @click="openModal()"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada kategori</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat kategori pertama.</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Kategori
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Warna
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deskripsi
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Urutan
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50">
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
              <span class="text-sm text-gray-900">{{ category.display_order }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="openModal(category)"
                title="Edit"
                class="text-[#882f1d] hover:text-[#6b2416] mr-3 p-1 inline-flex items-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="deleteCategory(category.id)"
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
      <div v-if="totalPages > 1" class="border-t bg-white px-6 py-4 flex items-center justify-between">
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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Urutan Tampilan
              </label>
              <input
                v-model.number="form.display_order"
                type="number"
                min="0"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="0"
              />
            </div>

            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Aktif
              </label>
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
  layout: 'admin',
  middleware: 'auth'
})

const categories = useState('admin-document-categories', () => [])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref(null)
const currentPage = useState('admin-document-categories-page', () => 1)
const pageLimit = 10

const totalPages = computed(() => Math.max(1, Math.ceil(categories.value.length / pageLimit)))
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

const form = ref({
  name: '',
  color: '#6B7280',
  description: '',
  display_order: 0,
  is_active: true
})

// Fetch categories
const fetchCategories = async () => {
  const hasCache = categories.value.length > 0
  if (!hasCache) loading.value = true
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
    } else if (!hasCache) {
      alert('Gagal memuat kategori')
    }
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
      description: category.description || '',
      display_order: category.display_order || 0,
      is_active: category.is_active
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = {
      name: '',
      color: '#6B7280',
      description: '',
      display_order: 0,
      is_active: true
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    name: '',
    color: '#6B7280',
    description: '',
    display_order: 0,
    is_active: true
  }
}

// Save category
const saveCategory = async () => {
  saving.value = true
  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      navigateTo('/admin')
      return
    }

    const url = isEditing.value
      ? `/api/admin/document-categories/${editingId.value}`
      : '/api/admin/document-categories'

    const method = isEditing.value ? 'PUT' : 'POST'

    // Simpan semua context SEBELUM close modal (termasuk form data!)
    const currentEditingId = editingId.value
    const wasEditing = isEditing.value
    const formData = { ...form.value }  // Clone form data
    
    // Close modal immediately for better UX
    closeModal()
    
    const result = await $fetch(url, {
      method,
      body: formData,  // Gunakan formData yang sudah disimpan
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // Optimistic update - langsung update state tanpa tunggu fetch
    if (wasEditing) {
      const index = categories.value.findIndex(c => c.id === currentEditingId)
      console.log('🔄 Updating category at index:', index, 'with result:', result)
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...result }
        console.log('✅ Category updated successfully in UI')
      }
    } else {
      console.log('➕ Adding new category:', result)
      categories.value.push(result)
      // Sort by display_order after insert
      categories.value.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      console.log('✅ New category added to UI')
    }

    // Show success notification after update
    setTimeout(() => {
      alert(wasEditing ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan')
    }, 100)
  } catch (error) {
    console.error('Failed to save category:', error)
    
    // Handle token errors
    if (error.statusCode === 401 || error.data?.message?.includes('token')) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      navigateTo('/admin')
      return
    }
    
    alert(error.data?.message || 'Gagal menyimpan kategori')
  } finally {
    saving.value = false
  }
}

// Delete category
const deleteCategory = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    return
  }

  try {
    const token = sessionStorage.getItem('admin_access_token')
    
    if (!token) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      navigateTo('/admin')
      return
    }

    // Optimistic update - langsung hapus dari state SEBELUM request
    const originalCategories = [...categories.value]
    categories.value = categories.value.filter(c => c.id !== id)

    try {
      await $fetch(`/api/admin/document-categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Show success notification after delete
      setTimeout(() => {
        alert('Kategori berhasil dihapus')
      }, 100)
    } catch (deleteError) {
      // Rollback on error
      categories.value = originalCategories
      throw deleteError
    }
  } catch (error) {
    console.error('Failed to delete category:', error)
    
    // Handle token errors
    if (error.statusCode === 401 || error.data?.message?.includes('token')) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      sessionStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      navigateTo('/admin')
      return
    }
    
    alert(error.data?.message || 'Gagal menghapus kategori')
  }
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

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})
</script>
