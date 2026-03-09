<template>
  <section class="py-12 bg-gradient-to-br from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4">Pengumuman Gereja</h2>
        <p class="text-gray-600">Informasi terkini kegiatan Paroki St. Paulus</p>
      </div>

      <div v-if="pending" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d]"></div>
        <p class="mt-4 text-gray-600">Memuat...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">❌ Gagal memuat</p>
      </div>

      <div v-else-if="announcements.length > 0">
        <div class="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-[#882f1d] to-[#a03822] text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold">Thumbnail</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Jam</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Jenis</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Acara</th>
                <th class="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in announcements" :key="item.id" class="border-b hover:bg-gray-50"
                :class="{ 'bg-gray-50/50': i % 2 === 0 }">
                <td class="px-6 py-4">
                  <div v-if="item.thumbnail" class="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" 
                      @error="(e) => (e.target as HTMLImageElement).style.display = 'none'" />
                  </div>
                  <div v-else class="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                    📢
                  </div>
                </td>
                <td class="px-6 py-4"><span class="font-medium text-gray-800">{{ formatDate(item.event_date) }}</span>
                </td>
                <td class="px-6 py-4"><span class="font-medium text-gray-700">{{ formatTime(item.event_time) }}</span>
                </td>
                <td class="px-6 py-4">
                  <span v-if="item.activity_type" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="item.activity_type === 'Sakramen' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'">
                    {{ item.activity_type }}
                  </span>
                  <span v-else class="text-gray-400 text-sm">-</span>
                </td>
                <td class="px-6 py-4">
                  <h3 class="font-semibold text-gray-800 mb-1">{{ item.title }}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2">{{ item.description }}</p>
                </td>
                <td class="px-6 py-4 text-center">
                  <button @click="openModal(item)"
                    class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6d2517] text-sm font-medium">Selengkapnya</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-4">
          <div v-for="item in announcements" :key="item.id" class="bg-white rounded-xl shadow-lg border p-5">
            <!-- Thumbnail Full Width -->
            <div v-if="item.thumbnail" class="w-full h-48 rounded-lg overflow-hidden mb-4 border">
              <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" 
                @error="(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2260%22%3E📢%3C/text%3E%3C/svg%3E'" />
            </div>
            <div v-else class="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-6xl">
              📢
            </div>
            
            <!-- Jenis Kegiatan Badge -->
            <div v-if="item.activity_type" class="mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="item.activity_type === 'Sakramen' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'">
                🏷️ {{ item.activity_type }}
              </span>
            </div>
            
            <div class="flex gap-4 mb-3 pb-3 border-b">
              <div><span class="text-xs text-gray-500">Tanggal</span><br><span class="text-sm font-medium">{{
                formatDate(item.event_date) }}</span></div>
              <div><span class="text-xs text-gray-500">Jam</span><br><span class="text-sm font-medium">{{
                formatTime(item.event_time) }}</span></div>
            </div>
            <h3 class="font-bold text-lg mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ item.description }}</p>
            <button @click="openModal(item)"
              class="w-full px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6d2517] text-sm font-medium">Lihat
              Detail</button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 bg-white rounded-xl shadow-lg">
        <p class="text-gray-500">Belum ada pengumuman</p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-gradient-to-r from-[#882f1d] to-[#a03822] text-white px-6 py-4 rounded-t-2xl">
            <div class="flex justify-between">
              <div>
                <h2 class="text-2xl font-cinzel font-bold mb-2">{{ selected?.title }}</h2>
                <div class="flex gap-4 text-sm flex-wrap">
                  <span>📅 {{ formatDate(selected?.event_date) }}</span>
                  <span>🕒 {{ formatTime(selected?.event_time) }}</span>
                  <span v-if="selected?.activity_type" class="bg-white/20 px-2 py-1 rounded">
                    🏷️ {{ selected.activity_type }}
                  </span>
                </div>
              </div>
              <button @click="closeModal" class="p-2 hover:bg-white/20 rounded-full">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6">
            <img v-if="selected?.thumbnail" :src="selected.thumbnail"
              class="w-full h-64 object-cover rounded-xl mb-6" 
              @error="(e) => (e.target as HTMLImageElement).style.display = 'none'" />
            <h3 class="text-lg font-semibold mb-3">Detail Acara:</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ selected?.description }}</p>
          </div>
          <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
            <button @click="closeModal"
              class="w-full px-6 py-3 bg-[#882f1d] text-white rounded-lg hover:bg-[#6d2517] font-medium">Tutup</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
interface Announcement {
  id: number
  title: string
  description: string
  activity_type: string | null
  event_date: string
  event_time: string
  thumbnail: string | null
}

const showModal = ref(false)
const selected = ref<Announcement | null>(null)

// Use useFetch with lazy option untuk optimasi - tidak block SSR
const { data, pending, error } = useFetch<{ success: boolean, data: Announcement[], count: number }>('/api/church-announcements', { 
  query: { limit: 10 },
  lazy: true, // Lazy load - tidak block initial page load
  server: false, // Hanya load di client side untuk mencegah SSR overhead
  default: () => ({ success: false, data: [], count: 0 }),
  transform: (response) => response || { success: false, data: [], count: 0 }
})

const announcements = computed(() => {
  if (!data.value?.data) return []
  const items = data.value.data
  console.log('[ChurchAnnouncements] Data received:', items.length, 'items')
  return items
})

function openModal(item: Announcement) {
  selected.value = item
  showModal.value = true
  if (process.client) {
    document.body.style.overflow = 'hidden'
  }
}

function closeModal() {
  showModal.value = false
  selected.value = null
  if (process.client) {
    document.body.style.overflow = ''
  }
}

function formatDate(d: string | undefined): string {
  if (!d) return '-'
  try {
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return d
  }
}

function formatTime(t: string | undefined): string {
  if (!t) return '-'
  try {
    const [h, m] = t.split(':')
    return `${h}:${m} WIB`
  } catch {
    return t
  }
}

onUnmounted(() => { 
  if (process.client) {
    document.body.style.overflow = '' 
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
