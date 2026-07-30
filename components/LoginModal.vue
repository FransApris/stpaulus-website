<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[100000] flex items-center justify-center p-4"
        @mousedown.self="overlayMousedown = true"
        @mouseup.self="if (overlayMousedown) closeModal(); overlayMousedown = false"
        @mouseleave="overlayMousedown = false">
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
          <div class="p-6 sm:p-8">
            <!-- Notice Banner when opened via ?login=required -->
            <div v-if="!isLoggedIn && route.query.login === 'required'" 
                 class="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-start gap-2.5 shadow-xs">
              <span class="text-base leading-none">🔐</span>
              <div>
                <strong class="font-bold text-amber-900">Akses Memerlukan Login</strong>
                <p class="text-amber-800 font-normal mt-0.5">Silakan masuk ke akun Anda terlebih dahulu untuk mengakses layanan paroki ini.</p>
              </div>
            </div>

            <!-- Already Logged In (User Profile Card) -->
            <div v-if="isLoggedIn" class="space-y-5">
              <!-- User Info Header -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-xs">
                <div class="flex items-center space-x-4 mb-3">
                  <div class="h-14 w-14 bg-gradient-to-br from-paulus-blue to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md border-2 border-white">
                    {{ getUserInitials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-900 text-base truncate">{{ user?.full_name || user?.username || 'User' }}</p>
                    <p class="text-xs text-gray-600 truncate mt-0.5">{{ user?.email || user?.contact_phone || 'Umat Paroki' }}</p>
                    <p class="text-xs font-semibold text-[#882f1d] truncate mt-0.5">🏷️ {{ user?.user_category || 'Umat Paroki' }}</p>
                  </div>
                </div>

                <!-- Roles Badge -->
                <div class="border-t border-blue-200/80 pt-3">
                  <p class="text-xs font-semibold text-gray-700 mb-1.5">Hak Akses Sistem:</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="role in userRoles" :key="role"
                      class="px-2.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700 border border-blue-200 shadow-xs">
                      {{ getRoleLabel(role) }}
                    </span>
                  </div>
                </div>

                <!-- Live User Quota Badge -->
                <div v-if="userQuota" class="bg-white/90 border border-blue-200 rounded-lg p-3 mt-3 text-xs">
                  <div class="flex items-center justify-between gap-1 flex-wrap">
                    <span class="font-bold text-gray-800 text-xs">📊 Status Kuota Pemesanan:</span>
                    <span v-if="userQuota.is_unlimited" class="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold text-[11px] border border-purple-200">
                      ✨ Tanpa Batas (DPP)
                    </span>
                    <span v-else :class="userQuota.remaining > 0 ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-900 border-amber-300'" class="px-2.5 py-0.5 rounded-full font-bold text-[11px] border">
                      Sisa {{ userQuota.remaining }} / {{ userQuota.max_allowed }}
                    </span>
                  </div>
                  <p v-if="!userQuota.is_unlimited" class="text-gray-600 text-[11px] mt-1">
                    Bulan {{ userQuota.period }}: Telah terpakai {{ userQuota.monthly_count }} dari maksimal {{ userQuota.max_allowed }} pemesanan.
                  </p>
                </div>
              </div>

              <!-- Quick Access Actions -->
              <div class="space-y-2.5">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Akses Layanan</h3>

                <!-- Pemesanan Ruang -->
                <button @click="navigateToBookingSection('')"
                  class="w-full flex items-center space-x-3 p-3.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-md transition-all text-left group">
                  <div class="h-9 w-9 bg-green-600 text-white rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-800 text-sm">Katalog & Pesan Ruang</p>
                    <p class="text-xs text-green-700 font-medium">Pilih fasilitas & buat sewa baru</p>
                  </div>
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Pemesanan Saya -->
                <button @click="navigateToBookingSection('#pemesanan-saya')"
                  class="w-full flex items-center space-x-3 p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl hover:shadow-md transition-all text-left group">
                  <div class="h-9 w-9 bg-purple-600 text-white rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-800 text-sm">Riwayat Booking Saya</p>
                    <p class="text-xs text-purple-700 font-medium">Status & daftar transaksi sewa Anda</p>
                  </div>
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Kronik (hanya untuk admin/pengurus) -->
                <NuxtLink v-if="canAccessKronik" to="/kronik/manage" @click="closeModal"
                  class="flex items-center space-x-3 p-3.5 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl hover:shadow-md transition-all group">
                  <div class="h-9 w-9 bg-paulus-blue text-white rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-800 text-sm">Kelola Kronik</p>
                    <p class="text-xs text-gray-600">Isi & kelola peristiwa paroki</p>
                  </div>
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-paulus-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>

              <!-- Logout Button -->
              <button @click="handleLogout"
                class="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-200 flex items-center justify-center space-x-2 text-sm mt-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar / Logout</span>
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
                  <div class="text-right mt-1">
                    <NuxtLink to="/lupa-password" @click="$emit('update:modelValue', false)"
                      class="text-xs text-paulus-blue hover:underline">
                      Lupa password?
                    </NuxtLink>
                  </div>
                </div>

                <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-600">{{ errorMessage }}</p>
                </div>

                <button type="submit" :disabled="loading"
                  class="w-full bg-paulus-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ loading ? 'Memproses...' : 'Masuk' }}
                </button>

                <!-- Link daftar akun baru -->
                <div class="text-center text-sm text-gray-600">
                  Belum punya akun?
                  <NuxtLink to="/daftar" @click="$emit('update:modelValue', false)" class="text-paulus-blue font-semibold hover:underline">
                    Daftar di sini →
                  </NuxtLink>
                </div>
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

const route = useRoute()

const isLoggedIn = ref(false)
const user = ref(null)
const userQuota = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const loginForm = ref({
  username: '',
  password: ''
})

const getUserInitials = computed(() => {
  if (!user.value) return '?'
  const name = user.value.full_name || user.value.username || ''
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const loadUserQuota = async () => {
  if (!process.client) return
  const token = localStorage.getItem('auth_token')
  if (!token) {
    userQuota.value = null
    return
  }
  try {
    const data = await $fetch('/api/bookings/my-quota', {
      headers: { Authorization: `Bearer ${token}` }
    })
    userQuota.value = data
  } catch (err) {
    console.warn('[LoginModal] Could not fetch quota:', err)
  }
}

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
        loadUserQuota()
      } catch (error) {
        console.error('[LoginModal] Token invalid:', error)
        localStorage.removeItem('auth_token')
      }
    }
  }
})

