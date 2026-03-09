<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Tentang Kami" />

        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Tentang Kami</h1>
          <p class="text-xl text-gray-600">Mengenal Paroki St. Paulus Juanda lebih dekat</p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-6">Sejarah Paroki</h2>
            <p class="text-gray-700 mb-4 leading-relaxed">
              Paroki St. Paulus Juanda didirikan pada tahun 1980 sebagai bagian dari Keuskupan Surabaya.
              Terletak di Jalan Juanda, Sidoarjo, paroki ini telah berkembang menjadi komunitas yang
              dinamis dan peduli terhadap sesama.
            </p>

            <h2 class="text-2xl font-semibold text-[#882f1d] mb-6 mt-6">Visi dan Misi</h2>

            <h3 class="text-xl font-semibold text-gray-800 mb-3">Visi</h3>
            <p class="text-gray-700 mb-4 leading-relaxed">
              Menjadi komunitas paroki yang hidup dalam iman Katolik, saling mendukung, dan aktif
              berkontribusi bagi masyarakat sekitar.
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mb-3">Misi</h3>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1 leading-relaxed">
              <li>Menyelenggarakan perayaan Ekaristi dan sakramen secara teratur</li>
              <li>Mengembangkan pendidikan iman bagi semua umat</li>
              <li>Mendorong pelayanan sosial dan kemanusiaan</li>
              <li>Memperkuat persaudaraan antar umat paroki</li>
              <li>Menjalin kerjasama dengan lembaga-lembaga gerejawi dan masyarakat</li>
            </ul>

            <h2 class="text-2xl font-semibold text-[#882f1d] mb-6 mt-6">Pelayanan Kami</h2>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="font-semibold text-gray-800 mb-3">Liturgi dan Perayaan</h4>
                <ul class="text-gray-700 space-y-1 text-sm leading-relaxed">
                  <li>• Misa harian dan mingguan</li>
                  <li>• Sakramen-sakramen</li>
                  <li>• Devosi dan doa bersama</li>
                  <li>• Perayaan hari raya</li>
                </ul>
              </div>

              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="font-semibold text-gray-800 mb-3">Pendidikan dan Pembinaan</h4>
                <ul class="text-gray-700 space-y-1 text-sm leading-relaxed">
                  <li>• Katekese anak dan remaja</li>
                  <li>• Kursus persiapan sakramen</li>
                  <li>• Kelompok doa dan studi Alkitab</li>
                  <li>• Pembinaan keluarga Katolik</li>
                </ul>
              </div>

              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="font-semibold text-gray-800 mb-3">Pelayanan Sosial</h4>
                <ul class="text-gray-700 space-y-1 text-sm leading-relaxed">
                  <li>• Bantuan kepada yang membutuhkan</li>
                  <li>• Kunjungan ke rumah sakit</li>
                  <li>• Program kemanusiaan</li>
                  <li>• Kerjasama sosial</li>
                </ul>
              </div>

              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="font-semibold text-gray-800 mb-3">Komunitas dan Kegiatan</h4>
                <ul class="text-gray-700 space-y-1 text-sm leading-relaxed">
                  <li>• Kelompok kategorial</li>
                  <li>• Kegiatan paroki</li>
                  <li>• Rekreasi bersama</li>
                  <li>• Bakti sosial</li>
                </ul>
              </div>
            </div>

            <h2 class="text-2xl font-semibold text-[#882f1d] mb-6 mt-6">Pastor dan Staf</h2>
            <p class="text-gray-700 mb-4 leading-relaxed">
              Paroki St. Paulus Juanda dipimpin oleh Romo [Nama Pastor] sebagai pastor paroki,
              didukung oleh tim pastoral yang terdiri dari para suster, katekis, dan relawan.
            </p>

            <h2 class="text-2xl font-semibold text-[#882f1d] mb-6 mt-6">Kontak Kami</h2>
            <p class="text-gray-700 mb-4 leading-relaxed">
              Untuk informasi lebih lanjut mengenai paroki kami atau jika Anda ingin bergabung
              dalam paroki, silakan hubungi sekretariat paroki melalui halaman kontak
              atau datang langsung ke gereja pada jam pelayanan.
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
  title: 'Tentang Kami - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Tentang Paroki St. Paulus Juanda - sejarah, visi misi, dan pelayanan kami' }
  ]
})
</script>
