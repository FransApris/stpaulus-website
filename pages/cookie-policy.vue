<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Kebijakan Cookie" />

        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Kebijakan Cookie</h1>
          <p class="text-xl text-gray-600">Informasi tentang penggunaan cookie di situs web kami</p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Apa itu Cookie?</h2>
            <p class="text-gray-700 mb-6">
              Cookie adalah file teks kecil yang disimpan di perangkat Anda saat Anda mengunjungi situs web.
              Cookie membantu situs web mengingat preferensi Anda dan meningkatkan pengalaman browsing.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Jenis Cookie yang Kami Gunakan</h2>

            <h3 class="text-xl font-semibold text-gray-800 mb-4">Cookie Wajib</h3>
            <p class="text-gray-700 mb-4">
              Cookie ini diperlukan untuk fungsi dasar situs web, seperti navigasi dan keamanan.
              Tanpa cookie ini, situs web tidak akan berfungsi dengan baik.
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mb-4">Cookie Analitik</h3>
            <p class="text-gray-700 mb-4">
              Kami menggunakan cookie untuk memahami bagaimana pengunjung menggunakan situs web kami,
              sehingga kami dapat meningkatkan pengalaman pengguna.
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mb-4">Cookie Fungsional</h3>
            <p class="text-gray-700 mb-4">
              Cookie ini mengingat preferensi Anda, seperti bahasa dan pengaturan tampilan,
              untuk memberikan pengalaman yang lebih personal.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Pengelolaan Cookie</h2>
            <p class="text-gray-700 mb-6">
              Anda dapat mengontrol dan menghapus cookie melalui pengaturan browser Anda.
              Namun, menghapus cookie tertentu mungkin memengaruhi fungsi situs web.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Cookie Pihak Ketiga</h2>
            <p class="text-gray-700 mb-6">
              Beberapa cookie mungkin disediakan oleh layanan pihak ketiga yang terintegrasi
              dengan situs web kami, seperti layanan analitik atau media sosial.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Persetujuan</h2>
            <p class="text-gray-700 mb-6">
              Dengan menggunakan situs web kami, Anda menyetujui penggunaan cookie sesuai
              dengan kebijakan ini. Anda dapat menarik persetujuan kapan saja dengan
              mengubah pengaturan cookie di browser Anda.
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
  title: 'Kebijakan Cookie - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Kebijakan cookie Paroki St. Paulus Juanda - informasi tentang penggunaan cookie di situs web' }
  ]
})
</script>
