<template>
  <div class="bg-white shadow-xl rounded-lg overflow-hidden my-8">
    <h3 class="text-2xl font-cinzel font-extrabold p-5 text-gray-900 bg-red-100 border-b-4 border-red-600">
      Data Umat Paroki Berdasarkan Usia (Lengkap) 🧑‍👵
    </h3>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-red-600 text-white sticky top-0">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Lingkungan
            </th>
            <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              0-4
            </th>
            <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              5-11
            </th>
            <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              12-16
            </th>
            <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              17-29
            </th>
            <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              30-59
            </th>
            <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              60-100
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-extrabold uppercase tracking-wider bg-red-700">
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-gray-700">
          <tr 
            v-for="(data, index) in dataUsia" 
            :key="index" 
            :class="rowClass(data)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" 
                :class="{'text-red-700 font-extrabold': data.lingkungan === 'Total'}">
              {{ data.lingkungan }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center">
              {{ data['0-4'] }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center">
              {{ data['5-11'] }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center">
              {{ data['12-16'] }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center">
              {{ data['17-29'] }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center">
              {{ data['30-59'] }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center">
              {{ data['60-100'] }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-center text-white" 
                :class="{'bg-red-600': data.lingkungan !== 'Total', 'bg-red-800 text-lg': data.lingkungan === 'Total'}">
              {{ data.Jumlah.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-4 text-sm text-gray-600 border-t">
        Total Jiwa Paroki: {{ totalParoki.toLocaleString('id-ID') }}.
    </div>
  </div>
</template>

<script setup>
const totalParoki = 4367;

const dataUsia = [
  // Data dari gambar pertama (Bartolomeus, Fransiskus Asisi, Maria Regina, Petrus, Simon, Theresia 1-5)
  { lingkungan: 'Bartolomeus 1', '0-4': 5, '5-11': 9, '12-16': 5, '17-29': 32, '30-59': 57, '60-100': 24, Jumlah: 132 },
  { lingkungan: 'Bartolomeus 2', '0-4': 3, '5-11': 12, '12-16': 9, '17-29': 21, '30-59': 50, '60-100': 4, Jumlah: 99 },
  { lingkungan: 'Bartolomeus 3', '0-4': 6, '5-11': 6, '12-16': 2, '17-29': 23, '30-59': 44, '60-100': 13, Jumlah: 94 },
  { lingkungan: 'Bartolomeus 4', '0-4': 10, '5-11': 16, '12-16': 14, '17-29': 21, '30-59': 61, '60-100': 10, Jumlah: 132 },
  { lingkungan: 'Fransiskus Asisi 1', '0-4': 0, '5-11': 8, '12-16': 5, '17-29': 33, '30-59': 58, '60-100': 15, Jumlah: 117 },
  { lingkungan: 'Fransiskus Asisi 2', '0-4': 4, '5-11': 13, '12-16': 11, '17-29': 42, '30-59': 74, '60-100': 36, Jumlah: 180 },
  { lingkungan: 'Fransiskus Asisi 3', '0-4': 1, '5-11': 9, '12-16': 12, '17-29': 43, '30-59': 66, '60-100': 18, Jumlah: 149 },
  { lingkungan: 'Maria Regina 1', '0-4': 1, '5-11': 7, '12-16': 6, '17-29': 16, '30-59': 30, '60-100': 14, Jumlah: 68 },
  { lingkungan: 'Maria Regina 2', '0-4': 0, '5-11': 7, '12-16': 3, '17-29': 13, '30-59': 28, '60-100': 16, Jumlah: 67 },
  { lingkungan: 'Maria Regina 3', '0-4': 1, '5-11': 4, '12-16': 4, '17-29': 11, '30-59': 21, '60-100': 19, Jumlah: 60 },
  { lingkungan: 'Petrus 1', '0-4': 2, '5-11': 11, '12-16': 14, '17-29': 16, '30-59': 61, '60-100': 28, Jumlah: 132 },
  { lingkungan: 'Petrus 2', '0-4': 8, '5-11': 9, '12-16': 9, '17-29': 29, '30-59': 55, '60-100': 16, Jumlah: 126 },
  { lingkungan: 'Petrus 3', '0-4': 5, '5-11': 5, '12-16': 14, '17-29': 26, '30-59': 52, '60-100': 9, Jumlah: 111 },
  { lingkungan: 'Petrus 4', '0-4': 12, '5-11': 10, '12-16': 1, '17-29': 28, '30-59': 73, '60-100': 8, Jumlah: 132 },
  { lingkungan: 'Petrus 5', '0-4': 1, '5-11': 5, '12-16': 6, '17-29': 20, '30-59': 36, '60-100': 11, Jumlah: 79 },
  { lingkungan: 'Petrus 6', '0-4': 4, '5-11': 7, '12-16': 11, '17-29': 8, '30-59': 41, '60-100': 4, Jumlah: 75 },
  { lingkungan: 'Simon 1', '0-4': 0, '5-11': 15, '12-16': 12, '17-29': 26, '30-59': 60, '60-100': 19, Jumlah: 132 },
  { lingkungan: 'Simon 2', '0-4': 8, '5-11': 14, '12-16': 9, '17-29': 38, '30-59': 74, '60-100': 16, Jumlah: 159 },
  { lingkungan: 'Simon 3', '0-4': 4, '5-11': 9, '12-16': 9, '17-29': 24, '30-59': 42, '60-100': 25, Jumlah: 113 },
  { lingkungan: 'Simon 4', '0-4': 11, '5-11': 11, '12-16': 7, '17-29': 33, '30-59': 72, '60-100': 7, Jumlah: 141 },
  { lingkungan: 'Simon 5', '0-4': 4, '5-11': 4, '12-16': 4, '17-29': 24, '30-59': 50, '60-100': 9, Jumlah: 95 },
  { lingkungan: 'Simon 6', '0-4': 5, '5-11': 9, '12-16': 13, '17-29': 28, '30-59': 63, '60-100': 14, Jumlah: 132 },
  { lingkungan: 'Simon 7', '0-4': 17, '5-11': 22, '12-16': 6, '17-29': 15, '30-59': 76, '60-100': 4, Jumlah: 140 },
  { lingkungan: 'Theresia 1', '0-4': 3, '5-11': 5, '12-16': 4, '17-29': 13, '30-59': 21, '60-100': 8, Jumlah: 54 },
  { lingkungan: 'Theresia 2', '0-4': 1, '5-11': 7, '12-16': 10, '17-29': 32, '30-59': 45, '60-100': 13, Jumlah: 108 },
  { lingkungan: 'Theresia 3', '0-4': 6, '5-11': 24, '12-16': 25, '17-29': 24, '30-59': 84, '60-100': 8, Jumlah: 171 },
  { lingkungan: 'Theresia 4', '0-4': 1, '5-11': 9, '12-16': 9, '17-29': 26, '30-59': 44, '60-100': 8, Jumlah: 97 },
  { lingkungan: 'Theresia 5', '0-4': 2, '5-11': 7, '12-16': 10, '17-29': 29, '30-59': 50, '60-100': 13, Jumlah: 111 },
  
  // DATA BARU dari gambar IMG_20251023_223745.jpg
  { lingkungan: 'Theresia 6', '0-4': 3, '5-11': 12, '12-16': 9, '17-29': 17, '30-59': 44, '60-100': 3, Jumlah: 88 },
  { lingkungan: 'Theresia 7', '0-4': 14, '5-11': 30, '12-16': 12, '17-29': 22, '30-59': 82, '60-100': 5, Jumlah: 165 },
  { lingkungan: 'Theresia 8', '0-4': 4, '5-11': 18, '12-16': 11, '17-29': 15, '30-59': 62, '60-100': 12, Jumlah: 122 },
  { lingkungan: 'VAP 1', '0-4': 2, '5-11': 1, '12-16': 2, '17-29': 20, '30-59': 35, '60-100': 24, Jumlah: 84 },
  { lingkungan: 'VAP 2', '0-4': 3, '5-11': 12, '12-16': 4, '17-29': 14, '30-59': 35, '60-100': 34, Jumlah: 102 },
  { lingkungan: 'VAP 3', '0-4': 1, '5-11': 4, '12-16': 5, '17-29': 15, '30-59': 18, '60-100': 17, Jumlah: 60 },
  { lingkungan: 'VAP 4', '0-4': 6, '5-11': 7, '12-16': 7, '17-29': 24, '30-59': 65, '60-100': 30, Jumlah: 141 },
  { lingkungan: 'Yakobus 1', '0-4': 9, '5-11': 14, '12-16': 6, '17-29': 13, '30-59': 52, '60-100': 20, Jumlah: 114 },
  { lingkungan: 'Yakobus 2', '0-4': 9, '5-11': 19, '12-16': 20, '17-29': 49, '30-59': 99, '60-100': 14, Jumlah: 210 },
  { lingkungan: 'Yakobus 3', '0-4': 3, '5-11': 18, '12-16': 6, '17-29': 4, '30-59': 39, '60-100': 5, Jumlah: 75 },
  
  // Baris Total Paroki (Dari gambar IMG_20251023_223745.jpg)
  { lingkungan: 'Total', '0-4': 179, '5-11': 405, '12-16': 325, '17-29': 887, '30-59': 2018, '60-100': 553, Jumlah: 4367 },
];

const rowClass = (data) => {
  // Menonjolkan baris Total
  if (data.lingkungan === 'Total') {
    return 'bg-red-200 font-bold border-t-4 border-red-700 hover:bg-red-200';
  }
  // Zebra striping untuk baris biasa
  const index = dataUsia.indexOf(data);
  return index % 2 === 1 ? 'bg-gray-50 hover:bg-red-50' : 'hover:bg-red-50';
};
</script>