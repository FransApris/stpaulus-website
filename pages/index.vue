<template>
  <div>
    <!-- isMaintenance: useMaintenance kini server:false, default () => {} -->
    <!-- Selama client belum fetch, isMaintenance = false → tidak ada flash -->
    <PageMaintenance v-if="isMaintenance" title="Beranda / Home" />
    <div v-else class="min-h-screen pt-4 bg-gray-50">
      <!-- HeroSection: hero-image dari activeTheme yang server:false+lazy:true -->
      <!-- SSR render URL fallback, client render Cloudinary URL = mismatch -->
      <!-- Gunakan #fallback slot untuk render hero statis saat SSR -->
      <ClientOnly>
        <HeroSection :show-hero="true" title="Selamat Datang di Paroki St. Paulus Juanda"
          subtitle="Temukan berita, artikel, galeri kegiatan, dan agenda terbaru kami." cta-text="Lihat Jadwal Misa"
          cta-to="/misa" :hero-image="activeTheme?.image_path || '/images/gereja-stpaulus-hero.jpg'" />
        <template #fallback>
          <!-- SSR: render hero dengan image default agar konsisten dengan state awal client -->
          <HeroSection :show-hero="true" title="Selamat Datang di Paroki St. Paulus Juanda"
            subtitle="Temukan berita, artikel, galeri kegiatan, dan agenda terbaru kami." cta-text="Lihat Jadwal Misa"
            cta-to="/misa" hero-image="/images/gereja-stpaulus-hero.jpg" />
        </template>
      </ClientOnly>


    <!-- Live Jadwal Misa Widget (Floating) -->
    <ClientOnly>
      <MisaScheduleWidget />
    </ClientOnly>

    <!-- Section 1: Welcome / About Teaser -->
    <section class="py-16 bg-white reveal-on-scroll">
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
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <SimpleCard class="reveal-on-scroll reveal-delay-100" title="Gallery Foto"
            description="Lihat momen indah kegiatan paroki kami. Dari misa hingga retret rohani." to="/galeri"
            link-text="Lihat Gallery" />
          <SimpleCard class="reveal-on-scroll reveal-delay-200" title="Sejarah Gereja"
            description="Pelajari perjalanan Paroki St. Paulus sejak didirikan. Warisan iman yang kaya." to="/sejarah"
            link-text="Baca Sejarah" />
          <SimpleCard class="reveal-on-scroll reveal-delay-300" title="Kontak Kami"
            description="Hubungi pastor, staf, atau komunitas untuk informasi lebih lanjut." to="/kontak"
            link-text="Hubungi" />
        </div>
      </div>
    </section>

    <!-- Quick Stats Section (NEW) -->
    <ClientOnly>
      <QuickStatsCounter />
    </ClientOnly>

    <!-- Section 2: Teritorial Lingkungan -->
    <ClientOnly>
      <section class="py-16 bg-white reveal-on-scroll">
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
    <section class="py-16 bg-white reveal-on-scroll">
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
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="bg-gray-200 h-48 rounded-t-2xl"></div>
            <div class="bg-white p-5 rounded-b-2xl shadow-xs border border-gray-100/90 border-t-0">
              <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4 mt-4 pt-3 border-t border-gray-100"></div>
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

        <!-- Albums Carousel -->
        <div v-else-if="latestAlbums && latestAlbums.length > 0" class="relative group">
          <!-- Left Button (Hidden on Mobile) -->
          <button @click="scrollAlbumCarousel('left')" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kiri">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <!-- Right Button (Hidden on Mobile) -->
          <button @click="scrollAlbumCarousel('right')" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kanan">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <!-- Carousel Container with Drag Events -->
          <div 
            ref="albumCarouselRef" 
            class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing"
            @mousedown="onDragStart"
            @mouseleave="onDragEnd"
            @mouseup="onDragEnd"
            @mousemove="onDragMove"
          >
            <a v-for="(album, idx) in latestAlbums" :key="album.id" :href="album.share_url" target="_blank"
              rel="noopener noreferrer" class="group reveal-on-scroll shrink-0 w-[85vw] sm:w-[40vw] lg:w-[30vw] snap-center" :class="`reveal-delay-${(idx % 3 + 1) * 100}`">
            <div
              class="bg-white rounded-2xl shadow-xs border border-gray-100/90 overflow-hidden hover:shadow-xl hover:border-[#882f1d]/20 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between h-full">
              <!-- Album Cover -->
              <div class="relative overflow-hidden h-48 bg-gradient-to-br from-[#882f1d] to-[#c58229] pointer-events-none">
                <img :src="optimizeImageUrl(album.thumbnail_url || '/images/default-gallery.jpg', 600)" :alt="album.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  @error="handleAlbumImageError" draggable="false">

                <!-- Google Photos Badge -->
                <div
                  class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1 shadow-xs">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 .5a11.5 11.5 0 0 1 11.5 11.5A11.5 11.5 0 0 1 12 23.5 11.5 11.5 0 0 1 .5 12 11.5 11.5 0 0 1 12 .5zm3.5 4.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                  </svg>
                  Google Photos
                </div>
              </div>

              <!-- Album Info -->
              <div class="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#882f1d] transition-colors line-clamp-2">
                    {{ album.title }}
                  </h3>
                  <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                    {{ album.description || 'Album foto kegiatan paroki' }}
                  </p>
                </div>

                <!-- Date and Action -->
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span class="text-xs text-gray-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                      </path>
                    </svg>
                    <ClientOnly fallback="Memuat tanggal...">
                      {{ formatDate(album.created_at) }}
                    </ClientOnly>
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
    <!-- ClientOnly: data berita menggunakan server:false + lazy:true -->
    <!-- SSR akan render skeleton, client render data → mismatch terjamin tanpa ClientOnly -->
    <ClientOnly>
      <section class="py-12 bg-gray-50 reveal-on-scroll">
        <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-3">
              <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Berita Terbaru</h2>
            <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Informasi dan berita terkini dari Paroki St.
              Paulus Juanda.</p>
          </div>
          <div v-if="newsPending" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar">
            <div v-for="i in 3" :key="i" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] animate-pulse flex flex-col h-[400px]">
              <div class="bg-gray-200 h-48 rounded-t-2xl shrink-0"></div>
              <div class="bg-white p-5 rounded-b-2xl shadow-xs border border-gray-100/90 border-t-0 flex-1 flex flex-col">
                <div class="h-5 bg-gray-200 rounded w-full mb-3"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div class="mt-auto h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <div v-else-if="newsError" class="text-center text-red-500">
            Gagal memuat berita terbaru.
          </div>
          <div v-else-if="latestNews && latestNews.length > 0" class="relative group">
            <button @click="scrollNewsCarousel('left')" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kiri"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button @click="scrollNewsCarousel('right')" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kanan"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            <div ref="newsCarouselRef" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing" @mousedown="onNewsDragStart" @mouseleave="onNewsDragEnd" @mouseup="onNewsDragEnd" @mousemove="onNewsDragMove">
              <ArticleCard v-for="(news, idx) in latestNews.slice(0, 6)" :key="news.id" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] reveal-on-scroll pointer-events-none-img" :class="`reveal-delay-${(idx % 3 + 1) * 100}`" :image="news.image || activeTheme?.image_path || '/images/default-news.jpg'" image-type="url" :title="news.title" :description="news.excerpt" :date="news.date" :to="`/berita/${news.slug}`" draggable="false" />
            </div>
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
    </ClientOnly>

    <!-- Section 5: Dokumen Paroki -->
    <!-- ClientOnly: data dokumen menggunakan server:false + lazy:true -->
    <ClientOnly>
      <section class="py-12 bg-white reveal-on-scroll">
        <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-3">
              <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Dokumen Paroki</h2>
            <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Koleksi dokumen resmi dan informasi penting
              Gereja St. Paulus Juanda.</p>
          </div>
          <div v-if="featuredDocumentsPending" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar">
            <div v-for="i in 3" :key="i" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] animate-pulse">
              <div class="bg-white p-6 rounded-2xl shadow-xs border border-gray-100/90">
                <div class="flex items-center mb-3">
                  <div class="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div class="flex justify-between items-center mb-4">
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/5"></div>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div class="flex space-x-2">
                    <div class="w-8 h-8 bg-gray-200 rounded"></div>
                    <div class="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="featuredDocumentsError" class="text-center text-red-500">
            Gagal memuat dokumen unggulan.
          </div>
          <div v-else-if="featuredDocuments && featuredDocuments.length > 0" class="relative group">
            <button @click="scrollDocCarousel('left')" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kiri"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button @click="scrollDocCarousel('right')" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kanan"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            <div ref="docCarouselRef" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing" @mousedown="onDocDragStart" @mouseleave="onDocDragEnd" @mouseup="onDocDragEnd" @mousemove="onDocDragMove">
            <div v-for="(doc, idx) in featuredDocuments.slice(0, 6)" :key="doc.id" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] group relative bg-white border border-gray-100/90 rounded-2xl shadow-xs overflow-hidden hover:shadow-xl hover:border-[#882f1d]/20 transition-all duration-300 transform hover:-translate-y-1.5 reveal-on-scroll" :class="`reveal-delay-${(idx % 3 + 1) * 100}`">
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
                  <div class="text-xs text-gray-600">
                    Diunggah: <ClientOnly fallback="...">{{ formatDate(doc.created_at) }}</ClientOnly>
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
    </ClientOnly>

    <!-- Section 6: Artikel Terbaru (Updated to use API) -->
    <ClientOnly>
      <section class="py-12 bg-gray-50 reveal-on-scroll">
        <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-3">
              <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Artikel & Renungan</h2>
            <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Baca inspirasi rohani, khotbah, dan artikel
              dari pastor serta komunitas paroki kami.</p>
          </div>
          <div v-if="articlesPending" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar">
            <div v-for="i in 3" :key="i" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] animate-pulse flex flex-col h-[400px]">
              <div class="bg-gray-200 h-48 rounded-t-2xl shrink-0"></div>
              <div class="bg-white p-5 rounded-b-2xl shadow-xs border border-gray-100/90 border-t-0 flex-1 flex flex-col">
                <div class="h-5 bg-gray-200 rounded w-full mb-3"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div class="mt-auto h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <div v-else-if="articlesError" class="text-center text-red-500">
            Gagal memuat artikel terbaru.
          </div>
          <div v-else-if="latestArticles && latestArticles.length > 0" class="relative group">
            <button @click="scrollArticleCarousel('left')" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kiri"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button @click="scrollArticleCarousel('right')" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kanan"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            <div ref="articleCarouselRef" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing" @mousedown="onArticleDragStart" @mouseleave="onArticleDragEnd" @mouseup="onArticleDragEnd" @mousemove="onArticleDragMove">
              <ArticleCard v-for="(article, idx) in latestArticles.slice(0, 6)" :key="article.id" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] reveal-on-scroll pointer-events-none-img" :class="`reveal-delay-${(idx % 3 + 1) * 100}`" :image="article.image || '/images/default-article.jpg'" image-type="url" :title="article.title" :description="article.excerpt" :date="article.date" :to="`/artikel/${article.slug}`" link-text="Baca Artikel →" draggable="false" />
            </div>
          </div>
          <div v-else class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar">
            <ArticleCard class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw]" image="Renungan Harian" title="Renungan Minggu Ini: Kasih dan Pengampunan" description="Artikel singkat tentang ajaran Yesus mengenai pengampunan, dihubungkan dengan kehidupan sehari-hari umat." to="/artikel/renungan-kasih" link-text="Baca Artikel →" />
            <ArticleCard class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw]" image="Khotbah Pastor" title="Khotbah Minggu Lalu: Iman di Tengah Tantangan" description="Transkrip khotbah Pastor Yohanes tentang mempertahankan iman di era modern." to="/artikel/khotbah-iman" link-text="Baca Lengkap →" />
            <ArticleCard class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw]" image="Pengumuman" title="Panduan Retret Rohani 2024" description="Informasi lengkap tentang retret tahunan paroki, termasuk jadwal dan persiapan." to="/artikel/retret-2024" link-text="Lihat Detail →" />
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
    </ClientOnly>

    <!-- Section 7: Agenda Mendatang -->
    <ClientOnly>
      <section class="py-12 bg-white reveal-on-scroll">
        <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-3">
              <div class="h-1 w-12 bg-[#882f1d] rounded"></div>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#882f1d] mb-3">Agenda Mendatang</h2>
            <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Jadwal kegiatan dan acara mendatang di Paroki
              St. Paulus Juanda.</p>
          </div>
          <div v-if="agendaPending" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar">
            <div v-for="i in 3" :key="i" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] group bg-white border border-gray-100/90 rounded-2xl shadow-xs overflow-hidden animate-pulse">
              <div class="p-6">
                <div class="flex items-center space-x-2 mb-3">
                  <div class="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
                <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div class="flex items-center mb-3">
                  <div class="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div class="flex items-center mb-4">
                  <div class="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div class="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
              </div>
            </div>
          </div>
          <div v-else-if="agendaError" class="text-center text-red-500">
            Gagal memuat agenda mendatang.
          </div>
          <div v-else-if="upcomingAgendas && upcomingAgendas.length > 0" class="relative group">
            <button @click="scrollAgendaCarousel('left')" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kiri"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button @click="scrollAgendaCarousel('right')" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg text-[#882f1d] opacity-80 hover:opacity-100 hover:scale-110 transition-all hover:bg-white focus:outline-none hidden md:flex items-center justify-center border border-gray-100" aria-label="Geser kanan"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            <div ref="agendaCarouselRef" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-2 -mx-2 hide-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing" @mousedown="onAgendaDragStart" @mouseleave="onAgendaDragEnd" @mouseup="onAgendaDragEnd" @mousemove="onAgendaDragMove">
              <div v-for="(agenda, idx) in upcomingAgendas.slice(0, 6)" :key="agenda.id" class="shrink-0 snap-center w-[85vw] sm:w-[45vw] lg:w-[28vw] group bg-white border border-gray-100/90 rounded-2xl shadow-xs overflow-hidden hover:shadow-xl hover:border-[#882f1d]/20 transition-all duration-300 transform hover:-translate-y-1.5 reveal-on-scroll" :class="`reveal-delay-${(idx % 3 + 1) * 100}`">
                <div class="p-6">
                  <div class="flex items-center space-x-2 mb-3">
                    <span :style="getCategoryStyle(agenda)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">{{ agenda.category }}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{{ agenda.title }}</h3>
                  <div class="flex items-center text-gray-600 mb-2">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <ClientOnly fallback="..."><span class="font-medium">{{ formatDate(agenda.start_date) }}</span></ClientOnly>
                  </div>
                  <div class="flex items-center text-gray-600 mb-3">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{{ agenda.location }}</span>
                  </div>
                  <div v-if="agenda.description" class="text-gray-700 mb-4">
                    <p class="text-sm line-clamp-2">{{ agenda.description }}</p>
                  </div>
                  <NuxtLink :to="`/agenda/${agenda.id}`" draggable="false" class="inline-block text-[#882f1d] font-medium hover:text-[#6b2416] transition-colors">Lihat Detail →</NuxtLink>
                </div>
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
    </ClientOnly>

    <!-- Section 8: Status Pemesanan Ruangan -->
    <ClientOnly>
      <section id="booking-section" class="py-16 bg-gray-50 reveal-on-scroll">
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
                <div class="flex items-start mb-4 pb-3 border-b-2 border-gray-100 gap-3">
                  <div class="bg-[#882f1d]/10 p-2.5 rounded-xl shrink-0 mt-0.5">
                    <svg class="w-5 h-5 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-snug flex-1 break-words">
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
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ booking.event_name }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ booking.room_name }}</div>
                      <div class="text-sm text-gray-500">{{ booking.room_location }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ booking.requester_name || booking.user_name || '-' }}</div>
                      <div class="text-sm text-gray-500 break-all">@{{ booking.username || '-' }}</div>
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
            <div v-if="totalBookingPages > 1" class="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <!-- Previous Button -->
              <button @click="goToBookingPage(currentBookingPage - 1)" :disabled="currentBookingPage === 1" :class="[
                'px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base',
                currentBookingPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#882f1d] border border-[#882f1d] hover:bg-[#882f1d] hover:text-white'
              ]">
                <span class="hidden sm:inline">‹ Sebelumnya</span>
                <span class="sm:hidden">‹ Prev</span>
              </button>

              <!-- Page Numbers -->
              <div class="flex flex-wrap justify-center gap-1">
                <button v-for="page in totalBookingPages" :key="page" @click="goToBookingPage(page)" :class="[
                  'px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base',
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
                  'px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base',
                  currentBookingPage === totalBookingPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#882f1d] border border-[#882f1d] hover:bg-[#882f1d] hover:text-white'
                ]">
                <span class="hidden sm:inline">Selanjutnya ›</span>
                <span class="sm:hidden">Next ›</span>
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

    <QRPersembahan />
  </div>
  </div>
