<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gallery Management</h1>
      <p class="text-sm text-gray-600 mt-1">Kelola galeri gereja dengan Google Photos Shared Albums - tanpa OAuth, mudah & praktis!</p>
    </div>

    <!-- Shared Albums Manager -->
    <SharedAlbumsManager />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})
</script>
