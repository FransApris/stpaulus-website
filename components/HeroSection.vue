<template>
  <!-- No ClientOnly - Direct Render (SSR + Client Safe) -->
  <div v-if="props.showHero"
    class="relative min-h-screen overflow-hidden hero-container z-0" :class="className">
    <!-- Eager-loaded LCP Hero Image for Instant Parsing & Fast LCP -->
    <img :src="resolvedHeroImage" alt="Hero Paroki St. Paulus Juanda"
      fetchpriority="high" loading="eager" decoding="async"
      class="absolute inset-0 w-full h-full object-cover object-center z-0" />

    <!-- Absolute Center Content -->
    <div class="absolute inset-0 flex items-center justify-center z-10 bg-black/40">

      <div class="px-6 text-center text-white md:px-12 w-full max-w-4xl mx-auto">
        <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-cinzel drop-shadow-lg">
          {{ title }}
        </h1>
        <p class="mb-8 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl font-lora drop-shadow-md">
          {{ subtitle }}
        </p>

        <NuxtLink v-if="ctaTo" :to="ctaTo"
          class="inline-block rounded-full border-2 border-white px-8 py-3 text-base font-medium uppercase leading-normal text-white transition-all duration-300 ease-in-out hover:border-paulus-blue hover:text-paulus-blue hover:bg-white/20 focus:border-paulus-blue focus:text-paulus-blue focus:outline-none focus:ring-2 focus:ring-paulus-blue ring-0 active:border-paulus-blue active:text-paulus-blue shadow-lg hover:shadow-xl drop-shadow-md">
          {{ ctaText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props (Simple Defaults - No withDefaults)
const props = defineProps({
  showHero: { type: Boolean, default: true },
  title: { type: String, default: 'Selamat Datang di Paroki St. Paulus Juanda' },
  subtitle: { type: String, default: 'Temukan berita, artikel, galeri kegiatan, dan agenda terbaru kami.' },
  ctaText: { type: String, default: 'Lihat Jadwal Misa' },
  ctaTo: { type: String, default: '/misa' },
  heroImage: { type: String, default: '/images/gereja-stpaulus-hero.jpg' },
  className: { type: String, default: '' }
})

const { optimizeImageUrl } = useOptimizedImage()

// Computed Image with Cloudinary WebP optimization
const resolvedHeroImage = computed(() => {
  const img = props.heroImage || '/images/gereja-stpaulus-hero.jpg'
  return optimizeImageUrl(img, 1200)
})


// No onMounted/Events - Pure Statics
</script>

<style scoped>
.hero-container {
  height: 100vh !important;
  min-height: 100vh !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  display: block !important;
}

h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

h3 {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>