<template>
  <!-- Mobile Bottom Navigation - Only visible on mobile screens -->
  <nav :class="[
    'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[9998] md:hidden transition-transform duration-300',
    isHidden ? 'translate-y-full' : 'translate-y-0'
  ]">
    <!-- 4 nav items terbagi rata menggunakan grid-cols-4 -->
    <div
      class="grid grid-cols-4 items-center py-2 px-1"
      style="padding-bottom: max(8px, env(safe-area-inset-bottom));"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="handleNavClick(item.path)"
        :class="getNavItemClasses(item.path)"
        class="touch-feedback relative flex flex-col items-center justify-center py-2 px-1 transition-all duration-300 min-h-[44px] cursor-pointer"
      >
        <!-- Active Indicator Line -->
        <div 
          class="absolute top-0 left-1/2 -translate-x-1/2 h-1 bg-[#882f1d] rounded-b-md transition-all duration-300 ease-out"
          :class="isRouteActive(item.path) ? 'w-1/2 opacity-100' : 'w-0 opacity-0'"
        ></div>
        <div 
          class="w-6 h-6 mb-1 flex items-center justify-center transition-transform duration-300"
          :class="isRouteActive(item.path) ? '-translate-y-0.5' : ''"
        >
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-xs font-medium text-center leading-tight">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
// ── ICON DECLARATIONS — HARUS di atas segalanya (mencegah TDZ di build produksi) ──
const HomeIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })])
const DocumentIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })])
const CalendarIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })])
const PhoneIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })])

const route = useRoute()

// 4 menu utama — tombol Menu bulat tengah telah dihapus sesuai revisi UX
const navItems = [
  { label: 'Beranda', path: '/', icon: HomeIcon },
  { label: 'Berita', path: '/berita', icon: DocumentIcon },
  { label: 'Agenda', path: '/agenda', icon: CalendarIcon },
  { label: 'Kontak', path: '/kontak', icon: PhoneIcon },
]

const isHidden = ref(false)
const lastScrollY = ref(0)
const SCROLL_THRESHOLD = 100

const handleScroll = () => {
  const currentScrollY = window.scrollY
  if (currentScrollY > lastScrollY.value && currentScrollY > SCROLL_THRESHOLD) {
    isHidden.value = true
  } else if (currentScrollY < lastScrollY.value) {
    isHidden.value = false
  }
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    isHidden.value = false
  }
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  if (process.client) window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  if (process.client) window.removeEventListener('scroll', handleScroll)
})

const isRouteActive = (itemPath: string) => {
  return route.path === itemPath ||
    (itemPath === '/berita' && route.path.startsWith('/berita')) ||
    (itemPath === '/agenda' && route.path.startsWith('/agenda'))
}

const getNavItemClasses = (itemPath: string) => {
  const isActive = isRouteActive(itemPath)
  return isActive
    ? 'text-[#882f1d] bg-gradient-to-b from-[#882f1d]/10 to-transparent'
    : 'text-gray-600 hover:text-[#882f1d] hover:bg-gray-50'
}

const handleNavClick = (targetPath: string) => {
  if (process.client) {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      const mainEl = document.querySelector('main')
      if (mainEl) mainEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
    scrollToTop()
    nextTick(() => scrollToTop())
    setTimeout(() => scrollToTop(), 150)
    setTimeout(() => scrollToTop(), 350)
  }
}
</script>

<style scoped>
nav a {
  min-height: 44px;
  min-width: 44px;
}
</style>
