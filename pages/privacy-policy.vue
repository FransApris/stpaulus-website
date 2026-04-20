<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-br from-[#882f1d] to-[#5a1e12] py-14">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <div class="flex justify-center mb-5">
          <div class="bg-white/20 rounded-full p-5">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-cinzel text-white mb-3">Kebijakan Privasi</h1>
        <p class="text-white/80 text-lg">Informasi tentang bagaimana kami mengelola dan melindungi data pribadi Anda</p>
        <div class="mt-5 inline-flex items-center gap-2 bg-white/10 text-white/70 text-sm px-4 py-2 rounded-full">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
          </svg>
          Terakhir diperbarui: {{ new Date().toLocaleDateString('id-ID') }}
        </div>
      </div>
    </div>

    <section class="py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Kebijakan Privasi" />

        <!-- Table of Contents -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Daftar Isi</h2>
          <ol class="list-none space-y-2 p-0 m-0">
            <li v-for="(item, i) in sections" :key="i">
              <a :href="'#section-' + (i+1)" class="flex items-center gap-3 text-gray-700 hover:text-[#882f1d] transition-colors group">
                <span class="w-6 h-6 rounded-full bg-[#882f1d]/10 text-[#882f1d] text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-[#882f1d] group-hover:text-white transition-colors">{{ i + 1 }}</span>
                <span class="text-sm">{{ item }}</span>
              </a>
            </li>
          </ol>
        </div>

        <!-- Sections -->
        <div class="space-y-6">

          <!-- 1. Pengumpulan Data -->
          <div id="section-1" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">1. Pengumpulan Data</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Kami mengumpulkan informasi yang Anda berikan secara sukarela saat menggunakan situs web ini,
                termasuk saat mendaftar newsletter, mengirim pesan kontak, atau berpartisipasi dalam kegiatan paroki.
              </p>
            </div>
          </div>

          <!-- 2. Penggunaan Data -->
          <div id="section-2" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">2. Penggunaan Data</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 mb-4 leading-relaxed">Data yang dikumpulkan digunakan untuk:</p>
              <ul class="space-y-3">
                <li v-for="item in usageItems" :key="item" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-[#882f1d] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 3. Perlindungan Data -->
          <div id="section-3" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">3. Perlindungan Data</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Kami berkomitmen untuk melindungi data pribadi Anda dengan menerapkan langkah-langkah keamanan
                teknis dan organisasi yang sesuai untuk mencegah akses, pengungkapan, perubahan, atau penghancuran
                data yang tidak sah.
              </p>
            </div>
          </div>

          <!-- 4. Hak Anda -->
          <div id="section-4" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">4. Hak Anda</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 mb-4 leading-relaxed">Anda memiliki hak untuk:</p>
              <ul class="space-y-3">
                <li v-for="item in rightsItems" :key="item" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-[#882f1d] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 5. Kontak -->
          <div id="section-5" class="bg-gradient-to-br from-[#882f1d] to-[#5a1e12] rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-8 text-center">
              <div class="flex justify-center mb-4">
                <div class="bg-white/20 rounded-full p-3">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
              </div>
              <h2 class="text-xl font-cinzel text-white mb-3">5. Kontak</h2>
              <p class="text-white/80 leading-relaxed mb-6 max-w-xl mx-auto">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda
                terkait data pribadi, silakan hubungi kami.
              </p>
              <NuxtLink to="/kontak" class="inline-flex items-center gap-2 bg-white text-[#882f1d] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                Hubungi Kami
              </NuxtLink>
            </div>
          </div>

        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
const sections = [
  'Pengumpulan Data',
  'Penggunaan Data',
  'Perlindungan Data',
  'Hak Anda',
  'Kontak',
]

const usageItems = [
  'Menyediakan layanan dan informasi paroki',
  'Mengirim komunikasi penting tentang kegiatan gereja',
  'Meningkatkan pengalaman pengguna situs web',
  'Mematuhi persyaratan hukum dan administratif',
]

const rightsItems = [
  'Mengakses data pribadi yang kami simpan tentang Anda',
  'Memperbaiki data yang tidak akurat atau tidak lengkap',
  'Meminta penghapusan data pribadi Anda',
  'Menolak pemrosesan data untuk tujuan tertentu',
]

useHead({
  title: 'Kebijakan Privasi - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Kebijakan privasi Paroki St. Paulus Juanda - informasi tentang pengelolaan data pribadi' }
  ]
})
</script>
