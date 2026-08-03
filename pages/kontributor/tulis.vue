<template>
  <div class="max-w-4xl mx-auto pb-12">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Tulis Berita Kegiatan</h2>
        <p class="text-sm text-gray-500 mt-1">Bagikan cerita kegiatan dari lingkungan/wilayah Anda. Tulisan akan ditinjau sebelum dipublikasikan.</p>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <form @submit.prevent="submitNews" class="space-y-6">
        
        <!-- Judul -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Judul Berita <span class="text-red-500">*</span></label>
          <input type="text" id="title" v-model="form.title" required maxlength="500"
            class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm px-4 py-2 border"
            placeholder="Contoh: Kegiatan Kerja Bakti Lingkungan Petrus 3" />
          <p class="text-xs text-gray-400 mt-1 text-right">{{ form.title.length }}/500</p>
        </div>

        <!-- Detail Kegiatan (Waktu & Tempat) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Kegiatan</label>
            <input type="date" v-model="form.when_date" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm px-4 py-2 border" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Kegiatan</label>
            <input type="text" v-model="form.where_location" placeholder="Contoh: Balai RW 05" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm px-4 py-2 border" />
          </div>
        </div>

        <!-- Isi Berita -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Isi Berita / Cerita Kegiatan <span class="text-red-500">*</span></label>
          <p class="text-xs text-gray-500 mb-3">Ceritakan apa saja yang terjadi, siapa yang terlibat, dan kesan dari acara tersebut.</p>
          <div class="border border-gray-300 rounded-lg overflow-hidden min-h-[300px]">
            <ClientOnly fallback-tag="div" fallback="Memuat editor teks...">
              <EditorCKEditorWrapper v-model="form.content" />
            </ClientOnly>
          </div>
        </div>

        <!-- Gambar Utama -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Utama (Pilih File atau Masukkan URL)</label>
          <p class="text-xs text-gray-500 mb-2">Opsional. Maksimal ukuran file 5MB. Gunakan gambar berformat JPG, PNG, atau WEBP.</p>
          
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden" />
              <button type="button" @click="$refs.fileInput.click()" :disabled="uploadingImage"
                class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:ring-offset-2 flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed">
                <span v-if="uploadingImage" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Mengunggah...
                </span>
                <span v-else class="flex items-center">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  Pilih File Foto
                </span>
              </button>
              
              <div class="flex-1 w-full">
                <input type="url" v-model="form.image"
                  class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm px-4 py-2 border"
                  placeholder="Atau tempel URL gambar di sini (https://...)" :disabled="uploadingImage" />
              </div>
            </div>
            
            <!-- Image Preview -->
            <div v-if="form.image" class="mt-3">
              <p class="text-xs text-gray-500 mb-1">Pratinjau:</p>
              <img :src="form.image" alt="Pratinjau Gambar" class="h-40 w-auto object-contain rounded-lg border border-gray-200 bg-gray-50" />
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="pt-4 border-t border-gray-200 flex justify-end gap-3">
          <NuxtLink to="/kontributor"
            class="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d]">
            Batal
          </NuxtLink>
          <button type="submit" :disabled="submitting"
            class="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#882f1d] hover:bg-[#702517] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] disabled:opacity-70 disabled:cursor-not-allowed">
            <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Mengirim...' : 'Kirim Berita (Draft)' }}
          </button>
        </div>
        
        <div v-if="errorMsg" class="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ successMsg }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'kontributor',
  middleware: 'kontributor-auth' // Bug Fix #5: Use dedicated middleware
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || ''

// Bug Fix #4: Read token directly from sessionStorage, not from non-existent auth.accessToken
const getToken = () => {
  if (process.client) {
    return sessionStorage.getItem('admin_access_token') || ''
  }
  return ''
}

const form = ref({
  title: '',
  content: '',
  image: '',
  when_date: '',
  where_location: ''
})

const submitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const uploadingImage = ref(false)

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (file.size > 5 * 1024 * 1024) {
    errorMsg.value = 'Gagal: Ukuran gambar tidak boleh lebih dari 5MB.'
    target.value = ''
    return
  }

  uploadingImage.value = true
  errorMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await $fetch<any>(`${apiBase}/api/admin/uploads/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    })

    if (response && response.url) {
      form.value.image = response.url
      successMsg.value = 'Gambar berhasil diunggah.'
      setTimeout(() => { successMsg.value = '' }, 3000) // Clear success message after 3s
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'Gagal mengunggah gambar.'
  } finally {
    uploadingImage.value = false
    target.value = ''
  }
}

const submitNews = async () => {
  if (!form.value.title || !form.value.content) {
    errorMsg.value = 'Judul dan Isi Berita wajib diisi.'
    return
  }

  submitting.value = true
  errorMsg.value = ''

  try {
    await $fetch(`${apiBase}/api/kontributor/news`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: { ...form.value }
    })

    successMsg.value = 'Berita berhasil dikirim! Menunggu tinjauan Admin Komsos.'
    form.value = { title: '', content: '', image: '', when_date: '', where_location: '' }
    setTimeout(() => navigateTo('/kontributor'), 2000)
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'Gagal mengirim berita.'
  } finally {
    submitting.value = false
  }
}
</script>
