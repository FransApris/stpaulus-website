<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-1">
        <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manajemen Maintenance</h1>
          <p class="text-sm text-gray-500">Aktifkan atau nonaktifkan mode maintenance per halaman dengan satu klik</p>
        </div>
      </div>
    </div>

    <!-- Info banner -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
      <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      <div class="text-sm text-blue-700">
        <strong>Cara kerja:</strong> Ketika maintenance <strong>aktif</strong>, pengunjung website akan melihat halaman
        pemberitahuan yang ramah. Konten asli halaman <strong>tidak dihapus</strong> dan akan langsung kembali normal
        saat maintenance dinonaktifkan.
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div class="inline-block w-8 h-8 border-4 border-[#882f1d] border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-gray-500 text-sm">Memuat status halaman...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 text-sm flex gap-3">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Pages list -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Summary bar -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-gray-700">
            {{ pages.length }} halaman dikelola
          </span>
          <span v-if="activeCount > 0"
            class="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {{ activeCount }} aktif maintenance
          </span>
          <span v-else
            class="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Semua halaman normal
          </span>
        </div>
        <!-- Bulk action -->
        <button
          v-if="activeCount > 0"
          @click="deactivateAll"
          :disabled="savingKey === '__all__'"
          class="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50">
          Nonaktifkan Semua
        </button>
      </div>

      <!-- Page rows -->
      <ul class="divide-y divide-gray-50">
        <li v-for="page in pages" :key="page.key"
          class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">

          <!-- Page icon + info -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div :class="[
              'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
              page.active ? 'bg-amber-100' : 'bg-gray-100 group-hover:bg-gray-200'
            ]">
              <svg :class="['w-4 h-4', page.active ? 'text-amber-600' : 'text-gray-400']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-800 truncate">{{ page.label }}</span>
                <span v-if="page.active"
                  class="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Maintenance
                </span>
              </div>
              <a :href="page.path" target="_blank" rel="noopener noreferrer"
                class="text-xs text-gray-400 hover:text-[#882f1d] transition-colors flex items-center gap-1 w-fit">
                {{ page.path }}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Loading spinner for this row -->
          <div v-if="savingKey === page.key"
            class="w-5 h-5 border-2 border-[#882f1d] border-t-transparent rounded-full animate-spin flex-shrink-0">
          </div>

          <!-- Toggle switch -->
          <button v-else
            @click="togglePage(page)"
            :aria-label="`${page.active ? 'Nonaktifkan' : 'Aktifkan'} maintenance ${page.label}`"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:ring-offset-2',
              page.active ? 'bg-amber-500' : 'bg-gray-200'
            ]">
            <span :class="[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              page.active ? 'translate-x-5' : 'translate-x-0'
            ]"></span>
          </button>

          <!-- Status label -->
          <span :class="['text-xs font-medium w-16 text-right flex-shrink-0', page.active ? 'text-amber-600' : 'text-gray-400']">
            {{ page.active ? 'Aktif' : 'Normal' }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Toast notification -->
    <Transition name="toast">
      <div v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50',
          toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
        ]">
        <svg v-if="toast.type === 'success'" class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0016 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  title: 'Manajemen Maintenance - Admin'
})

// ── State ──────────────────────────────────────────────────────
const pages   = ref([])
const loading = ref(true)
const error   = ref(null)
const savingKey = ref(null)

const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

const activeCount = computed(() => pages.value.filter(p => p.active).length)

// ── Fetch status dari server ───────────────────────────────────
async function fetchPages() {
  loading.value = true
  error.value = null
  try {
    const data = await $fetch('/api/admin/maintenance')
    pages.value = data.pages
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Gagal memuat data maintenance'
  } finally {
    loading.value = false
  }
}

// ── Toggle satu halaman ────────────────────────────────────────
async function togglePage(page) {
  if (savingKey.value) return
  savingKey.value = page.key
  const newActive = !page.active
  try {
    await $fetch('/api/admin/maintenance', {
      method: 'POST',
      body: { key: page.key, active: newActive }
    })
    page.active = newActive
    showToast(
      newActive
        ? `✓ Maintenance "${page.label}" diaktifkan`
        : `✓ Halaman "${page.label}" dikembalikan normal`,
      'success'
    )
  } catch (e) {
    showToast(e?.data?.statusMessage || 'Gagal menyimpan perubahan', 'error')
  } finally {
    savingKey.value = null
  }
}

// ── Nonaktifkan semua ──────────────────────────────────────────
async function deactivateAll() {
  savingKey.value = '__all__'
  try {
    const activePages = pages.value.filter(p => p.active)
    for (const page of activePages) {
      await $fetch('/api/admin/maintenance', {
        method: 'POST',
        body: { key: page.key, active: false }
      })
      page.active = false
    }
    showToast('✓ Semua halaman dikembalikan ke mode normal', 'success')
  } catch (e) {
    showToast('Gagal menonaktifkan semua', 'error')
    await fetchPages()
  } finally {
    savingKey.value = null
  }
}

// ── Toast helper ───────────────────────────────────────────────
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(fetchPages)
onBeforeUnmount(() => { if (toastTimer) clearTimeout(toastTimer) })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
