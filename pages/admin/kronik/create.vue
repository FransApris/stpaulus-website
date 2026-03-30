<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Tambah Kronik Baru</h1>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
      <!-- Kategori -->
      <div>
        <label class="block text-sm font-medium mb-2">Kategori *</label>
        <select v-model="form.category_id" required class="w-full border rounded-lg px-4 py-2">
          <option value="">Pilih Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Bagian/Section -->
      <div v-if="sections.length">
        <label class="block text-sm font-medium mb-2">Bagian</label>
        <select v-model="form.section_id" class="w-full border rounded-lg px-4 py-2">
          <option value="">Pilih Bagian (Opsional)</option>
          <option v-for="sec in sections" :key="sec.id" :value="sec.id">
            {{ sec.name }}
          </option>
        </select>
      </div>

      <!-- WHAT: Judul -->
      <div>
        <label class="block text-sm font-medium mb-2">Judul / Apa yang Terjadi? *</label>
        <input
          v-model="form.what_title"
          type="text"
          required
          placeholder="Contoh: Perayaan Ekaristi Pemberkatan Keluarga"
          class="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <!-- WHAT: Deskripsi -->
      <div>
        <label class="block text-sm font-medium mb-2">Deskripsi Lengkap *</label>
        <textarea
          v-model="form.what_description"
          required
          rows="5"
          placeholder="Jelaskan detail kegiatan yang terjadi..."
          class="w-full border rounded-lg px-4 py-2"
        ></textarea>
      </div>

      <!-- WHO: Siapa yang Terlibat -->
      <div>
        <label class="block text-sm font-medium mb-2">Siapa yang Terlibat?</label>
        <textarea
          v-model="form.who_involved"
          rows="3"
          placeholder="Tuliskan siapa saja yang terlibat dalam kegiatan ini..."
          class="w-full border rounded-lg px-4 py-2"
        ></textarea>
      </div>

      <!-- WHEN: Tanggal & Durasi -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Tanggal & Waktu *</label>
          <input
            v-model="form.when_date"
            type="datetime-local"
            required
            class="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Durasi</label>
          <input
            v-model="form.when_duration"
            type="text"
            placeholder="Contoh: 2 jam"
            class="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <!-- WHERE: Lokasi -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Lokasi</label>
          <input
            v-model="form.where_location"
            type="text"
            placeholder="Contoh: Gereja St. Paulus"
            class="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Alamat Lengkap</label>
          <input
            v-model="form.where_address"
            type="text"
            placeholder="Alamat detail lokasi"
            class="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <!-- WHY: Tujuan -->
      <div>
        <label class="block text-sm font-medium mb-2">Mengapa / Tujuan?</label>
        <textarea
          v-model="form.why_purpose"
          rows="3"
          placeholder="Jelaskan tujuan atau alasan dilaksanakannya kegiatan ini..."
          class="w-full border rounded-lg px-4 py-2"
        ></textarea>
      </div>

      <!-- HOW: Proses -->
      <div>
        <label class="block text-sm font-medium mb-2">Bagaimana Prosesnya?</label>
        <textarea
          v-model="form.how_process"
          rows="3"
          placeholder="Jelaskan bagaimana kegiatan ini berlangsung..."
          class="w-full border rounded-lg px-4 py-2"
        ></textarea>
      </div>

      <!-- Featured Image -->
      <div>
        <label class="block text-sm font-medium mb-2">Foto Utama</label>
        <input
          type="file"
          accept="image/*"
          @change="handleFeaturedImageUpload"
          :disabled="uploadingFeatured"
          class="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c58229] file:text-white hover:file:bg-[#882f1d] disabled:opacity-50"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ uploadingFeatured ? 'Mengunggah...' : 'Upload 1 foto utama untuk thumbnail' }}
        </p>
        <!-- Preview -->
        <div v-if="form.featured_image" class="mt-2 relative inline-block">
          <img :src="resolveKronikImagePath(form.featured_image)" alt="Preview" class="h-32 w-auto rounded-lg border border-gray-200" />
          <button
            type="button"
            @click="removeFeaturedImage"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Gallery -->
      <div>
        <label class="block text-sm font-medium mb-2">Galeri Foto (Maks. 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          @change="handleGalleryUpload"
          :disabled="uploadingGallery || (form.gallery && form.gallery.length >= 5)"
          class="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ uploadingGallery ? 'Mengunggah...' :
             form.gallery && form.gallery.length >= 5 ? 'Maksimal 5 foto' :
             `Upload beberapa foto (${form.gallery?.length || 0}/5)` }}
        </p>
        <!-- Preview Gallery -->
        <div v-if="form.gallery && form.gallery.length > 0" class="mt-2 flex flex-wrap gap-2">
          <div v-for="(img, idx) in form.gallery" :key="idx" class="relative inline-block">
            <img :src="resolveKronikImagePath(img)" alt="Gallery" class="h-20 w-20 object-cover rounded-lg border border-gray-200" />
            <button
              type="button"
              @click="removeGalleryImage(idx)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          @click="submitAction = 'draft'"
          class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Simpan sebagai Draft
        </button>

        <button
          type="submit"
          @click="submitAction = 'pending'"
          class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Kirim untuk Approval
        </button>

        <button
          type="submit"
          @click="submitAction = 'published'"
          class="bg-[#c58229] text-white px-6 py-3 rounded-lg hover:bg-[#882f1d] transition-colors"
        >
          Publish Langsung
        </button>

        <NuxtLink
          to="/admin/kronik"
          class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Batal
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const submitAction = ref('draft')
const uploadingFeatured = ref(false)
const uploadingGallery = ref(false)

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_access_token') || localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const form = reactive({
  category_id: '',
  section_id: '',
  what_title: '',
  what_description: '',
  who_involved: '',
  when_date: '',
  when_duration: '',
  where_location: '',
  where_address: '',
  why_purpose: '',
  how_process: '',
  featured_image: '',
  gallery: [],
  author_id: 1 // TODO: Get from auth
})

