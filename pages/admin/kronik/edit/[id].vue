<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Edit Kronik</h1>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>

    <form v-else-if="entry" @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
      <!-- Notice: Kategori Locked -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-blue-900">Kategori Terlindungi</p>
            <p class="text-sm text-blue-700 mt-1">Kategori ini dipilih otomatis berdasarkan profil pembuat dan
              <strong>tidak dapat diubah</strong> untuk menjaga integritas data.</p>
          </div>
        </div>
      </div>

      <!-- Kategori (Disabled) -->
      <div>
        <label class="block text-sm font-medium mb-2">Kategori * <span class="text-xs text-gray-500">(Tidak dapat
            diubah)</span></label>
        <select v-model="form.category_id" required disabled
          class="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed">
          <option value="">Pilih Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <p class="text-xs text-gray-600 mt-1">📌 Kategori asli: <strong>{{ entry.category_name }}</strong></p>
      </div>

      <!-- Bagian/Section -->
      <div v-if="sections.length || isSectionRequired">
        <label class="block text-sm font-medium mb-2">
          Bagian
          <span v-if="isSectionRequired" class="text-red-500">*</span>
          <span v-else class="text-gray-400 text-xs">(Opsional)</span>
        </label>
        <div v-if="isSectionRequired && !sections.length"
          class="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-yellow-800 text-sm mb-2">
          ⚠️ Belum ada bagian untuk kategori ini. Tambahkan dulu di
          <NuxtLink to="/admin/kronik/sections" class="underline font-semibold">halaman Sections</NuxtLink>.
        </div>
        <select v-model="form.section_id" :required="isSectionRequired" class="w-full border rounded-lg px-4 py-2">
          <option value="">{{ isSectionRequired ? '-- Pilih Wilayah / Lingkungan --' : 'Pilih Bagian (Opsional)' }}</option>
          <option v-for="sec in sections" :key="sec.id" :value="sec.id">
            {{ sec.name }}
          </option>
        </select>
      </div>

      <!-- WHAT: Judul -->
      <div>
        <label class="block text-sm font-medium mb-2">Judul / Apa yang Terjadi? *</label>
        <input v-model="form.what_title" type="text" required
          placeholder="Contoh: Perayaan Ekaristi Pemberkatan Keluarga" class="w-full border rounded-lg px-4 py-2" />
      </div>

      <!-- WHAT: Deskripsi -->
      <div>
        <label class="block text-sm font-medium mb-2">Deskripsi Lengkap *</label>
        <textarea v-model="form.what_description" required rows="5"
          placeholder="Jelaskan detail kegiatan yang terjadi..." class="w-full border rounded-lg px-4 py-2"></textarea>
      </div>

      <!-- WHO: Siapa yang Terlibat -->
      <div>
        <label class="block text-sm font-medium mb-2">Siapa yang Terlibat?</label>
        <textarea v-model="form.who_involved" rows="3"
          placeholder="Tuliskan siapa saja yang terlibat dalam kegiatan ini..."
          class="w-full border rounded-lg px-4 py-2"></textarea>
      </div>

      <!-- WHEN: Tanggal & Durasi -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Tanggal & Waktu *</label>
          <input v-model="form.when_date" type="datetime-local" required class="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Durasi</label>
          <input v-model="form.when_duration" type="text" placeholder="Contoh: 2 jam"
            class="w-full border rounded-lg px-4 py-2" />
        </div>
      </div>

      <!-- WHERE: Lokasi -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Lokasi</label>
          <input v-model="form.where_location" type="text" placeholder="Contoh: Gereja St. Paulus"
            class="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Alamat Lengkap</label>
          <input v-model="form.where_address" type="text" placeholder="Alamat detail lokasi"
            class="w-full border rounded-lg px-4 py-2" />
        </div>
      </div>

      <!-- WHY: Tujuan -->
      <div>
        <label class="block text-sm font-medium mb-2">Mengapa / Tujuan?</label>
        <textarea v-model="form.why_purpose" rows="3"
          placeholder="Jelaskan tujuan atau alasan dilaksanakannya kegiatan ini..."
          class="w-full border rounded-lg px-4 py-2"></textarea>
      </div>

      <!-- HOW: Proses -->
      <div>
        <label class="block text-sm font-medium mb-2">Bagaimana Prosesnya?</label>
        <textarea v-model="form.how_process" rows="3" placeholder="Jelaskan bagaimana kegiatan ini berlangsung..."
          class="w-full border rounded-lg px-4 py-2"></textarea>
      </div>

      <!-- Featured Image -->
      <div>
        <label class="block text-sm font-medium mb-2">Foto Utama</label>
        <input type="file" accept="image/*" @change="handleFeaturedImageUpload" :disabled="uploadingFeatured"
          class="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c58229] file:text-white hover:file:bg-[#882f1d] disabled:opacity-50" />
        <p class="text-xs text-gray-500 mt-1">
          {{ uploadingFeatured ? 'Mengunggah...' : 'Upload 1 foto utama untuk thumbnail' }}
        </p>
        <!-- Preview -->
        <div v-if="form.featured_image" class="mt-2 relative inline-block">
          <img :src="resolveKronikImagePath(form.featured_image)" alt="Preview"
            class="h-32 w-auto rounded-lg border border-gray-200" />
          <button type="button" @click="removeFeaturedImage"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
            ×
          </button>
        </div>
      </div>

      <!-- Gallery -->
      <div>
        <label class="block text-sm font-medium mb-2">Galeri Foto (Maks. 5)</label>
        <input type="file" accept="image/*" multiple @change="handleGalleryUpload"
          :disabled="uploadingGallery || (form.gallery && form.gallery.length >= 5)"
          class="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50" />
        <p class="text-xs text-gray-500 mt-1">
          {{ uploadingGallery ? 'Mengunggah...' :
            form.gallery && form.gallery.length >= 5 ? 'Maksimal 5 foto' :
              `Upload beberapa foto (${form.gallery?.length || 0}/5)` }}
        </p>
        <!-- Preview Gallery -->
        <div v-if="form.gallery && form.gallery.length > 0" class="mt-2 flex flex-wrap gap-2">
          <div v-for="(img, idx) in form.gallery" :key="idx" class="relative inline-block">
            <img :src="resolveKronikImagePath(img)" alt="Gallery"
              class="h-20 w-20 object-cover rounded-lg border border-gray-200" />
            <button type="button" @click="removeGalleryImage(idx)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium mb-2">Status *</label>
        <select v-model="form.status" required class="w-full border rounded-lg px-4 py-2">
          <option value="draft">Draft</option>
          <option value="pending">Pending Review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <!-- Metadata -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <p class="text-sm text-gray-600">
          <strong>Penulis:</strong> {{ entry.author_name || entry.author_username || '-' }}<br />
          <strong>Kategori Asli:</strong> {{ entry.category_name }}<br />
          <strong>Bagian:</strong> {{ entry.section_name || '-' }}<br />
          <strong>Dibuat:</strong> {{ formatDate(entry.created_at) }}<br />
          <strong>Diupdate:</strong> {{ formatDate(entry.updated_at) }}<br />
          <strong v-if="entry.published_at">Published:</strong> {{ formatDate(entry.published_at) }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 pt-4">
        <button type="submit" :disabled="saving"
          class="bg-[#c58229] text-white px-6 py-3 rounded-lg hover:bg-[#882f1d] transition-colors disabled:opacity-50">
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>

        <NuxtLink to="/admin/kronik"
          class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
          Batal
        </NuxtLink>
      </div>
    </form>

    <div v-else class="text-center py-12">
      <p class="text-red-600">Kronik tidak ditemukan</p>
      <NuxtLink to="/admin/kronik" class="text-[#c58229] hover:underline mt-4 inline-block">
        Kembali ke Daftar Kronik
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const entryId = route.params.id

const loading = ref(true)
const saving = ref(false)
const uploadingFeatured = ref(false)
const uploadingGallery = ref(false)
const entry = ref(null)

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_access_token') || localStorage.getItem('auth_token')
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
  status: 'pending'
})