</template>

<script setup>
const { optimizeImageUrl } = useOptimizedImage()
const { isMaintenance } = useMaintenance('beranda')
const { initObserver } = useScrollReveal()

// ── ALBUM CAROUSEL LOGIC ──
const albumCarouselRef = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeftPos = ref(0)

const scrollAlbumCarousel = (direction) => {
  if (albumCarouselRef.value) {
    const scrollAmount = typeof window !== 'undefined' ? window.innerWidth * 0.4 : 300
    albumCarouselRef.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}

const onDragStart = (e) => {
  if (!albumCarouselRef.value) return
  isDragging.value = true
  albumCarouselRef.value.classList.remove('snap-x', 'snap-mandatory', 'scroll-smooth')
  startX.value = e.pageX - albumCarouselRef.value.offsetLeft
  scrollLeftPos.value = albumCarouselRef.value.scrollLeft
}

const onDragEnd = () => {
  if (!isDragging.value || !albumCarouselRef.value) return
  isDragging.value = false
  albumCarouselRef.value.classList.add('snap-x', 'snap-mandatory', 'scroll-smooth')
}

const onDragMove = (e) => {
  if (!isDragging.value || !albumCarouselRef.value) return
  e.preventDefault()
  const x = e.pageX - albumCarouselRef.value.offsetLeft
  const walk = (x - startX.value) * 2 // scroll speed multiplier
  albumCarouselRef.value.scrollLeft = scrollLeftPos.value - walk
}

// ── NEWS CAROUSEL LOGIC ──
const newsCarouselRef = ref(null)
const isNewsDragging = ref(false)
const startNewsX = ref(0)
const scrollNewsLeftPos = ref(0)

const scrollNewsCarousel = (direction) => {
  if (newsCarouselRef.value) {
    const scrollAmount = typeof window !== 'undefined' ? window.innerWidth * 0.4 : 300
    newsCarouselRef.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }
}
const onNewsDragStart = (e) => {
  if (!newsCarouselRef.value) return
  isNewsDragging.value = true
  newsCarouselRef.value.classList.remove('snap-x', 'snap-mandatory', 'scroll-smooth')
  startNewsX.value = e.pageX - newsCarouselRef.value.offsetLeft
  scrollNewsLeftPos.value = newsCarouselRef.value.scrollLeft
}
const onNewsDragEnd = () => {
  if (!isNewsDragging.value || !newsCarouselRef.value) return
  isNewsDragging.value = false
  newsCarouselRef.value.classList.add('snap-x', 'snap-mandatory', 'scroll-smooth')
}
const onNewsDragMove = (e) => {
  if (!isNewsDragging.value || !newsCarouselRef.value) return
  e.preventDefault()
  const walk = (e.pageX - newsCarouselRef.value.offsetLeft - startNewsX.value) * 2
  newsCarouselRef.value.scrollLeft = scrollNewsLeftPos.value - walk
}

// ── DOC CAROUSEL LOGIC ──
const docCarouselRef = ref(null)
const isDocDragging = ref(false)
const startDocX = ref(0)
const scrollDocLeftPos = ref(0)

const scrollDocCarousel = (direction) => {
  if (docCarouselRef.value) {
    const scrollAmount = typeof window !== 'undefined' ? window.innerWidth * 0.4 : 300
    docCarouselRef.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }
}
const onDocDragStart = (e) => {
  if (!docCarouselRef.value) return
  isDocDragging.value = true
  docCarouselRef.value.classList.remove('snap-x', 'snap-mandatory', 'scroll-smooth')
  startDocX.value = e.pageX - docCarouselRef.value.offsetLeft
  scrollDocLeftPos.value = docCarouselRef.value.scrollLeft
}
const onDocDragEnd = () => {
  if (!isDocDragging.value || !docCarouselRef.value) return
  isDocDragging.value = false
  docCarouselRef.value.classList.add('snap-x', 'snap-mandatory', 'scroll-smooth')
}
const onDocDragMove = (e) => {
  if (!isDocDragging.value || !docCarouselRef.value) return
  e.preventDefault()
  const walk = (e.pageX - docCarouselRef.value.offsetLeft - startDocX.value) * 2
  docCarouselRef.value.scrollLeft = scrollDocLeftPos.value - walk
}

// ── ARTICLE CAROUSEL LOGIC ──
const articleCarouselRef = ref(null)
const isArticleDragging = ref(false)
const startArticleX = ref(0)
const scrollArticleLeftPos = ref(0)

const scrollArticleCarousel = (direction) => {
  if (articleCarouselRef.value) {
    const scrollAmount = typeof window !== 'undefined' ? window.innerWidth * 0.4 : 300
    articleCarouselRef.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }
}
const onArticleDragStart = (e) => {
  if (!articleCarouselRef.value) return
  isArticleDragging.value = true
  articleCarouselRef.value.classList.remove('snap-x', 'snap-mandatory', 'scroll-smooth')
  startArticleX.value = e.pageX - articleCarouselRef.value.offsetLeft
  scrollArticleLeftPos.value = articleCarouselRef.value.scrollLeft
}
const onArticleDragEnd = () => {
  if (!isArticleDragging.value || !articleCarouselRef.value) return
  isArticleDragging.value = false
  articleCarouselRef.value.classList.add('snap-x', 'snap-mandatory', 'scroll-smooth')
}
const onArticleDragMove = (e) => {
  if (!isArticleDragging.value || !articleCarouselRef.value) return
  e.preventDefault()
  const walk = (e.pageX - articleCarouselRef.value.offsetLeft - startArticleX.value) * 2
  articleCarouselRef.value.scrollLeft = scrollArticleLeftPos.value - walk
}

// ── AGENDA CAROUSEL LOGIC ──
const agendaCarouselRef = ref(null)
const isAgendaDragging = ref(false)
const startAgendaX = ref(0)
const scrollAgendaLeftPos = ref(0)

const scrollAgendaCarousel = (direction) => {
  if (agendaCarouselRef.value) {
    const scrollAmount = typeof window !== 'undefined' ? window.innerWidth * 0.4 : 300
    agendaCarouselRef.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }
}
const onAgendaDragStart = (e) => {
  if (!agendaCarouselRef.value) return
  isAgendaDragging.value = true
  agendaCarouselRef.value.classList.remove('snap-x', 'snap-mandatory', 'scroll-smooth')
  startAgendaX.value = e.pageX - agendaCarouselRef.value.offsetLeft
  scrollAgendaLeftPos.value = agendaCarouselRef.value.scrollLeft
}
const onAgendaDragEnd = () => {
  if (!isAgendaDragging.value || !agendaCarouselRef.value) return
  isAgendaDragging.value = false
  agendaCarouselRef.value.classList.add('snap-x', 'snap-mandatory', 'scroll-smooth')
}
const onAgendaDragMove = (e) => {
  if (!isAgendaDragging.value || !agendaCarouselRef.value) return
  e.preventDefault()
  const walk = (e.pageX - agendaCarouselRef.value.offsetLeft - startAgendaX.value) * 2
  agendaCarouselRef.value.scrollLeft = scrollAgendaLeftPos.value - walk
}

// ── HYDRATION & UTILITY HOISTING (MENCEGAH REFERENCE ERROR) ──
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

// Pagination untuk booking
const currentBookingPage = ref(1)
const bookingsPerPage = 10

// State loading per-dokumen
const loadingDocId = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return ''
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

const openDocumentAsBlob = async (doc) => {
  if (!process.client) return
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
      return { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', border: '1px solid #16A34A' }
    case 'PENDING':
      return { backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#D97706', border: '1px solid #D97706' }
    case 'REJECTED':
      return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', border: '1px solid #DC2626' }
    case 'CANCELLED':
      return { backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#EA580C', border: '1px solid #EA580C' }
    default:
      return { backgroundColor: 'rgba(156, 163, 175, 0.1)', color: '#6B7280', border: '1px solid #D1D5DB' }
  }
}
// ──────────────────────────────────────────────────────────────

// Page Meta — SSR diaktifkan kembali (ssr:false hanya untuk diagnostik sementara, sudah selesai)
// Semua section data-dynamic sudah dibungkus <ClientOnly> untuk mencegah hydration mismatch.
definePageMeta({ ssr: true })

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
    server: false,
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
    server: false,
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
    server: false,
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
    server: false,
    lazy: true,
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
      const response = await $fetch('/api/bookings/public-list');
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
  server: false,
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
  if (themeError.value || !activeThemeData.value) {
    return {
      id: 0,
      name: 'Default',
      image_path: '/images/gereja-stpaulus-hero.jpg'
    }
  }
  return activeThemeData.value
})

// ── Preload Hero Image (hanya di halaman beranda) ────────────────────────────
// Diletakkan di onMounted agar tidak pernah dieksekusi di server.
// watch di dalam onMounted adalah pattern yang aman untuk avoid hydration mismatch.
onMounted(() => {
  watch(activeTheme, (theme) => {
    if (theme?.image_path) {
      useHead({
        link: [{
          rel: 'preload',
          as: 'image',
          href: optimizeImageUrl(theme.image_path, 1200),
          fetchpriority: 'high'
        }]
      })
    }
  }, { immediate: true })
})
// ──────────────────────────────────────────────────────────────────────────

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

  // Guard hydration: di SSR tidak ada jam lokal yang akurat,
  // kembalikan array kosong dan biarkan client-side yang melakukan filter.
  if (!process.client) return [];

  // Tanggal WIB hari ini (YYYY-MM-DD) — dibandingkan per-tanggal, bukan per-momen,
  // agar booking hari ini yang jamnya sudah lewat tetap ditampilkan.
  const todayWIB = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });

  return bookings.filter((booking) => {
    try {
      // ── Prioritas 1: gunakan start_time_utc (ISO string murni dari server) ──
      const utcString = booking.start_time_utc || booking.end_time_utc;
      if (utcString && utcString.includes('T') && utcString.includes('Z')) {
        const bookingStart = new Date(utcString);
        const bookingDateWIB = bookingStart.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
        // Tampilkan jika tanggal booking >= hari ini WIB
        return bookingDateWIB >= todayWIB;
      }

      // ── Fallback: parse dari event_date (format lokal) ──
      let eventDateStr = booking.event_date;
      if (eventDateStr instanceof Date) {
        const yr = eventDateStr.getFullYear();
        const mo = String(eventDateStr.getMonth() + 1).padStart(2, '0');
        const dy = String(eventDateStr.getDate()).padStart(2, '0');
        eventDateStr = `${yr}-${mo}-${dy}`;
      }
      return String(eventDateStr || '').slice(0, 10) >= todayWIB;
    } catch {
      return false;
    }
  });
});

// Pagination untuk tabel booking di beranda
const paginatedBookings = computed(() => {
  const start = (currentBookingPage.value - 1) * bookingsPerPage;
  return publicBookings.value.slice(start, start + bookingsPerPage);
});

const totalBookingPages = computed(() =>
  Math.ceil(publicBookings.value.length / bookingsPerPage)
);

const goToBookingPage = (page) => {
  const total = totalBookingPages.value;
  if (page < 1 || page > total) return;
  currentBookingPage.value = page;

  // Scroll to top of booking section smoothly
  setTimeout(() => {
    const el = document.getElementById('booking-section');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80; // Offset untuk header navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, 50);
};

// Note: helper functions and formatting utilities have been hoisted to the top to avoid Temporal Dead Zone (ReferenceError).
</script>

<style scoped>
/* No additional styles - All Tailwind */
</style>
