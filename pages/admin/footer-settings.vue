<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Pengaturan Footer</h1>
      <p class="text-sm sm:text-base text-gray-600">
        Kelola konten footer website termasuk tautan, media sosial, dan teks hak cipta
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-6 rounded-lg shadow flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Footer Settings -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Pengaturan Footer</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="copyright_entity" class="block text-sm font-medium text-gray-700">
                Nama Entitas Hak Cipta
              </label>
              <input
                type="text"
                id="copyright_entity"
                v-model="formData.copyright_entity"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="KOMSOS Paroki St. Paulus - Juanda"
              />
              <p class="mt-2 text-sm text-gray-500">
                Teks yang akan ditampilkan setelah simbol © dan tahun. Contoh: © 2023 - {{ new Date().getFullYear() }} [Nama Entitas]
              </p>
            </div>
            <div>
              <label for="footer_description" class="block text-sm font-medium text-gray-700">
                Deskripsi Footer
              </label>
              <textarea
                id="footer_description"
                v-model="formData.footer_description"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Deskripsi singkat tentang paroki atau informasi penting lainnya..."
                maxlength="1000"
              ></textarea>
              <p class="mt-2 text-sm text-gray-500">
                Deskripsi yang akan ditampilkan di bagian atas footer. Maksimal 1000 karakter.
              </p>
            </div>
            <div>
              <label for="physical_address" class="block text-sm font-medium text-gray-700">
                Alamat Fisik
              </label>
              <textarea
                id="physical_address"
                v-model="formData.physical_address"
                rows="2"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Jl. Contoh No. 123, Kota, Provinsi, Kode Pos"
                maxlength="500"
              ></textarea>
              <p class="mt-2 text-sm text-gray-500">
                Alamat lengkap gereja yang akan ditampilkan di footer. Maksimal 500 karakter.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media Links -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Tautan Media Sosial</h3>
            <button
              @click="addSocialLink"
              title="Tambah Tautan Media Sosial"
              aria-label="Tambah Tautan Media Sosial"
              class="inline-flex items-center justify-center w-10 h-10 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div v-if="formData.social_links.length === 0" class="text-sm text-gray-500 italic">
            Belum ada tautan media sosial. Klik tombol + untuk menambahkan.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(link, index) in formData.social_links"
              :key="index"
              class="flex items-center space-x-2 p-3 bg-gray-50 rounded-md"
            >
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-grow">
                <div class="sm:col-span-4">
                  <label :for="`platform_${index}`" class="sr-only">Platform</label>
                  <select
                    :id="`platform_${index}`"
                    v-model="link.platform"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Pilih Platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                    <option value="tiktok">TikTok</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                    <option value="spotify">Spotify</option>
                  </select>
                </div>
                <div class="sm:col-span-8">
                  <label :for="`url_${index}`" class="sr-only">URL</label>
                  <input
                    :id="`url_${index}`"
                    type="url"
                    v-model="link.url"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <button
                @click="removeSocialLink(index)"
                title="Hapus Tautan Media Sosial"
                aria-label="Hapus Tautan Media Sosial"
                class="text-red-600 hover:text-red-800 p-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Links (grouped by column) -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Tautan Footer (Menu Tambahan)</h3>
            <button
              @click="addFooterLink"
              title="Tambah Tautan Footer"
              aria-label="Tambah Tautan Footer"
              class="inline-flex items-center justify-center w-10 h-10 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div v-if="formData.footer_links.length === 0" class="text-sm text-gray-500 italic">
            Belum ada tautan footer. Klik tombol + untuk menambahkan.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(link, index) in formData.footer_links"
              :key="index"
              class="p-4 bg-gray-50 rounded-md border border-gray-200"
            >
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div class="sm:col-span-4">
                  <label :for="`title_${index}`" class="block text-xs font-medium text-gray-700 mb-1">Judul Tautan</label>
                  <input
                    :id="`title_${index}`"
                    type="text"
                    v-model="link.title"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Contoh: Kebijakan Privasi"
                  />
                </div>
                <div class="sm:col-span-5">
                  <label :for="`link_url_${index}`" class="block text-xs font-medium text-gray-700 mb-1">URL / Path</label>
                  <input
                    :id="`link_url_${index}`"
                    type="text"
                    v-model="link.url"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="/kebijakan-privasi atau https://..."
                  />
                </div>
                <div class="sm:col-span-3 flex items-end justify-between">
                  <div class="flex items-center">
                    <input
                      :id="`target_${index}`"
                      type="checkbox"
                      v-model="link.is_external"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label :for="`target_${index}`" class="ml-2 block text-xs text-gray-700">Tab Baru</label>
                  </div>
                  <div class="flex space-x-1">
                    <button
                      @click="removeFooterLink(index)"
                      title="Hapus Tautan Footer"
                      aria-label="Hapus Tautan Footer"
                      class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button
          @click="saveSettings"
          :disabled="saving"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="saving" class="-ml-1 mr-3 h-4 w-4 animate-spin" fill="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Reactive data
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const formData = ref({
  copyright_entity: '',
  footer_description: '',
  physical_address: '',
  social_links: [] as any[],
  footer_links: [] as any[]
})

