<template>
  <!-- Main Content -->
  <div>
    <!-- Add Article Button -->
    <div class="mb-6">
      <button @click="showAddModal = true"
        class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium">
        Tambah Artikel
      </button>
    </div>

    <!-- Articles List -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Daftar Artikel</h3>
          <div class="text-sm text-gray-500">
            {{ articles.length }} artikel ditemukan
          </div>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Memuat artikel...</p>
        </div>

        <div v-else-if="articles.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada artikel</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat artikel pertama Anda.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="article in articles" :key="article.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900">{{ article.title }}</h4>
                <p class="text-sm text-gray-500 mt-1">{{ article.excerpt || 'Tidak ada ringkasan' }}</p>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Penulis: {{ article.author || 'Tidak diketahui' }}</span>
                  <span>Dibuat: {{ formatDate(article.created_at) }}</span>
                  <span :class="getStatusClass(article.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(article.status) }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <button @click="editArticle(article)" title="Edit"
                  class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded text-sm inline-flex items-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="togglePublish(article)" :title="article.status === 'published' ? 'Unpublish' : 'Publish'"
                  :class="article.status === 'published' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'"
                  class="text-white p-2 rounded text-sm inline-flex items-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="article.status === 'published'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button @click="deleteArticle(article)" title="Hapus"
                  class="bg-red-600 hover:bg-red-700 text-white p-2 rounded text-sm inline-flex items-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Article Modal -->
  <div v-if="showAddModal || editingArticle"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingArticle ? 'Edit Artikel' : 'Tambah Artikel Baru' }}
        </h3>

        <form @submit.prevent="saveArticle" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Judul</label>
            <input v-model="articleForm.title" type="text" required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Slug
              <span class="text-xs text-gray-500">(otomatis dari judul)</span>
            </label>
            <input v-model="articleForm.slug" type="text" required readonly disabled
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed"
              title="Slug otomatis dibuat dari judul" />
            <p class="mt-1 text-xs text-gray-500">
              🔒 Slug dibuat otomatis dari judul dan tidak dapat diedit
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Ringkasan</label>
            <textarea v-model="articleForm.excerpt" rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Konten</label>
            <ClientOnly>
              <CKEditorWrapper v-model="articleForm.content" placeholder="Tulis konten artikel di sini..."
                @ready="onEditorReady" />
              <template #fallback>
                <div
                  class="mt-1 border border-gray-300 rounded-md shadow-sm p-3 min-h-[300px] bg-gray-50 flex items-center justify-center">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
                    <p class="mt-2 text-sm text-gray-500">Memuat editor...</p>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Penulis</label>
            <input v-model="articleForm.author" type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
          </div>

          <!-- IMAGE UPLOAD COMPONENT -->
          <AdminImageUpload v-model="articleForm.image" label="Gambar/Thumbnail Artikel"
            helper-text="Gambar akan tampil sebagai thumbnail di halaman utama dan detail artikel" type="article" />

          <div>
            <label class="block text-sm font-medium text-gray-700">Kategori</label>
            <div class="mt-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              <div v-for="category in allCategories" :key="category.id" class="flex items-center">
                <input :id="`category-${category.id}`" v-model="articleForm.category_ids" :value="category.id"
                  type="checkbox" class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                <label :for="`category-${category.id}`" class="ml-2 block text-sm text-gray-900">
                  {{ category.name }}
                </label>
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-500">Pilih satu atau lebih kategori untuk artikel ini</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="articleForm.status"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium">
              Batal
            </button>
            <button type="submit" :disabled="saving"
              class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

import { watch } from 'vue'

// Components are auto-imported by Nuxt, no need for defineAsyncComponent
// Just wrap them in <ClientOnly> in the template

const articles = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const editingArticle = ref(null)
const saving = ref(false)
const filterStatus = ref('')
const searchQuery = ref('')
const selectedArticles = ref([])
const imageError = ref(false)

const articleForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  image: '',
  status: 'draft',
  category_ids: []
})

const allCategories = ref([])

// Auto-generate slug from title
watch(() => articleForm.value.title, (newTitle) => {
  if (newTitle && !editingArticle.value) {
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    articleForm.value.slug = slug
  }
})

// CKEditor ready callback
const onEditorReady = (editorInstance) => {
  console.log('[Articles] CKEditor ready!', editorInstance)
}

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  navigateTo('/admin/login')
}

