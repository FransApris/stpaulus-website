<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-br from-[#882f1d] to-[#5a1e12] py-14">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <div class="flex justify-center mb-5">
          <div class="bg-white/20 rounded-full p-5">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-cinzel text-white mb-3">Kebijakan Cookie</h1>
        <p class="text-white/80 text-lg">Informasi tentang penggunaan cookie di situs web kami</p>
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
        <Breadcrumb title="Kebijakan Cookie" />

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

          <!-- 1. Apa itu Cookie -->
          <div id="section-1" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">1. Apa itu Cookie?</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Cookie adalah file teks kecil yang disimpan di perangkat Anda saat Anda mengunjungi situs web.
                Cookie membantu situs web mengingat preferensi Anda dan meningkatkan pengalaman browsing.
              </p>
            </div>
          </div>

          <!-- 2. Jenis Cookie -->
          <div id="section-2" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">2. Jenis Cookie yang Kami Gunakan</h2>
            </div>
            <div class="px-6 py-5">
              <div class="space-y-5">
                <div v-for="type in cookieTypes" :key="type.name" class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="type.color">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 mb-1">{{ type.name }}</p>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ type.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Pengelolaan Cookie -->
          <div id="section-3" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">3. Pengelolaan Cookie</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Anda dapat mengontrol dan menghapus cookie melalui pengaturan browser Anda.
                Namun, menghapus cookie tertentu mungkin memengaruhi fungsi situs web.
              </p>
            </div>
          </div>

          <!-- 4. Cookie Pihak Ketiga -->
          <div id="section-4" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">4. Cookie Pihak Ketiga</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Beberapa cookie mungkin disediakan oleh layanan pihak ketiga yang terintegrasi
                dengan situs web kami, seperti layanan analitik atau media sosial.
              </p>
            </div>
          </div>

          <!-- 5. Persetujuan -->
          <div id="section-5" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-4 bg-[#882f1d]/5 border-b border-[#882f1d]/10">
              <div class="w-9 h-9 rounded-full bg-[#882f1d] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-lg font-cinzel font-semibold text-[#882f1d]">5. Persetujuan</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-700 leading-relaxed">
                Dengan menggunakan situs web kami, Anda menyetujui penggunaan cookie sesuai
                dengan kebijakan ini. Anda dapat menarik persetujuan kapan saja dengan
                mengubah pengaturan cookie di browser Anda.
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
                Jika Anda memiliki pertanyaan tentang kebijakan cookie ini, silakan hubungi kami.
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
  'Apa itu Cookie?',
  'Jenis Cookie yang Kami Gunakan',
  'Pengelolaan Cookie',
  'Cookie Pihak Ketiga',
  'Persetujuan',
]

const cookieTypes = [
  {
    name: 'Cookie Wajib',
    desc: 'Diperlukan untuk fungsi dasar situs web, seperti navigasi dan keamanan. Tanpa cookie ini, situs web tidak akan berfungsi dengan baik.',
    color: 'bg-red-700',
  },
  {
    name: 'Cookie Analitik',
    desc: 'Digunakan untuk memahami bagaimana pengunjung menggunakan situs web kami, sehingga kami dapat meningkatkan pengalaman pengguna.',
    color: 'bg-blue-600',
  },
  {
    name: 'Cookie Fungsional',
    desc: 'Mengingat preferensi Anda, seperti bahasa dan pengaturan tampilan, untuk memberikan pengalaman yang lebih personal.',
    color: 'bg-green-600',
  },
]

useHead({
  title: 'Kebijakan Cookie - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Kebijakan cookie Paroki St. Paulus Juanda - informasi tentang penggunaan cookie di situs web' }
  ]
})
</script>
