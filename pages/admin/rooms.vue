<template>
  <div class="space-y-6">
    <!-- Add Room Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Tambah Ruangan Baru</h2>
      <form @submit.prevent="createRoom" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newRoom.name" type="text" placeholder="Nama Ruangan" class="border p-2 rounded" required />
        <input v-model="newRoom.capacity" type="number" placeholder="Kapasitas" class="border p-2 rounded" required />
        <div class="flex flex-col">
          <label class="mb-1">Lokasi</label>
          <select v-model="newRoom.location" class="border p-2 rounded" required>
            <option value="">Pilih Lokasi</option>
            <option value="Gereja">Gereja</option>
            <option value="Balai Paroki Lt.1">Balai Paroki Lt.1</option>
            <option value="Balai Paroki Lt.2">Balai Paroki Lt.2</option>
            <option value="Balai Paroki Lt.3">Balai Paroki Lt.3</option>
            <option value="Selasar">Selasar</option>
            <option value="Halaman Belakang Gereja">Halaman Belakang Gereja</option>
            <option value="Halaman Depan Gereja">Halaman Depan Gereja</option>
          </select>
        </div>
        <input v-model="newRoom.facilities" type="text" placeholder="Fasilitas (comma separated)"
          class="border p-2 rounded" />
        <div class="flex flex-col">
          <label class="mb-1">Memerlukan Persetujuan</label>
          <select v-model="newRoom.requires_approval" class="border p-2 rounded">
            <option :value="true">Ya</option>
            <option :value="false">Tidak</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block mb-2">Kategori yang Diijinkan</label>
          <div class="mb-3 pb-3 border-b">
            <label class="flex items-center font-semibold text-blue-600">
              <input v-model="selectAllCreate" @change="toggleAllCategoriesCreate" type="checkbox"
                class="mr-2 w-4 h-4" />
              Pilih Semua
            </label>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="category in userCategories" :key="category.value" class="flex items-center">
              <input v-model="newRoom.allowed_categories" :value="category.value" type="checkbox" class="mr-2" />
              {{ category.label }}
            </label>
          </div>
        </div>
        <button type="submit" :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {{ loading ? 'Membuat...' : 'Buat Ruangan' }}
        </button>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- Rooms List -->
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Daftar Ruangan</h2>
        <div class="text-sm text-gray-600">
          Total: <span class="font-semibold">{{ totalItems }}</span> ruangan
        </div>
      </div>
      <div v-if="rooms.length === 0" class="text-gray-500">Belum ada ruangan.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">
                <button @click="sortBy('name')" class="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Nama
                  <span v-if="sortField === 'name'" class="text-blue-600">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                  <span v-else class="text-gray-400">⇅</span>
                </button>
              </th>
              <th class="px-4 py-2 text-left">
                <button @click="sortBy('capacity')"
                  class="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Kapasitas
                  <span v-if="sortField === 'capacity'" class="text-blue-600">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                  <span v-else class="text-gray-400">⇅</span>
                </button>
              </th>
              <th class="px-4 py-2 text-left">
                <button @click="sortBy('location')"
                  class="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Lokasi
                  <span v-if="sortField === 'location'" class="text-blue-600">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                  <span v-else class="text-gray-400">⇅</span>
                </button>
              </th>
              <th class="px-4 py-2 text-left">Fasilitas</th>
              <th class="px-4 py-2 text-left">
                <button @click="sortBy('requires_approval')"
                  class="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Persetujuan
                  <span v-if="sortField === 'requires_approval'" class="text-blue-600">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                  <span v-else class="text-gray-400">⇅</span>
                </button>
              </th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in paginatedRooms" :key="room.id" class="border-t hover:bg-gray-50 transition-colors">
              <td class="px-4 py-2">{{ room.name }}</td>
              <td class="px-4 py-2">{{ room.capacity }}</td>
              <td class="px-4 py-2">{{ room.location }}</td>
              <td class="px-4 py-2">
                {{
                  (() => {
                    try {
                      let facilities = room.facilities;
                      if (typeof facilities === 'string') {
                        facilities = JSON.parse(facilities);
                      }
                      return Array.isArray(facilities) ? facilities.join(', ') : '';
                    } catch (e) {
                      return room.facilities || '';
                    }
                  })()
                }}
              </td>
              <td class="px-4 py-2">{{ room.requires_approval == 1 || room.requires_approval === true ? 'Ya' : 'Tidak'
                }}</td>
              <td class="px-4 py-2">
                <button @click="editRoom(room)" title="Edit" class="text-blue-600 hover:text-blue-800 mr-2 p-1 inline-flex items-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="deleteRoom(room)" title="Hapus" class="text-red-600 hover:text-red-800 p-1 inline-flex items-center">
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
              :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'">
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

    <!-- Edit Room Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Edit Ruangan</h3>
        <form @submit.prevent="updateRoom" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="editingRoom.name" type="text" placeholder="Nama Ruangan" class="border p-2 rounded"
            required />
          <input v-model="editingRoom.capacity" type="number" placeholder="Kapasitas" class="border p-2 rounded"
            required />
          <div class="flex flex-col">
            <label class="mb-1">Lokasi</label>
            <select v-model="editingRoom.location" class="border p-2 rounded" required>
              <option value="">Pilih Lokasi</option>
              <option value="Gereja">Gereja</option>
              <option value="Balai Paroki Lt.1">Balai Paroki Lt.1</option>
              <option value="Balai Paroki Lt.2">Balai Paroki Lt.2</option>
              <option value="Balai Paroki Lt.3">Balai Paroki Lt.3</option>
              <option value="Selasar">Selasar</option>
              <option value="Halaman Belakang Gereja">Halaman Belakang Gereja</option>
              <option value="Halaman Depan Gereja">Halaman Depan Gereja</option>
            </select>
          </div>
          <input v-model="editingRoom.facilities" type="text" placeholder="Fasilitas (comma separated)"
            class="border p-2 rounded" />
          <div class="flex flex-col">
            <label class="mb-1">Memerlukan Persetujuan</label>
            <select v-model="editingRoom.requires_approval" class="border p-2 rounded">
              <option :value="true">Ya</option>
              <option :value="false">Tidak</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block mb-2">Kategori yang Diijinkan</label>
            <div class="mb-3 pb-3 border-b">
              <label class="flex items-center font-semibold text-blue-600">
                <input v-model="selectAllEdit" @change="toggleAllCategoriesEdit" type="checkbox" class="mr-2 w-4 h-4" />
                Pilih Semua
              </label>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="category in userCategories" :key="category.value" class="flex items-center">
                <input v-model="editingRoom.allowed_categories" :value="category.value" type="checkbox" class="mr-2" />
                {{ category.label }}
              </label>
            </div>
          </div>
          <div class="md:col-span-2 flex justify-end space-x-2">
            <button type="button" @click="closeEditModal"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" :disabled="editLoading"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
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
  layout: 'admin',
  middleware: 'auth'
})

