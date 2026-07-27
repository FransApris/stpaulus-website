<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Kontak & Sekretariat" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Kontak Kami</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Hubungi paroki untuk informasi lebih lanjut atau pertanyaan rohani
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Kontak Kami" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Info Kontak dengan margin 10% kanan kiri -->
        <div class="grid md:grid-cols-2 gap-8 mx-[10%]">
          <div>
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-4">Alamat & Telepon</h2>
            <p class="mb-2">Jl. Raya Bandara Juanda No.10, Semambung, Kec. Gedangan, Kabupaten Sidoarjo, Jawa Timur 61254</p>
            <p class="mb-1">Tel: 031-8557854</p>
            <p class="mb-1">Email: <a href="mailto:stpaulus.sekretariat@gmail.com" class="text-[#882f1d] hover:underline">stpaulus.sekretariat@gmail.com</a></p>
            <p>Instagram: <a href="https://www.instagram.com/stpaulusjuanda" target="_blank" rel="noopener noreferrer" class="text-[#882f1d] hover:underline">@stpaulusjuanda</a></p>
          </div>
          <div>
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-4">Form Kontak</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
              <input
                v-model="form.name"
                type="text"
                placeholder="Nama"
                class="w-full p-2 border rounded"
                required
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full p-2 border rounded"
                required
              />
              <input
                v-model="form.phone"
                type="tel"
                placeholder="No. HP"
                class="w-full p-2 border rounded"
                required
              />
              <textarea
                v-model="form.message"
                placeholder="Pesan"
                class="w-full p-2 border rounded"
                rows="4"
                required
              ></textarea>
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  :disabled="loading"
                  class="bg-[#882f1d] text-white px-6 py-2 rounded hover:bg-[#6b2416] disabled:opacity-50"
                >
                  {{ loading ? 'Mengirim...' : 'Kirim' }}
                </button>
                <button
                  type="button"
                  @click="openWhatsApp"
                  class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Hubungi via WhatsApp
                </button>
              </div>
            </form>
            <p v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</p>
            <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Tombol Bottom -->
        <BackButton position="bottom" />
      </div>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('kontak')
const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const submitForm = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })

    successMessage.value = response.message
    form.value = { name: '', email: '', phone: '', message: '' }
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || 'Terjadi kesalahan saat mengirim pesan'
  } finally {
    loading.value = false
  }
}

const openWhatsApp = () => {
  const whatsappUrl = 'https://wa.me/6285649779883'
  window.open(whatsappUrl, '_blank')
}

onMounted(() => {
  if (process.client) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
})
</script>
