<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <ClientOnly>
      <div id="admin-sidebar" class="w-64 bg-white shadow-lg flex-shrink-0">
        <div class="flex flex-col h-full">
          <!-- Logo/Header -->
          <div class="flex items-center justify-center h-16 px-4 bg-[#882f1d] flex-shrink-0">
            <img src="/images/logo-paulus-juanda.png" alt="Logo Paroki St. Paulus" class="h-10 w-auto mr-3" />
            <h1 class="text-xl font-cinzel text-white font-bold">CMS Admin</h1>
          </div>

          <!-- Navigation (Dynamic Array of Objects) -->
          <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            <template v-for="menu in filteredMenus" :key="menu.id || menu.route">
              <!-- Single Link Menu (e.g. Dashboard) -->
              <NuxtLink v-if="!menu.children && menu.route" :to="menu.route"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882f1d]"
                :class="$route.path === menu.route ? 'bg-[#882f1d] text-white shadow-sm' : 'text-gray-700 hover:bg-red-50 hover:text-[#882f1d]'"
                @keydown.enter="navigateTo(menu.route)" @keydown.space.prevent="navigateTo(menu.route)">
                <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === menu.route ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menu.icon"></path>
                </svg>
                <span>{{ menu.title }}</span>
              </NuxtLink>

              <!-- Group / Accordion Menu -->
              <div v-else-if="menu.children && menu.children.length > 0">
                <div @click="toggleGroup(menu.id)"
                  class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                  :class="isGroupActive(menu) ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menu.icon"></path>
                  </svg>
                  <span class="flex-1 font-bold">{{ menu.title }}</span>
                  <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                    :class="openGroups[menu.id || ''] ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
                <div v-show="openGroups[menu.id || '']" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                  <NuxtLink v-for="child in menu.children" :key="child.route" :to="child.route" :prefetch="child.prefetch"
                    class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                    :class="isChildActive(child.route) ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                    <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="isChildActive(child.route) ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="child.icon"></path>
                    </svg>
                    <span>{{ child.title }}</span>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </nav>

          <!-- Logout -->
          <div class="p-4 border-t flex-shrink-0 bg-gray-50/50">
            <button @click="handleLogout"
              class="flex items-center w-full px-4 py-2.5 text-sm font-bold text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
              <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header id="admin-topheader" class="bg-white shadow-sm flex-shrink-0">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-cinzel text-gray-900 font-bold">{{ pageTitle }}</h2>
              <p class="text-sm text-gray-600">Selamat datang di panel admin CMS</p>
              <p v-if="user" class="text-xs text-[#882f1d] font-semibold mt-0.5">Anda login sebagai: {{ user.role_display_name }}</p>
            </div>
            <div class="text-sm text-gray-500 font-medium">
              {{ currentDate }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ADMIN_NAVIGATION, type AdminNavGroup } from '~/utils/adminMenu'

interface AdminUser {
  id: string | number
  role_name: string
  role_display_name: string
  permissions: string[]
}

// User state
const user = useState<AdminUser | null>('admin-layout-user', () => null)
const route = useRoute()

// Group toggle states
const openGroups = reactive<Record<string, boolean>>({
  profil_paroki: false,
  publikasi: false,
  peribadatan: false,
  booking: false,
  kronik: false,
  dokumen_interaksi: false,
  pengaturan_sistem: false
})

const toggleGroup = (groupId?: string) => {
  if (!groupId) return
  openGroups[groupId] = !openGroups[groupId]
}

// Cek status aktif child menu (termasuk subroute dinamis seperti /admin/pastors/create)
const isChildActive = (targetRoute: string) => {
  if (route.path === targetRoute) return true
  // Khusus kronik sections agar tidak false positive dengan /admin/kronik
  if (targetRoute === '/admin/kronik' && route.path.startsWith('/admin/kronik/sections')) return false
  return route.path.startsWith(targetRoute + '/')
}