const rooms = useState('admin-rooms', () => [])
const newRoom = ref({
  name: '',
  capacity: '',
  location: '',
  facilities: '',
  requires_approval: true,
  allowed_categories: []
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Select All state
const selectAllCreate = ref(false)
const selectAllEdit = ref(false)

// Sorting state
const sortField = ref('name')
const sortOrder = ref('asc')
const currentPage = useState('admin-rooms-page', () => 1)
const pageLimit = 10

// Edit modal
const showEditModal = ref(false)
const editingRoom = ref({
  id: '',
  name: '',
  capacity: '',
  location: '',
  facilities: '',
  requires_approval: true,
  allowed_categories: []
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')

const userCategories = [
  { value: 'Dewan Pastoral Paroki', label: 'Dewan Pastoral Paroki' },
  { value: 'Kategorial', label: 'Kelompok Kategorial' },
  { value: 'Wilayah', label: 'Wilayah' },
  { value: 'Komunitas', label: 'Komunitas' },
  { value: 'Lingkungan', label: 'Lingkungan' },
  { value: 'Seksi', label: 'Seksi' }
]

// Toggle all categories for Create form
const toggleAllCategoriesCreate = () => {
  if (selectAllCreate.value) {
    // Select all
    newRoom.value.allowed_categories = userCategories.map(cat => cat.value)
  } else {
    // Deselect all
    newRoom.value.allowed_categories = []
  }
}

// Toggle all categories for Edit form
const toggleAllCategoriesEdit = () => {
  if (selectAllEdit.value) {
    // Select all
    editingRoom.value.allowed_categories = userCategories.map(cat => cat.value)
  } else {
    // Deselect all
    editingRoom.value.allowed_categories = []
  }
}

// Watch for manual checkbox changes in Create form
watch(() => newRoom.value.allowed_categories, (newVal) => {
  selectAllCreate.value = newVal.length === userCategories.length
}, { deep: true })

// Watch for manual checkbox changes in Edit form
watch(() => editingRoom.value.allowed_categories, (newVal) => {
  selectAllEdit.value = newVal.length === userCategories.length
}, { deep: true })

// Sorted rooms computed property
const sortedRooms = computed(() => {
  if (!rooms.value || rooms.value.length === 0) return []

  const sorted = [...rooms.value].sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]

    // Special handling for requires_approval (boolean)
    if (sortField.value === 'requires_approval') {
      aValue = aValue ? 1 : 0
      bValue = bValue ? 1 : 0
    } else if (sortField.value === 'capacity') {
      // Numeric sort for capacity
      aValue = parseInt(aValue) || 0
      bValue = parseInt(bValue) || 0
    } else {
      // Handle null/undefined values for other fields
      if (!aValue) aValue = ''
      if (!bValue) bValue = ''

      // Convert to lowercase for case-insensitive sorting
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
    }

    // Compare
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return sorted
})

const totalItems = computed(() => sortedRooms.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return sortedRooms.value.slice(start, start + pageLimit)
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

// Sort function
const sortBy = (field) => {
  if (sortField.value === field) {
    // Toggle order if same field
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New field - reset to ascending
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Load rooms
const loadRooms = async () => {
  try {
    rooms.value = await $fetch('/api/admin/rooms', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load rooms', err)
  }
}

onMounted(() => {
  loadRooms()
})

watch([sortField, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

const createRoom = async () => {
  // Optimistic update: Clone form data before clearing
  const roomData = { ...newRoom.value }

  // Handle facilities - bisa berupa string comma-separated atau kosong
  let facilities = null
  if (roomData.facilities && typeof roomData.facilities === 'string' && roomData.facilities.trim() !== '') {
    facilities = JSON.stringify(roomData.facilities.split(',').map(f => f.trim()))
  }

  const allowedCategories = roomData.allowed_categories.length > 0 ? JSON.stringify(roomData.allowed_categories) : null

  loading.value = true
  message.value = ''
  error.value = ''

  // Clear form immediately for instant UX
  newRoom.value = {
    name: '',
    capacity: '',
    location: '',
    facilities: '',
    requires_approval: true,
    allowed_categories: []
  }

  try {
    const result = await $fetch('/api/admin/rooms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: {
        ...roomData,
        facilities,
        allowed_categories: allowedCategories
      }
    })

    // Add new room to list instantly
    rooms.value.unshift(result.room || result)

    // Show success message without blocking
    setTimeout(() => {
      message.value = 'Ruangan berhasil dibuat'
      setTimeout(() => { message.value = '' }, 3000)
    }, 100)
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal membuat ruangan'
    // Rollback: Re-fetch to ensure consistency
    await loadRooms()
  } finally {
    loading.value = false
  }
}

const editRoom = (room) => {
  // Normalize facilities to a comma-separated string
  // regardless of whether the API returns a JSON string, a parsed array, or plain text
  let facilitiesStr = ''
  if (room.facilities) {
    if (Array.isArray(room.facilities)) {
      // Already a parsed array — join directly
      facilitiesStr = room.facilities.join(', ')
    } else if (typeof room.facilities === 'string') {
      try {
        const parsed = JSON.parse(room.facilities)
        facilitiesStr = Array.isArray(parsed) ? parsed.join(', ') : room.facilities
      } catch (e) {
        // Not JSON — use as-is (plain comma-separated or single value)
        facilitiesStr = room.facilities
      }
    } else {
      facilitiesStr = String(room.facilities)
    }
  }

  // Populate edit form with room data
  editingRoom.value = {
    id: room.id,
    name: room.name || '',
    capacity: room.capacity || '',
    location: room.location || '',
    facilities: facilitiesStr,           // Always a normalized string now
    requires_approval: Boolean(room.requires_approval),
    allowed_categories: []
  }

  // Parse allowed_categories — robustly handles: JSON string, Array, null, undefined
  let parsedCategories = []
  if (Array.isArray(room.allowed_categories)) {
    // Already an array (e.g. some APIs return parsed JSON)
    parsedCategories = room.allowed_categories
  } else if (typeof room.allowed_categories === 'string' && room.allowed_categories.trim() !== '') {
    try {
      const parsed = JSON.parse(room.allowed_categories)
      parsedCategories = Array.isArray(parsed) ? parsed : []
    } catch (e) {
      // If not valid JSON, try comma-separated fallback
      parsedCategories = room.allowed_categories.split(',').map(s => s.trim()).filter(Boolean)
    }
  }
  editingRoom.value.allowed_categories = parsedCategories

  // Update "Pilih Semua" checkbox state
  selectAllEdit.value = parsedCategories.length === userCategories.length

  showEditModal.value = true
}

const deleteRoom = (room) => {
  // TODO: Implement delete functionality
  alert('Delete functionality not implemented yet')
}

const updateRoom = async () => {
  // Optimistic update: Clone form data and close modal
  const roomData = { ...editingRoom.value }

  // Handle facilities — always a string at this point (normalized in editRoom)
  // but guard against any edge-case where it could be an array or other type
  let facilities = null
  if (roomData.facilities) {
    if (Array.isArray(roomData.facilities)) {
      // Defensive: shouldn't happen, but handle gracefully
      if (roomData.facilities.length > 0) {
        facilities = JSON.stringify(roomData.facilities)
      }
    } else if (typeof roomData.facilities === 'string' && roomData.facilities.trim() !== '') {
      facilities = JSON.stringify(roomData.facilities.split(',').map(f => f.trim()).filter(Boolean))
    }
  }

  const allowedCategories = roomData.allowed_categories.length > 0 ? JSON.stringify(roomData.allowed_categories) : null

  console.log('Sending update with:', {
    roomData,
    facilities,
    allowedCategories,
    requires_approval: roomData.requires_approval,
    requires_approval_type: typeof roomData.requires_approval
  })

  editLoading.value = true
  editMessage.value = ''
  editError.value = ''

  // Close modal immediately for instant UX
  showEditModal.value = false

  try {
    const result = await $fetch(`/api/admin/rooms/${roomData.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: {
        ...roomData,
        facilities,
        allowed_categories: allowedCategories
      }
    })

    console.log('Received update result:', result)

    // Update room in list instantly
    const index = rooms.value.findIndex(r => r.id === roomData.id)
    if (index !== -1) {
      rooms.value[index] = result.room || result
      console.log('Updated room in list:', rooms.value[index])
    }

    // Show success message without blocking
    setTimeout(() => {
      editMessage.value = 'Ruangan berhasil diperbarui'
      setTimeout(() => { editMessage.value = '' }, 3000)
    }, 100)
  } catch (err) {
    console.error('Update room error:', err)
    editError.value = err.data?.statusMessage || 'Gagal memperbarui ruangan'
    // Rollback: Re-fetch to ensure consistency
    await loadRooms()
  } finally {
    editLoading.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingRoom.value = {
    id: '',
    name: '',
    capacity: '',
    location: '',
    facilities: '',
    requires_approval: true,
    allowed_categories: []
  }
  selectAllEdit.value = false
  editMessage.value = ''
  editError.value = ''
}
</script>
