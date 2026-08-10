<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- Mobile Snackbars / Toasts (Tahap 6) — rendered globally via Teleport to body -->
  <ToastContainer />
</template>

<script setup>
// Scroll to top on route change
const route = useRoute()

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
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
}

watch(() => route.fullPath, (newVal, oldVal) => {
  if (process.client && newVal !== oldVal) {
    scrollToTop()
    nextTick(() => scrollToTop())
    setTimeout(() => scrollToTop(), 150)
    setTimeout(() => scrollToTop(), 350)
  }
}, { immediate: false })

onMounted(() => {
  // Secret Developer Watermark
  console.log(
    "%c Website Developed by Fransiscus Apris Dwiharta ", 
    "background: #882f1d; color: #ffffff; font-size: 14px; font-weight: bold; padding: 10px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
  );
  console.log(
    "%c ✨ Crafted with passion ✨ ", 
    "color: #882f1d; font-size: 12px; font-style: italic;"
  );

  // Enable CSS :active state on iOS (Touch Feedback & Micro-Interactions)
  if (typeof document !== 'undefined') {
    document.body.addEventListener('touchstart', function() {}, {passive: true});
  }
});
</script>

<style>
/* Global overflow prevention */
html {
  overflow-x: hidden !important;
  max-width: 100vw !important;
  width: 100% !important;
}

body {
  overflow-x: hidden !important;
  max-width: 100vw !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

/* Box sizing for all elements */
*,
*::before,
*::after {
  box-sizing: border-box !important;
}

/* Prevent any element from causing horizontal scroll */
#__nuxt {
  overflow-x: hidden !important;
  max-width: 100vw !important;
  width: 100% !important;
}
</style>
