<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Beranda / Home" />
    <div v-else>
  <div class="min-h-screen pt-4 bg-gray-50">
    <!-- HeroSection (Dynamic based on active theme) - FULL WIDTH -->
    <HeroSection :show-hero="true" title="Selamat Datang di Paroki St. Paulus Juanda"
      subtitle="Temukan berita, artikel, galeri kegiatan, dan agenda terbaru kami." cta-text="Lihat Jadwal Misa"
      cta-to="/misa" :hero-image="activeTheme?.image_path || '/images/gereja-stpaulus-hero.jpg'" />

    <!-- Live Jadwal Misa Widget (Floating) -->
    <ClientOnly>
      <MisaScheduleWidget />
    </ClientOnly>

    <!-- Section 1: Welcome / About Teaser -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
        <div class="text-center mb-12">
          <div class="flex items-center justify-center mb-3">
            <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Paroki St. Paulus Juanda</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Jl. Raya Bandara Juanda No.10, Semambung, Kec.
            Gedangan, Kabupaten Sidoarjo, Jawa Timur 61254<br />Tel: 031-8557854 | Email: stpaulus.sekretariat@gmail.com
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <SimpleCard title="Gallery Foto"
            description="Lihat momen indah kegiatan paroki kami. Dari misa hingga retret rohani." to="/galeri"
            link-text="Lihat Gallery →" />
          <SimpleCard title="Sejarah Gereja"
            description="Pelajari perjalanan Paroki St. Paulus sejak didirikan. Warisan iman yang kaya." to="/sejarah"
            link-text="Baca Sejarah →" />
          <SimpleCard title="Kontak Kami"
            description="Hubungi pastor, staf, atau komunitas untuk informasi lebih lanjut." to="/kontak"
            link-text="Hubungi →" />
        </div>
      </div>
    </section>

    <!-- Quick Stats Section (NEW) -->
    <ClientOnly>
      <QuickStatsCounter />
    </ClientOnly>

    <!-- Section 2: Teritorial Lingkungan -->
    <ClientOnly>
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
          <div class="text-center mb-12">
            <div class="flex items-center justify-center mb-3">
              <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Teritorial Lingkungan</h2>
            <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Peta wilayah teritorial Paroki St. Paulus
              Juanda.</p>
          </div>
          <div class="max-w-6xl mx-auto">
            <MapEmbed :height="480" :lat="-7.3917066" :lng="112.7296374" title="Teritorial Lingkungan Paroki St. Paulus"
              address="Paroki St Paulus Juanda Sidoarjo" />
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- Section 2.5: Pengumuman Gereja (NEW) - Client Side Only untuk optimasi -->
    <ClientOnly>
      <ChurchAnnouncementsSection />
    </ClientOnly>

    <!-- Section 3: Album Terbaru -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
        <div class="text-center mb-12">
          <div class="flex items-center justify-center mb-3">
            <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Album Terbaru</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Lihat album foto terbaru dari kegiatan paroki
            kami.</p>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="bg-gray-200 h-48 rounded-t-lg"></div>
            <div class="bg-white p-4 rounded-b-lg shadow">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-lg font-semibold">Gagal memuat album</p>
            <p class="text-sm text-gray-600 mt-2">Silakan coba refresh halaman</p>
          </div>
        </div>

        <!-- Albums Grid -->
        <div v-else-if="latestAlbums && latestAlbums.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a v-for="album in latestAlbums" :key="album.id" :href="album.share_url" target="_blank"
            rel="noopener noreferrer" class="group">
            <div
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <!-- Album Cover -->
              <div class="relative overflow-hidden h-48">
                <img :src="optimizeImageUrl(album.thumbnail_url || '/images/default-gallery.jpg', 600)" :alt="album.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  @error="handleAlbumImageError">

                <!-- Google Photos Badge -->
                <div
                  class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 .5a11.5 11.5 0 0 1 11.5 11.5A11.5 11.5 0 0 1 12 23.5 11.5 11.5 0 0 1 .5 12 11.5 11.5 0 0 1 12 .5zm3.5 4.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                  </svg>
                  Google Photos
                </div>
              </div>

              <!-- Album Info -->
              <div class="p-5">
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:underline line-clamp-2">
                  {{ album.title }}
                </h3>
                <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                  {{ album.description || 'Album foto kegiatan paroki' }}
                </p>

                <!-- Date and Action -->
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span class="text-xs text-gray-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                      </path>
                    </svg>
                    {{ formatDate(album.created_at) }}
                  </span>
                  <span
                    class="text-[#882f1d] font-semibold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                    Buka Album
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
            </path>
          </svg>
          <p class="text-gray-500 text-lg">Belum ada album tersedia</p>
          <p class="text-gray-400 text-sm mt-2">Album galeri akan muncul di sini</p>
        </div>

        <!-- View All Button -->
        <div v-if="latestAlbums && latestAlbums.length > 0" class="text-center mt-10">
          <NuxtLink to="/galeri"
            class="inline-flex items-center gap-2 bg-[#882f1d] text-white px-8 py-3 rounded-lg hover:bg-[#6d2417] transition-colors font-semibold">
            Lihat Semua Album
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3">
              </path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 4: Latest News / Events Teaser -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-3">
            <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Berita Terbaru</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Informasi dan berita terkini dari Paroki St.
            Paulus Juanda.</p>
        </div>
        <div v-if="newsPending" class="text-center text-gray-500">
          Memuat berita terbaru...
        </div>
        <div v-else-if="newsError" class="text-center text-red-500">
          Gagal memuat berita terbaru.
        </div>
        <div v-else-if="latestNews && latestNews.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ArticleCard v-for="news in latestNews.slice(0, 3)" :key="news.id"
            :image="news.image || activeTheme?.image_path || '/images/default-news.jpg'" image-type="url"
            :title="news.title" :description="news.excerpt" :date="news.date" :to="`/berita/${news.slug}`" />
        </div>
        <div v-else class="text-center py-12">
          <div class="inline-flex flex-col items-center justify-center gap-4 bg-white rounded-lg shadow-md p-8">
            <p class="text-gray-600 text-lg">Belum ada berita terbaru saat ini.</p>
            <p class="text-gray-500 max-w-xl">Silakan cek kembali nanti atau kunjungi halaman jadwal misa untuk melihat
              update kegiatan terbaru.</p>
            <NuxtLink to="/misa"
              class="mt-2 inline-flex items-center justify-center rounded-lg bg-[#882f1d] px-6 py-2 text-white hover:bg-[#a55e1f]">
              Ke Jadwal Misa
            </NuxtLink>
          </div>
        </div>
        <!-- CTA ke Full Berita -->
        <div class="text-center mt-6">
          <NuxtLink to="/berita"
            class="bg-[#882f1d] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Berita
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 5: Dokumen Paroki -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-3">
            <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Dokumen Paroki</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Koleksi dokumen resmi dan informasi penting
            Gereja St. Paulus Juanda.</p>
        </div>
        <div v-if="featuredDocumentsPending" class="text-center text-gray-500">
          Memuat dokumen unggulan...
        </div>
        <div v-else-if="featuredDocumentsError" class="text-center text-red-500">
          Gagal memuat dokumen unggulan.
        </div>
        <div v-else-if="featuredDocuments && featuredDocuments.length > 0" class="grid md:grid-cols-3 gap-4">
          <div v-for="doc in featuredDocuments.slice(0, 3)" :key="doc.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="p-6">
              <!-- Category Badge -->
              <div class="flex items-center mb-3">
                <div class="flex-shrink-0 w-4 h-4 rounded mr-2" :style="{ backgroundColor: doc.category_color }">
                </div>
                <span class="text-sm font-medium text-gray-600">{{ doc.category_name }}</span>
              </div>

              <!-- Title -->
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ doc.title }}</h3>

              <!-- Description -->
              <p v-if="doc.description" class="text-gray-600 text-sm mb-4 line-clamp-3">
                {{ doc.description }}
              </p>

              <!-- File Info -->
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{{ doc.original_filename }}</span>
                <span>{{ formatFileSize(doc.file_size) }}</span>
              </div>

              <!-- Upload Date and Action Buttons Row -->
              <div class="flex items-center justify-between">
                <!-- Upload Date -->
                <div class="text-xs text-gray-400">
                  Diunggah: {{ formatDate(doc.created_at) }}
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-1">
                  <button @click="viewDocument(doc)"
                    class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    title="Lihat Dokumen">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="printDocument(doc)"
                    class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                    title="Cetak (buka PDF lalu Ctrl+P)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <button @click="downloadDocument(doc)"
                    class="p-2 text-gray-600 hover:text-[#882f1d] hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Download Dokumen">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
          <h3 class="text-lg font-cinzel font-medium text-gray-900 mb-2">Belum ada dokumen unggulan</h3>
          <p class="text-gray-600">Belum ada dokumen yang ditandai sebagai unggulan.</p>
        </div>
        <!-- CTA ke Full Dokumen -->
        <div class="text-center mt-6">
          <NuxtLink to="/dokumen-paroki"
            class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Dokumen
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 6: Artikel Terbaru (Updated to use API) -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-3">
            <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Artikel & Renungan</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Baca inspirasi rohani, khotbah, dan artikel
            dari pastor serta komunitas paroki kami.</p>
        </div>
        <div v-if="articlesPending" class="text-center text-gray-500">
          Memuat artikel terbaru...
        </div>
        <div v-else-if="articlesError" class="text-center text-red-500">
          Gagal memuat artikel terbaru.
        </div>
        <div v-else-if="latestArticles && latestArticles.length > 0" class="grid md:grid-cols-3 gap-4">
          <ArticleCard v-for="article in latestArticles.slice(0, 3)" :key="article.id"
            :image="article.image || '/images/default-article.jpg'" image-type="url" :title="article.title"
            :description="article.excerpt" :date="article.date" :to="`/artikel/${article.slug}`"
            link-text="Baca Artikel →" />
        </div>
        <div v-else class="grid md:grid-cols-3 gap-4">
          <ArticleCard image="Renungan Harian" title="Renungan Minggu Ini: Kasih dan Pengampunan"
            description="Artikel singkat tentang ajaran Yesus mengenai pengampunan, dihubungkan dengan kehidupan sehari-hari umat."
            to="/artikel/renungan-kasih" link-text="Baca Artikel →" />
          <ArticleCard image="Khotbah Pastor" title="Khotbah Minggu Lalu: Iman di Tengah Tantangan"
            description="Transkrip khotbah Pastor Yohanes tentang mempertahankan iman di era modern."
            to="/artikel/khotbah-iman" link-text="Baca Lengkap →" />
          <ArticleCard image="Pengumuman" title="Panduan Retret Rohani 2024"
            description="Informasi lengkap tentang retret tahunan paroki, termasuk jadwal dan persiapan."
            to="/artikel/retret-2024" link-text="Lihat Detail →" />
        </div>
        <!-- CTA ke Full Artikel -->
        <div class="text-center mt-6">
          <NuxtLink to="/artikel"
            class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Artikel
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 7: Agenda Mendatang -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-3">
            <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Agenda Mendatang</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Jadwal kegiatan dan acara mendatang di Paroki
            St. Paulus Juanda.</p>
        </div>
        <div v-if="agendaPending" class="text-center text-gray-500">
          Memuat agenda mendatang...
        </div>
        <div v-else-if="agendaError" class="text-center text-red-500">
          Gagal memuat agenda mendatang.
        </div>
        <div v-else-if="upcomingAgendas && upcomingAgendas.length > 0" class="grid md:grid-cols-3 gap-4">
          <div v-for="agenda in upcomingAgendas.slice(0, 3)" :key="agenda.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-3">
                <span :style="getCategoryStyle(agenda)"
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                  {{ agenda.category }}
                </span>
              </div>

              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{{ agenda.title }}</h3>

              <div class="flex items-center text-gray-600 mb-2">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">{{ formatDate(agenda.start_date) }}</span>
              </div>

              <div class="flex items-center text-gray-600 mb-3">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ agenda.location }}</span>
              </div>

              <div v-if="agenda.description" class="text-gray-700 mb-4">
                <p class="text-sm line-clamp-2">{{ agenda.description }}</p>
              </div>

              <NuxtLink :to="`/agenda/${agenda.id}`"
                class="inline-block text-[#882f1d] font-medium hover:text-[#6b2416] transition-colors">
                Lihat Detail →
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 class="text-lg font-cinzel font-medium text-gray-900 mb-2">Tidak ada agenda mendatang</h3>
          <p class="text-gray-600">Belum ada agenda yang dijadwalkan untuk periode mendatang.</p>
        </div>
        <!-- CTA ke Full Agenda -->
        <div class="text-center mt-6">
          <NuxtLink to="/agenda"
            class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Agenda
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 8: Status Pemesanan Ruangan -->
    <ClientOnly>
      <section id="booking-section" class="py-16 bg-gray-50">
        <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
          <div class="text-center mb-12">
            <div class="flex items-center justify-center mb-3">
              <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Status Pemesanan Ruangan</h2>
            <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Status pemesanan ruangan di Paroki St.
              Paulus
              - Juanda.</p>
          </div>

          <!-- Info Badge: Filter Active -->
          <div class="mb-6 max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-blue-900 mb-1">📅 Menampilkan Pemesanan Aktif</p>
              <p class="text-sm text-blue-800">
                Hanya menampilkan pemesanan <strong>hari ini dan mendatang</strong>. Pemesanan yang sudah selesai tidak
                ditampilkan.
              </p>
            </div>
          </div>

          <div v-if="bookingsPending" class="text-center text-gray-500">
            Memuat status pemesanan...
          </div>
          <div v-else-if="bookingsError" class="text-center text-red-500">
            Gagal memuat status pemesanan. Silakan refresh halaman.
          </div>
          <div v-else-if="publicBookings && publicBookings.length > 0">
            <!-- Mobile View: Card Layout -->
            <div class="md:hidden space-y-4 mb-6">
              <div v-for="booking in paginatedBookings" :key="booking.id"
                class="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-[#882f1d]/30 transition-all duration-300">
                <!-- Event Name with Icon -->
                <div class="flex items-center mb-4 pb-3 border-b-2 border-gray-100">
                  <div class="bg-[#882f1d]/10 p-2 rounded-lg mr-3">
                    <svg class="w-6 h-6 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 truncate flex-1">
                    {{ booking.event_name }}
                  </h3>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <!-- Date -->
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">📅 Tanggal</p>
                    <p class="text-sm font-bold text-gray-800">{{ formatDate(booking.event_date) }}</p>
                  </div>

                  <!-- Time -->
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">🕐 Waktu</p>
                    <p class="text-sm font-bold text-gray-800">{{ booking.start_time }}</p>
                    <p class="text-xs text-gray-600">s/d {{ booking.end_time }}</p>
                  </div>

                  <!-- Room -->
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">🏢 Ruangan</p>
                    <p class="text-sm font-bold text-gray-800">{{ booking.room_name }}</p>
                    <p class="text-xs text-gray-600">{{ booking.room_location }}</p>
                  </div>

                  <!-- Status -->
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">✓ Status</p>
                    <span :style="getBookingStatusStyle(booking.status)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ booking.status }}
                    </span>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">👤 Pemesan</p>
                  <p class="text-sm font-bold text-gray-800">{{ booking.requester_name || booking.user_name || '-' }}
                  </p>
                  <p class="text-xs text-gray-600">Username: {{ booking.username || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Desktop View: Table -->
            <div class="hidden md:block overflow-x-auto">
              <table class="min-w-full bg-white rounded-lg shadow-md">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal &
                      Waktu</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama
                      Acara</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemesan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="booking in paginatedBookings" :key="booking.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(booking.event_date) }}</div>
                      <div class="text-sm text-gray-500">{{ booking.start_time }} - {{ booking.end_time }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ booking.event_name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ booking.room_name }}</div>
                      <div class="text-sm text-gray-500">{{ booking.room_location }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ booking.requester_name || booking.user_name || '-' }}</div>
                      <div class="text-sm text-gray-500">@{{ booking.username || '-' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :style="getBookingStatusStyle(booking.status)"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ booking.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Controls -->
            <div v-if="totalBookingPages > 1" class="mt-6 flex items-center justify-center space-x-2">
              <!-- Previous Button -->
              <button @click="goToBookingPage(currentBookingPage - 1)" :disabled="currentBookingPage === 1" :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                currentBookingPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#882f1d] border border-[#882f1d] hover:bg-[#882f1d] hover:text-white'
              ]">
                ‹ Sebelumnya
              </button>

              <!-- Page Numbers -->
              <div class="flex space-x-1">
                <button v-for="page in totalBookingPages" :key="page" @click="goToBookingPage(page)" :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  page === currentBookingPage
                    ? 'bg-[#882f1d] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]">
                  {{ page }}
                </button>
              </div>

              <!-- Next Button -->
              <button @click="goToBookingPage(currentBookingPage + 1)"
                :disabled="currentBookingPage === totalBookingPages" :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  currentBookingPage === totalBookingPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#882f1d] border border-[#882f1d] hover:bg-[#882f1d] hover:text-white'
                ]">
                Selanjutnya ›
              </button>
            </div>

            <!-- Info Text -->
            <div class="mt-4 text-center text-sm text-gray-600">
              Menampilkan {{ (currentBookingPage - 1) * bookingsPerPage + 1 }} -
              {{ Math.min(currentBookingPage * bookingsPerPage, publicBookings.length) }}
              dari {{ publicBookings.length }} pemesanan
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            <h3 class="text-lg font-cinzel font-medium text-gray-900 mb-2">Tidak ada pemesanan aktif</h3>
            <p class="text-gray-600">Saat ini tidak ada pemesanan ruangan untuk hari ini dan mendatang.</p>
          </div>
          <!-- CTA ke Full Bookings -->
          <div class="text-center mt-12">
            <NuxtLink to="/booking"
              class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
              Pesan Ruangan
            </NuxtLink>
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- Section 9: QR Persembahan - Sebelum Footer -->
    <QRPersembahan />
  </div>
    </div>
  </div>
