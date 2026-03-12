<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[100000] flex items-center justify-center p-4"
        @click.self="closeModal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <button @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close modal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="bg-gradient-to-br from-paulus-blue to-blue-700 text-white p-8 pb-6 rounded-t-2xl">
            <div class="flex items-center justify-center mb-4">
              <div class="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-center mb-2">Portal Layanan Digital</h2>
            <p class="text-blue-100 text-center text-sm">
              Masuk untuk mengakses Kronik & Pemesanan Ruang
            </p>
          </div>

          <!-- Content -->
          <div class="p-8">
            <!-- Already Logged In -->
            <div v-if="isLoggedIn" class="space-y-6">
              <!-- User Info -->
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="h-14 w-14 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-900 truncate">{{ user?.full_name || user?.username || 'User' }}</p>
                    <p class="text-sm text-gray-600 truncate">{{ user?.unit_name || user?.user_category || 'Umat Paroki'
                      }}</p>
                  </div>
                </div>

                <!-- Roles -->
                <div class="border-t border-green-200 pt-4">
                  <p class="text-xs font-semibold text-gray-700 mb-2">Hak Akses:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="role in userRoles" :key="role"
                      class="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      {{ getRoleLabel(role) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Quick Access -->
              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Akses Cepat</h3>

                <!-- Kronik (hanya untuk admin/pengurus) -->
                <NuxtLink v-if="canAccessKronik" to="/kronik/manage" @click="closeModal"
                  class="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all group">
                  <div class="h-10 w-10 bg-paulus-blue rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-semibold text-gray-800 text-sm">Kelola Kronik</p>
                    <p class="text-xs text-gray-600">Isi & kelola kronik paroki</p>
                  </div>
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-paulus-blue transition-colors" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>

                <!-- Pemesanan Ruang -->
                <NuxtLink to="/booking" @click="closeModal"
                  class="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all group">
                  <div class="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-semibold text-gray-800 text-sm">Pemesanan Ruang</p>
                    <p class="text-xs text-gray-600">Booking ruang paroki</p>
                  </div>
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>

              <!-- Logout Button -->
              <button @click="handleLogout"
                class="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>

            <!-- Login Form -->
            <div v-else class="space-y-6">
              <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input v-model="loginForm.username" type="text" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paulus-blue focus:border-transparent text-gray-900"
                    placeholder="Masukkan username" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input v-model="loginForm.password" type="password" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paulus-blue focus:border-transparent text-gray-900"
                    placeholder="Masukkan password" />
                </div>

                <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-600">{{ errorMessage }}</p>
                </div>

                <button type="submit" :disabled="loading"
                  class="w-full bg-paulus-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ loading ? 'Memproses...' : 'Masuk' }}
                </button>
              </form>

              <!-- Info -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-sm text-blue-800">
                  <strong>💡 Layanan Portal User:</strong>
                </p>
                <ul class="text-xs text-blue-700 mt-2 space-y-1 ml-4">
                  <li>• <strong>Kronik Paroki</strong> - Ketua & Pengurus (DPP, BGKP, Wilayah, Lingkungan)</li>
                  <li>• <strong>Pemesanan Ruang</strong> - Semua user terdaftar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isLoggedIn = ref(false)
const user = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const loginForm = ref({
  username: '',
  password: ''
})

// Check login status on mount
onMounted(async () => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const response = await $fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        user.value = response
        isLoggedIn.value = true
      } catch (error) {
        console.error('[LoginModal] Token invalid:', error)
        localStorage.removeItem('auth_token')
      }
    }
  }
})

// Watch for modal open to refresh auth state
watch(() => props.modelValue, (newVal) => {
  if (newVal && process.client) {
    const token = localStorage.getItem('auth_token')
    if (token && !user.value) {
      $fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        user.value = response
        isLoggedIn.value = true
      }).catch(() => {
        localStorage.removeItem('auth_token')
      })
    }
  }
})

const isAdmin = computed(() => {
  if (!user.value) return false
  const roleStr = (user.value.role || '').toLowerCase()
  // Admin roles: super_admin, admin_sekretariat, admin_komsos, dll
  return roleStr.includes('admin') || user.value.role_id === 1
})

const userRoles = computed(() => {
  if (!user.value) return []
  const roles = []

  const roleStr = (user.value.role || '').toLowerCase()
  const category = (user.value.user_category || '').toLowerCase()
  const unitName = (user.value.unit_name || '').toLowerCase()

  // User biasa (bukan admin)
  if (roleStr === 'user' || !isAdmin.value) {
    // Check if has valid organizational category
    const validCategories = ['parish_council', 'categorical_group', 'region', 'community',
      'dpp', 'bgkp', 'wilayah', 'lingkungan']
    const hasValidCategory = validCategories.some(cat => category.includes(cat))

    if (hasValidCategory || unitName) {
      // Determine if ketua or pengurus based on unit_name
      if (unitName.includes('ketua')) {
        roles.push('ketua')
      } else {
        // Default: if has category/unit but not ketua, consider as pengurus
        roles.push('pengurus')
      }
    }
    roles.push('user')
  }

  return [...new Set(roles)]
})

const canAccessKronik = computed(() => {
  if (!user.value) return false

  // Admin tidak bisa akses kronik dari web public (harus dari panel admin)
  if (isAdmin.value) return false

  // User biasa dengan kategori tertentu bisa akses kronik
  const category = (user.value.user_category || '').toLowerCase()
  const unitName = (user.value.unit_name || '').toLowerCase()

  // 1. Cek kategori valid (DPP, BGKP, Wilayah, Lingkungan)
  const validCategories = ['parish_council', 'categorical_group', 'region', 'community',
    'dpp', 'bgkp', 'wilayah', 'lingkungan']
  const hasCategoryAccess = validCategories.some(cat => category.includes(cat))

  // 2. Cek unit_name jika ada
  const hasUnitAccess = unitName && (
    unitName.includes('ketua') ||
    unitName.includes('pengurus') ||
    unitName.includes('dpp') ||
    unitName.includes('bgkp') ||
    unitName.includes('wilayah') ||
    unitName.includes('lingkungan')
  )

  return hasCategoryAccess || hasUnitAccess
})

const getRoleLabel = (role) => {
  const labels = {
    'admin': '👑 Administrator',
    'ketua': '⭐ Ketua',
    'pengurus': '🔑 Pengurus',
    'user': '👤 User'
  }
  return labels[role] || role
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: loginForm.value
    })

    const token = response.accessToken
    localStorage.setItem('auth_token', token)

    const userResponse = await $fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })

    // Check if user is admin (admin tidak bisa login di web public)
    const roleStr = (userResponse.role || '').toLowerCase()
    if (roleStr.includes('admin') || userResponse.role_id === 1) {
      errorMessage.value = '❌ Admin harus login melalui Panel Admin (/admin/login)'
      localStorage.removeItem('auth_token')
      loading.value = false
      return
    }

    user.value = userResponse
    isLoggedIn.value = true

    loginForm.value.username = ''
    loginForm.value.password = ''
  } catch (error) {
    console.error('[LoginModal] Login error:', error)
    errorMessage.value = error.data?.statusMessage || 'Login gagal. Periksa username dan password Anda.'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  isLoggedIn.value = false
  user.value = null
  closeModal()
}

const closeModal = () => {
  emit('update:modelValue', false)
}

// Close on ESC key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.modelValue) {
      closeModal()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}

.paulus-blue {
  background-color: #1e40af;
}
</style>
