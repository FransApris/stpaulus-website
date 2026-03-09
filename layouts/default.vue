<template>
  <div class="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden max-w-full">
    <!-- Header: No ClientOnly - SSR Compatible -->
    <Header :show-hero="isHomePage" /> <!-- Direct render, computed safe di server/client -->

    <!-- Main Content: Full Remaining Height -->
    <main class="flex-grow pt-16 container mx-auto p-4 pb-20 md:pb-4 overflow-x-hidden max-w-full"
      style="box-sizing: border-box;"> <!-- Offset fixed navbar and mobile bottom nav -->
      <NuxtPage />
    </main>

    <!-- Footer: Always Bottom -->
    <Footer />

    <!-- Mobile Bottom Navigation -->
    <ClientOnly>
      <MobileBottomNav />
    </ClientOnly>

    <!-- Chat Widget -->
    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup>
// Route check (SSR-safe, auto-available)
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<style scoped>
/* Minimal - No overrides */
</style>