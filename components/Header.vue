<template>
  <header
    class="fixed top-0 left-0 right-0 z-[99999] transition-all duration-300 shadow-lg overflow-visible bg-[#882f1d]">
    <Navbar :show-hero="localShowHero" />
  </header>
</template>

<script setup>
// Props
const props = defineProps({
  showHero: { type: Boolean, default: true }
})

// Composable
const route = useRoute()
const isHomePage = computed(() => route.path === '/')

// Local State
const localShowHero = computed(() => props.showHero && isHomePage.value)
</script>

<style scoped>
/* No additional styles - All Tailwind */
</style>