const resolveKronikImagePath = (value) => {
  const text = String(value || '').trim()
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.startsWith('/api/kronik/media/')) return text
  if (text.startsWith('/uploads/kronik/')) {
    const filename = text.split('/').pop()
    return filename ? `/api/kronik/media/${encodeURIComponent(filename)}` : ''
  }
  if (text.startsWith('/')) return text
  return `/api/kronik/media/${encodeURIComponent(text)}`
}

const normalizeGalleryValue = (value) => {
  if (!value) return []
  if (!Array.isArray(value)) return []
  return value.map((item) => resolveKronikImagePath(item)).filter(Boolean)
}

// Fetch categories
const { data: categoriesData } = await useFetch('/api/admin/kronik/categories')
const categories = computed(() => categoriesData.value?.data || [])

// Fetch sections based on category
const { data: sectionsData } = await useFetch('/api/admin/kronik/sections', {
  query: computed(() => ({ category_id: form.category_id }))
})
const sections = computed(() => sectionsData.value?.data || [])

// Wilayah & Lingkungan wajib memilih bagian spesifik
const isSectionRequired = computed(() => {
  const selected = categories.value.find(c => c.id == form.category_id)
  return selected?.slug === 'wilayah' || selected?.slug === 'lingkungan'
})

// Fetch entry data
const fetchEntry = async () => {
  loading.value = true
  try {
    const response = await $fetch(`/api/admin/kronik/entries/${entryId}`)

    if (response.success && response.data) {
      entry.value = response.data

      // Populate form
      form.category_id = response.data.category_id || ''
      form.section_id = response.data.section_id || ''
      form.what_title = response.data.what_title || ''
      form.what_description = response.data.what_description || ''
      form.who_involved = response.data.who_involved || ''
      form.when_date = response.data.when_date ? formatDateTimeLocal(response.data.when_date) : ''
      form.when_duration = response.data.when_duration || ''
      form.where_location = response.data.where_location || ''
      form.where_address = response.data.where_address || ''
      form.why_purpose = response.data.why_purpose || ''
      form.how_process = response.data.how_process || ''
      form.featured_image = resolveKronikImagePath(response.data.featured_image) || ''
      form.gallery = normalizeGalleryValue(response.data.gallery)
      form.status = response.data.status || 'pending'
    }
  } catch (error) {
    console.error('Error fetching entry:', error)
    alert('Gagal memuat data kronik')
  } finally {
    loading.value = false
  }
}

// Format date for datetime-local input
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  // Format: YYYY-MM-DDTHH:mm
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

// Handle form submission
const handleSubmit = async () => {
  saving.value = true

  try {
    const response = await $fetch(`/api/admin/kronik/entries/${entryId}`, {
      method: 'PUT',
      body: {
        ...form,
        gallery: form.gallery.length > 0 ? form.gallery : null
      }
    })

    if (response.success) {
      alert('Kronik berhasil diupdate!')
      navigateTo('/admin/kronik')
    }
  } catch (error) {
    console.error('Error updating entry:', error)
    alert('Gagal mengupdate kronik. Silakan coba lagi.')
  } finally {
    saving.value = false
  }
}

// Load entry on mount
onMounted(() => {
  fetchEntry()
})

useHead({
  title: 'Edit Kronik - Admin Panel'
})
</script>
