<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Breadcrumb -->
        <Breadcrumb title="Syarat dan Ketentuan" />

        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Syarat dan Ketentuan</h1>
          <p class="text-xl text-gray-600">Aturan penggunaan situs web Paroki St. Paulus Juanda</p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Penerimaan Syarat</h2>
            <p class="text-gray-700 mb-6">
              Dengan mengakses dan menggunakan situs web Paroki St. Paulus Juanda, Anda menyetujui
              dan terikat oleh syarat dan ketentuan yang tercantum di halaman ini.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Penggunaan Situs Web</h2>
            <p class="text-gray-700 mb-6">
              Situs web ini disediakan untuk tujuan informasi dan komunikasi paroki. Anda setuju untuk:
            </p>
            <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Menggunakan situs web ini hanya untuk tujuan yang sah</li>
              <li>Tidak mengganggu atau merusak fungsi situs web</li>
              <li>Tidak menyebarkan konten yang tidak pantas atau melanggar hukum</li>
              <li>Menghormati hak cipta dan hak kekayaan intelektual</li>
            </ul>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Konten Pengguna</h2>
            <p class="text-gray-700 mb-6">
              Jika Anda mengirimkan konten melalui formulir kontak atau fitur lainnya,
              Anda bertanggung jawab atas keakuratan dan keabsahan informasi tersebut.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Penolakan Jaminan</h2>
            <p class="text-gray-700 mb-6">
              Informasi di situs web ini disediakan "sebagaimana adanya" tanpa jaminan
              apa pun. Paroki St. Paulus Juanda tidak bertanggung jawab atas kerugian
              yang timbul dari penggunaan situs web ini.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Perubahan Syarat</h2>
            <p class="text-gray-700 mb-6">
              Kami berhak mengubah syarat dan ketentuan ini kapan saja tanpa pemberitahuan sebelumnya.
              Perubahan akan berlaku segera setelah dipublikasikan di situs web ini.
            </p>

            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Hukum yang Berlaku</h2>
            <p class="text-gray-700 mb-6">
              Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.
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
  title: 'Syarat dan Ketentuan - Paroki St. Paulus Juanda',
  meta: [
    { name: 'description', content: 'Syarat dan ketentuan penggunaan situs web Paroki St. Paulus Juanda' }
  ]
})
</script>
