<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Pusat Bantuan / FAQ" />
    <div v-else>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Pusat Bantuan" />

        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Pusat Bantuan</h1>
          <p class="text-xl text-gray-600">Temukan jawaban atas pertanyaan umum tentang paroki dan kegiatan kami</p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Pertanyaan Umum</h2>

            <div class="space-y-6">
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">Bagaimana cara mendaftar untuk kegiatan paroki?</h3>
                <p class="text-gray-700">
                  Anda dapat mendaftar kegiatan paroki melalui halaman agenda atau menghubungi sekretariat paroki
                  di nomor telepon yang tersedia. Beberapa kegiatan juga dapat didaftarkan melalui formulir online.
                </p>
              </div>

              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">Kapan jadwal misa mingguan?</h3>
                <p class="text-gray-700">
                  Jadwal misa dapat dilihat di halaman "Jadwal Misa" atau "Agenda". Kami menyelenggarakan
                  misa harian dan mingguan sesuai dengan kalender liturgi Gereja Katolik.
                </p>
              </div>

              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">Bagaimana cara mendapatkan informasi terbaru?</h3>
                <p class="text-gray-700">
                  Anda dapat mengikuti berita dan pengumuman melalui situs web ini, media sosial paroki,
                  atau bergabung dengan grup WhatsApp komunitas paroki.
                </p>
              </div>

              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">Apakah ada layanan konseling rohani?</h3>
                <p class="text-gray-700">
                  Ya, paroki menyediakan layanan konseling rohani. Anda dapat menghubungi romo paroki
                  atau suster yang bertugas untuk mendapatkan bimbingan rohani.
                </p>
              </div>

              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">Bagaimana cara bergabung dengan komunitas paroki?</h3>
                <p class="text-gray-700">
                  Untuk bergabung dengan komunitas paroki, Anda dapat menghadiri misa mingguan dan
                  mendaftar sebagai anggota melalui sekretariat paroki. Kami memiliki berbagai kelompok
                  kategorial sesuai dengan usia dan minat.
                </p>
              </div>
            </div>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6 mt-8">Butuh Bantuan Lebih Lanjut?</h2>
            <p class="text-gray-700 mb-6">
              Jika pertanyaan Anda tidak terjawab di atas, jangan ragu untuk menghubungi kami melalui:
            </p>

            <div class="bg-gray-50 p-6 rounded-lg">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold text-gray-800 mb-2">Sekretariat Paroki</h4>
                  <p class="text-gray-600">Jl. Raya Bandara Juanda No.10, Semambung, Kec. Gedangan, Kabupaten Sidoarjo, Jawa Timur 61254</p>
                  <p class="text-gray-600">Tel: 031-8557854</p>
                  <p class="text-gray-600">Email: stpaulus.sekretariat@gmail.com</p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 mb-2">Jam Operasional</h4>
                  <p class="text-gray-600">Senin - Jumat: 08:00 - 16:00</p>
                  <p class="text-gray-600">Sabtu: 08:00 - 12:00</p>
                  <p class="text-gray-600">Minggu: Tutup (kecuali kegiatan khusus)</p>
                </div>
              </div>
            </div>

            <div class="mt-8 text-center">
              <NuxtLink
                to="/kontak"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#882f1d] hover:bg-[#6b2416] transition-colors duration-200"
              >
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
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('help-center')
// Page meta
useHead({
  title: 'Pusat Bantuan - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Pusat bantuan dan FAQ Paroki St. Paulus Juanda - temukan jawaban pertanyaan umum' }
  ]
})
</script>
