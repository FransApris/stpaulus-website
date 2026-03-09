<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-gray-100">
    <!-- Image Container with Lazy Loading -->
    <div class="h-64 sm:h-80 w-full overflow-hidden relative bg-gray-200">
      <img :src="pastor.photoUrl || '/default-pastor.jpg'" :alt="`Foto Romo ${pastor.name}`" loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        :class="pastor.photoUrl ? 'object-top' : 'object-center'" />

      <!-- Status Badge Overlay -->
      <div class="absolute top-3 right-3">
        <span v-if="isCurrentlyServing"
          class="inline-flex items-center gap-1 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium shadow-lg">
          <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Aktif
        </span>
        <span v-else
          class="inline-flex items-center px-3 py-1 bg-gray-700/90 backdrop-blur-sm text-white rounded-full text-xs font-medium shadow-lg">
          Alumni
        </span>
      </div>
    </div>

    <div class="p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-1 leading-snug">
        {{ pastor.name }}
      </h3>

      <p class="text-sm font-medium text-gray-600 mt-3 border-t pt-3">
        Masa Bertugas:
      </p>
      <p class="text-lg font-bold text-[#882f1d]">
        {{ pastor.startYear }} - {{ displayEndYear }}
      </p>

      <p class="text-sm font-medium text-gray-600 mt-2">
        Lama Bertugas:
      </p>
      <p class="text-lg font-bold text-gray-800">
        {{ calculateDuration(pastor.startYear, pastor.endYear) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pastor: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      name: 'Nama Romo',
      startYear: 'YYYY',
      endYear: 'YYYY',
      photoUrl: '', // URL ke file gambar
    }),
  },
});

// Check if currently serving
const isCurrentlyServing = computed(() => {
  return props.pastor.endYear && props.pastor.endYear.toLowerCase() === 'sekarang'
})

// Display end year
const displayEndYear = computed(() => {
  return isCurrentlyServing.value ? 'Sekarang' : props.pastor.endYear
})

// Fungsi untuk menghitung Lama Bertugas
const calculateDuration = (start, end) => {
  const startYear = parseInt(start);
  const endYear = end.toLowerCase() === 'sekarang' ? new Date().getFullYear() : parseInt(end);

  if (isNaN(startYear) || isNaN(endYear)) {
    return 'Data tidak valid';
  }

  const duration = endYear - startYear;

  if (duration === 0) {
    return 'Kurang dari 1 tahun';
  }

  if (duration > 0) {
    return `${duration} Tahun`;
  }

  return 'Lama tidak diketahui';
};
</script>

<style scoped>
/* Smooth hover transition for card */
.group:hover img {
  transform: scale(1.05);
}
</style>
