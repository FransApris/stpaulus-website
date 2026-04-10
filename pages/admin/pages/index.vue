<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Kelola Halaman Statis</h1>
          <p class="text-gray-600 mt-1">Mengelola halaman-halaman statis website paroki</p>
        </div>
        <div class="flex space-x-3">
          <NuxtLink
            to="/admin/pages/new"
            class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Tambah Halaman Baru
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Pages List -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Daftar Halaman</h3>
          <div class="text-sm text-gray-500">
            {{ pages.length }} halaman ditemukan
          </div>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Memuat halaman...</p>
        </div>

        <div v-else-if="pages.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada halaman</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat halaman pertama Anda.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="page in pages"
            :key="page.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900">{{ page.title }}</h4>
                <p class="text-sm text-gray-500 mt-1">Slug: {{ page.slug }}</p>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Dibuat: {{ formatDate(page.created_at) }}</span>
                  <span
                    :class="page.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ page.is_published ? 'Published' : 'Draft' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-2">
                  URL: <code class="bg-gray-100 px-1 py-0.5 rounded">/pages/{{ page.slug }}</code>
                </p>
              </div>
              <div class="flex space-x-2 ml-4">
                <NuxtLink
                  :to="`/admin/pages/${page.slug}`"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </NuxtLink>
                <button
                  @click="togglePublish(page)"
                  :class="page.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'"
                  class="text-white px-3 py-1 rounded text-sm"
                >
                  {{ page.is_published ? 'Unpublish' : 'Publish' }}
                </button>
                <button
                  @click="deletePage(page)"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const pages = ref([])
const loading = ref(false)

// Fetch pages
const fetchPages = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/pages', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    pages.value = response
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    alert('Gagal memuat daftar halaman')
  } finally {
    loading.value = false
  }
}

// Toggle publish status
const togglePublish = async (page) => {
  try {
    const newStatus = page.is_published ? 0 : 1
    await $fetch(`/api/admin/pages/${page.slug}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: { ...page, is_published: newStatus }
    })

    await fetchPages()
    alert(`Halaman ${newStatus ? 'dipublikasikan' : 'disimpan sebagai draft'}`)
  } catch (error) {
    console.error('Failed to toggle publish status:', error)
    alert('Gagal mengubah status halaman')
  }
}

// Delete page
const deletePage = async (page) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus halaman "${page.title}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/pages/${page.slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    await fetchPages()
    alert('Halaman berhasil dihapus')
  } catch (error) {
    console.error('Failed to delete page:', error)
    alert('Gagal menghapus halaman')
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = sessionStorage.getItem('admin_access_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await fetchPages()
})
</script>
