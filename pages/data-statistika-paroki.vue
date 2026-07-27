<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Data Statistika Paroki" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Data Statistik Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Statistik dan data kependudukan umat Paroki St. Paulus Juanda
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Data Statistik Paroki" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('data-statistika-paroki')
// Page meta
definePageMeta({
  title: 'Data Statistik Paroki - St. Paulus'
})

// Import components
import TablePerkembanganUmat from '~/components/TablePerkembanganUmat.vue'
import TableUsia from '~/components/TableUsia.vue'
import TableJenisKelaminTotal from '~/components/TableJenisKelaminTotal.vue'
import TableSakramen from '~/components/TableSakramen.vue'

onMounted(() => {
  if (process.client) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
})
</script>

<style scoped>
.prose { color: #374151; }
</style>
