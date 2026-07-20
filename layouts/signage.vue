<template>
  <div class="min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col">
    <!-- Konten Utama: Akan memenuhi seluruh layar -->
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Layout bersih tanpa navbar dan footer untuk mode kiosk/signage
</script>

<style>
/* Pastikan body tidak memiliki margin/padding bawaan */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #111827; /* Tailwind gray-900 */
}
</style>
