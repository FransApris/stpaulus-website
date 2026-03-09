<template>
  <div class="bg-white shadow-xl rounded-lg overflow-hidden my-8 p-6">
    <h3 class="text-2xl font-cinzel font-extrabold text-center mb-6 text-gray-900 border-b-2 pb-2">
      Data Umat Paroki Berdasarkan Jenis Kelamin (Per Wilayah) 👨‍👩‍👧‍👦
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      
      <div v-for="(wilayahData, wilayahName) in dataJenisKelamin" :key="wilayahName" class="border border-indigo-200 rounded-lg overflow-hidden shadow-lg">
        
        <h4 class="text-lg font-bold p-3 text-white" :class="headerColor(wilayahName)">
          Wilayah {{ wilayahName }}
        </h4>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-indigo-100 text-indigo-800">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-semibold uppercase">Ling</th>
                <th class="px-3 py-2 text-center text-xs font-semibold uppercase">KK</th>
                <th class="px-3 py-2 text-center text-xs font-semibold uppercase">L</th>
                <th class="px-3 py-2 text-center text-xs font-semibold uppercase">P</th>
                <th class="px-3 py-2 text-center text-xs font-extrabold uppercase bg-indigo-200">Jum</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100 text-gray-700 text-sm">
              <tr v-for="(lingData, index) in wilayahData.lingkungan" :key="index" class="hover:bg-gray-50">
                <td class="px-3 py-2 whitespace-nowrap font-medium">{{ lingData.ling }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-center">{{ lingData.kk }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-center">{{ lingData.l }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-center">{{ lingData.p }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-center font-bold text-indigo-700 bg-indigo-50">
                  {{ lingData.jum }}
                </td>
              </tr>
              
              <tr class="bg-indigo-50 font-bold border-t-2 border-indigo-500">
                <td class="px-3 py-2 whitespace-nowrap text-left text-indigo-700">Total</td>
                <td class="px-3 py-2 whitespace-nowrap text-center text-indigo-700">{{ wilayahData.total.kk }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-center text-indigo-700">{{ wilayahData.total.l }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-center text-indigo-700">{{ wilayahData.total.p }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-center text-white bg-indigo-600">
                  {{ wilayahData.total.jum }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
    
    <h3 class="text-xl font-bold text-gray-800 border-t pt-6 mt-6 mb-4">
      Ringkasan Total Umat Paroki Santo Paulus (2025) 📊
    </h3>
    <div class="overflow-x-auto border rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-red-700 text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-bold uppercase">Umat Paroki</th>
            <th class="px-4 py-3 text-center text-sm font-bold uppercase">Jumlah KK</th>
            <th class="px-4 py-3 text-center text-sm font-bold uppercase">Laki-Laki</th>
            <th class="px-4 py-3 text-center text-sm font-bold uppercase">Perempuan</th>
            <th class="px-4 py-3 text-center text-lg font-extrabold uppercase bg-red-800">Total Jiwa</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100 text-gray-800">
          <tr class="bg-red-50 font-extrabold">
            <td class="px-4 py-3 whitespace-nowrap text-sm">Paroki St. Paulus</td>
            <td class="px-4 py-3 whitespace-nowrap text-base text-center text-red-700">{{ dataRingkasan.kk.toLocaleString('id-ID') }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-base text-center text-red-700">{{ dataRingkasan.l.toLocaleString('id-ID') }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-base text-center text-red-700">{{ dataRingkasan.p.toLocaleString('id-ID') }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-lg text-center text-white bg-red-700">
              {{ dataRingkasan.total.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const dataJenisKelamin = {
  Simon: {
    lingkungan: [
      { ling: 'Simon 1', kk: 42, l: 56, p: 76, jum: 132 },
      { ling: 'Simon 2', kk: 49, l: 82, p: 77, jum: 159 },
      { ling: 'Simon 3', kk: 38, l: 59, p: 54, jum: 113 },
      { ling: 'Simon 4', kk: 46, l: 63, p: 78, jum: 141 },
      { ling: 'Simon 5', kk: 30, l: 46, p: 49, jum: 95 },
      { ling: 'Simon 6', kk: 43, l: 55, p: 77, jum: 132 },
      { ling: 'Simon 7', kk: 44, l: 67, p: 73, jum: 140 },
    ],
    total: { kk: 292, l: 428, p: 484, jum: 912 }
  },
  Petrus: {
    lingkungan: [
      { ling: 'Petrus 1', kk: 50, l: 66, p: 66, jum: 132 },
      { ling: 'Petrus 2', kk: 42, l: 68, p: 58, jum: 126 },
      { ling: 'Petrus 3', kk: 34, l: 55, p: 56, jum: 111 },
      { ling: 'Petrus 4', kk: 52, l: 63, p: 69, jum: 132 },
      { ling: 'Petrus 5', kk: 28, l: 36, p: 43, jum: 79 },
      { ling: 'Petrus 6', kk: 24, l: 35, p: 40, jum: 75 },
    ],
    total: { kk: 230, l: 323, p: 332, jum: 655 }
  },
  VAP: {
    lingkungan: [
      { ling: 'VAP 1', kk: 28, l: 43, p: 41, jum: 84 },
      { ling: 'VAP 2', kk: 35, l: 49, p: 53, jum: 102 },
      { ling: 'VAP 3', kk: 23, l: 22, p: 38, jum: 60 },
      { ling: 'VAP 4', kk: 52, l: 62, p: 79, jum: 141 },
    ],
    total: { kk: 138, l: 176, p: 211, jum: 387 }
  },
  Bartolomeus: {
    lingkungan: [
      { ling: 'Barto 1', kk: 41, l: 54, p: 78, jum: 132 },
      { ling: 'Barto 2', kk: 32, l: 43, p: 56, jum: 99 },
      { ling: 'Barto 3', kk: 35, l: 43, p: 51, jum: 94 },
      { ling: 'Barto 4', kk: 43, l: 68, p: 64, jum: 132 },
    ],
    total: { kk: 151, l: 208, p: 249, jum: 457 }
  },
  Yakobus: {
    lingkungan: [
      { ling: 'Yakobus 1', kk: 41, l: 57, p: 57, jum: 114 },
      { ling: 'Yakobus 2', kk: 63, l: 98, p: 112, jum: 210 },
      { ling: 'Yakobus 3', kk: 24, l: 37, p: 38, jum: 75 },
    ],
    total: { kk: 128, l: 192, p: 207, jum: 399 }
  },
  'Maria Regina': {
    lingkungan: [
      { ling: 'MR 1', kk: 28, l: 34, p: 34, jum: 68 },
      { ling: 'MR 2', kk: 22, l: 31, p: 36, jum: 67 },
      { ling: 'MR 3', kk: 23, l: 34, p: 26, jum: 60 },
    ],
    total: { kk: 73, l: 99, p: 96, jum: 195 }
  },
  // Data dari gambar terbaru (Wilayah Theresia dan Fransiskus Asisi)
  Theresia: {
    lingkungan: [
      { ling: 'Theresia 1', kk: 18, l: 26, p: 28, jum: 54 },
      { ling: 'Theresia 2', kk: 28, l: 54, p: 54, jum: 108 },
      { ling: 'Theresia 3', kk: 52, l: 80, p: 91, jum: 171 },
      { ling: 'Theresia 4', kk: 32, l: 48, p: 49, jum: 97 },
      { ling: 'Theresia 5', kk: 32, l: 53, p: 58, jum: 111 },
      { ling: 'Theresia 6', kk: 31, l: 43, p: 45, jum: 88 },
      { ling: 'Theresia 7', kk: 52, l: 84, p: 81, jum: 165 },
      { ling: 'Theresia 8', kk: 39, l: 59, p: 63, jum: 122 },
    ],
    total: { kk: 284, l: 447, p: 469, jum: 916 }
  },
  'Fransiskus Asisi': {
    lingkungan: [
      { ling: 'FA 1', kk: 33, l: 53, p: 64, jum: 117 },
      { ling: 'FA 2', kk: 57, l: 88, p: 92, jum: 180 },
      { ling: 'FA 3', kk: 51, l: 78, p: 71, jum: 149 },
    ],
    total: { kk: 141, l: 219, p: 227, jum: 446 }
  }
};

const dataRingkasan = {
  kk: 1437,
  l: 2092,
  p: 2275,
  total: 4367
};

const headerColor = (wilayahName) => {
  // Memberikan warna yang sedikit berbeda untuk variasi visual, menambahkan warna baru untuk Theresia dan Fransiskus
  switch (wilayahName) {
    case 'Simon':
      return 'bg-blue-600';
    case 'Petrus':
      return 'bg-green-600';
    case 'VAP':
      return 'bg-yellow-600';
    case 'Bartolomeus':
      return 'bg-red-600';
    case 'Yakobus':
      return 'bg-purple-600';
    case 'Maria Regina':
      return 'bg-pink-600';
    case 'Theresia':
      return 'bg-teal-600'; // Warna baru untuk Theresia
    case 'Fransiskus Asisi':
      return 'bg-orange-600'; // Warna baru untuk Fransiskus Asisi
    default:
      return 'bg-indigo-600';
  }
}
</script>