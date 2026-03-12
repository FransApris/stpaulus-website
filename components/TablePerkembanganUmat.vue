<template>
  <div class="bg-white shadow-2xl rounded-xl overflow-hidden my-8 border-4 border-teal-500">
    <h3 class="text-lg md:text-2xl font-cinzel font-extrabold p-3 md:p-5 text-center text-white bg-teal-600">
      📈 Jumlah Umat 3 Tahun Terakhir (2023 - 2025)
    </h3>

    <div class="p-3 md:p-6">
      <!-- Mobile: Scrollable table -->
      <div class="overflow-x-auto -mx-3 md:mx-0">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-teal-100 text-teal-800">
            <tr>
              <th scope="col" class="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-bold uppercase tracking-wider">
                Tahun
              </th>
              <th scope="col" class="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-bold uppercase tracking-wider">
                <span class="hidden sm:inline">Jumlah KK</span>
                <span class="sm:hidden">KK</span>
                <span class="block text-[10px] md:text-xs font-normal normal-case mt-0.5">(Kepala Keluarga)</span>
              </th>
              <th scope="col" class="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-extrabold uppercase tracking-wider bg-teal-200 text-teal-900">
                <span class="hidden sm:inline">Jumlah Jiwa</span>
                <span class="sm:hidden">Jiwa</span>
                <span class="block text-[10px] md:text-xs font-normal normal-case mt-0.5">(Total)</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100 text-gray-800">
            <tr v-for="(data, index) in dataUmat" :key="index" :class="rowClass(data.Tahun)">
              <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base font-semibold text-center" :class="{'text-teal-700': data.Tahun === 2025}">
                {{ data.Tahun }}
              </td>
              <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-center">
                {{ data.kk.toLocaleString('id-ID') }}
              </td>
              <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-base md:text-lg text-center font-extrabold" :class="{'text-teal-900': data.Tahun === 2025, 'bg-teal-50': data.Tahun === 2025}">
                {{ data.jiwa.toLocaleString('id-ID') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[10px] md:text-xs italic text-gray-500 mt-3 md:mt-4 text-center px-2">
        Sumber: Duk Paroki Santo Paulus, Juanda 13 Oktober 2025
      </p>
    </div>
  </div>
</template>

<script setup>
const dataUmat = [
  { Tahun: 2023, kk: 1327, jiwa: 4013 },
  { Tahun: 2024, kk: 1360, jiwa: 4152 },
  { Tahun: 2025, kk: 1437, jiwa: 4367 }, // Data terbaru
];

const rowClass = (tahun) => {
  // Menonjolkan data tahun terakhir (2025)
  return tahun === 2025 ? 'bg-teal-100 font-bold border-t-2 border-teal-500' : 'hover:bg-gray-50';
};
</script>
