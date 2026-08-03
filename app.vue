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