const resolveKronikImagePath = (value) => {
  const text = String(value || '').trim()
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.startsWith('/')) return text
  return `/uploads/kronik/${text}`
}

const { data: categoriesData } = await useFetch('/api/admin/kronik/categories')
const categories = computed(() => categoriesData.value?.data || [])

const { data: sectionsData } = await useFetch('/api/admin/kronik/sections', {
  query: computed(() => ({ category_id: form.category_id }))
})
const sections = computed(() => sectionsData.value?.data || [])

// Handle featured image upload
const handleFeaturedImageUpload = async (event) => {
  const target = event.target
  const file = target.files?.[0]
  if (!file) return

  uploadingFeatured.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch('/api/kronik/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    })

    if (response.success && response.data.files.length > 0) {
      form.featured_image = response.data.files[0]
    } else {
      alert('Gagal mengunggah foto: ' + (response.error || 'Unknown error'))
    }
  } catch (error) {
    console.error('Failed to upload featured image:', error)
    alert('Gagal mengunggah foto. Silakan coba lagi.')
  } finally {
    uploadingFeatured.value = false
    target.value = ''
  }
}

// Handle gallery upload
const handleGalleryUpload = async (event) => {
  const target = event.target
  const files = Array.from(target.files || [])
  if (files.length === 0) return

  const currentCount = form.gallery.length
  const remainingSlots = 5 - currentCount
  if (remainingSlots <= 0) {
    alert('Maksimal 5 foto untuk galeri')
    return
  }

  const filesToUpload = files.slice(0, remainingSlots)
  uploadingGallery.value = true

  try {
    const formData = new FormData()
    filesToUpload.forEach(file => formData.append('file', file))

    const response = await $fetch('/api/kronik/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    })

    if (response.success && response.data.files.length > 0) {
      form.gallery.push(...response.data.files)
    } else {
      alert('Gagal mengunggah foto: ' + (response.error || 'Unknown error'))
    }
  } catch (error) {
    console.error('Failed to upload gallery images:', error)
    alert('Gagal mengunggah foto. Silakan coba lagi.')
  } finally {
    uploadingGallery.value = false
    target.value = ''
  }
}

const removeFeaturedImage = () => {
  form.featured_image = ''
}

const removeGalleryImage = (index) => {
  form.gallery.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const response = await $fetch('/api/admin/kronik/entries', {
      method: 'POST',
      body: {
        ...form,
        status: submitAction.value,
        gallery: form.gallery.length > 0 ? form.gallery : null
      }
    })

    if (response.success) {
      alert('Kronik berhasil dibuat!')
      navigateTo('/admin/kronik')
    }
  } catch (error) {
    console.error('Error creating entry:', error)
    alert('Gagal membuat kronik. Silakan coba lagi.')
  }
}

useHead({
  title: 'Tambah Kronik Baru - Admin Panel'
})
</script>
