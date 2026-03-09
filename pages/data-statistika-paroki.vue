<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb title="Data Statistik Paroki" />

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Data Statistik Paroki</h1>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto space-y-8">
          <TablePerkembanganUmat />
          <TableUsia />
          <TableJenisKelaminTotal />
          <TableSakramen />
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Data Statistik Paroki - St. Paulus'
})

// Import components
import TablePerkembanganUmat from '~/components/TablePerkembanganUmat.vue'
import TableUsia from '~/components/TableUsia.vue'
import TableJenisKelaminTotal from '~/components/TableJenisKelaminTotal.vue'
import TableSakramen from '~/components/TableSakramen.vue'
</script>

<style scoped>
.prose { color: #374151; }
</style>