// Cek apakah accordion group sedang aktif berdasarkan route anak
const isGroupActive = (group: AdminNavGroup) => {
  if (!group.children) return false
  return group.children.some(child => isChildActive(child.route))
}

// Filter menu dinamis secara ketat berdasarkan role pengguna saat ini
const filteredMenus = computed(() => {
  const currentRole = user.value?.role_name
  if (!currentRole) return []

  return ADMIN_NAVIGATION.map(group => {
    // 1. Cek apakah role diizinkan melihat grup ini (optional chaining: aman jika allowedRoles undefined)
    if (!group.allowedRoles?.includes(currentRole)) {
      return null
    }

    // 2. Jika grup memiliki sub-menu (children), filter sub-menu berdasarkan role
    if (group.children) {
      const allowedChildren = group.children.filter(child => child.allowedRoles.includes(currentRole))
      if (allowedChildren.length === 0) {
        return null
      }
      return {
        ...group,
        children: allowedChildren
      }
    }

    // 3. Menu single (seperti Dashboard)
    return group
  }).filter((item): item is AdminNavGroup => item !== null)
})

// Auto-open sidebar group ketika pengguna membuka halaman yang berada di dalam grup tersebut
watch(() => route.path, (newPath) => {
  filteredMenus.value.forEach(group => {
    if (group.id && group.children) {
      if (group.children.some(child => isChildActive(child.route) || newPath.startsWith(child.route))) {
        openGroups[group.id] = true
      }
    }
  })
}, { immediate: true })

// Ambil & validasi sesi admin saat layout dimount
onMounted(async () => {
  try {
    const token = sessionStorage.getItem('admin_access_token')

    if (!token) {
      navigateTo('/admin/login')
      return
    }

    const decoded = JSON.parse(atob(token.split('.')[1]))

    let resolvedRole = decoded.role
    let resolvedPermissions: string[] = []

    try {
      const me: any = await $fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-cache'
      })

      if (me?.role) {
        resolvedRole = me.role
      }

      if (Array.isArray(me?.permissions)) {
        resolvedPermissions = me.permissions
      }
    } catch {
      // Pertahankan role dari decode token jika endpoint /api/admin/me gagal merespons
    }

    user.value = {
      id: decoded.userId,
      role_name: resolvedRole,
      role_display_name: resolvedRole === 'super_admin' ? 'Super Admin' :
        resolvedRole === 'admin_komsos' ? 'Admin Komsos' :
          resolvedRole === 'admin_sekretariat' ? 'Admin Sekretariat' : resolvedRole,
      permissions: resolvedPermissions
    }
  } catch (error) {
    navigateTo('/admin/login')
  }
})

// Helper function untuk cek permission
const hasPermission = (permission: string) => {
  return user.value?.permissions?.includes(permission) || false
}

// Menentukan judul halaman secara dinamis dari konfigurasi menu yang sudah difilter
// (menggunakan filteredMenus bukan ADMIN_NAVIGATION global agar tidak bocorkan
// nama halaman yang tidak diizinkan untuk role saat ini)
const pageTitle = computed(() => {
  const currentPath = route.path
  if (currentPath === '/admin/dashboard') return 'Dashboard'
  if (currentPath === '/admin/kronik/create') return 'Buat Kronik Baru'
  if (currentPath === '/admin/forbidden') return 'Akses Ditolak'

  for (const group of filteredMenus.value) {
    if (group.children) {
      const match = group.children.find(child => isChildActive(child.route) || currentPath === child.route)
      if (match) return match.title
    }
  }
  return 'Admin Panel'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const handleLogout = async () => {
  try {
    localStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')

    user.value = null

    Object.keys(openGroups).forEach(key => {
      openGroups[key] = false
    })

    await nextTick()
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
    await navigateTo('/admin/login')
  }
}
</script>

<style scoped>
/* Scrollbar styling for admin sidebar */
nav::-webkit-scrollbar {
  width: 5px;
}
nav::-webkit-scrollbar-track {
  background: transparent;
}
nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}
nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
