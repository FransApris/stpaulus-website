<template>
  <div class="space-y-6">
    <!-- Add User Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-2">Tambah Pengguna Baru</h2>
      <form @submit.prevent="createUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Tipe User Selection -->
        <div class="md:col-span-2 mb-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipe Pengguna *</label>
          <div class="grid grid-cols-2 gap-4">
            <div 
              @click="newUser.role = 'user'" 
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                newUser.role === 'user' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-300'
              ]"
            >
              <div class="flex items-center">
                <input 
                  type="radio" 
                  v-model="newUser.role" 
                  value="user" 
                  class="mr-3"
                  required
                />
                <div>
                  <div class="font-semibold text-gray-900">👤 User (Booking)</div>
                  <div class="text-xs text-gray-600 mt-1">
                    Untuk pemesanan ruangan saja.<br/>
                    TIDAK dapat akses panel admin.
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              v-if="isSuperAdmin"
              @click="newUser.role = 'admin'" 
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                newUser.role === 'admin' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              ]"
            >
              <div class="flex items-center">
                <input 
                  type="radio" 
                  v-model="newUser.role" 
                  value="admin" 
                  class="mr-3"
                />
                <div>
                  <div class="font-semibold text-gray-900">🔐 Admin</div>
                  <div class="text-xs text-gray-600 mt-1">
                    Dapat akses panel admin.<br/>
                    TIDAK dapat booking ruangan.
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              v-if="!isSuperAdmin"
              class="p-4 border-2 border-gray-200 bg-gray-100 rounded-lg opacity-60"
            >
              <div class="flex items-center">
                <div>
                  <div class="font-semibold text-gray-500">🔐 Admin</div>
                  <div class="text-xs text-gray-500 mt-1">
                    Hanya Super Admin yang dapat<br/>
                    membuat akun admin.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Role Selection (only if admin type selected) -->
        <div v-if="newUser.role === 'admin' && isSuperAdmin" class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Role Admin *</label>
          <select v-model="newUser.adminRole" class="border p-2 rounded w-full" required>
            <option value="">Pilih Role Admin</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin_komsos">Admin Komsos</option>
            <option value="admin_sekretariat">Admin Sekretariat</option>
          </select>
        </div>

        <input v-model="newUser.username" type="text" placeholder="Username *" class="border p-2 rounded" required />
        <input v-model="newUser.email" type="email" placeholder="Email *" class="border p-2 rounded" required />
        <input v-model="newUser.password" type="password" placeholder="Password *" class="border p-2 rounded" required minlength="6" />
        <input v-model="newUser.full_name" type="text" placeholder="Nama Lengkap *" class="border p-2 rounded" required />
        <input v-model="newUser.contact_phone" type="text" placeholder="No. Telepon" class="border p-2 rounded" />
        <select v-model="newUser.user_category" class="border p-2 rounded" required>
          <option value="">Pilih Kategori *</option>
          <option v-for="category in userCategories.filter(c => c.is_active)" :key="category.id" :value="category.name">
            {{ category.display_name }}
          </option>
        </select>
        <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 md:col-span-2">
          {{ loading ? 'Membuat...' : (newUser.role === 'admin' ? '🔐 Buat Admin' : '👤 Buat User') }}
        </button>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>        <!-- Users List -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Daftar Pengguna</h2>
            <div class="flex items-center gap-4">
              <div class="text-xs text-gray-500">
                Total: {{ totalItems }} pengguna
              </div>
              <div class="text-sm text-gray-600">
                <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded mr-2">
                  🔐 Admin
                </span>
                <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">
                  👤 User Booking
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="users.length === 0" class="text-gray-500">Belum ada pengguna.</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full table-auto">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('username')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Username
                      <span class="text-xs">
                        <span v-if="sortField === 'username' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'username' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('full_name')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Nama
                      <span class="text-xs">
                        <span v-if="sortField === 'full_name' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'full_name' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left font-semibold">Email</th>
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('user_category')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Kategori
                      <span class="text-xs">
                        <span v-if="sortField === 'user_category' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'user_category' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('role_id')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Tipe
                      <span class="text-xs">
                        <span v-if="sortField === 'role_id' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'role_id' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" class="border-t hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-2">{{ user.username }}</td>
                  <td class="px-4 py-2">{{ user.full_name }}</td>
                  <td class="px-4 py-2">{{ user.email }}</td>
                  <td class="px-4 py-2">
                    <span v-if="user.user_category" class="text-sm">{{ user.user_category }}</span>
                    <span v-else class="text-gray-400 text-sm italic">-</span>
                  </td>
                  <td class="px-4 py-2">
                    <span v-if="user.role_id && user.role_id > 0" class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      🔐 Admin
                    </span>
                    <span v-else class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      👤 User
                    </span>
                  </td>
                  <td class="px-4 py-2">
                    <button @click="editUser(user)" title="Edit" class="text-blue-600 hover:text-blue-800 mr-2 p-1 inline-flex items-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button v-if="isSuperAdmin" @click="openResetPasswordModal(user)" title="Reset Password" class="text-orange-600 hover:text-orange-800 mr-2 p-1 inline-flex items-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                      </svg>
                    </button>
                    <button @click="deleteUser(user)" title="Hapus" class="text-red-600 hover:text-red-800 p-1 inline-flex items-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

        <!-- Reset Password Modal -->
        <div v-if="showResetPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Reset Password Pengguna</h3>
            <form @submit.prevent="resetPassword">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                <input
                  v-model="selectedUser.username"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  readonly
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  v-model="resetPasswordData.newPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Masukkan password baru"
                  required
                  minlength="6"
                />
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  v-model="resetPasswordData.confirmPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Konfirmasi password baru"
                  required
                  minlength="6"
                />
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeResetPasswordModal"
                  class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="resetPasswordLoading || resetPasswordData.newPassword !== resetPasswordData.confirmPassword || resetPasswordData.newPassword.length < 6"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ resetPasswordLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </form>
            <p v-if="resetPasswordError" class="mt-2 text-red-600 text-sm">{{ resetPasswordError }}</p>
            <p v-if="resetPasswordMessage" class="mt-2 text-green-600 text-sm">{{ resetPasswordMessage }}</p>
          </div>
        </div>

        <!-- Edit User Modal -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Edit Pengguna</h3>
            <form @submit.prevent="updateUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="editingUser.username" type="text" placeholder="Username" class="border p-2 rounded" required />
              <input v-model="editingUser.email" type="email" placeholder="Email (opsional)" class="border p-2 rounded" />
              <input v-model="editingUser.full_name" type="text" placeholder="Nama Lengkap" class="border p-2 rounded" required />
              <input v-model="editingUser.contact_phone" type="text" placeholder="No. Telepon" class="border p-2 rounded" />
              <select v-model="editingUser.user_category" class="border p-2 rounded">
                <option value="">Pilih Kategori</option>
                <option v-for="category in userCategories.filter(c => c.is_active)" :key="category.id" :value="category.name">
                  {{ category.display_name }}
                </option>
              </select>
              
              <!-- Info about user type (read-only) -->
              <div class="md:col-span-2 p-3 bg-gray-50 border border-gray-200 rounded">
                <p class="text-sm text-gray-700">
                  <strong>Tipe Pengguna:</strong> 
                  <span v-if="editingUser.role_id && editingUser.role_id > 0" class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs ml-2">
                    🔐 Admin
                  </span>
                  <span v-else class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs ml-2">
                    👤 User (Booking)
                  </span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  ℹ️ Tipe pengguna tidak dapat diubah melalui panel admin.
                </p>
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
  layout: 'admin',
  middleware: 'auth'
})

