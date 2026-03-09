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
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">Nama</th>
              <th class="px-4 py-2 text-left">Nama Tampilan</th>
              <th class="px-4 py-2 text-left">Deskripsi</th>
              <th class="px-4 py-2 text-left">Urutan</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id" class="border-t">
              <td class="px-4 py-2">{{ category.name }}</td>
              <td class="px-4 py-2">{{ category.display_name }}</td>
              <td class="px-4 py-2">{{ category.description }}</td>
              <td class="px-4 py-2">{{ category.display_order }}</td>
              <td class="px-4 py-2">
                <span :class="category.is_active ? 'text-green-600' : 'text-red-600'">
                  {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
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
          <div class="flex items-center md:col-span-2">
            <input v-model="editingCategory.is_active" type="checkbox" class="mr-2" />
            <label>Aktif</label>
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
  layout: 'admin'
})

const categories = ref([])
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
  is_active: true
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')

// Load categories
const loadCategories = async () => {
  try {
    categories.value = await $fetch('/api/admin/user-categories', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

onMounted(async () => {
  await loadCategories()
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
        Authorization: `Bearer ${localStorage.getItem('admin_access_token')}`
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
  editingCategory.value = { ...category }
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
    const index = categories.value.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      categories.value[index] = result
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
    is_active: true
  }
  editMessage.value = ''
  editError.value = ''
}
</script>
