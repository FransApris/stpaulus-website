<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Blog Utama" />
    <div v-else>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Blog" />

        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Blog Paroki</h1>
          <p class="text-xl text-gray-600">Berita, artikel, dan renungan dari komunitas Paroki St. Paulus Juanda</p>
        </div>

        <!-- Blog Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <!-- Featured Post -->
          <div class="md:col-span-2 lg:col-span-2">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="h-64 bg-gradient-to-r from-[#882f1d] to-[#6b2416] flex items-center justify-center">
                <div class="text-center text-white">
                  <svg class="w-16 h-16 mx-auto mb-4 opacity-75" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <h3 class="text-xl font-semibold">Artikel Terbaru</h3>
                </div>
              </div>
              <div class="p-6">
                <div class="flex items-center text-sm text-gray-500 mb-3">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                  </svg>
                  {{ new Date().toLocaleDateString('id-ID') }}
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  Selamat Datang di Blog Paroki St. Paulus Juanda
                </h3>
                <p class="text-gray-600 mb-4">
                  Blog ini akan berisi artikel-artikel rohani, berita paroki, renungan mingguan,
                  dan berbagai konten menarik lainnya dari komunitas kami.
                </p>
                <NuxtLink
                  to="/artikel"
                  class="inline-flex items-center text-[#882f1d] hover:text-[#6b2416] font-medium"
                >
                  Baca Artikel Lengkap
                  <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Sidebar Posts -->
          <div class="space-y-6">
            <!-- Recent Posts -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Artikel Terbaru</h3>
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">Renungan Mingguan</h4>
                    <p class="text-xs text-gray-500">2 hari yang lalu</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">Kegiatan Paroki</h4>
                    <p class="text-xs text-gray-500">1 minggu yang lalu</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">Berita Gereja</h4>
                    <p class="text-xs text-gray-500">2 minggu yang lalu</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Categories -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Kategori</h3>
              <div class="space-y-2">
                <NuxtLink to="/artikel/kategori/renungan" class="block text-gray-600 hover:text-[#882f1d] transition-colors">
                  Renungan
                </NuxtLink>
                <NuxtLink to="/artikel/kategori/berita" class="block text-gray-600 hover:text-[#882f1d] transition-colors">
                  Berita Paroki
                </NuxtLink>
                <NuxtLink to="/artikel/kategori/kegiatan" class="block text-gray-600 hover:text-[#882f1d] transition-colors">
                  Kegiatan
                </NuxtLink>
                <NuxtLink to="/artikel/kategori/pendidikan" class="block text-gray-600 hover:text-[#882f1d] transition-colors">
                  Pendidikan Iman
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center">
          <div class="bg-gradient-to-r from-[#882f1d] to-[#6b2416] rounded-lg p-8 text-white">
            <h3 class="text-2xl font-semibold mb-4">Ingin Membaca Lebih Banyak?</h3>
            <p class="mb-6">Kunjungi halaman artikel kami untuk konten lengkap dan terkini</p>
            <NuxtLink
              to="/artikel"
              class="inline-flex items-center px-6 py-3 bg-white text-[#882f1d] font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Lihat Semua Artikel
            </NuxtLink>
          </div>
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('blog')
// Page meta
useHead({
  title: 'Blog - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Blog Paroki St. Paulus Juanda - berita, artikel, dan renungan komunitas' }
  ]
})
</script>
