<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <img src="/images/logo-paulus-juanda.png" alt="Logo Paroki" class="h-8 w-auto" />
            <h1 class="text-xl font-cinzel font-bold text-[#882f1d]">Portal Kontributor</h1>
          </div>
          
          <div class="flex items-center gap-6">
            <nav class="hidden md:flex gap-4">
              <NuxtLink to="/kontributor" class="text-sm font-medium hover:text-[#882f1d] transition-colors"
                :class="$route.path === '/kontributor' ? 'text-[#882f1d]' : 'text-gray-600'">
                Berita Saya
              </NuxtLink>
              <NuxtLink to="/kontributor/tulis" class="text-sm font-medium hover:text-[#882f1d] transition-colors"
                :class="$route.path === '/kontributor/tulis' ? 'text-[#882f1d]' : 'text-gray-600'">
                Tulis Berita
              </NuxtLink>
            </nav>
            
            <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div class="text-sm text-gray-700 hidden sm:block">
                <ClientOnly fallback="Kontributor">
                  {{ displayName }}
                </ClientOnly>
              </div>
              <button @click="logout" class="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-4 mt-auto">
      <div class="max-w-5xl mx-auto px-4 text-center text-xs text-gray-500">
        &copy; {{ new Date().getFullYear() }} Paroki St. Paulus Juanda. Khusus Kontributor Internal.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
// Gunakan computed agar reaktif ketika auth.user diisi setelah fetchUserData selesai
const displayName = computed(() => auth.user.value?.username || 'Kontributor')

const logout = () => {
  auth.logout()
  navigateTo('/kontributor/login')
}
</script>
