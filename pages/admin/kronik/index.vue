<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold">Manajemen Kronik</h1>
        <div class="mt-3 flex gap-3">
          <NuxtLink
            to="/admin/kronik"
            class="text-[#c58229] border-b-2 border-[#c58229] pb-1 font-medium"
          >
            Entries
          </NuxtLink>
          <NuxtLink
            to="/admin/kronik/sections"
            class="text-gray-600 hover:text-[#c58229] pb-1 font-medium"
          >
            Sections
          </NuxtLink>
        </div>
      </div>
      <NuxtLink
        to="/admin/kronik/create"
        class="bg-[#c58229] text-white px-6 py-3 rounded-lg hover:bg-[#882f1d] transition-colors font-medium"
      >
        + Tambah Kronik Baru
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select v-model="filters.status" class="border rounded-lg px-4 py-2">
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </select>
        
        <select v-model="filters.category_id" class="border rounded-lg px-4 py-2">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari kronik..."
          class="border rounded-lg px-4 py-2"
        />

        <button
          @click="loadEntries"
          class="bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416]"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bagian</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="entry in paginatedEntries" :key="entry.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 max-w-xs truncate">{{ entry.what_title }}</td>
            <td class="px-6 py-4">{{ entry.category_name }}</td>
            <td class="px-6 py-4">{{ entry.section_name || '-' }}</td>
            <td class="px-6 py-4">{{ formatDate(entry.when_date) }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(entry.status)">
                {{ entry.status }}
              </span>
            </td>
            <td class="px-6 py-4">{{ entry.views_count }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/kronik/${entry.category_slug}/${entry.id}`"
                  target="_blank"
                  class="text-green-600 hover:text-green-800"
                  title="Lihat"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
                <NuxtLink
                  :to="`/admin/kronik/edit/${entry.id}`"
                  class="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>
                <button
                  @click="deleteEntry(entry.id)"
                  class="text-red-600 hover:text-red-800"
                  title="Hapus"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!entries || entries.length === 0" class="text-center py-12">
        <p class="text-gray-500">Belum ada kronik</p>
      </div>

      <div v-if="entries.length > pageLimit" class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p class="text-sm text-gray-600">
          Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-
          {{ Math.min(currentPage * pageLimit, entries.length) }}
          dari {{ entries.length }} kronik
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1.5 rounded-lg border text-sm',
              currentPage === page
                ? 'bg-[#c58229] text-white border-[#c58229]'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const filters = reactive({
  status: '',
  category_id: '',
  search: ''
})

const { data: categoriesData } = await useFetch('/api/admin/kronik/categories')
const categories = computed(() => categoriesData.value?.data || [])

const { data: entriesData, refresh: loadEntries } = await useFetch('/api/admin/kronik/entries', {
  query: filters
})
const entries = computed(() => entriesData.value?.data?.entries || [])
const currentPage = ref(1)
const pageLimit = 10

const totalPages = computed(() => {
  const pages = Math.ceil(entries.value.length / pageLimit)
  return pages > 0 ? pages : 1
})

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return entries.value.slice(start, start + pageLimit)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium',
    draft: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium',
    pending: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium',
    archived: 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium'
  }
  return classes[status] || ''
}

const deleteEntry = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kronik ini?')) return

  try {
    await $fetch(`/api/admin/kronik/entries/${id}`, {
      method: 'DELETE'
    })
    loadEntries()
    alert('Kronik berhasil dihapus')
  } catch (error) {
    console.error('Error deleting entry:', error)
    alert('Gagal menghapus kronik')
  }
}

useHead({
  title: 'Manajemen Kronik - Admin Panel'
})
</script>
