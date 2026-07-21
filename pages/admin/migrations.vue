<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Database Migrations</h1>
      <p class="text-gray-500 mt-1 text-sm">Jalankan migration SQL yang pending. Hanya super_admin.</p>
    </div>

    <!-- Email Test Tool -->
    <div class="bg-white rounded-xl shadow-sm border border-blue-200 p-5 mb-6">
      <div class="font-medium text-gray-900 mb-1">🔧 Test Konfigurasi Email (SMTP)</div>
      <p class="text-sm text-gray-500 mb-3">Kirim email percobaan untuk memverifikasi konfigurasi SMTP sudah benar.</p>
      <div class="flex gap-3 items-start">
        <input v-model="testEmailTo" type="email" placeholder="Masukkan email tujuan"
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        <button @click="runTestEmail" :disabled="testEmailRunning"
          class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
          {{ testEmailRunning ? 'Mengirim...' : 'Kirim Test Email' }}
        </button>
      </div>
      <div v-if="testEmailResult" class="mt-3 text-sm px-3 py-2 rounded-lg"
        :class="testEmailResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
        <p class="font-medium">{{ testEmailResult.success ? '✅' : '❌' }} {{ testEmailResult.message }}</p>
        <div v-if="testEmailResult.config" class="mt-2 space-y-0.5">
          <p v-for="(val, key) in testEmailResult.config" :key="key" class="font-mono text-xs">{{ key }}: {{ val }}</p>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="m in migrations" :key="m.key"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="font-medium text-gray-900">{{ m.label }}</div>
          <div class="text-sm text-gray-500 mt-0.5">{{ m.description }}</div>
          <!-- Result -->
          <div v-if="m.result" class="mt-3 space-y-1">
            <div v-for="(r, i) in m.result.results" :key="i" class="text-xs font-mono px-2 py-1 rounded"
              :class="r.status === 'ok' ? 'bg-green-50 text-green-800' : r.status.startsWith('skipped') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'">
              <span class="font-semibold">[{{ r.status }}]</span> {{ r.statement }}
            </div>
            <p :class="m.result.success ? 'text-green-700' : 'text-red-700'" class="text-sm font-medium mt-2">
              {{ m.result.message }}
            </p>
          </div>
        </div>
        <button @click="run(m)" :disabled="m.running || m.done"
          class="px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap" :class="m.done
            ? 'bg-green-100 text-green-700 cursor-default'
            : m.running
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-[#882f1d] text-white hover:bg-[#6d2517]'">
          {{ m.done ? '✓ Selesai' : m.running ? 'Running...' : 'Jalankan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface Migration {
  key: string
  label: string
  description: string
  running: boolean
  done: boolean
  result: any
}

const migrations = ref<Migration[]>([
  {
    key: '007_add_agenda_id_to_announcements',
    label: '007 - Tambah agenda_id ke pengumuman',
    description: 'Menambah kolom agenda_id (nullable FK) ke tabel church_announcements agar pengumuman bisa ditautkan ke agenda.',
    running: false,
    done: false,
    result: null
  },
  {
    key: '008_add_manage_users_permission_to_sekretariat',
    label: '008 - Tambah permission manage_users ke Admin Sekretariat',
    description: 'Memberikan permission manage_users_komsos_sekretariat ke role admin_sekretariat agar bisa melihat dan mengelola daftar pengguna ruangan.',
    running: false,
    done: false,
    result: null
  },
  {
    key: '009_add_liturgy_types_permission_to_sekretariat',
    label: '009 - Tambah permission manage_liturgy_types ke Admin Sekretariat',
    description: 'Memberikan permission manage_liturgy_types ke role admin_sekretariat agar bisa mengakses dan mengelola jenis liturgi (diperlukan untuk halaman jadwal misa).',
    running: false,
    done: false,
    result: null
  },
  {
    key: '031_create_app_settings',
    label: '031 - Buat tabel app_settings',
    description: 'Membuat tabel app_settings untuk menyimpan konfigurasi aplikasi yang persisten (termasuk status maintenance).',
    running: false,
    done: false,
    result: null
  },
  {
    key: '040_add_news_organization_filters',
    label: '040 - Tambah filter organisasi untuk berita (Wilayah, Lingkungan, Seksi, BGKP)',
    description: 'Membuat tabel seksi, news_wilayah_relations, news_lingkungan_relations, news_seksi_relations, dan menambah kolom is_bgkp di tabel news. Diperlukan untuk fitur kategorisasi dan filtering berita berdasarkan organisasi paroki.',
    running: false,
    done: false,
    result: null
  },
  {
    key: '050_create_news_interactions',
    label: '050 - Buat tabel news_interactions & kolom interaksi berita',
    description: 'Membuat tabel news_interactions (untuk tracking views, likes, shares) dan menambah kolom image, likes_count, shares_count, views_count, is_bgkp, dll ke tabel news. WAJIB dijalankan untuk memperbaiki error 500 pada halaman detail berita.',
    running: false,
    done: false,
    result: null
  }
])

const run = async (m: Migration) => {
  m.running = true
  m.result = null
  try {
    const res = await $fetch<any>('/api/admin/run-migration', {
      method: 'POST',
      body: { migration: m.key }
    })
    m.result = res
    m.done = res.success
  } catch (err: any) {
    m.result = {
      success: false,
      message: err?.data?.statusMessage || err?.message || 'Terjadi kesalahan',
      results: []
    }
  } finally {
    m.running = false
  }
}

// Email test
const testEmailTo = ref('')
const testEmailRunning = ref(false)
const testEmailResult = ref<any>(null)

const runTestEmail = async () => {
  if (!testEmailTo.value.trim()) return
  testEmailRunning.value = true
  testEmailResult.value = null
  try {
    const res = await $fetch<any>('/api/admin/test-email', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}` },
      body: { to: testEmailTo.value.trim() }
    })
    testEmailResult.value = res
  } catch (err: any) {
    testEmailResult.value = {
      success: false,
      message: err?.data?.statusMessage || err?.message || 'Terjadi kesalahan'
    }
  } finally {
    testEmailRunning.value = false
  }
}
</script>
