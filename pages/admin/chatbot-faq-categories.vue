<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-2">
      <h1 class="text-2xl sm:text-3xl font-cinzel font-bold text-gray-900 mb-1">Kategori Chatbot FAQ</h1>
      <p class="text-xs sm:text-sm text-gray-600">Kelola kategori topik untuk mengelompokkan pertanyaan asisten chatbot umat</p>
    </div>

    <!-- Add/Edit Category Form -->
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#882f1d]"></span>
          {{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
        </h2>
        <span v-if="editingCategory" class="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Mode Edit</span>
      </div>

      <form @submit.prevent="saveCategory" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nama Kategori *</label>
            <input
              v-model="categoryForm.name"
              type="text"
              placeholder="Contoh: Sakramen & Liturgi"
              class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d]"
              required
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Slug *</label>
            <input
              v-model="categoryForm.slug"
              type="text"
              placeholder="sakramen-liturgi"
              class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d]"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea
            v-model="categoryForm.description"
            placeholder="Deskripsi kategori (opsional)..."
            class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d] resize-vertical min-h-[70px]"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Warna</label>
            <div class="flex items-center gap-2">
              <input
                v-model="categoryForm.color"
                type="color"
                class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                v-model="categoryForm.color"
                type="text"
                class="flex-1 border border-gray-300 p-2 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Urutan Tampilan</label>
            <input
              v-model.number="categoryForm.display_order"
              type="number"
              min="0"
              class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d]"
            />
          </div>

          <div class="flex items-center sm:pt-6">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input
                v-model="categoryForm.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-[#882f1d] focus:ring-[#882f1d] w-4 h-4"
              />
              <span class="text-xs sm:text-sm font-medium text-gray-700">Kategori Aktif</span>
            </label>
          </div>
        </div>

        <div class="flex items-center gap-2.5 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center gap-1.5 bg-[#882f1d] hover:bg-[#6b2416] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loading ? 'Menyimpan...' : (editingCategory ? 'Update Kategori' : 'Tambah Kategori') }}</span>
          </button>

          <button
            v-if="editingCategory"
            type="button"
            @click="cancelEdit"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </form>

      <div v-if="message" class="mt-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span>{{ message }}</span>
      </div>
      <div v-if="error" class="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Categories List Section -->
    <div id="chatbot-categories-section" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-4">
      <div class="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-gray-900">Daftar Kategori FAQ</h2>
          <p class="text-xs text-gray-500">Total: {{ categories.length }} kategori tersimpan</p>
        </div>
      </div>

      <div v-if="categories.length === 0" class="text-center py-12 px-4">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-800">Belum ada kategori</p>
        <p class="text-xs text-gray-500 mt-1">Gunakan formulir di atas untuk membuat kategori pertama.</p>
      </div>

      <div v-else>
        <!-- Mobile/Tablet Card View -->
        <div class="xl:hidden p-3 sm:p-4 space-y-4">
          <div
            v-for="category in paginatedCategories"
            :key="'card-'+category.id"
            class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <!-- Card Header: Nama & Slug -->
            <div class="mb-3.5 pb-3 border-b border-gray-100">
              <div class="flex items-center gap-2.5">
                <div class="w-3.5 h-3.5 rounded-full shadow-sm shrink-0" :style="{ backgroundColor: category.color }"></div>
                <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-snug">{{ category.name }}</h3>
              </div>
              <p class="text-xs text-gray-500 font-mono mt-1 ml-6">{{ category.slug }}</p>
              <div v-if="category.description" class="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed bg-gray-50 rounded-lg p-2.5">
                {{ category.description }}
              </div>
            </div>

            <!-- Card Body: Grid Detail -->
            <div class="grid grid-cols-3 gap-2 text-xs mb-3.5">
              <div class="bg-gray-50 rounded-lg p-2.5">
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Warna</p>
                <div class="flex items-center gap-1.5 font-mono text-[11px] font-medium text-gray-900">
                  <span class="w-2.5 h-2.5 rounded-full inline-block" :style="{ backgroundColor: category.color }"></span>
                  <span>{{ category.color }}</span>
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-2.5 text-center">
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Urutan</p>
                <p class="text-gray-900 font-semibold text-xs">{{ category.display_order }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2.5 flex flex-col justify-center items-center">
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                <span
                  class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full"
                  :class="category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ category.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
            </div>

            <!-- Card Footer: Tombol Aksi Horisontal di Bawah -->
            <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                @click="editCategory(category)"
                title="Edit Kategori"
                class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Edit</span>
              </button>
              <button
                @click="deleteCategory(category)"
                title="Hapus Kategori"
                class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden xl:block w-full overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warna</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ category.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ category.slug }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 rounded shadow-sm" :style="{ backgroundColor: category.color }"></div>
                    <span class="text-sm text-gray-600 font-mono">{{ category.color }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.display_order }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ category.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editCategory(category)" title="Edit" class="text-blue-600 hover:text-blue-900 mr-3 p-1 inline-flex items-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="deleteCategory(category)" title="Hapus" class="text-red-600 hover:text-red-900 p-1 inline-flex items-center">
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

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t bg-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }}</p>
        <div class="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Sebelumnya
          </button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            class="px-3 py-1.5 rounded-lg border text-sm min-w-[36px]"
            :class="page === currentPage ? 'bg-[#882f1d] text-white border-[#882f1d]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Berikutnya
          </button>
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

const scrollToTop = () => {
  nextTick(() => {
    const target = document.getElementById('chatbot-categories-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const mainEl = target.closest('main') || document.querySelector('main')
      if (mainEl && typeof target.offsetTop === 'number') {
        mainEl.scrollTo({
          top: Math.max(0, target.offsetTop - 12),
          behavior: 'smooth'
        })
      }
    } else {
      const mainEl = document.querySelector('main')
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  })
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  scrollToTop()
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
