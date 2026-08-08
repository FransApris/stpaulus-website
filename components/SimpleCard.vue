<template>
  <div class="group relative bg-white border border-gray-100/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-[#882f1d]/20 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5 overflow-hidden text-center">
    <!-- Top accent gradient on hover -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#882f1d] to-[#c58229] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    <div>
      <h3 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-3 group-hover:text-[#6b2416] transition-colors">{{ title }}</h3>
      <p class="text-gray-600 leading-relaxed text-sm sm:text-base">{{ description }}</p>
    </div>

    <div class="mt-6">
      <NuxtLink :to="to" class="inline-flex items-center gap-1.5 font-semibold text-[#882f1d] group-hover:text-[#6b2416] text-sm sm:text-base transition-all">
        <span>{{ linkText }}</span>
        <span class="transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  linkText: {
    type: String,
    default: 'Lihat'
  }
})
</script>
