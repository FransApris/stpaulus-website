<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-[99999] transition-transform duration-300 shadow-lg overflow-visible bg-[#882f1d]',
      isHidden ? '-translate-y-full' : 'translate-y-0'
    ]">
    <Navbar :show-hero="localShowHero" />
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Props
const props = defineProps({
  showHero: { type: Boolean, default: true }
})

// Composable
const route = useRoute()
const isHomePage = computed(() => route.path === '/')

// Local State
const localShowHero = computed(() => props.showHero && isHomePage.value)

// Scroll Hide Logic
const isHidden = ref(false)
const lastScrollY = ref(0)
const scrollThreshold = 100

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY > lastScrollY.value && currentScrollY > scrollThreshold) {
    isHidden.value = true
  } else if (currentScrollY < lastScrollY.value) {
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
</script>

<style scoped>
/* No additional styles - All Tailwind */
</style>