// Watch for modal open to refresh auth state and quota
watch(() => props.modelValue, (newVal) => {
  if (newVal && process.client) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      $fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        user.value = response
        isLoggedIn.value = true
        loadUserQuota()
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
  const validCategories = [
    'parish_council',
    'categorical_group',
    'region',
    'community',
    'dewan pastoral paroki',
    'kategorial',
    'wilayah',
    'lingkungan',
    'komunitas',
    'dpp',
    'bgkp',
    'seksi'
  ]

  // User biasa (bukan admin)
  if (roleStr === 'user' || !isAdmin.value) {
    // Check if has valid organizational category
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
  const validCategories = [
    'parish_council',
    'categorical_group',
    'region',
    'community',
    'dewan pastoral paroki',
    'kategorial',
    'wilayah',
    'lingkungan',
    'komunitas',
    'dpp',
    'bgkp',
    'seksi'
  ]

  // 1. Cek kategori valid (DPP, BGKP, Wilayah, Lingkungan)
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

const navigateToBookingSection = async (sectionHash = '') => {
  closeModal()
  if (!process.client) return

  const targetId = sectionHash === '#pemesanan-saya' ? 'pemesanan-saya' : 'katalog-ruangan'

  const doScroll = () => {
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (route.path === '/booking') {
    setTimeout(doScroll, 50)
  } else {
    await navigateTo(`/booking${sectionHash}`)
    setTimeout(doScroll, 450)
  }
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
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.data?.message ||
      error?.statusMessage ||
      error?.message ||
      'Login gagal. Periksa username dan password Anda.'
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

const overlayMousedown = ref(false)

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
