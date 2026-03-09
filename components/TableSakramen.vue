<template>
  <div class="bg-white shadow-xl rounded-lg overflow-hidden my-6 p-6">
    <h3 class="text-2xl font-cinzel font-bold text-gray-800 mb-6 border-b pb-2">
      Data Sakramen 2023 – 2025 ✝️
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div class="border border-green-300 rounded-lg overflow-hidden shadow-md">
        <h4 class="text-lg font-semibold bg-green-500 text-white p-3">SAKRAMEN BAPTIS</h4>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-green-100">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">Jenis Baptis</th>
              <th v-for="tahun in ['2023', '2024', '2025']" :key="tahun" class="px-4 py-2 text-center text-xs font-semibold uppercase text-gray-600">
                {{ tahun }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-sm text-gray-800">
            <tr v-for="(item, index) in dataBaptis" :key="index" :class="{'bg-gray-50': index % 2 === 1}">
              <td class="px-4 py-3 font-medium">{{ item.jenis }}</td>
              <td class="px-4 py-3 text-center">{{ item.y2023 }}</td>
              <td class="px-4 py-3 text-center">{{ item.y2024 }}</td>
              <td class="px-4 py-3 text-center font-bold text-green-700">{{ item.y2025 }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border border-yellow-300 rounded-lg overflow-hidden shadow-md">
        <h4 class="text-lg font-semibold bg-yellow-600 text-white p-3">SAKRAMEN KOMUNI PERTAMA</h4>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-yellow-100">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">Sakramen</th>
              <th v-for="tahun in ['2023', '2024', '2025']" :key="tahun" class="px-4 py-2 text-center text-xs font-semibold uppercase text-gray-600">
                {{ tahun }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-sm text-gray-800">
            <tr>
              <td class="px-4 py-3 font-medium">Komuni Pertama</td>
              <td class="px-4 py-3 text-center">{{ dataKomuni.y2023 }}</td>
              <td class="px-4 py-3 text-center">{{ dataKomuni.y2024 }}</td>
              <td class="px-4 py-3 text-center font-bold text-yellow-700">{{ dataKomuni.y2025 }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="lg:col-span-1 flex flex-col gap-6">

        <div class="border border-indigo-300 rounded-lg overflow-hidden shadow-md">
          <h4 class="text-lg font-semibold bg-indigo-500 text-white p-3">SAKRAMEN KRISMA</h4>
          <div class="p-4 text-center text-lg font-bold text-indigo-700">
            <span class="text-sm font-normal text-gray-600 block">Tahun 2024:</span> 115
          </div>
        </div>

        <div class="border border-red-300 rounded-lg overflow-hidden shadow-md flex-grow">
          <h4 class="text-lg font-semibold bg-red-500 text-white p-3">SAKRAMEN PERKAWINAN</h4>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-red-100">
              <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">Jenis Perkawinan</th>
              <th v-for="tahun in ['2023', '2024', '2025']" :key="tahun" class="px-4 py-2 text-center text-xs font-semibold uppercase text-gray-600">
                {{ tahun }}
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm text-gray-800">
              <tr v-for="(item, index) in dataPerkawinan" :key="index" :class="{'bg-gray-50': index % 2 === 1}">
                <td class="px-4 py-3 font-medium">{{ item.jenis }}</td>
                <td class="px-4 py-3 text-center">{{ item.y2023 }}</td>
                <td class="px-4 py-3 text-center">{{ item.y2024 }}</td>
                <td class="px-4 py-3 text-center font-bold text-red-700">{{ item.y2025 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const dataBaptis = [
  { jenis: 'Baptis Bayi', y2023: 65, y2024: 35, y2025: 45 },
  { jenis: 'Baptis Dewasa', y2023: 37, y2024: 21, y2025: 14 },
  { jenis: 'Diterima Dalam Gereja Katolik', y2023: 11, y2024: 4, y2025: 1 },
];

const dataKomuni = { y2023: 111, y2024: 59, y2025: 31 };

const dataPerkawinan = [
  { jenis: 'Katolik - Katolik', y2023: 8, y2024: 5, y2025: 13 },
  { jenis: 'Katolik - Kristen', y2023: 3, y2024: 1, y2025: 3 },
  { jenis: 'Katolik - Non Kristen', y2023: 2, y2024: 1, y2025: 4 },
];
</script>
