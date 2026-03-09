<template>
  <div class="container mx-auto px-4 md:px-12 py-6 md:py-12">

    <div class="relative wrap overflow-hidden md:p-10 h-full">

      <!-- Vertical Line - Hidden on mobile for cleaner look -->
      <div
        class="hidden md:block absolute border-2 border-opacity-20 border-[#882f1d] h-full left-1/2 transform -translate-x-0.5"
        style="z-index: 1;"></div>

      <div v-for="(item, index) in timelineData" :key="index" :class="[
        'mb-8 md:mb-12 flex justify-between items-center w-full relative timeline-item',
        index % 2 === 0 ? 'timeline-even' : 'timeline-odd'
      ]">
        <!-- Content Card -->
        <div
          class="order-1 w-full md:w-5/12 px-4 md:px-6 py-4 md:py-5 transition duration-500 ease-in-out transform hover:scale-105 rounded-lg content-card"
          :class="{
            'bg-white border-l-4 border-[#882f1d] shadow-lg card-even': index % 2 === 0,
            'bg-[#882f1d]/5 border-l-4 border-[#882f1d] shadow-lg card-odd': index % 2 === 1
          }">
          <!-- Year Badge -->
          <div class="flex items-center gap-3 mb-3">
            <div
              class="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-[#882f1d] rounded-full flex items-center justify-center shadow-md">
              <span class="text-white font-bold text-sm md:text-base">{{ item.tahun.slice(-2) }}</span>
            </div>
            <p class="text-xl md:text-2xl font-bold text-[#882f1d]">{{ item.tahun }}</p>
          </div>

          <!-- Description -->
          <p class="text-sm md:text-base leading-relaxed text-gray-800">
            <span v-html="item.deskripsi"></span>
            <span v-if="item.catatan"
              class="block mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded italic text-xs md:text-sm text-gray-700">
              <strong class="text-amber-700">💡 Catatan:</strong> {{ item.catatan }}
            </span>
          </p>
        </div>

        <!-- Center Dot (Desktop Only) -->
        <div
          class="hidden md:flex z-20 items-center justify-center order-1 bg-[#882f1d] shadow-xl w-10 h-10 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white">
          <span class="text-white font-bold text-xs">{{ item.tahun.slice(-2) }}</span>
        </div>

        <!-- Spacer (Desktop Only) -->
        <div class="order-1 w-5/12 hidden md:block"></div>
      </div>
    </div>

    <!-- Fokus Pastoral Section -->
    <div class="mt-12 md:mt-16 pt-6 md:pt-8 border-t-2 border-gray-200">
      <h3 class="text-2xl md:text-3xl font-cinzel font-bold text-[#882f1d] mb-3 md:mb-4 text-center px-4">
        Fokus Pastoral Sejak Agustus 2014 (Masa Romo Tri Kuncoro Yekti (Romo Cun))
      </h3>
      <p class="text-center text-gray-700 mb-6 md:mb-8 px-4 text-sm md:text-base">
        Paroki St. Paulus – Juanda dinilai masih dalam proses pendewasaan, dengan 3 area utama yang menjadi perhatian:
      </p>

      <div class="grid md:grid-cols-3 gap-4 md:gap-6">
        <!-- Card 1 -->
        <div
          class="p-5 md:p-6 bg-gradient-to-br from-[#882f1d]/5 to-[#882f1d]/10 rounded-xl shadow-md border-t-4 border-[#882f1d] hover:shadow-xl transition-shadow duration-300">
          <span class="text-4xl md:text-5xl block mb-3 text-center">🤝</span>
          <p class="font-bold text-base md:text-lg text-[#882f1d] mb-2 text-center">Integrasi Komunitas Warga</p>
          <p class="text-xs md:text-sm text-gray-700 text-center leading-relaxed">
            Mendorong pengenalan lintas wilayah pasca-penggabungan dan memperkuat komunitas hidup.
          </p>
        </div>

        <!-- Card 2 -->
        <div
          class="p-5 md:p-6 bg-gradient-to-br from-[#882f1d]/5 to-[#882f1d]/10 rounded-xl shadow-md border-t-4 border-[#882f1d] hover:shadow-xl transition-shadow duration-300">
          <span class="text-4xl md:text-5xl block mb-3 text-center">❤️‍🔥</span>
          <p class="font-bold text-base md:text-lg text-[#882f1d] mb-2 text-center">Membangun Sense of Belonging</p>
          <p class="text-xs md:text-sm text-gray-700 text-center leading-relaxed">
            Menciptakan rasa memiliki yang kuat di antara warga paroki yang berasal dari berbagai paroki asal.
          </p>
        </div>

        <!-- Card 3 -->
        <div
          class="p-5 md:p-6 bg-gradient-to-br from-[#882f1d]/5 to-[#882f1d]/10 rounded-xl shadow-md border-t-4 border-[#882f1d] hover:shadow-xl transition-shadow duration-300">
          <span class="text-4xl md:text-5xl block mb-3 text-center">🏗️</span>
          <p class="font-bold text-base md:text-lg text-[#882f1d] mb-2 text-center">Organisasi dan Pembangunan</p>
          <p class="text-xs md:text-sm text-gray-700 text-center leading-relaxed">
            Melanjutkan pembangunan Balai Paroki dan menata organisasi pastoral (DPP, pengelolaan, SDM).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const timelineData = [
  // Saya pastikan semua data lengkap dan berurutan sesuai cerita
  { tahun: '1996', deskripsi: 'Muncul informasi awal tentang upaya pengadaan lahan untuk gereja dan pura di kalangan Angkatan Laut.' },
  { tahun: '1998', deskripsi: 'Informasi pengadaan lahan untuk kompleks gereja dan pura beredar luas di kalangan Angkatan Laut.' },
  {
    tahun: '1999',
    deskripsi: 'Setelah berkoordinasi dengan Paroki Salib Suci, dibentuklah Panitia Pembangunan Gereja yang kemudian berkoordinasi dengan Angkatan Laut.',
    catatan: 'Terjadi pergeseran fokus lahan dari "gereja ekumene" menjadi "gereja Katolik" (pura dan gereja Katolik).'
  },
  {
    tahun: '2001',
    deskripsi: 'Proses pembangunan gedung gereja dimulai, namun segera dihentikan karena adanya isu penolakan pembangunan dari kalangan Angkatan Laut.'
  },
  {
    tahun: '2002',
    deskripsi: 'Proses pembangunan gereja dilanjutkan kembali setelah isu penolakan mereda. Proses perizinan IMB di Pemkab. Sidoarjo dimulai.'
  },
  {
    tahun: '2005',
    deskripsi: 'Gedung gereja selesai dibangun dan diresmikan, disusul dengan pembangunan pastoran. Setelah pastoran jadi, Paroki Salib Suci membentuk **Stasi Santo Paulus**.',
    catatan: 'Area Stasi diperluas dengan sumbangan masing-masing 1 wilayah dari Paroki Sidoarjo, Pagesangan, dan Gembala yang Baik.'
  },
  {
    tahun: '2008',
    deskripsi: 'Pada **1 Mei**, Stasi Santo Paulus resmi ditingkatkan statusnya menjadi **Paroki** dan tanggal tersebut ditetapkan sebagai hari jadi Paroki St. Paulus – Juanda.'
  },
  { tahun: '2013', deskripsi: 'Dimulainya pembangunan Balai Paroki.' },
  {
    tahun: '2014',
    deskripsi: 'Terjadi pergantian Romo Kepala Paroki dari Romo Sony kepada **Romo Tri Kuncoro Yekti (Romo Cun)** pada Agustus.',
    catatan: 'Romo Cun mencatat bahwa paroki saat itu masih "belum matang" dan berada dalam dinamika proses menjadi paroki sejati.'
  },
];
</script>