const users = useState('admin-users', () => [])
const userCategories = useState('admin-users-categories', () => [])
const newUser = ref({
  username: '',
  email: '',
  password: '',
  full_name: '',
  contact_phone: '',
  user_category: '',
  role: 'user',
  adminRole: ''
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Sorting state
const sortField = ref('username')
const sortOrder = ref('asc')

// Reset password modal
const showResetPasswordModal = ref(false)
const selectedUser = ref({})
const resetPasswordData = ref({
  newPassword: '',
  confirmPassword: ''
})
const resetPasswordLoading = ref(false)
const resetPasswordMessage = ref('')
const resetPasswordError = ref('')

// Edit modal
const showEditModal = ref(false)
const editingUser = ref({
  id: '',
  username: '',
  email: '',
  full_name: '',
  contact_phone: '',
  user_category: '',
  unit_name: '',
  role: 'user'
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')

// Current user info
const currentUser = useState('admin-users-current-user', () => null)

// Pagination state
const currentPage = useState('admin-users-page', () => 1)
const pageLimit = 10

// Check if current user is super admin
const isSuperAdmin = computed(() => {
  return currentUser.value?.role_name === 'super_admin'
})

// Sorted users computed property
const sortedUsers = computed(() => {
  if (!users.value || users.value.length === 0) return []
  
  const sorted = [...users.value].sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]
    
    // Special handling for role_id (Tipe)
    if (sortField.value === 'role_id') {
      // Convert role_id to sortable value: NULL/0 = 0 (User), > 0 = 1 (Admin)
      aValue = (aValue && aValue > 0) ? 1 : 0
      bValue = (bValue && bValue > 0) ? 1 : 0
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

const totalItems = computed(() => sortedUsers.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return sortedUsers.value.slice(start, start + pageLimit)
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
    // New field, default to ascending
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Load current user info
const loadCurrentUser = async () => {
  try {
    currentUser.value = await $fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load current user', err)
  }
}

// Load user categories
const loadUserCategories = async () => {
  try {
    userCategories.value = await $fetch('/api/admin/user-categories', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    // If 403 Forbidden, set empty categories for restricted users
    if (err.statusCode === 403) {
      userCategories.value = []
      return
    }
    console.error('Failed to load user categories', err)
  }
}

// Load users
const loadUsers = async () => {
  try {
    const response = await $fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    
    // Handle both array response (old) and object response (new)
    users.value = Array.isArray(response) ? response : (response.users || [])
    
    console.log('[Users Page] Loaded', users.value.length, 'users')
  } catch (err) {
    console.error('[Users Page] Failed to load users:', err)
    users.value = []
  }
}

onMounted(async () => {
  await loadCurrentUser()
  await loadUserCategories()
  await loadUsers()
})

watch([sortField, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

const createUser = async () => {
  // Optimistic update: Clone form data before clearing
  const userData = { ...newUser.value }
  
  // Determine the correct role to send to backend
  let roleToSend = 'user'
  if (userData.role === 'admin' && userData.adminRole) {
    roleToSend = userData.adminRole // super_admin, admin_komsos, or admin_sekretariat
  }
  
  // Prepare clean data for API
  const cleanUserData = {
    username: userData.username || '',
    email: userData.email || '',
    password: userData.password || '',
    full_name: userData.full_name || '',
    contact_phone: userData.contact_phone || '',
    user_category: userData.user_category || '',
    role: roleToSend || 'user'
  }

  console.log('[Create User Frontend] Sending data:', cleanUserData)
  
  loading.value = true
  message.value = ''
  error.value = ''
  
  // Clear form immediately for instant UX
  newUser.value = {
    username: '',
    email: '',
    password: '',
    full_name: '',
    contact_phone: '',
    user_category: '',
    role: 'user',
    adminRole: ''
  }
  
  try {
    const result = await $fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: cleanUserData
    })
    
    console.log('[Create User] Server response:', result)
    console.log('[Create User] User data:', result.user)
    console.log('[Create User] User role_id:', result.user?.role_id)
    
    // Add new user to list instantly
    users.value.unshift(result.user || result)
    
    setTimeout(() => {
      message.value = roleToSend === 'user' ? 'User berhasil dibuat' : 'Admin berhasil dibuat'
    }, 100)
  } catch (err) {
    console.error('[Create User] Error:', err)
    error.value = err.data?.statusMessage || 'Gagal membuat pengguna'
    // Rollback: Re-fetch to ensure consistency
    await loadUsers()
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  // Populate edit form with user data
  editingUser.value = { 
    ...user,
    // Use role_name from RBAC if available, fallback to legacy role field
    role: user.role_name || user.role
  }
  showEditModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.username}"? Tindakan ini tidak dapat dibatalkan.`)) {
    return
  }

  // Optimistic update: Remove from UI immediately
  const deletedUser = { ...user }
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    users.value.splice(index, 1)
  }

  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    
    setTimeout(() => {
      alert('Pengguna berhasil dihapus')
    }, 100)
  } catch (err) {
    alert(`Gagal menghapus pengguna: ${err.data?.statusMessage || 'Terjadi kesalahan'}`)
    
    // Rollback: Re-add the deleted user
    if (index !== -1) {
      users.value.splice(index, 0, deletedUser)
    }
  }
}

// Reset password functions
const openResetPasswordModal = (user) => {
  selectedUser.value = user
  resetPasswordData.value = {
    newPassword: '',
    confirmPassword: ''
  }
  resetPasswordMessage.value = ''
  resetPasswordError.value = ''
  showResetPasswordModal.value = true
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  selectedUser.value = {}
  resetPasswordData.value = {
    newPassword: '',
    confirmPassword: ''
  }
}

const resetPassword = async () => {
  if (resetPasswordData.value.newPassword !== resetPasswordData.value.confirmPassword) {
    resetPasswordError.value = 'Password dan konfirmasi password tidak cocok'
    return
  }

  resetPasswordLoading.value = true
  resetPasswordMessage.value = ''
  resetPasswordError.value = ''

  try {
    const response = await $fetch(`/api/admin/users/${selectedUser.value.id}/reset-password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: {
        newPassword: resetPasswordData.value.newPassword
      }
    })

    resetPasswordMessage.value = response.message
    setTimeout(() => {
      closeResetPasswordModal()
    }, 2000)
  } catch (err) {
    resetPasswordError.value = err.data?.statusMessage || 'Gagal me-reset password'
  } finally {
    resetPasswordLoading.value = false
  }
}

const updateUser = async () => {
  // Optimistic update: Clone form data and close modal
  const userData = { ...editingUser.value }
  const originalUserData = users.value.find(u => u.id === userData.id)
  
  // Clean up data: remove fields that are not editable or should not be sent to API
  const cleanUserData = {
    username: userData.username,
    email: userData.email,
    full_name: userData.full_name,
    contact_phone: userData.contact_phone,
    user_category: userData.user_category
  }
  
  // Only super admin can edit role
  if (isSuperAdmin.value && userData.role) {
    cleanUserData.role = userData.role
  }
  
  editLoading.value = true
  editMessage.value = ''
  editError.value = ''
  
  // Close modal immediately for instant UX
  showEditModal.value = false
  
  try {
    const result = await $fetch(`/api/admin/users/${userData.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: cleanUserData
    })
    
    // Update user in list instantly
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1) {
      users.value[index] = result.user || result
    }
    
    setTimeout(() => {
      editMessage.value = 'Pengguna berhasil diperbarui'
      setTimeout(() => { editMessage.value = '' }, 3000)
    }, 100)
  } catch (err) {
    console.error('[Update User] Error:', err)
    
    // Show error via alert since modal is closed
    setTimeout(() => {
      alert(`Gagal memperbarui pengguna: ${err.data?.statusMessage || 'Terjadi kesalahan'}`)
    }, 100)
    
    // Rollback: Restore original user data
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1 && originalUserData) {
      users.value[index] = originalUserData
    } else {
      // If can't rollback, re-fetch to ensure consistency
      await loadUsers()
    }
  } finally {
    editLoading.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {
    id: '',
    username: '',
    email: '',
    full_name: '',
    contact_phone: '',
    user_category: '',
    unit_name: '',
    role: 'user'
  }
  editMessage.value = ''
  editError.value = ''
}
</script>
