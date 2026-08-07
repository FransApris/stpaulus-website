<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Kronik</h1>
        <div class="mt-3 flex gap-3">
          <NuxtLink to="/admin/kronik" class="text-[#c58229] border-b-2 border-[#c58229] pb-1 font-medium text-sm sm:text-base">
            Entries
          </NuxtLink>
          <NuxtLink to="/admin/kronik/sections" class="text-gray-600 hover:text-[#c58229] pb-1 font-medium text-sm sm:text-base">
            Sections
          </NuxtLink>
        </div>
      </div>
      <NuxtLink to="/admin/kronik/create"
        class="inline-flex items-center justify-center gap-2 bg-[#c58229] text-white px-5 py-2.5 rounded-lg hover:bg-[#882f1d] transition-colors font-medium text-sm sm:text-base shadow-sm self-start sm:self-auto">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span>Tambah Kronik Baru</span>
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <select v-model="filters.status" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#c58229] focus:border-[#c58229] outline-none">
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </select>

        <select v-model="filters.category_id" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#c58229] focus:border-[#c58229] outline-none">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <input v-model="filters.search" type="text" placeholder="Cari kronik..." class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#c58229] focus:border-[#c58229] outline-none" />

        <button @click="loadEntries" class="bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors text-sm font-medium">
          Filter
        </button>
      </div>
    </div>

    <!-- Table and Cards -->
    <div id="kronik-entries-section" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-4">
      <!-- Mobile/Tablet Card View -->
      <div class="xl:hidden p-3 sm:p-4 space-y-4">
        <div v-for="entry in paginatedEntries" :key="'card-'+entry.id" class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
          <!-- Card Header: Judul & Kategori (Lebar penuh, tidak terhimpit) -->
          <div class="mb-3.5 pb-3 border-b border-gray-100">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-snug">{{ entry.what_title }}</h3>
            <div class="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span class="inline-block font-semibold text-[#882f1d] bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-[11px]">
                {{ entry.category_name }}
              </span>
              <span v-if="entry.section_name" class="text-gray-400">&bull;</span>
              <span v-if="entry.section_name" class="text-gray-600 font-medium text-[11px]">{{ entry.section_name }}</span>
            </div>
          </div>
          
          <!-- Card Body: Grid Informasi (Tanggal, Status, Views) -->
          <div class="grid grid-cols-2 gap-2.5 text-xs mb-3.5">
            <div class="bg-gray-50 rounded-lg p-2.5">
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tanggal</p>
              <p class="text-gray-900 font-medium text-xs">{{ formatDate(entry.when_date) }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-2.5 flex flex-col justify-center">
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
              <select :value="entry.status" @change="updateStatus(entry, $event.target.value)" :class="getStatusSelectClass(entry.status)" class="rounded-md text-xs font-medium px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 block w-full">
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="pending">pending</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div class="col-span-2 bg-gray-50 rounded-lg p-2.5 flex items-center justify-between">
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tayangan / Views</span>
              <span class="text-gray-900 font-semibold text-xs">{{ entry.views_count || 0 }} tayangan</span>
            </div>
          </div>

          <!-- Card Footer: Icon / Tombol Aksi Tersusun Horisontal di Bawah -->
          <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
            <NuxtLink :to="`/kronik/${entry.category_slug}/${entry.id}`" target="_blank"
              class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
              title="Lihat Kronik">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Lihat</span>
            </NuxtLink>
            <NuxtLink :to="`/admin/kronik/edit/${entry.id}`"
              class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
              title="Edit Kronik">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              <span>Edit</span>
            </NuxtLink>
            <button @click="deleteEntry(entry.id)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
              title="Hapus Kronik">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden xl:block w-full overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
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
              <select :value="entry.status" @change="updateStatus(entry, $event.target.value)"
                :class="getStatusSelectClass(entry.status)"
                class="rounded-full text-xs font-medium px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1">
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="pending">pending</option>
                <option value="archived">archived</option>
              </select>
            </td>
            <td class="px-6 py-4">{{ entry.views_count }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <NuxtLink :to="`/kronik/${entry.category_slug}/${entry.id}`" target="_blank"
                  class="text-green-600 hover:text-green-800" title="Lihat">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
                <NuxtLink :to="`/admin/kronik/edit/${entry.id}`" class="text-blue-600 hover:text-blue-800" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>
                <button @click="deleteEntry(entry.id)" class="text-red-600 hover:text-red-800" title="Hapus">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!entries || entries.length === 0" class="text-center py-12">
        <p class="text-gray-500">Belum ada kronik</p>
      </div>

      <div v-if="entries.length > pageLimit"
        class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p class="text-sm text-gray-600">
          Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-
          {{ Math.min(currentPage * pageLimit, entries.length) }}
          dari {{ entries.length }} kronik
        </p>
        <div class="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Sebelumnya
          </button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
            'px-3 py-1.5 rounded-lg border text-sm',
            currentPage === page
              ? 'bg-[#c58229] text-white border-[#c58229]'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          ]">
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
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

const scrollToTop = () => {
  nextTick(() => {
    const target = document.getElementById('kronik-entries-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const mainEl = target.closest('main') || document.querySelector('main')
      if (mainEl && typeof target.offsetTop === 'number') {
        mainEl.scrollTo({
          top: Math.max(0, target.offsetTop - 12),
          behavior: 'smooth'
        })
      }
    } else {
      const mainEl = document.querySelector('main')
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  })
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  scrollToTop()
}

watch(filters, () => {
  currentPage.value = 1
  scrollToTop()
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

const getStatusSelectClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800 focus:ring-green-400',
    draft: 'bg-yellow-100 text-yellow-800 focus:ring-yellow-400',
    pending: 'bg-blue-100 text-blue-800 focus:ring-blue-400',
    archived: 'bg-gray-100 text-gray-800 focus:ring-gray-400'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const updatingStatus = ref(null)

const updateStatus = async (entry, newStatus) => {
  if (entry.status === newStatus) return
  updatingStatus.value = entry.id
  const oldStatus = entry.status
  entry.status = newStatus

  try {
    const token = localStorage.getItem('auth_token')
    await $fetch(`/api/admin/kronik/entries/${entry.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { status: newStatus }
    })
  } catch (error) {
    console.error('Error updating status:', error)
    entry.status = oldStatus
    alert('Gagal mengubah status')
  } finally {
    updatingStatus.value = null
  }
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
