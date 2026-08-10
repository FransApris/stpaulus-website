<template>
  <div class="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden max-w-full">
    <!-- Header: No ClientOnly - SSR Compatible -->
    <Header :show-hero="isHomePage" /> <!-- Direct render, computed safe di server/client -->

    <!-- Main Content: Full Remaining Height -->
    <main
      :class="isHomePage
        ? 'flex-grow pb-20 md:pb-4 overflow-x-hidden w-full max-w-full'
        : 'flex-grow pt-16 container mx-auto p-4 pb-20 md:pb-4 overflow-x-hidden max-w-full'"
      style="box-sizing: border-box;"> <!-- Offset fixed navbar and mobile bottom nav -->
      <NuxtPage />
    </main>

    <!-- Footer: Always Bottom -->
    <Footer />

    <!-- Mobile Bottom Navigation (Client Only to prevent hydration mismatches) -->
    <ClientOnly>
      <MobileBottomNav />
    </ClientOnly>

    <!-- Chat Widget (Lazy Loaded) -->
    <ClientOnly>
      <LazyChatWidget />
    </ClientOnly>

  </div>
</template>

<script setup>
// Route check (SSR-safe, auto-available)
const route = useRoute()
const isHomePage = computed(() => route.path === '/')

// Schema.org Structured Data (JSON-LD) for Search Engine Rich Results
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CatholicChurch',
        'name': 'Paroki St. Paulus Juanda',
        'alternateName': 'Gereja Katolik St. Paulus Juanda Sidoarjo',
        'url': 'https://stpaulusjuanda.org',
        'logo': 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png',
        'image': 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png',
        'description': 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Jl. Juanda No. 10',
          'addressLocality': 'Sidoarjo',
          'addressRegion': 'Jawa Timur',
          'postalCode': '61253',
          'addressCountry': 'ID'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': -7.3826,
          'longitude': 112.7667
        },
        'telephone': '+62-31-8557854'
      })
    }
  ]
})
</script>


<style scoped>
/* Minimal - No overrides */
</style>