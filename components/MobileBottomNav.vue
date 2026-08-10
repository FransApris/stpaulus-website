<template>
  <!-- Mobile Bottom Navigation - Only visible on mobile screens -->
  <nav :class="[
    'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[9998] md:hidden transition-transform duration-300',
    isHidden ? 'translate-y-full' : 'translate-y-0'
  ]">
    <div class="flex items-center justify-around py-2 px-2" style="padding-bottom: max(8px, env(safe-area-inset-bottom));">

      <!-- Nav items: first 2 -->
      <NuxtLink
        v-for="item in navItems.slice(0, 2)"
        :key="item.path"
        :to="item.path"
        @click="handleNavClick(item.path)"
        :class="getNavItemClasses(item.path)"
        class="touch-feedback flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-200 min-h-[44px] cursor-pointer"
      >
        <div class="w-6 h-6 mb-1 flex items-center justify-center">
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-xs font-medium text-center leading-tight">{{ item.label }}</span>
      </NuxtLink>

      <!-- Center action button — opens Bottom Sheet -->
      <button
        id="btn-bottom-sheet-open"
        aria-label="Buka menu cepat"
        class="touch-feedback relative flex flex-col items-center justify-center flex-shrink-0 mx-1"
        @click="openQuickMenu"
      >
        <div class="w-13 h-13 rounded-full bg-[#882f1d] shadow-lg flex items-center justify-center -mt-5 border-4 border-white transition-transform active:scale-90">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <span class="text-xs font-medium text-gray-500 mt-1">Menu</span>
      </button>

      <!-- Nav items: last 2 -->
      <NuxtLink
        v-for="item in navItems.slice(2)"
        :key="item.path"
        :to="item.path"
        @click="handleNavClick(item.path)"
        :class="getNavItemClasses(item.path)"
        class="touch-feedback flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-200 min-h-[44px] cursor-pointer"
      >
        <div class="w-6 h-6 mb-1 flex items-center justify-center">
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-xs font-medium text-center leading-tight">{{ item.label }}</span>
      </NuxtLink>

    </div>
  </nav>

  <!-- Bottom Sheet / Mobile Drawer — content injected via MobileBottomNav -->
  <BottomSheet>
    <div class="space-y-1">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">Navigasi Cepat</p>
      <NuxtLink
        v-for="link in quickLinks"
        :key="link.path"
        :to="link.path"
        @click="handleQuickLink(link.path)"
        class="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors touch-feedback-subtle"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ background: link.color + '18' }">
          <component :is="link.icon" class="w-5 h-5" :style="{ color: link.color }" />
        </div>
        <div>
          <p class="font-semibold text-gray-800 text-sm">{{ link.label }}</p>
          <p class="text-xs text-gray-500">{{ link.desc }}</p>
        </div>
        <svg class="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { useBottomSheet } from '~/composables/useBottomSheet'

const { open: openSheet, close: closeSheet } = useBottomSheet()

function openQuickMenu() {
  openSheet({ title: 'Menu Paroki', size: 'auto' })
}

function handleQuickLink(path: string) {
  closeSheet()
  handleNavClick(path)
}

// Quick navigation links for the bottom sheet
const quickLinks = [
  { label: 'Jadwal Misa', desc: 'Lihat jadwal misa & liturgi', path: '/jadwal-misa', color: '#882f1d', icon: CalendarIcon },
  { label: 'Galeri Foto', desc: 'Album foto kegiatan paroki', path: '/galeri', color: '#7c3aed', icon: PhotoIcon },
  { label: 'Pengumuman', desc: 'Info terkini dari paroki', path: '/pengumuman', color: '#d97706', icon: BellIcon },
  { label: 'Booking Ruangan', desc: 'Pesan ruangan & fasilitas', path: '/booking', color: '#059669', icon: BuildingIcon },
  { label: 'Dokumen', desc: 'Dokumen & formulir paroki', path: '/dokumen-paroki', color: '#0284c7', icon: DocumentIcon },
  { label: 'Kontak', desc: 'Hubungi sekretariat paroki', path: '/kontak', color: '#dc2626', icon: PhoneIcon },
]

// Scroll Hide Logic
const isHidden = ref(false)
const lastScrollY = ref(0)
const scrollThreshold = 100

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY > lastScrollY.value && currentScrollY > scrollThreshold) {
    isHidden.value = true // hide when scrolling down
  } else if (currentScrollY < lastScrollY.value) {
    isHidden.value = false // show when scrolling up
  }
  
  // Also show nav if we are at the very bottom of the page
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    isHidden.value = false
  }
  
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})

// Import icons (using Heroicons)
const HomeIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  })
])

const DocumentIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  })
])

const CalendarIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  })
])

const MapPinIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
  }),
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'
  })
])

const PhoneIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
  })
])

const PhotoIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const BellIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
])

const BuildingIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
])


// Route composable
const route = useRoute()

// Navigation items: 4 items (center button is separate)
const navItems = [
  { label: 'Beranda', path: '/', icon: HomeIcon },
  { label: 'Berita', path: '/berita', icon: DocumentIcon },
  { label: 'Agenda', path: '/agenda', icon: CalendarIcon },
  { label: 'Kontak', path: '/kontak', icon: PhoneIcon },
]

// Active state
const getNavItemClasses = (itemPath: string) => {
  const isActive = route.path === itemPath ||
    (itemPath === '/berita' && route.path.startsWith('/berita')) ||
    (itemPath === '/artikel' && route.path.startsWith('/artikel')) ||
    (itemPath === '/agenda' && route.path.startsWith('/agenda'))

  return isActive
    ? 'text-[#882f1d] bg-[#882f1d]/10 rounded-lg'
    : 'text-gray-600 hover:text-[#882f1d] hover:bg-gray-50'
}

// Smooth scroll to top when navigation item is clicked
const handleNavClick = (targetPath) => {
  if (process.client) {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
      if (document.body) {
        document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
      const mainEl = document.querySelector('main')
      if (mainEl) {
        mainEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
    }

    // Scroll immediately
    scrollToTop()

    // Scroll again after micro-tasks and route transition completes
    nextTick(() => scrollToTop())
    setTimeout(() => scrollToTop(), 150)
    setTimeout(() => scrollToTop(), 350)
  }
}
</script>

<style scoped>
/* Ensure proper touch targets - minimum 44px */
nav a {
  min-height: 44px;
  min-width: 44px;
}
</style>
