<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-br from-[#882f1d] to-[#5a1e12] py-14">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <div class="flex justify-center mb-5">
          <div class="bg-white/20 rounded-full p-5">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-cinzel text-white mb-3">Syarat dan Ketentuan</h1>
        <p class="text-white/80 text-lg">Aturan dan ketentuan penggunaan situs web Paroki St. Paulus Juanda</p>
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
        <Breadcrumb title="Syarat dan Ketentuan" />

        <!-- Table of Contents -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Daftar Isi</h2>
          <ol class="space-y-2">
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

          <!-- 1. Penerimaan Syarat -->
          <div id="section-1" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">1. Penerimaan Syarat</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Dengan mengakses dan menggunakan situs web Paroki St. Paulus Juanda, Anda menyetujui
                dan terikat oleh syarat dan ketentuan yang tercantum di halaman ini.
              </p>
            </div>
          </div>

          <!-- 2. Penggunaan Situs Web -->
          <div id="section-2" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">2. Penggunaan Situs Web</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 mb-4 leading-relaxed">Situs web ini disediakan untuk tujuan informasi dan komunikasi paroki. Anda setuju untuk:</p>
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

          <!-- 3. Konten Pengguna -->
          <div id="section-3" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">3. Konten Pengguna</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Jika Anda mengirimkan konten melalui formulir kontak atau fitur lainnya,
                Anda bertanggung jawab atas keakuratan dan keabsahan informasi tersebut.
              </p>
            </div>
          </div>

          <!-- 4. Penolakan Jaminan -->
          <div id="section-4" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">4. Penolakan Jaminan</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Informasi di situs web ini disediakan "sebagaimana adanya" tanpa jaminan apa pun.
                Paroki St. Paulus Juanda tidak bertanggung jawab atas kerugian yang timbul dari penggunaan situs web ini.
              </p>
            </div>
          </div>

          <!-- 5. Perubahan Syarat -->
          <div id="section-5" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">5. Perubahan Syarat</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Kami berhak mengubah syarat dan ketentuan ini kapan saja tanpa pemberitahuan sebelumnya.
                Perubahan akan berlaku segera setelah dipublikasikan di situs web ini.
              </p>
            </div>
          </div>

          <!-- 6. Hukum yang Berlaku -->
          <div id="section-6" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 3.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">6. Hukum yang Berlaku</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.
              </p>
            </div>
          </div>

          <!-- 7. Hak Cipta -->
          <div id="section-7" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V8a1 1 0 10-2 0v1H7z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">7. Hak Cipta</h2>
            </div>
            <div class="px-6 py-5">
              <div class="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <svg class="w-6 h-6 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V8a1 1 0 10-2 0v1H7z" clip-rule="evenodd"/>
                </svg>
                <p class="text-amber-800 font-semibold">Hak Cipta © {{ new Date().getFullYear() }} Paroki St. Paulus Juanda – Sidoarjo.</p>
              </div>
              <p class="text-gray-700 leading-relaxed">
                Seluruh konten, teks, gambar, logo, desain, dokumentasi, dan materi multimedia yang terdapat
                di situs web <span class="font-medium text-[#882f1d]">stpaulusjuanda.org</span> dilindungi oleh undang-undang hak cipta dan
                peraturan perundang-undangan yang berlaku di Republik Indonesia.
              </p>
            </div>
          </div>

          <!-- CTA Kontak -->
          <div class="bg-gradient-to-br from-[#882f1d] to-[#5a1e12] rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-8 text-center">
              <div class="flex justify-center mb-4">
                <div class="bg-white/20 rounded-full p-3">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
              </div>
              <h2 class="text-xl font-cinzel text-white mb-3">Ada Pertanyaan?</h2>
              <p class="text-white/80 leading-relaxed mb-6 max-w-xl mx-auto">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami.
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
  'Penerimaan Syarat',
  'Penggunaan Situs Web',
  'Konten Pengguna',
  'Penolakan Jaminan',
  'Perubahan Syarat',
  'Hukum yang Berlaku',
  'Hak Cipta',
]

const usageItems = [
  'Menggunakan situs web ini hanya untuk tujuan yang sah',
  'Tidak mengganggu atau merusak fungsi situs web',
  'Tidak menyebarkan konten yang tidak pantas atau melanggar hukum',
  'Menghormati hak cipta dan hak kekayaan intelektual',
]

useHead({
  title: 'Syarat dan Ketentuan - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Syarat dan ketentuan penggunaan situs web Paroki St. Paulus Juanda' }
  ]
})
</script>
