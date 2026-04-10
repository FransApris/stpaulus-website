<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-cinzel font-bold text-gray-900">Kelola Jenis Liturgi</h1>
        <p class="text-gray-600">Kelola jenis-jenis liturgi yang tersedia untuk jadwal misa</p>
      </div>
      <button @click="showCreateModal = true" :disabled="loading"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tambah Jenis Liturgi
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ikon</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="type in liturgyTypes" :key="type.id" class="hover:bg-gray-50 transition-colors"
              :class="{ 'opacity-60 animate-pulse': type._isOptimistic }">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-2xl">{{ type.icon }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: type.color }"></div>
                  <span class="text-sm font-medium text-gray-900">{{ type.name }}</span>
                  <span v-if="type._isOptimistic" class="ml-2 text-xs text-gray-400">(Menyimpan...)</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ type.slug }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ type.description || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ type.display_order }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="type.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ type.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editType(type)" :disabled="type._isOptimistic || loading"
                  title="Edit"
                  class="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed p-1 inline-flex items-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="confirmDelete(type)" :disabled="type._isOptimistic || loading"
                  title="Hapus"
                  class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed p-1 inline-flex items-center">
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

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showCreateModal ? 'Tambah Jenis Liturgi' : 'Edit Jenis Liturgi' }}
          </h3>

          <form @submit.prevent="saveType" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama</label>
              <input v-model="form.name" type="text" required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Slug</label>
              <input v-model="form.slug" type="text" required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Ikon (emoji)</label>
              <input v-model="form.icon" type="text" placeholder="⛪"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Warna</label>
              <input v-model="form.color" type="color"
                class="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea v-model="form.description" rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Urutan Tampilan</label>
              <input v-model.number="form.display_order" type="number" min="0"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div v-if="showEditModal" class="flex items-center">
              <input v-model="form.is_active" type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModals"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                Batal
              </button>
              <button type="submit" :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-[#882f1d] border border-transparent rounded-md hover:bg-[#6b2416] disabled:opacity-50">
                {{ loading ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Konfirmasi Hapus</h3>
          <p class="text-sm text-gray-500 mb-4">
            Apakah Anda yakin ingin menghapus jenis liturgi "{{ typeToDelete?.name }}"?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div class="flex justify-end space-x-3">
            <button @click="closeModals"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
              Batal
            </button>
            <button @click="deleteType" :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50">
              {{ loading ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-2 opacity-0">
      <div v-if="toast.show" class="fixed bottom-4 right-4 z-50 max-w-sm">
        <div class="rounded-lg shadow-lg p-4 flex items-center space-x-3" :class="{
          'bg-green-50 border border-green-200': toast.type === 'success',
          'bg-red-50 border border-red-200': toast.type === 'error'
        }">
          <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-if="toast.type === 'error'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span class="text-sm font-medium" :class="{
            'text-green-800': toast.type === 'success',
            'text-red-800': toast.type === 'error'
          }">
            {{ toast.message }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
const liturgyTypes = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const typeToDelete = ref(null)

const toast = reactive({
  show: false,
  message: '',
  type: 'success' // 'success' or 'error'
})

const form = reactive({
  id: null,
  name: '',
  slug: '',
  icon: '⛪',
  color: '#6B7280',
  description: '',
  display_order: 0,
  is_active: true
})

// Show toast notification
const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true

  setTimeout(() => {
    toast.show = false
  }, 3000)
}

// Fetch liturgy types
const fetchLiturgyTypes = async () => {
  try {
    const response = await $fetch('/api/admin/liturgy-types', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    // API now returns array directly
    liturgyTypes.value = response || []
  } catch (error) {
    console.error('Failed to fetch liturgy types:', error)
    showToast('Gagal memuat data jenis liturgi', 'error')
  }
}

// Save type (create or update)
const saveType = async () => {
  if (loading.value) return // Prevent double submission

  // Optimistic update: Clone form data before any async operations
  const typeData = { ...form }
  const isEditing = !!typeData.id
  const oldData = isEditing ? { ...liturgyTypes.value.find(t => t.id === typeData.id) } : null

  loading.value = true

  // Optimistic UI update BEFORE closing modal
  if (isEditing) {
    const index = liturgyTypes.value.findIndex(t => t.id === typeData.id)
    if (index !== -1) {
      liturgyTypes.value[index] = { ...liturgyTypes.value[index], ...typeData }
    }
  } else {
    // For new item, add with temporary ID
    const tempId = Date.now()
    liturgyTypes.value.unshift({ ...typeData, id: tempId, _isOptimistic: true })
  }

  // Close modal immediately for instant UX
  closeModals()

  try {
    const url = typeData.id ? `/api/admin/liturgy-types/${typeData.id}` : '/api/admin/liturgy-types'
    const method = typeData.id ? 'PUT' : 'POST'

    const result = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: typeData
    })

    // Replace optimistic data with server response
    if (isEditing) {
      const index = liturgyTypes.value.findIndex(t => t.id === typeData.id)
      if (index !== -1) {
        // Use data from server response
        liturgyTypes.value[index] = result.data || result
      }
      showToast('Jenis liturgi berhasil diperbarui', 'success')
    } else {
      // Replace temporary item with real data from server
      const tempIndex = liturgyTypes.value.findIndex(t => t._isOptimistic)
      if (tempIndex !== -1) {
        liturgyTypes.value.splice(tempIndex, 1)
      }
      // Use data from server response
      liturgyTypes.value.unshift(result.data || result)
      showToast('Jenis liturgi berhasil ditambahkan', 'success')
    }
  } catch (error) {
    console.error('Failed to save liturgy type:', error)
    showToast(error.data?.statusMessage || 'Gagal menyimpan jenis liturgi', 'error')

    // Rollback on error
    if (isEditing && oldData) {
      const index = liturgyTypes.value.findIndex(t => t.id === typeData.id)
      if (index !== -1) {
        liturgyTypes.value[index] = oldData
      }
    } else {
      // Remove optimistic new item
      const tempIndex = liturgyTypes.value.findIndex(t => t._isOptimistic)
      if (tempIndex !== -1) {
        liturgyTypes.value.splice(tempIndex, 1)
      }
    }
  } finally {
    loading.value = false
  }
}

// Edit type
const editType = (type) => {
  Object.assign(form, type)
  showEditModal.value = true
}

// Confirm delete
const confirmDelete = (type) => {
  typeToDelete.value = type
  showDeleteModal.value = true
}

// Delete type
const deleteType = async () => {
  if (!typeToDelete.value || loading.value) return

  // Optimistic update: Store deleted data for rollback
  const deletedType = { ...typeToDelete.value }
  const originalIndex = liturgyTypes.value.findIndex(t => t.id === deletedType.id)

  // Remove from UI immediately
  if (originalIndex !== -1) {
    liturgyTypes.value.splice(originalIndex, 1)
  }

  // Close modal immediately for instant UX
  closeModals()

  loading.value = true

  try {
    await $fetch(`/api/admin/liturgy-types/${deletedType.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    // Success - item already removed from UI
    showToast('Jenis liturgi berhasil dihapus', 'success')
  } catch (error) {
    console.error('Failed to delete liturgy type:', error)
    showToast(error.data?.statusMessage || 'Gagal menghapus jenis liturgi', 'error')

    // Rollback: Re-add the deleted type at original position
    if (originalIndex !== -1) {
      liturgyTypes.value.splice(originalIndex, 0, deletedType)
    } else {
      liturgyTypes.value.push(deletedType)
    }
  } finally {
    loading.value = false
  }
}

// Close modals and reset form
const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  typeToDelete.value = null

  // Reset form
  Object.assign(form, {
    id: null,
    name: '',
    slug: '',
    icon: '⛪',
    color: '#6B7280',
    description: '',
    display_order: 0,
    is_active: true
  })
}

// Auto-generate slug from name
watch(() => form.name, (newName) => {
  if (newName) { // Generate for both new and edit entries
    form.slug = newName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }
})

// Wait for authentication before fetching data
const { user } = useAuth()
watch(() => user.value, async (newUser) => {
  if (newUser) {
    await fetchLiturgyTypes()
  }
}, { immediate: true })
</script>
