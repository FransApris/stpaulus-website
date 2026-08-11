<template>
  <div class="fixed top-0 left-0 w-full h-1 z-[100000] pointer-events-none opacity-90">
    <div
      class="h-full bg-gradient-to-r from-[#882f1d] via-[#a55e1f] to-[#c58229] transition-all duration-150 ease-out"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
let ticking = false

const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  
  if (docHeight > 0) {
    progress.value = (scrollTop / docHeight) * 100
  } else {
    progress.value = 0
  }
}

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateProgress()
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // Initial check
  setTimeout(updateProgress, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
