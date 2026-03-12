<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Scroll to top on route change
const route = useRoute()

watch(() => route.path, () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}, { immediate: false })
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