// Fetch articles
const fetchArticles = async () => {
  loading.value = true
  try {
    // Add cache busting timestamp
    const timestamp = new Date().getTime()
    const params = filterStatus.value ? `?status=${filterStatus.value}&_=${timestamp}` : `?_=${timestamp}`
    const response = await $fetch(`/api/admin/articles${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })
    articles.value = response
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    alert('Gagal memuat artikel')
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/admin/article-categories', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })

    // Flatten categories for checkbox selection
    const flattenCategories = (cats) => {
      let result = []
      cats.forEach(cat => {
        result.push({ id: cat.id, name: cat.name })
        if (cat.children) {
          result = result.concat(flattenCategories(cat.children))
        }
      })
      return result
    }
    allCategories.value = flattenCategories(response)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Save article
const saveArticle = async () => {
  saving.value = true

  // Simpan context sebelum optimistic update
  const wasEditing = !!editingArticle.value
  const editingId = editingArticle.value?.id
  const formData = { ...articleForm.value }
  const originalArticles = [...articles.value]

  try {
    const url = wasEditing
      ? `/api/admin/articles/${editingId}`
      : '/api/admin/articles'
    const method = wasEditing ? 'PUT' : 'POST'

    // Close modal immediately for better UX
    closeModal()

    // Optimistic update - Update UI FIRST before API call
    if (wasEditing) {
      const index = articles.value.findIndex(a => a.id === editingId)
      if (index !== -1) {
        articles.value[index] = { ...articles.value[index], ...formData }
      }
    } else {
      // Add optimistic temp article
      const tempId = Date.now()
      articles.value.unshift({
        id: tempId,
        ...formData,
        _isOptimistic: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Now make API call
    const result = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: formData
    })

    // Replace optimistic data with real data from server
    if (wasEditing) {
      const index = articles.value.findIndex(a => a.id === editingId)
      if (index !== -1) {
        articles.value[index] = result.data || result
      }
    } else {
      // Remove temp article and add real one
      const tempIndex = articles.value.findIndex(a => a._isOptimistic)
      if (tempIndex !== -1) {
        articles.value.splice(tempIndex, 1)
      }
      articles.value.unshift(result.data || result)
    }

    // Show success notification
    setTimeout(() => {
      alert(wasEditing ? 'Artikel berhasil diperbarui' : 'Artikel berhasil ditambahkan')
    }, 100)

  } catch (error) {
    // Rollback on error - restore original state
    articles.value = originalArticles
    console.error('Failed to save article:', error)
    alert('Gagal menyimpan artikel')
  } finally {
    saving.value = false
  }
}

// Edit article
const editArticle = (article) => {
  editingArticle.value = article
  imageError.value = false
  articleForm.value = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: article.content,
    author: article.author || '',
    image: article.image || '',
    status: article.status,
    category_ids: article.categories ? article.categories.map(cat => cat.id) : []
  }

  showAddModal.value = true
}

// Toggle publish status
const togglePublish = async (article) => {
  try {
    const newStatus = article.status === 'published' ? 'draft' : 'published'

    // Optimistic update - langsung update UI
    const index = articles.value.findIndex(a => a.id === article.id)
    if (index !== -1) {
      articles.value[index].status = newStatus
    }

    await $fetch(`/api/admin/articles/${article.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: { ...article, status: newStatus }
    })

    setTimeout(() => {
      alert(`Artikel ${newStatus === 'published' ? 'dipublikasikan' : 'disimpan sebagai draft'}`)
    }, 100)
  } catch (error) {
    console.error('Failed to toggle publish status:', error)
    // Rollback on error
    const index = articles.value.findIndex(a => a.id === article.id)
    if (index !== -1) {
      articles.value[index].status = article.status
    }
    alert('Gagal mengubah status artikel')
  }
}

// Delete article
const deleteArticle = async (article) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${article.title}"?`)) {
    return
  }

  try {
    // Optimistic update - langsung hapus dari UI
    articles.value = articles.value.filter(a => a.id !== article.id)

    await $fetch(`/api/admin/articles/${article.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })

    setTimeout(() => {
      alert('Artikel berhasil dihapus')
    }, 100)
  } catch (error) {
    console.error('Failed to delete article:', error)
    // Rollback on error
    articles.value.push(article)
    alert('Gagal menghapus artikel')
  }
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  editingArticle.value = null
  articleForm.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    status: 'draft',
    category_ids: []
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'published':
      return 'Published'
    case 'draft':
      return 'Draft'
    case 'archived':
      return 'Archived'
    default:
      return status
  }
}

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchArticles()
  }, 500)
}

// Placeholder functions for bulk actions
const exportArticles = () => {
  alert('Fitur export akan segera hadir')
}

const selectAllArticles = () => {
  selectedArticles.value = articles.value.map(article => article.id)
}

const bulkPublish = async () => {
  if (selectedArticles.value.length === 0) return

  try {
    for (const id of selectedArticles.value) {
      await $fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`,
          'Content-Type': 'application/json'
        },
        body: { status: 'published' }
      })
    }
    selectedArticles.value = []
    await fetchArticles()
    alert('Artikel berhasil dipublikasikan')
  } catch (error) {
    console.error('Failed to bulk publish:', error)
    alert('Gagal mempublikasikan artikel')
  }
}

const bulkDelete = async () => {
  if (selectedArticles.value.length === 0) return

  if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedArticles.value.length} artikel?`)) {
    return
  }

  try {
    for (const id of selectedArticles.value) {
      await $fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
        }
      })
    }
    selectedArticles.value = []
    await fetchArticles()
    alert('Artikel berhasil dihapus')
  } catch (error) {
    console.error('Failed to bulk delete:', error)
    alert('Gagal menghapus artikel')
  }
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = localStorage.getItem('admin_access_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await Promise.all([fetchArticles(), fetchCategories()])
})
</script>
