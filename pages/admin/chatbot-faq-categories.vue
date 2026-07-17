<template>
  <div class="space-y-6">
    <!-- Add/Edit Category Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">{{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru' }}</h2>
      <form @submit.prevent="saveCategory" class="grid grid-cols-1 gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
            <input
              v-model="categoryForm.name"
              type="text"
              placeholder="Masukkan nama kategori..."
              class="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              v-model="categoryForm.slug"
              type="text"
              placeholder="nama-kategori"
              class="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            v-model="categoryForm.description"
            placeholder="Deskripsi kategori (opsional)..."
            class="w-full border p-2 rounded resize-vertical min-h-[80px]"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Warna</label>
            <input
              v-model="categoryForm.color"
              type="color"
              class="w-full border p-2 rounded h-10"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampilan</label>
            <input
              v-model.number="categoryForm.display_order"
              type="number"
              min="0"
              class="w-full border p-2 rounded"
            />
          </div>

          <div class="flex items-center">
            <label class="flex items-center mt-6">
              <input
                v-model="categoryForm.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-paulus-blue focus:ring-paulus-blue"
              />
              <span class="ml-2 text-sm text-gray-700">Aktif</span>
            </label>
          </div>
        </div>

        <div class="flex space-x-2">
          <button
            type="submit"
            :disabled="loading"
            class="bg-paulus-blue text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Menyimpan...' : (editingCategory ? 'Update Kategori' : 'Tambah Kategori') }}
          </button>

          <button
            v-if="editingCategory"
            type="button"
            @click="cancelEdit"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- Categories List -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Daftar Kategori</h2>
      <div v-if="categories.length === 0" class="text-gray-500">Belum ada kategori.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">Nama</th>
              <th class="px-4 py-2 text-left">Slug</th>
              <th class="px-4 py-2 text-left">Warna</th>
              <th class="px-4 py-2 text-left">Urutan</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in paginatedCategories" :key="category.id" class="border-t">
              <td class="px-4 py-2 font-medium">{{ category.name }}</td>
              <td class="px-4 py-2 text-gray-600">{{ category.slug }}</td>
              <td class="px-4 py-2">
                <div class="flex items-center space-x-2">
                  <div
                    class="w-4 h-4 rounded border"
                    :style="{ backgroundColor: category.color }"
                  ></div>
                  <span class="text-sm text-gray-600">{{ category.color }}</span>
                </div>
              </td>
              <td class="px-4 py-2">{{ category.display_order }}</td>
              <td class="px-4 py-2">
                <span
                  :class="category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ category.is_active ? 'Aktif' : 'Nonaktif' }}
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
        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between border-t pt-4">
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
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { makeRequest } = useAdminApi()

const categories = useState('admin-chatbot-faq-categories', () => [])
const categoryForm = ref({
  name: '',
  slug: '',
  description: '',
  color: '#6B7280',
  display_order: 0,
  is_active: true
})
const editingCategory = ref(null)
const loading = ref(false)
const message = ref('')
const error = ref('')
const currentPage = useState('admin-chatbot-faq-categories-page', () => 1)
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

// Load categories
const loadCategories = async () => {
  try {
    const data = await makeRequest('/api/admin/chatbot-faq-categories')
    // Normalize is_active from MySQL TINYINT (1/0) to boolean
    categories.value = (Array.isArray(data) ? data : []).map(cat => ({
      ...cat,
      is_active: Boolean(cat.is_active)
    }))
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

onMounted(() => {
  loadCategories()
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

// Auto-generate slug from name
watch(() => categoryForm.value.name, (newName) => {
  if (!editingCategory.value && newName) {
    categoryForm.value.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
})

const saveCategory = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    if (editingCategory.value) {
      await makeRequest(`/api/admin/chatbot-faq-categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: categoryForm.value
      })
      message.value = 'Kategori berhasil diperbarui'
    } else {
      await makeRequest('/api/admin/chatbot-faq-categories', {
        method: 'POST',
        body: categoryForm.value
      })
      message.value = 'Kategori berhasil ditambahkan'
    }

    resetForm()
    await loadCategories()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal menyimpan kategori'
  } finally {
    loading.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    color: category.color,
    display_order: category.display_order,
    // MySQL TINYINT returns 1/0 (integer), must convert to boolean
    // so that v-model on checkbox works correctly
    is_active: Boolean(category.is_active)
  }
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    slug: '',
    description: '',
    color: '#6B7280',
    display_order: 0,
    is_active: true
  }
}

const deleteCategory = async (category) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return

  try {
    await makeRequest(`/api/admin/chatbot-faq-categories/${category.id}`, {
      method: 'DELETE'
    })
    message.value = 'Kategori berhasil dihapus'
    await loadCategories()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal menghapus kategori'
  }
}
</script>
