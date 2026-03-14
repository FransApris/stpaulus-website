<template>
  <div class="space-y-6">
    <!-- Add/Edit FAQ Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">{{ editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru' }}</h2>
      <form @submit.prevent="saveFaq" class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
          <textarea v-model="faqForm.question" placeholder="Masukkan pertanyaan..."
            class="w-full border p-2 rounded resize-vertical min-h-[80px]" required></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
          <textarea v-model="faqForm.answer" placeholder="Masukkan jawaban..."
            class="w-full border p-2 rounded resize-vertical min-h-[120px]" required></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select v-model="faqForm.category" class="w-full border p-2 rounded">
              <option value="">Pilih Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Keywords (pisahkan dengan koma)</label>
            <input v-model="keywordsText" type="text" placeholder="misal: misa, jadwal, waktu"
              class="w-full border p-2 rounded" />
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input v-model="faqForm.is_active" type="checkbox"
              class="rounded border-gray-300 text-paulus-blue focus:ring-paulus-blue" />
            <span class="ml-2 text-sm text-gray-700">Aktif</span>
          </label>
        </div>

        <div class="flex space-x-2">
          <button type="submit" :disabled="loading"
            class="bg-paulus-blue text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {{ loading ? 'Menyimpan...' : (editingFaq ? 'Update FAQ' : 'Tambah FAQ') }}
          </button>

          <button v-if="editingFaq" type="button" @click="cancelEdit"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Batal
          </button>
        </div>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- FAQs List -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Daftar FAQ</h2>

      <!-- Loading indicator -->
      <div v-if="loadingFaqs" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-paulus-blue"></div>
        <p class="mt-2 text-gray-600">Memuat data terbaru...</p>
      </div>

      <div v-else-if="faqs.length === 0" class="text-gray-500">Belum ada FAQ.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">Pertanyaan</th>
              <th class="px-4 py-2 text-left">Kategori</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Penggunaan</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faq in paginatedFaqs" :key="faq.id" class="border-t">
              <td class="px-4 py-2 max-w-xs truncate" :title="faq.question">{{ faq.question }}</td>
              <td class="px-4 py-2">{{ getCategoryName(faq.category) || '-' }}</td>
              <td class="px-4 py-2">
                <span :class="faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ faq.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-4 py-2">{{ faq.usage_count || 0 }}</td>
              <td class="px-4 py-2">
                <button @click="editFaq(faq)" title="Edit" class="text-blue-600 hover:text-blue-800 mr-2 p-1 inline-flex items-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="deleteFaq(faq)" title="Hapus" class="text-red-600 hover:text-red-800 p-1 inline-flex items-center">
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
  middleware: 'auth',
  layout: 'admin'
})

const { makeRequest } = useAdminApi()

const faqs = useState('admin-chatbot-faqs', () => [])
const categories = useState('admin-chatbot-faq-categories-list', () => [])
const faqForm = ref({
  question: '',
  answer: '',
  category: '',
  is_active: true
})
const keywordsText = ref('')
const editingFaq = ref(null)
const loading = ref(false)
const loadingFaqs = ref(false)
const message = ref('')
const error = ref('')
const currentPage = useState('admin-chatbot-faqs-page', () => 1)
const pageLimit = 10

const totalPages = computed(() => Math.max(1, Math.ceil(faqs.value.length / pageLimit)))
const paginatedFaqs = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return faqs.value.slice(start, start + pageLimit)
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

// Load FAQs and Categories
const loadFaqs = async () => {
  const hasCache = faqs.value.length > 0
  try {
    if (!hasCache) loadingFaqs.value = true
    faqs.value = await makeRequest('/api/admin/chatbot-faqs')
  } catch (err) {
    console.error('Failed to load FAQs', err)
  } finally {
    loadingFaqs.value = false
  }
}

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

