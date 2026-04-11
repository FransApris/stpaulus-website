<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Database Migrations</h1>
      <p class="text-gray-500 mt-1 text-sm">Jalankan migration SQL yang pending. Hanya super_admin.</p>
    </div>

    <div class="space-y-4">
      <div v-for="m in migrations" :key="m.key"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="font-medium text-gray-900">{{ m.label }}</div>
          <div class="text-sm text-gray-500 mt-0.5">{{ m.description }}</div>
          <!-- Result -->
          <div v-if="m.result" class="mt-3 space-y-1">
            <div v-for="(r, i) in m.result.results" :key="i"
              class="text-xs font-mono px-2 py-1 rounded"
              :class="r.status === 'ok' ? 'bg-green-50 text-green-800' : r.status.startsWith('skipped') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'">
              <span class="font-semibold">[{{ r.status }}]</span> {{ r.statement }}
            </div>
            <p :class="m.result.success ? 'text-green-700' : 'text-red-700'" class="text-sm font-medium mt-2">
              {{ m.result.message }}
            </p>
          </div>
        </div>
        <button @click="run(m)" :disabled="m.running || m.done"
          class="px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
          :class="m.done
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
</script>
