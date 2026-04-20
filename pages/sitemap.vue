<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Peta Situs" />

        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Peta Situs</h1>
          <p class="text-xl text-gray-600">Navigasi lengkap semua halaman di situs web Paroki St. Paulus Juanda</p>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Main Pages -->
            <div>
              <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Halaman Utama</h2>
              <ul class="space-y-4">
                <li>
                  <NuxtLink to="/" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Beranda</span>
                      <p class="text-sm text-gray-500 mt-0.5">Halaman utama website Paroki St. Paulus Juanda</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/tentang-kami" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Tentang Kami</span>
                      <p class="text-sm text-gray-500 mt-0.5">Sejarah, visi & misi, serta profil Gereja Paroki Santo Paulus Juanda</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/kontak" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Kontak</span>
                      <p class="text-sm text-gray-500 mt-0.5">Alamat, nomor telepon, dan formulir hubungi kami</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/jadwal-misa" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Jadwal Misa</span>
                      <p class="text-sm text-gray-500 mt-0.5">Jadwal misa harian, mingguan, dan hari raya di gereja</p>
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Content Pages -->
            <div>
              <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Konten & Informasi</h2>
              <ul class="space-y-4">
                <li>
                  <NuxtLink to="/artikel" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Artikel</span>
                      <p class="text-sm text-gray-500 mt-0.5">Tulisan rohani, katekese, dan refleksi iman dari komunitas paroki</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/berita" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Berita</span>
                      <p class="text-sm text-gray-500 mt-0.5">Informasi terkini, pengumuman, dan kabar kegiatan paroki</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/galeri" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Galeri</span>
                      <p class="text-sm text-gray-500 mt-0.5">Koleksi foto dan dokumentasi kegiatan serta momen paroki</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/agenda" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Agenda</span>
                      <p class="text-sm text-gray-500 mt-0.5">Kalender kegiatan, acara mendatang, dan program paroki</p>
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Legal Pages -->
            <div>
              <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Informasi Legal</h2>
              <ul class="space-y-4">
                <li>
                  <NuxtLink to="/privacy-policy" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Kebijakan Privasi</span>
                      <p class="text-sm text-gray-500 mt-0.5">Informasi tentang cara kami mengumpulkan dan melindungi data pengguna</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/terms-of-service" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Syarat dan Ketentuan</span>
                      <p class="text-sm text-gray-500 mt-0.5">Aturan dan ketentuan penggunaan layanan website paroki</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/cookie-policy" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Kebijakan Cookie</span>
                      <p class="text-sm text-gray-500 mt-0.5">Penjelasan penggunaan cookie untuk meningkatkan pengalaman pengguna</p>
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Support Pages -->
            <div>
              <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Dukungan</h2>
              <ul class="space-y-4">
                <li>
                  <NuxtLink to="/help-center" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Pusat Bantuan</span>
                      <p class="text-sm text-gray-500 mt-0.5">Pertanyaan umum (FAQ) dan panduan penggunaan website</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/blog" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Blog</span>
                      <p class="text-sm text-gray-500 mt-0.5">Catatan pastoral, renungan, dan cerita inspiratif dari paroki</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/dokumen-paroki" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Dokumen Paroki</span>
                      <p class="text-sm text-gray-500 mt-0.5">Dokumen resmi, surat, dan arsip administrasi paroki</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/data-statistika-paroki" class="group flex items-start gap-3">
                    <svg class="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-[#882f1d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                    <div>
                      <span class="font-medium text-gray-700 group-hover:text-[#882f1d] transition-colors">Data Statistik</span>
                      <p class="text-sm text-gray-500 mt-0.5">Data statistika umat, lingkungan, dan wilayah Paroki St. Paulus</p>
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Last Updated -->
          <div class="mt-12 pt-8 border-t border-gray-200 text-center">
            <p class="text-sm text-gray-500">
              Peta situs terakhir diperbarui: {{ new Date().toLocaleDateString('id-ID') }}
            </p>
          </div>
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
// Page meta
useHead({
  title: 'Peta Situs - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Peta situs lengkap Paroki St. Paulus Juanda - navigasi semua halaman website' }
  ]
})
</script>
