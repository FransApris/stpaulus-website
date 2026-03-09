<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Kebijakan Privasi" />

        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Kebijakan Privasi</h1>
          <p class="text-xl text-gray-600">Informasi tentang bagaimana kami mengelola data pribadi Anda</p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Pengumpulan Data</h2>
            <p class="text-gray-700 mb-4 leading-relaxed">
              Kami mengumpulkan informasi yang Anda berikan secara sukarela saat menggunakan situs web ini,
              termasuk saat mendaftar newsletter, mengirim pesan kontak, atau berpartisipasi dalam kegiatan paroki.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6 mt-6">Penggunaan Data</h2>
            <p class="text-gray-700 mb-3 leading-relaxed">
              Data yang dikumpulkan digunakan untuk:
            </p>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1 leading-relaxed">
              <li>Menyediakan layanan dan informasi paroki</li>
              <li>Mengirim komunikasi penting tentang kegiatan gereja</li>
              <li>Meningkatkan pengalaman pengguna situs web</li>
              <li>Mematuhi persyaratan hukum dan administratif</li>
            </ul>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6 mt-6">Perlindungan Data</h2>
            <p class="text-gray-700 mb-4 leading-relaxed">
              Kami berkomitmen untuk melindungi data pribadi Anda dengan menerapkan langkah-langkah keamanan
              teknis dan organisasi yang sesuai untuk mencegah akses, pengungkapan, perubahan, atau penghancuran
              data yang tidak sah.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6 mt-6">Hak Anda</h2>
            <p class="text-gray-700 mb-3 leading-relaxed">
              Anda memiliki hak untuk:
            </p>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1 leading-relaxed">
              <li>Mengakses data pribadi yang kami simpan tentang Anda</li>
              <li>Memperbaiki data yang tidak akurat atau tidak lengkap</li>
              <li>Meminta penghapusan data pribadi Anda</li>
              <li>Menolak pemrosesan data untuk tujuan tertentu</li>
            </ul>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Kontak</h2>
            <p class="text-gray-700 mb-6">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda
              terkait data pribadi, silakan hubungi kami melalui halaman kontak.
            </p>

            <div class="mt-8 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <strong>Terakhir diperbarui:</strong> {{ new Date().toLocaleDateString('id-ID') }}
              </p>
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
// Page meta
useHead({
  title: 'Kebijakan Privasi - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Kebijakan privasi Paroki St. Paulus Juanda - informasi tentang pengelolaan data pribadi' }
  ]
})
</script>
