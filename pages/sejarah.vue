<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-8 md:py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb title="Sejarah Paroki" />

        <!-- Header Section -->
        <div class="text-center mb-8 md:mb-12">
          <h1 class="text-2xl md:text-4xl font-cinzel text-[#882f1d] mb-3 md:mb-4 px-2">
            Sejarah Paroki St. Paulus Juanda
          </h1>
          <p class="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Sebuah perjalanan iman yang unik, dimulai dari pengadaan lahan hingga menjadi komunitas Paroki yang mandiri
            dan terintegrasi.
          </p>
        </div>

        <!-- Content Sejarah -->
        <div class="w-full md:max-w-[85%] lg:max-w-[75%] mx-auto">
          <TimelineSejarahParoki />
        </div>

        <!-- Back Button -->
        <div class="mt-8 md:mt-12">
          <BackButton position="bottom" />
        </div>
      </div>
    </section>
  </div>
</template>

// Page meta
definePageMeta({
title: 'Sejarah Paroki - St. Paulus'
})

// Dynamic import for TimelineSejarahParoki component (only loaded when needed)
const TimelineSejarahParoki = defineAsyncComponent(() => import('~/components/TimelineSejarahParoki.vue'))

<style scoped>
.prose {
  color: #374151;
}

.prose h2 {
  color: #882f1d;
}

@media print {
  .timeline-grid {
    grid-template-columns: 1fr !important;
  }

  button,
  nav {
    display: none !important;
  }
}
</style>
