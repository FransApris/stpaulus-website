<template>
  <div class="space-y-6 w-full max-w-3xl">
    <!-- Header -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Database Migrations</h1>
      <p class="text-sm sm:text-base text-gray-600">Jalankan migration SQL yang pending. Khusus Super Admin.</p>
    </div>

    <!-- Email Test Tool -->
    <div class="bg-white rounded-lg shadow p-4 sm:p-6 border border-blue-100">
      <div class="font-semibold text-gray-900 text-sm sm:text-base mb-1">🔧 Test Konfigurasi Email (SMTP)</div>
      <p class="text-xs sm:text-sm text-gray-500 mb-4">Kirim email percobaan untuk memverifikasi konfigurasi SMTP sudah benar.</p>
      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          v-model="testEmailTo"
          type="email"
          placeholder="Masukkan email tujuan"
          class="w-full sm:flex-1 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          @click="runTestEmail"
          :disabled="testEmailRunning || !testEmailTo.trim()"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ testEmailRunning ? 'Mengirim...' : 'Kirim Test Email' }}
        </button>
      </div>
      <div
        v-if="testEmailResult"
        class="mt-4 text-xs sm:text-sm p-3.5 rounded-lg border"
        :class="testEmailResult.success ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'"
      >
        <p class="font-semibold break-words">{{ testEmailResult.success ? '✅' : '❌' }} {{ testEmailResult.message }}</p>
        <div v-if="testEmailResult.config" class="mt-2 space-y-0.5 overflow-x-auto">
          <p v-for="(val, key) in testEmailResult.config" :key="key" class="font-mono text-xs break-all">{{ key }}: {{ val }}</p>
        </div>
      </div>
    </div>

    <!-- Migrations List -->
    <div class="space-y-4">
      <div
        v-for="m in migrations"
        :key="m.key"
        class="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border border-gray-100"
      >
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm sm:text-base text-gray-900 break-words">{{ m.label }}</div>
          <div class="text-xs sm:text-sm text-gray-500 mt-1 break-words leading-relaxed">{{ m.description }}</div>
          <!-- Result -->
          <div v-if="m.result" class="mt-3 space-y-1">
            <div
              v-for="(r, i) in m.result.results"
              :key="i"
              class="text-xs font-mono px-2.5 py-1.5 rounded break-all"
              :class="r.status === 'ok' ? 'bg-green-50 text-green-800' : r.status.startsWith('skipped') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'"
            >
              <span class="font-bold">[{{ r.status }}]</span> {{ r.statement }}
            </div>
            <p :class="m.result.success ? 'text-green-700' : 'text-red-700'" class="text-xs sm:text-sm font-medium mt-2 break-words">
              {{ m.result.message }}
            </p>
          </div>
        </div>
        <button
          @click="run(m)"
          :disabled="m.running || m.done"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
          :class="m.done
            ? 'bg-green-100 text-green-700 cursor-default'
            : m.running
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-[#882f1d] text-white hover:bg-[#6d2517]'"
        >
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
    key: '032_add_force_password_reset',
    label: '032 - Tambah kolom requires_password_reset',
    description: 'Menambahkan fitur paksaan reset password pada tabel users (Clean Slate).',
    running: false,
    done: false,
    result: null
  },
  {
    key: '034_add_quota_settings',
    label: '034 - Tambah pengaturan kuota pemesanan (DPP/BGKP & per kategori)',
    description: 'Menambah kolom is_unlimited & monthly_quota ke tabel user_categories, serta kolom monthly_quota_override & quota_is_unlimited_override ke tabel users. Memungkinkan Super Admin mengatur batas kuota pemesanan per kategori maupun per user individual. DPP & BGKP otomatis di-set unlimited.',
    running: false,
    done: false,
    result: null
  },
  {
    key: '035_add_kontributor_role',
    label: '035 - Tambah Role Kontributor Berita',
    description: 'Menambahkan role kontributor_berita dan kolom author_id di tabel news untuk melacak penulis berita dari kontributor lingkungan/wilayah.',
    running: false,
    done: false,
    result: null
  },
  {
    key: '036_add_user_kontributor_role',
    label: '036 - Tambah Role User & Kontributor',
    description: 'Menambahkan role user_kontributor untuk user yang bisa memesan ruangan dan juga portal kontributor.',
    running: false,
    done: false,
    result: null
  },
  {
    key: '037_fix_role_id_foreign_key',
    label: '037 - ⚠️ Perbaiki FK users.role_id (WAJIB dijalankan)',
    description: 'Memperbaiki Foreign Key constraint pada kolom users.role_id yang masih menunjuk ke tabel user_roles (lama) padahal kode RBAC sudah menggunakan tabel roles (baru). Tanpa migration ini, update role pengguna dari Admin Panel akan selalu gagal dengan error 500. Langkah: (1) Sinkronisasi data roles → user_roles, (2) DROP FK lama, (3) ADD FK baru ke tabel roles.',
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
    key: '046_insert_ketua_wilayah_faqs',
    label: '046 - Tambah data FAQ Ketua Wilayah dan Lingkungan',
    description: 'Memasukkan data daftar Ketua Wilayah dan seluruh daftar Ketua Lingkungan masing-masing ke dalam database Chatbot FAQ.',
    running: false,
    done: false,
    result: null
  },
  {
    key: '047_insert_dpp_pengurus_faqs',
    label: '047 - Tambah data FAQ Pengurus Inti dan Bidang DPP',
    description: 'Memasukkan data daftar Pengurus Inti dan struktur pengurus Bidang-Bidang di DPP Paroki St. Paulus Juanda ke dalam database Chatbot FAQ.',
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
  },
  {
    key: '051_add_author_origin_to_news',
    label: '051 - Tambah Kolom author_origin',
    description: 'Menambahkan kolom author_origin ke tabel news untuk melacak asal kontributor berita (misal: Wilayah atau Lingkungan).',
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
