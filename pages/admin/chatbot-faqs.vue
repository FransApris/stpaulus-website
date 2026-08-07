<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-2">
      <h1 class="text-2xl sm:text-3xl font-cinzel font-bold text-gray-900 mb-1">Kelola Chatbot FAQ Umat</h1>
      <p class="text-xs sm:text-sm text-gray-600">Kelola basis pengetahuan (knowledge base) tanya jawab otomatis asisten chatbot umat</p>
    </div>

    <!-- Add/Edit FAQ Form -->
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#882f1d]"></span>
          {{ editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru' }}
        </h2>
        <span v-if="editingFaq" class="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Mode Edit</span>
      </div>

      <form @submit.prevent="saveFaq" class="space-y-4">
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Pertanyaan *</label>
          <textarea
            v-model="faqForm.question"
            placeholder="Contoh: Kapan jadwal misa hari Minggu di Gereja St. Paulus?"
            class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d] resize-vertical min-h-[70px]"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Jawaban *</label>
          <textarea
            v-model="faqForm.answer"
            placeholder="Tuliskan jawaban yang lengkap dan jelas untuk dijawab oleh chatbot..."
            class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d] resize-vertical min-h-[110px]"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
            <select
              v-model="faqForm.category"
              class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d] bg-white"
            >
              <option value="">Pilih Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Keywords (pisahkan dengan koma)</label>
            <input
              v-model="keywordsText"
              type="text"
              placeholder="misal: misa, jadwal, waktu, ekaristi"
              class="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:border-[#882f1d] focus:ring-1 focus:ring-[#882f1d]"
            />
          </div>
        </div>

        <div class="flex items-center pt-1">
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input
              v-model="faqForm.is_active"
              type="checkbox"
              class="rounded border-gray-300 text-[#882f1d] focus:ring-[#882f1d] w-4 h-4"
            />
            <span class="text-xs sm:text-sm font-medium text-gray-700">FAQ Aktif (dapat dijawab oleh chatbot)</span>
          </label>
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
            <span>{{ loading ? 'Menyimpan...' : (editingFaq ? 'Update FAQ' : 'Tambah FAQ') }}</span>
          </button>

          <button
            v-if="editingFaq"
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

    <!-- FAQs List Section -->
    <div id="chatbot-faqs-section" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-4">
      <div class="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-gray-900">Daftar FAQ Chatbot</h2>
          <p class="text-xs text-gray-500">Total: {{ faqs.length }} pertanyaan FAQ tersimpan</p>
        </div>
        <button
          @click="loadFaqs"
          class="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingFaqs }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <!-- Loading indicator -->
      <div v-if="loadingFaqs" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
        <p class="mt-2 text-xs sm:text-sm text-gray-600">Memuat data FAQ...</p>
      </div>

      <div v-else-if="faqs.length === 0" class="text-center py-12 px-4">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-800">Belum ada FAQ</p>
        <p class="text-xs text-gray-500 mt-1">Gunakan formulir di atas untuk menambahkan FAQ pertama.</p>
      </div>

      <div v-else>
        <!-- Mobile/Tablet Card View -->
        <div class="xl:hidden p-3 sm:p-4 space-y-4">
          <div
            v-for="faq in paginatedFaqs"
            :key="'card-'+faq.id"
            class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <!-- Card Header: Pertanyaan -->
            <div class="mb-3">
              <div class="flex items-start gap-2.5">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#882f1d]/10 text-[#882f1d] text-xs font-bold shrink-0 mt-0.5">
                  Q
                </span>
                <h3 class="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {{ faq.question }}
                </h3>
              </div>
            </div>

            <!-- Card Body: Jawaban Preview -->
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-3.5">
              <div class="flex items-start gap-2">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0 mt-0.5">
                  A
                </span>
                <p class="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {{ faq.answer }}
                </p>
              </div>
            </div>

            <!-- Card Info Grid: Kategori, Penggunaan, Status -->
            <div class="grid grid-cols-3 gap-2 text-xs mb-3.5">
              <div class="bg-gray-50 rounded-lg p-2.5">
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Kategori</p>
                <p class="text-gray-900 font-medium text-xs truncate">
                  {{ getCategoryName(faq.category) || '-' }}
                </p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2.5 text-center">
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Penggunaan</p>
                <p class="text-gray-900 font-semibold text-xs">{{ faq.usage_count || 0 }}x</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2.5 flex flex-col justify-center items-center">
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                <span
                  class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full"
                  :class="faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ faq.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
            </div>

            <!-- Keywords pills if any -->
            <div v-if="faq.keywords" class="mb-3.5 flex items-center gap-1.5 flex-wrap">
              <span class="text-[10px] text-gray-400 font-medium">Keywords:</span>
              <span
                v-for="(kw, idx) in parseKeywordsList(faq.keywords)"
                :key="idx"
                class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {{ kw }}
              </span>
            </div>

            <!-- Card Footer: Tombol Aksi Horisontal di Bawah -->
            <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                @click="editFaq(faq)"
                title="Edit FAQ"
                class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Edit</span>
              </button>
              <button
                @click="deleteFaq(faq)"
                title="Hapus FAQ"
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pertanyaan</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penggunaan</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="faq in paginatedFaqs" :key="faq.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-semibold text-gray-900">{{ faq.question }}</div>
                  <div class="text-xs text-gray-500 line-clamp-1 mt-0.5">{{ faq.answer }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                    {{ getCategoryName(faq.category) || '-' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ faq.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {{ faq.usage_count || 0 }}x
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editFaq(faq)"
                    title="Edit"
                    class="text-blue-600 hover:text-blue-900 mr-3 p-1 inline-flex items-center"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteFaq(faq)"
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
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t bg-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }}</p>
        <div class="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1.5 rounded-lg border text-sm min-w-[36px]"
            :class="page === currentPage ? 'bg-[#882f1d] text-white border-[#882f1d]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Berikutnya
          </button>
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

const scrollToTop = () => {
  nextTick(() => {
    const target = document.getElementById('chatbot-faqs-section')
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

const parseKeywordsList = (kw) => {
  if (!kw) return []
  try {
    const parsed = JSON.parse(kw)
    if (Array.isArray(parsed)) return parsed
  } catch (e) {}
  return String(kw).split(',').map(s => s.trim()).filter(Boolean)
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
