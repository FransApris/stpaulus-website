<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Pengaturan Footer</h1>
          <p class="mt-2 text-sm text-gray-600">
            Kelola konten footer website termasuk tautan, media sosial, dan teks hak cipta
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
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
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Tambah Tautan
                </button>
              </div>

              <div class="space-y-4">
                <div v-for="(link, index) in formData.social_links" :key="index" class="flex items-center space-x-4 p-4 border border-gray-200 rounded-md">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label :for="`platform_name_${index}`" class="block text-sm font-medium text-gray-700">
                        Nama Platform
                      </label>
                      <input
                        type="text"
                        :id="`platform_name_${index}`"
                        v-model="link.platform_name"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Instagram"
                      />
                    </div>
                    <div>
                      <label :for="`platform_icon_${index}`" class="block text-sm font-medium text-gray-700">
                        Ikon Kelas
                      </label>
                      <input
                        type="text"
                        :id="`platform_icon_${index}`"
                        v-model="link.platform_icon"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="fab fa-instagram"
                      />
                    </div>
                    <div>
                      <label :for="`url_${index}`" class="block text-sm font-medium text-gray-700">
                        URL
                      </label>
                      <input
                        type="url"
                        :id="`url_${index}`"
                        v-model="link.url"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>
                  <div class="flex items-center">
                    <button
                      @click="removeSocialLink(index)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Links -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Tautan Footer</h3>
                <button
                  @click="addFooterLink"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Tambah Tautan
                </button>
              </div>

              <div class="space-y-4">
                <div v-for="(link, index) in formData.footer_links" :key="index" class="p-4 border border-gray-200 rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label :for="`title_${index}`" class="block text-sm font-medium text-gray-700">
                        Judul
                      </label>
                      <input
                        type="text"
                        :id="`title_${index}`"
                        v-model="link.title"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Kebijakan Privasi"
                      />
                    </div>
                    <div>
                      <label :for="`url_${index}`" class="block text-sm font-medium text-gray-700">
                        URL
                      </label>
                      <input
                        type="text"
                        :id="`url_${index}`"
                        v-model="link.url"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="/privacy-policy"
                      />
                    </div>
                    <div>
                      <label :for="`column_type_${index}`" class="block text-sm font-medium text-gray-700">
                        Kolom
                      </label>
                      <select
                        :id="`column_type_${index}`"
                        v-model="link.column_type"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="legal">Legal</option>
                        <option value="support">Dukungan</option>
                        <option value="content">Konten</option>
                      </select>
                    </div>
                    <div class="flex items-end space-x-2">
                      <button
                        @click="removeFooterLink(index)"
                        class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Hapus
                      </button>
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
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'
import AdminLayout from '~/layouts/admin.vue'

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
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
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

// Save settings
const saveSettings = async () => {
  try {
    saving.value = true
    error.value = ''

    await $fetch('/api/admin/footer-settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
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
