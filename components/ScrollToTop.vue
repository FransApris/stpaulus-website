<template>
  <Transition name="fade-up">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-24 sm:bottom-6 right-6 z-50 p-3 rounded-full bg-[#882f1d] text-white shadow-lg hover:bg-[#6b2416] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d]"
      aria-label="Kembali ke atas"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path>
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
let scrollTimer = null

const handleScroll = () => {
  if (scrollTimer) return
  scrollTimer = setTimeout(() => {
    isVisible.value = window.scrollY > 400
    scrollTimer = null
  }, 100)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