<style scoped>
/* ==========================================
   TIMELINE ZIGZAG - DESKTOP
   ========================================== */

@media (min-width: 768px) {

  /* Garis vertikal tengah */
  .wrap>div:first-child {
    display: block !important;
  }

  /* ITEM GENAP - Konten di KIRI */
  .timeline-even {
    flex-direction: row !important;
  }

  .timeline-even .content-card {
    text-align: right !important;
  }

  .timeline-even.card-even {
    border-left: none !important;
    border-right: 4px solid #882f1d !important;
  }

  /* ITEM GANJIL - Konten di KANAN */
  .timeline-odd {
    flex-direction: row-reverse !important;
  }

  .timeline-odd .content-card {
    text-align: left !important;
  }

  .timeline-odd .card-odd {
    border-left: 4px solid #882f1d !important;
    border-right: none !important;
  }

  /* Dot selalu di tengah */
  .timeline-item .z-20 {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
}

/* ==========================================
   MOBILE - SINGLE COLUMN
   ========================================== */
@media (max-width: 767px) {
  .wrap>div:first-child {
    left: 1.25rem !important;
    transform: none !important;
  }

  .timeline-item {
    display: block !important;
    padding-left: 3.5rem !important;
  }

  .timeline-item .content-card {
    width: 100% !important;
    text-align: left !important;
  }

  .timeline-item .z-20 {
    left: 1.25rem !important;
    transform: translateX(-50%) !important;
  }

  .content-card {
    border-left: 4px solid #882f1d !important;
    border-right: none !important;
  }

  /* Hide spacer */
  .timeline-item>div:last-child {
    display: none !important;
  }
}
</style>