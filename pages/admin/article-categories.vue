<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Kategori Konten</h1>
      <p class="text-gray-600">Kelola kategori untuk mengorganisir artikel dan berita paroki</p>
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

    <!-- Categories Tree -->
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

      <div v-else class="p-6">
        <div class="space-y-2">
          <CategoryTreeItem
            v-for="category in categories"
            :key="category.id"
            :category="category"
            @edit="openModal"
            @delete="deleteCategory"
          />
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
                Kategori Induk
              </label>
              <select
                v-model="form.parent_id"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
              >
                <option :value="null">Tidak ada (Kategori Utama)</option>
                <option
                  v-for="category in allCategories"
                  :key="category.id"
                  :value="category.id"
                  :disabled="isEditing && category.id === editingId"
                >
                  {{ category.name }}
                </option>
              </select>
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
import { defineComponent, h } from '#imports'

definePageMeta({
  layout: 'admin'
})

const categories = useState('admin-article-categories', () => [])
const allCategories = useState('admin-article-all-categories', () => [])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  parent_id: null,
  description: ''
})

// Category Tree Item Component
const CategoryTreeItem = defineComponent({
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const expanded = ref(true)

    const toggleExpanded = () => {
      expanded.value = !expanded.value
    }

    return () => h('div', { class: 'border border-gray-200 rounded-lg' }, [
      // Category header
      h('div', { class: 'flex items-center justify-between p-4 bg-gray-50' }, [
        h('div', { class: 'flex items-center' }, [
          props.category.children && props.category.children.length > 0 ? h('button', {
            onClick: toggleExpanded,
            class: 'mr-2 text-gray-500 hover:text-gray-700'
          }, [
            h('svg', {
              class: `w-4 h-4 transition-transform ${expanded.value ? 'rotate-90' : ''}`,
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5l7 7-7 7' })
            ])
          ]) : h('div', { class: 'w-6' }),
          h('div', [
            h('div', { class: 'text-sm font-medium text-gray-900' }, props.category.name),
            h('div', { class: 'text-sm text-gray-500' }, props.category.slug)
          ])
        ]),
        h('div', { class: 'flex space-x-2' }, [
          h('button', {
            onClick: () => emit('edit', props.category),
            title: 'Edit',
            class: 'text-[#882f1d] hover:text-[#6b2416] p-1 inline-flex items-center'
          }, [
            h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
            ])
          ]),
          h('button', {
            onClick: () => emit('delete', props.category.id),
            title: 'Hapus',
            class: 'text-red-600 hover:text-red-900 p-1 inline-flex items-center'
          }, [
            h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
            ])
          ])
        ])
      ]),
      // Description
      props.category.description && h('div', { class: 'px-4 pb-2 text-sm text-gray-600' }, props.category.description),
      // Children
      props.category.children && props.category.children.length > 0 && expanded.value && h('div', { class: 'ml-6 space-y-2' }, [
        props.category.children.map(child => h(CategoryTreeItem, {
          category: child,
          onEdit: (cat) => emit('edit', cat),
          onDelete: (id) => emit('delete', id)
        }))
      ])
    ])
  }
})

// Fetch categories
const fetchCategories = async () => {
  // Show loading spinner only if there is no cached data yet
  const hasCache = categories.value.length > 0
  if (!hasCache) loading.value = true
  try {
    const response = await $fetch('/api/admin/article-categories', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    categories.value = response
    allCategories.value = flattenCategories(response)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    if (!hasCache) alert('Gagal memuat kategori')
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
      parent_id: category.parent_id,
      description: category.description || ''
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = {
      name: '',
      parent_id: null,
      description: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    name: '',
    parent_id: null,
    description: ''
  }
}

// Helper: flatten tree to flat list
const flattenCategories = (cats) => {
  let result = []
  cats.forEach(cat => {
    result.push({ id: cat.id, name: cat.name })
    if (cat.children?.length) result = result.concat(flattenCategories(cat.children))
  })
  return result
}

// Helper: recursively find category by id in tree
const findInTree = (cats, id) => {
  for (const cat of cats) {
    if (cat.id === id) return cat
    if (cat.children?.length) {
      const found = findInTree(cat.children, id)
      if (found) return found
    }
  }
  return null
}

// Helper: recursively update category in tree
const updateInTree = (cats, id, newData) => {
  for (let i = 0; i < cats.length; i++) {
    if (cats[i].id === id) {
      cats[i] = { ...cats[i], ...newData }
      return true
    }
    if (cats[i].children?.length) {
      if (updateInTree(cats[i].children, id, newData)) return true
    }
  }
  return false
}

// Helper: recursively delete category from tree
const deleteFromTree = (cats, id) => {
  const idx = cats.findIndex(c => c.id === id)
  if (idx !== -1) {
    cats.splice(idx, 1)
    return true
  }
  for (const cat of cats) {
    if (cat.children?.length) {
      if (deleteFromTree(cat.children, id)) return true
    }
  }
  return false
}

// Helper: insert new category at correct tree position based on parent_id
const insertInTree = (cats, newCat) => {
  if (!newCat.parent_id) {
    cats.push(newCat)
    return
  }
  const parent = findInTree(cats, newCat.parent_id)
  if (parent) {
    if (!parent.children) parent.children = []
    parent.children.push(newCat)
  } else {
    cats.push(newCat) // fallback: parent not found, add to root
  }
}

// Save category
const saveCategory = async () => {
  saving.value = true
  const wasEditing = isEditing.value
  const currentEditingId = editingId.value
  const formData = { ...form.value }

  // Snapshot for rollback
  const snapshot = JSON.parse(JSON.stringify(categories.value))
  const tempId = `temp_${Date.now()}`

  // True optimistic update BEFORE API call
  if (wasEditing) {
    updateInTree(categories.value, currentEditingId, formData)
  } else {
    insertInTree(categories.value, { id: tempId, ...formData, children: [], slug: '' })
  }
  allCategories.value = flattenCategories(categories.value)

  // Close modal immediately
  closeModal()

  try {
    const url = wasEditing
      ? `/api/admin/article-categories/${currentEditingId}`
      : '/api/admin/article-categories'
    const method = wasEditing ? 'PUT' : 'POST'

    const result = await $fetch(url, {
      method,
      body: formData,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    // Replace optimistic placeholder with real server data
    if (wasEditing) {
      updateInTree(categories.value, currentEditingId, result)
    } else {
      deleteFromTree(categories.value, tempId)
      insertInTree(categories.value, result)
    }
    allCategories.value = flattenCategories(categories.value)

    setTimeout(() => {
      alert(wasEditing ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan')
    }, 100)
  } catch (error) {
    // Rollback and reopen modal with original data
    categories.value = snapshot
    allCategories.value = flattenCategories(snapshot)
    isEditing.value = wasEditing
    editingId.value = currentEditingId
    form.value = formData
    showModal.value = true
    console.error('Failed to save category:', error)
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

  // Snapshot for rollback
  const snapshot = JSON.parse(JSON.stringify(categories.value))

  // True optimistic: recursively delete from tree immediately
  deleteFromTree(categories.value, id)
  allCategories.value = allCategories.value.filter(c => c.id !== id)

  try {
    await $fetch(`/api/admin/article-categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    setTimeout(() => {
      alert('Kategori berhasil dihapus')
    }, 100)
  } catch (error) {
    // Rollback on error
    categories.value = snapshot
    allCategories.value = flattenCategories(snapshot)
    console.error('Failed to delete category:', error)
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
</script>
