<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-cinzel text-gray-900">Kategori Galeri</h1>
      <p class="text-sm text-gray-600 mt-1">Kelola kategori untuk album galeri foto</p>
    </div>

    <!-- Add Category Button -->
    <div class="mb-6">
      <button
        @click="showAddCategoryModal = true"
        class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Tambah Kategori Baru
      </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="category in paginatedCategories" :key="category.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded-full mr-3"
                :style="{ backgroundColor: category.color }"
              ></div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ category.nama_kategori }}</h3>
                <p v-if="category.description" class="text-sm text-gray-500">{{ category.description }}</p>
                <p class="text-xs text-gray-400">Urutan: {{ category.display_order }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
              <button
                @click="editCategory(category)"
                title="Edit"
                class="text-blue-600 hover:text-blue-900 p-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteCategory(category)"
                title="Hapus"
                class="text-red-600 hover:text-red-900 p-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="totalPages > 1" class="px-6 py-4 border-t flex items-center justify-between">
        <p class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }} • {{ totalItems }} kategori</p>
        <div class="flex items-center gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Sebelumnya
          </button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            class="px-3 py-1 rounded border text-sm"
            :class="page === currentPage ? 'bg-red-700 text-white border-red-700' : 'hover:bg-gray-50'">
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Berikutnya
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div
      v-if="showAddCategoryModal || editingCategory"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
          </h3>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama Kategori</label>
              <input
                v-model="categoryForm.nama_kategori"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                v-model="categoryForm.description"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Warna</label>
              <input
                v-model="categoryForm.color"
                type="color"
                class="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div v-if="editingCategory">
              <label class="block text-sm font-medium text-gray-700">Urutan Tampilan</label>
              <input
                v-model.number="categoryForm.display_order"
                type="number"
                min="0"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div v-if="editingCategory" class="flex items-center">
              <input
                v-model="categoryForm.is_active"
                type="checkbox"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeCategoryModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {{ loading ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Konfirmasi Hapus</h3>
          <p class="text-sm text-gray-500 mb-4">
            Apakah Anda yakin ingin menghapus kategori "{{ deletingCategory?.nama_kategori }}"?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ loading ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
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

import { ref, onMounted } from '#imports'

// Reactive data
const categories = useState('admin-gallery-categories', () => [])
const showAddCategoryModal = ref(false)
const editingCategory = ref(null)
const showDeleteModal = ref(false)
const deletingCategory = ref(null)
const loading = ref(false)
const currentPage = useState('admin-gallery-categories-page', () => 1)
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

const categoryForm = ref({
  nama_kategori: '',
  description: '',
  color: '#6B7280',
  display_order: 0,
  is_active: true
})

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/admin/gallery-categories', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    categories.value = response.categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    alert('Gagal memuat kategori')
  }
}

// Save category (create or update)
const saveCategory = async () => {
  loading.value = true
  try {
    const url = editingCategory.value
      ? `/api/admin/gallery-categories/${editingCategory.value.id}`
      : '/api/admin/gallery-categories'

    const method = editingCategory.value ? 'PUT' : 'POST'

    // Simpan context sebelum close modal
    const wasEditing = !!editingCategory.value
    const editingId = editingCategory.value?.id
    const formData = { ...categoryForm.value }
    
    // Close modal immediately for better UX
    closeCategoryModal()

    const result = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: formData
    })

    // Optimistic update - langsung update state
    if (wasEditing) {
      const index = categories.value.findIndex(c => c.id === editingId)
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...result }
      }
    } else {
      categories.value.push(result)
    }

    setTimeout(() => {
      alert(wasEditing ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
    }, 100)
  } catch (error) {
    console.error('Failed to save category:', error)
    alert('Gagal menyimpan kategori')
  } finally {
    loading.value = false
  }
}

// Edit category
const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    nama_kategori: category.nama_kategori,
    description: category.description || '',
    color: category.color,
    display_order: category.display_order,
    is_active: category.is_active
  }
  showAddCategoryModal.value = false
}

// Delete category
const deleteCategory = (category) => {
  deletingCategory.value = category
  showDeleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  loading.value = true
  try {
    const deletedId = deletingCategory.value.id
    const deletedCat = { ...deletingCategory.value }
    
    // Optimistic update - langsung hapus dari UI
    categories.value = categories.value.filter(c => c.id !== deletedId)
    closeDeleteModal()

    await $fetch(`/api/admin/gallery-categories/${deletedId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    setTimeout(() => {
      alert('Kategori berhasil dihapus')
    }, 100)
  } catch (error) {
    console.error('Failed to delete category:', error)
    // Rollback on error
    if (deletedCat) {
      categories.value.push(deletedCat)
    }
    alert('Gagal menghapus kategori')
  } finally {
    loading.value = false
  }
}

// Modal handlers
const closeCategoryModal = () => {
  showAddCategoryModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    nama_kategori: '',
    description: '',
    color: '#6B7280',
    display_order: 0,
    is_active: true
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingCategory.value = null
}

// Check authentication and fetch data on mount
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
