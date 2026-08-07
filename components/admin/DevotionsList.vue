<template>
  <div>
    <div class="mb-6">
      <button
        @click="$emit('openAddModal')"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        Tambah Jadwal Devosi
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-x-auto">
      <div v-if="loading" class="p-8 text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"
        ></div>
        <p class="mt-2 text-gray-600">Memuat jadwal...</p>
      </div>

      <div v-else-if="devotions.length === 0" class="p-8 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Belum ada jadwal devosi
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Mulai dengan membuat jadwal devosi pertama.
        </p>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Judul & Jenis
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hari
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Waktu
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lokasi
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="devotion in devotions"
              :key="devotion.id"
              :class="
                !(devotion.is_active === 1 || devotion.is_active === true)
                  ? 'opacity-50 bg-gray-50'
                  : 'hover:bg-gray-50'
              "
              class="transition-opacity"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                <div class="flex items-center gap-2">
                  <span class="text-xl">{{
                    getDevotionIcon(devotion.type)
                  }}</span>
                  <div>
                    {{ devotion.title }}
                    <p class="text-xs text-gray-500 mt-0.5 font-normal">
                      {{
                        devotion.type_name || getDevotionLabel(devotion.type)
                      }}
                    </p>
                    <p
                      v-if="devotion.description"
                      class="text-xs text-gray-400 mt-0.5 font-normal italic"
                    >
                      {{ devotion.description }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    devotion.day_of_week === 'Minggu'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  "
                >
                  {{ devotion.day_of_week }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ devotion.time }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ devotion.location || "-" }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button
                  @click="$emit('toggle', devotion)"
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="
                    devotion.is_active === 1 || devotion.is_active === true
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  "
                  :title="
                    devotion.is_active === 1 || devotion.is_active === true
                      ? 'Nonaktifkan'
                      : 'Aktifkan'
                  "
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="
                      devotion.is_active === 1 || devotion.is_active === true
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    "
                  ></span>
                </button>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="$emit('edit', devotion)"
                  class="text-blue-600 hover:text-blue-800 p-1 mr-1"
                  title="Edit"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="$emit('delete', devotion)"
                  class="text-red-600 hover:text-red-800 p-1"
                  title="Hapus"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  devotions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["openAddModal", "edit", "toggle", "delete"]);

const getDevotionIcon = (type) => {
  const icons = {
    jalan_salib: "✝️",
    doa_novena: "📿",
    doa_rosario: "📿",
    adorasi: "🕯️",
  };
  return icons[type] || "🙏";
};

const getDevotionLabel = (type) => {
  const labels = {
    jalan_salib: "Jalan Salib",
    doa_novena: "Doa Novena",
    doa_rosario: "Doa Rosario",
    adorasi: "Adorasi (Sakramen Mahakudus)",
  };
  return labels[type] || type;
};
</script>
