<template>
  <section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Header - Samakan dengan section lain -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-3">
          <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
        </div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">
          Persembahan Gereja
        </h2>
        <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Dukung pelayanan Paroki St. Paulus melalui persembahan digital
        </p>
      </div>

      <!-- Two QR Codes Layout - Improved spacing -->
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        <!-- QR Code 1: BCA Pemeliharaan -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-center">
            <h3 class="text-base md:text-lg font-bold text-white mb-1">QRIS BCA (Pemeliharaan)</h3>
            <p class="text-xs md:text-sm text-blue-100">Scan untuk transfer</p>
          </div>

          <div class="p-4 md:p-5">
            <!-- QR Code Display -->
            <div class="bg-white border-4 border-blue-100 rounded-xl p-3 mb-4 hover:border-blue-200 transition-colors">
              <div class="w-full aspect-square bg-white rounded flex items-center justify-center">
                <img src="/images/qr/qr-pemeliharaan.webp" alt="QR Code BCA 2588671122"
                  class="w-full h-full object-contain" />
              </div>
            </div>

            <!-- Bank Info - Font diperbesar -->
            <div class="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center text-sm md:text-base">
                <svg class="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fill-rule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clip-rule="evenodd" />
                </svg>
                Info Transfer
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm font-medium">Bank:</span>
                  <span class="font-bold text-gray-900 text-sm">BCA</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm font-medium">No. Rekening:</span>
                  <span class="font-mono font-bold text-gray-900 text-base md:text-lg">2588671122</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm font-medium">Atas Nama:</span>
                  <span class="font-bold text-gray-900 text-sm">BGKP - ST.PAULUS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code 2: BCA Sosial -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-center">
            <h3 class="text-base md:text-lg font-bold text-white mb-1">QRIS BCA (Kas Sosial)</h3>
            <p class="text-xs md:text-sm text-yellow-100">Scan untuk transfer</p>
          </div>

          <div class="p-4 md:p-5">
            <!-- QR Code Display -->
            <div
              class="bg-white border-4 border-yellow-100 rounded-xl p-3 mb-4 hover:border-yellow-200 transition-colors">
              <div class="w-full aspect-square bg-white rounded flex items-center justify-center">
                <img src="/images/qr/qr-sosial.webp" alt="QR Code BCA 2588561122" class="w-full h-full object-contain" />

              </div>
            </div>

            <!-- Bank Info - Font diperbesar -->
            <div class="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center text-sm md:text-base">
                <svg class="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fill-rule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clip-rule="evenodd" />
                </svg>
                Info Transfer
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm font-medium">Bank:</span>
                  <span class="font-bold text-gray-900 text-sm">BCA</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm font-medium">No. Rekening:</span>
                  <span class="font-mono font-bold text-gray-900 text-base md:text-lg">2588561122</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm font-medium">Atas Nama:</span>
                  <span class="font-bold text-gray-900 text-sm">BGKP - ST.PAULUS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Instructions Section -->
      <div class="max-w-3xl mx-auto mt-10">
        <div class="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center">
            Cara Berdonasi
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <ol class="space-y-3">
              <li class="flex items-start">
                <span
                  class="flex-shrink-0 w-7 h-7 bg-[#882f1d] text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  1
                </span>
                <span class="pt-1 text-sm text-gray-700">Buka aplikasi mobile banking (BCA Mobile, BRI Mobile,
                  dll)</span>
              </li>
              <li class="flex items-start">
                <span
                  class="flex-shrink-0 w-7 h-7 bg-[#882f1d] text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  2
                </span>
                <span class="pt-1 text-sm text-gray-700">Pilih menu <strong>QRIS</strong> atau <strong>Scan QR
                    Code</strong></span>
              </li>
            </ol>
            <ol class="space-y-3" start="3">
              <li class="flex items-start">
                <span
                  class="flex-shrink-0 w-7 h-7 bg-[#882f1d] text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  3
                </span>
                <span class="pt-1 text-sm text-gray-700">Arahkan kamera ke QR Code di atas</span>
              </li>
              <li class="flex items-start">
                <span
                  class="flex-shrink-0 w-7 h-7 bg-[#882f1d] text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  4
                </span>
                <span class="pt-1 text-sm text-gray-700">Masukkan nominal persembahan dan konfirmasi pembayaran</span>
              </li>
            </ol>
          </div>

          <!-- Note -->
          <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p class="text-sm text-gray-700">
              <strong class="text-blue-900">💡 Catatan:</strong> Persembahan Anda sangat berarti untuk menunjang
              kegiatan pelayanan paroki. Tuhan memberkati kemurahan hati Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No reactive data needed, this is a static display component
</script>
