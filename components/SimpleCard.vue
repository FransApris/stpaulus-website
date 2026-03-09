<template>
  <div class="text-center p-6 rounded-lg bg-gray-100 hover:bg-[#882f1d]/5 transition-colors">
    <h3 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-2">{{ title }}</h3>
    <p class="text-gray-700">{{ description }}</p>
    <NuxtLink :to="to" class="mt-4 inline-block text-[#882f1d] hover:underline">{{ linkText }}</NuxtLink>
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
    default: 'Lihat →'
  }
})
</script>