const loadCategories = async () => {
  try {
    categories.value = await makeRequest('/api/admin/chatbot-faq-categories')
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

onMounted(() => {
  loadFaqs()
  loadCategories()
})

const saveFaq = async () => {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    // Parse keywords dengan handling yang lebih robust
    let keywords = null
    const keywordsStr = String(keywordsText.value || '').trim()

    if (keywordsStr.length > 0) {
      keywords = keywordsStr
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)

      // Jika setelah filter masih kosong, set ke null
      if (keywords.length === 0) {
        keywords = null
      }
    }

    const formData = {
      question: faqForm.value.question,
      answer: faqForm.value.answer,
      category: faqForm.value.category || null,
      is_active: faqForm.value.is_active,
      keywords: keywords
    }

    console.log('[FAQ Save] Sending data:', formData)

    const isEditing = !!editingFaq.value
    const faqId = editingFaq.value?.id

    if (isEditing) {
      // Store old data for rollback
      const index = faqs.value.findIndex(f => f.id === faqId)
      const oldData = index !== -1 ? { ...faqs.value[index] } : null

      // Optimistic update
      if (index !== -1) {
        faqs.value[index] = { ...faqs.value[index], ...formData }
      }

      // Reset form immediately for instant UX
      resetForm()

      try {
        const result = await makeRequest(`/api/admin/chatbot-faqs/${faqId}`, {
          method: 'PUT',
          body: formData
        })

        // Replace with server data
        if (index !== -1) {
          faqs.value[index] = result.data || result
        }

        setTimeout(() => {
          message.value = 'FAQ berhasil diperbarui'
        }, 100)
      } catch (err) {
        // Rollback on error
        if (index !== -1 && oldData) {
          faqs.value[index] = oldData
        }
        throw err
      }
    } else {
      // Add optimistic temp item
      const tempId = Date.now()
      faqs.value.unshift({
        ...formData,
        id: tempId,
        _isOptimistic: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Reset form immediately for instant UX
      resetForm()

      try {
        const result = await makeRequest('/api/admin/chatbot-faqs', {
          method: 'POST',
          body: formData
        })

        // Replace temp with real data from server
        const tempIndex = faqs.value.findIndex(f => f._isOptimistic)
        if (tempIndex !== -1) {
          faqs.value.splice(tempIndex, 1)
        }
        faqs.value.unshift(result.data || result)

        setTimeout(() => {
          message.value = 'FAQ berhasil ditambahkan'
        }, 100)
      } catch (err) {
        // Remove optimistic item on error
        const tempIndex = faqs.value.findIndex(f => f._isOptimistic)
        if (tempIndex !== -1) {
          faqs.value.splice(tempIndex, 1)
        }
        throw err
      }
    }
  } catch (err) {
    console.error('[FAQ Save] Error:', err)
    error.value = err.data?.statusMessage || err.message || 'Gagal menyimpan FAQ'
  } finally {
    loading.value = false
  }
}

const editFaq = (faq) => {
  editingFaq.value = faq
  faqForm.value = {
    question: faq.question,
    answer: faq.answer,
    category: faq.category || '',
    is_active: Boolean(faq.is_active) // Convert 0/1 to false/true for checkbox
  }

  // Handle keywords - bisa berupa string biasa atau JSON array
  let keywordsString = ''

  if (faq.keywords) {
    try {
      // Coba parse sebagai JSON array dulu
      const parsed = JSON.parse(faq.keywords)
      if (Array.isArray(parsed)) {
        keywordsString = parsed.join(', ')
      } else {
        keywordsString = String(faq.keywords)
      }
    } catch (e) {
      // Jika bukan JSON, gunakan langsung sebagai string
      keywordsString = String(faq.keywords)
    }
  }

  keywordsText.value = keywordsString
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  editingFaq.value = null
  faqForm.value = {
    question: '',
    answer: '',
    category: '',
    is_active: true
  }
  keywordsText.value = ''
}

const getCategoryName = (slug) => {
  const category = categories.value.find(cat => cat.slug === slug)
  return category ? category.name : slug
}

const deleteFaq = async (faq) => {
  if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return

  // Optimistic update: Remove from UI immediately
  const deletedFaq = { ...faq }
  const index = faqs.value.findIndex(f => f.id === faq.id)
  if (index !== -1) {
    faqs.value.splice(index, 1)
  }

  try {
    await makeRequest(`/api/admin/chatbot-faqs/${faq.id}`, {
      method: 'DELETE'
    })

    setTimeout(() => {
      message.value = 'FAQ berhasil dihapus'
    }, 100)
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal menghapus FAQ'

    // Rollback: Re-add the deleted FAQ
    if (index !== -1) {
      faqs.value.splice(index, 0, deletedFaq)
    }
  }
}
</script>