</template>

<script setup>
const { optimizeImageUrl } = useOptimizedImage()
const { isMaintenance } = useMaintenance('beranda')

// DIAGNOSTIC: Temporarily disable SSR to test IPC crash
definePageMeta({ ssr: false })

// Set page title and meta
useHead({
  title: 'Paroki St. Paulus - Juanda, Sidoarjo',
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },

    // Open Graph for homepage
    { property: 'og:title', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
    { property: 'og:description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
    { property: 'og:image', content: 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png' },
    { property: 'og:url', content: 'https://stpaulusjuanda.org' },

    // Twitter Card for homepage
    { name: 'twitter:title', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
    { name: 'twitter:description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
    { name: 'twitter:image', content: 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png' }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://stpaulusjuanda.org/'
    }
  ]
})


// Fetch latest album data from Google Shared Albums
const { data: galleryData, pending, error } = await useAsyncData('homepage-gallery',
  async () => {
    try {
      const response = await $fetch('/api/shared-albums?active=true')
      return response.data || []
    } catch (err) {
      console.error('Failed to fetch gallery:', err)
      return []
    }
  },
  {
    lazy: true,
    default: () => [],
    transform: (data) => data || []
  }
);

// Fetch latest news data
const { data: newsData, pending: newsPending, error: newsError } = await useAsyncData('homepage-news',
  async () => {
    try {
      return await $fetch('/api/berita')
    } catch (err) {
      console.error('Failed to fetch news:', err)
      return []
    }
  },
  {
    lazy: true,
    default: () => [],
    transform: (data) => data || []
  }
);

// Fetch latest articles data
const { data: articlesData, pending: articlesPending, error: articlesError } = await useAsyncData('homepage-articles',
  async () => {
    try {
      return await $fetch('/api/artikel')
    } catch (err) {
      console.error('Failed to fetch articles:', err)
      return []
    }
  },
  {
    lazy: true,
    default: () => [],
    transform: (data) => data || []
  }
);

// Fetch upcoming agenda data
const { data: agendaData, pending: agendaPending, error: agendaError } = await useAsyncData('homepage-agenda',
  async () => {
    try {
      return await $fetch('/api/agenda/upcoming')
    } catch (err) {
      console.error('Failed to fetch agenda:', err)
      return []
    }
  },
  {
    default: () => [],
    transform: (data) => data || []
  }
);

// Fetch featured documents data - CLIENT ONLY untuk optimasi
const { data: featuredDocumentsData, pending: featuredDocumentsPending, error: featuredDocumentsError } = await useAsyncData('homepage-featured-documents',
  async () => {
    try {
      return await $fetch('/api/featured-documents')
    } catch (err) {
      console.error('Failed to fetch documents:', err)
      return []
    }
  }, {
  server: false,
  lazy: true,
  default: () => [],
  transform: (data) => data || []
}
);

// Fetch public bookings data - CLIENT ONLY untuk optimasi
const { data: bookingsData, pending: bookingsPending, error: bookingsError } = await useAsyncData('homepage-bookings',
  async () => {
    try {
      console.log('[Homepage] Fetching bookings from API...');
      const response = await $fetch('/api/bookings/public-list');
      console.log('[Homepage] API Response:', response);
      console.log('[Homepage] Bookings count:', response?.bookings?.length || 0);
      return response;
    } catch (err) {
      console.error('[Homepage] Failed to fetch bookings:', err);
      return { bookings: [], total: 0 };
    }
  }, {
  server: false,
  lazy: true,
  default: () => ({ bookings: [], total: 0 }),
  transform: (data) => {
    // Ensure we return object with bookings array
    if (!data) return { bookings: [], total: 0 };
    if (Array.isArray(data)) return { bookings: data, total: data.length };
    if (data.bookings && Array.isArray(data.bookings)) return data;
    return { bookings: [], total: 0 };
  }
}
);

// Fetch active hero theme with error handling
const { data: activeThemeData, error: themeError } = await useAsyncData('active-hero-theme',
  async () => {
    try {
      return await $fetch('/api/hero-theme/active')
    } catch (err) {
      console.error('Failed to fetch hero theme:', err)
      return null
    }
  }, {
  lazy: true,
  default: () => null,
  transform: (data) => data || null
}
)

// Get the latest albums (first 3 in sorted array)
const latestAlbums = computed(() => {
  return galleryData.value?.slice(0, 3) || [];
});

// Get active hero theme with fallback
const activeTheme = computed(() => {
  // If error or no data, return default theme
  if (themeError.value || !activeThemeData.value) {
    return {
      id: 0,
      name: 'Default',
      image_path: '/images/gereja-stpaulus-hero.jpg'
    }
  }
  return activeThemeData.value
})

// Get latest news (first 3)
const latestNews = computed(() => {
  return newsData.value?.slice(0, 3) || [];
});

// Get latest articles (first 3)
const latestArticles = computed(() => {
  return articlesData.value?.slice(0, 3) || [];
});

// Get upcoming agendas (first 6)
const upcomingAgendas = computed(() => {
  return agendaData.value?.slice(0, 6) || [];
});

// Get featured documents (first 3)
const featuredDocuments = computed(() => {
  return featuredDocumentsData.value || [];
});

// Get public bookings dengan filter: hanya hari ini dan mendatang
const publicBookings = computed(() => {
  const bookings = bookingsData.value?.bookings || [];

  console.log('[Homepage] Total bookings from API:', bookings.length);
  console.log('[Homepage] Sample booking data:', bookings[0]);

  // Filter: hanya tampilkan booking yang belum selesai (end_time >= now)
  const now = new Date();
  const filtered = bookings.filter((booking) => {
    try {
      // Gunakan end_time_utc (full ISO UTC string) jika tersedia untuk perbandingan yang akurat
      // Ini konsisten dengan cara halaman booking.vue memproses data
      if (booking.end_time_utc) {
        const bookingEndDate = new Date(booking.end_time_utc);
        console.log('[Homepage] Checking booking (UTC):', {
          id: booking.id,
          event: booking.event_name,
          endDate: bookingEndDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          now: now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          isVisible: bookingEndDate >= now
        });
        return bookingEndDate >= now;
      }

      // Fallback: parse dari event_date + end_time (format lama)
      let eventDateStr = booking.event_date;

      // If event_date is a Date object, convert to string
      if (eventDateStr instanceof Date) {
        const year = eventDateStr.getFullYear();
        const month = String(eventDateStr.getMonth() + 1).padStart(2, '0');
        const day = String(eventDateStr.getDate()).padStart(2, '0');
        eventDateStr = `${year}-${month}-${day}`;
      }

      // MySQL returns date as "YYYY-MM-DD" string
      const [year, month, day] = eventDateStr.split('-').map(Number);

      // Parse end_time dari string "HH:MM" or "HH:MM:SS"
      const endTimeStr = booking.end_time.split(':');
      const hours = Number(endTimeStr[0]);
      const minutes = Number(endTimeStr[1]);

      // Create date in local timezone with end time
      const bookingEndDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

      console.log('[Homepage] Checking booking (fallback):', {
        id: booking.id,
        event: booking.event_name,
        endDate: bookingEndDate.toLocaleString(),
        now: now.toLocaleString(),
        isVisible: bookingEndDate >= now
      });

      // Hanya tampilkan jika booking belum selesai
      return bookingEndDate >= now;
    } catch (error) {
      console.error('[Homepage] Error parsing booking date:', error, booking);
      return false;
    }
  });

  console.log('[Homepage] Filtered bookings count:', filtered.length);
  return filtered;
});

// Pagination untuk booking
const currentBookingPage = ref(1)
const bookingsPerPage = 10

const paginatedBookings = computed(() => {
  const start = (currentBookingPage.value - 1) * bookingsPerPage
  const end = start + bookingsPerPage
  return publicBookings.value.slice(start, end)
})

const totalBookingPages = computed(() => {
  return Math.ceil(publicBookings.value.length / bookingsPerPage)
})

const goToBookingPage = (page) => {
  if (page >= 1 && page <= totalBookingPages.value) {
    currentBookingPage.value = page
    // Scroll to booking section
    const bookingSection = document.querySelector('#booking-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

const handleAlbumImageError = (event) => {
  const img = event?.target
  if (!img || typeof img.src !== 'string') return

  if (img.src.includes('/images/default-gallery.jpg')) return
  img.src = '/images/default-gallery.jpg'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getDocumentUrl = (docId, mode = 'attachment') => `/api/documents/${docId}/download?mode=${mode}`

// State loading per-dokumen untuk beranda
const loadingDocId = ref(null)

// Buka dokumen lewat API server lalu tampilkan sebagai blob URL
// Cara ini 100% same-origin, tidak ada masalah cross-origin/chrome-error
const openDocumentAsBlob = async (doc) => {
  if (!process.client) return
  // Buka tab baru dulu (synchronous) agar popup blocker tidak aktif
  const newTab = globalThis.window.open('', '_blank')
  loadingDocId.value = doc.id
  try {
    const response = await fetch(getDocumentUrl(doc.id, 'attachment'))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    if (newTab) {
      newTab.location.href = blobUrl
    } else {
      globalThis.window.open(blobUrl, '_blank', 'noopener')
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
  } catch (error) {
    console.error('Failed to open document:', error)
    if (newTab) newTab.close()
    alert('Gagal membuka dokumen. Silakan coba lagi.')
  } finally {
    loadingDocId.value = null
  }
}

const viewDocument = (doc) => openDocumentAsBlob(doc)
const printDocument = (doc) => openDocumentAsBlob(doc)

const downloadDocument = (doc) => {
  if (process.client) {
    try {
      const a = globalThis.document.createElement('a')
      a.href = getDocumentUrl(doc.id, 'attachment')
      a.download = doc.original_filename
      globalThis.document.body.appendChild(a)
      a.click()
      globalThis.document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download document:', error)
      alert('Gagal mengunduh dokumen')
    }
  }
}

const getCategoryStyle = (agenda) => {
  if (agenda.category_color) {
    // Convert hex to RGB for background with opacity
    const hex = agenda.category_color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      color: agenda.category_color,
      border: `1px solid ${agenda.category_color}`
    }
  }
  return {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    color: '#6B7280',
    border: '1px solid #D1D5DB'
  }
}

const getBookingStatusStyle = (status) => {
  switch (status) {
    case 'APPROVED':
      return {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        color: '#16A34A',
        border: '1px solid #16A34A'
      }
    case 'PENDING':
      return {
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        color: '#D97706',
        border: '1px solid #D97706'
      }
    case 'REJECTED':
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#DC2626',
        border: '1px solid #DC2626'
      }
    case 'CANCELLED':
      return {
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        color: '#EA580C',
        border: '1px solid #EA580C'
      }
    default:
      return {
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        color: '#6B7280',
        border: '1px solid #D1D5DB'
      }
  }
}
</script>

<style scoped>
/* No additional styles - All Tailwind */
</style>