// Fetch footer settings
const fetchSettings = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await $fetch('/api/admin/footer-settings', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    }) as {
      settings: any;
      socialLinks: any[];
      links: { legal: any[]; support: any[]; content: any[]; };
    }

    if (response.settings) {
      formData.value.copyright_entity = response.settings.copyright_entity || ''
      formData.value.footer_description = response.settings.footer_description || ''
      formData.value.physical_address = response.settings.physical_address || ''
    }

    formData.value.social_links = response.socialLinks || []
    formData.value.footer_links = [
      ...response.links.legal.map((link: any) => ({ ...link, column_type: 'legal' })),
      ...response.links.support.map((link: any) => ({ ...link, column_type: 'support' })),
      ...response.links.content.map((link: any) => ({ ...link, column_type: 'content' }))
    ]
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch footer settings'
    console.error('Error fetching footer settings:', err)
  } finally {
    loading.value = false
  }
}

// Add social link
const addSocialLink = () => {
  formData.value.social_links.push({
    platform_name: '',
    platform_icon: '',
    url: '',
    display_order: formData.value.social_links.length + 1
  })
}

// Remove social link
const removeSocialLink = (index: number) => {
  formData.value.social_links.splice(index, 1)
  // Update display orders
  formData.value.social_links.forEach((link, i) => {
    link.display_order = i + 1
  })
}

// Edit social link (focus first field)
const editSocialLink = (index: number) => {
  if (!process.client) return
  const input = document.getElementById(`platform_name_${index}`) as HTMLInputElement | null
  if (input) {
    input.focus()
    input.select()
  }
}

// Add footer link
const addFooterLink = () => {
  formData.value.footer_links.push({
    title: '',
    url: '',
    column_type: 'legal',
    display_order: formData.value.footer_links.length + 1
  })
}

// Remove footer link
const removeFooterLink = (index: number) => {
  formData.value.footer_links.splice(index, 1)
  // Update display orders
  formData.value.footer_links.forEach((link, i) => {
    link.display_order = i + 1
  })
}

// Edit footer link (focus first field)
const editFooterLink = (index: number) => {
  if (!process.client) return
  const input = document.getElementById(`title_${index}`) as HTMLInputElement | null
  if (input) {
    input.focus()
    input.select()
  }
}

// Save settings
const saveSettings = async () => {
  try {
    saving.value = true
    error.value = ''

    await $fetch('/api/admin/footer-settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: {
        copyright_entity: formData.value.copyright_entity,
        footer_description: formData.value.footer_description,
        physical_address: formData.value.physical_address,
        social_links: formData.value.social_links,
        footer_links: formData.value.footer_links
      }
    })

    // Show success message
    alert('Pengaturan footer berhasil disimpan!')

    // Refresh data
    await fetchSettings()
  } catch (err: any) {
    error.value = err.message || 'Failed to save footer settings'
    console.error('Error saving footer settings:', err)
  } finally {
    saving.value = false
  }
}

// Initialize
onMounted(() => {
  fetchSettings()
})
</script>
