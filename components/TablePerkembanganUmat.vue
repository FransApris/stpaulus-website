<template>
  <div class="bg-white shadow-2xl rounded-xl overflow-hidden my-8 border-4 border-teal-500">
    <h3 class="text-2xl font-cinzel font-extrabold p-5 text-center text-white bg-teal-600">
      📈 Jumlah Umat 3 Tahun Terakhir (2023 - 2025)
    </h3>

    <div class="p-6">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-teal-100 text-teal-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">
              Tahun
            </th>
            <th scope="col" class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">
              Jumlah KK (Kepala Keluarga)
            </th>
            <th scope="col" class="px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider bg-teal-200 text-teal-900">
              Jumlah Jiwa (Total)
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100 text-gray-800">
          <tr v-for="(data, index) in dataUmat" :key="index" :class="rowClass(data.Tahun)">
            <td class="px-6 py-4 whitespace-nowrap text-base font-semibold text-center" :class="{'text-teal-700': data.Tahun === 2025}">
              {{ data.Tahun }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-center">
              {{ data.kk.toLocaleString('id-ID') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-lg text-center font-extrabold" :class="{'text-teal-900': data.Tahun === 2025, 'bg-teal-50': data.Tahun === 2025}">
              {{ data.jiwa.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-xs italic text-gray-500 mt-4 text-center">
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
