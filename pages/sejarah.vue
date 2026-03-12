<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Sejarah Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Sebuah perjalanan iman yang unik, dari pengadaan lahan hingga menjadi komunitas Paroki yang mandiri
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Sejarah Paroki" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Content Sejarah -->
        <div class="w-full md:max-w-[85%] lg:max-w-[75%] mx-auto">
          <TimelineSejarahParoki />
        </div>

        <!-- Back Button -->
        <div class="mt-8 md:mt-12">
          <BackButton position="bottom" />
        </div>
      </div>
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
