<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manage Sections</h1>
            <p class="mt-2 text-gray-600">
              Kelola bagian-bagian dari Wilayah, Lingkungan, DPP, dan BGKP
            </p>
            <div class="mt-3 flex gap-3">
              <NuxtLink
                to="/admin/kronik"
                class="text-gray-600 hover:text-[#c58229] pb-1 font-medium"
              >
                Entries
              </NuxtLink>
              <NuxtLink
                to="/admin/kronik/sections"
                class="text-[#c58229] border-b-2 border-[#c58229] pb-1 font-medium"
              >
                Sections
              </NuxtLink>
            </div>
          </div>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-[#c58229] text-white rounded-lg hover:bg-[#a66d1f] transition-colors"
          >
            + Add Section
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Filter by Category</label
            >
            <select
              v-model="selectedCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Search</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search sections..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Status</label
            >
            <select
              v-model="statusFilter"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sections Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-[#c58229]"
          ></div>
          <p class="mt-4 text-gray-600">Loading sections...</p>
        </div>

        <div
          v-else-if="filteredSections.length === 0"
          class="p-8 text-center text-gray-500"
        >
          <p>No sections found</p>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Slug
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Entries
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="section in paginatedSections"
              :key="section.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ section.name }}
                </div>
                <div
                  v-if="section.description"
                  class="text-sm text-gray-500 truncate max-w-xs"
                >
                  {{ section.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ section.category_name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ section.slug }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ section.entries_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    section.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ section.is_active ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openEditModal(section)"
                  title="Edit"
                  class="text-[#c58229] hover:text-[#a66d1f] mr-3 p-1 inline-flex items-center"
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
                    />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(section)"
                  title="Delete"
                  class="text-red-600 hover:text-red-800 p-1 inline-flex items-center"
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
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="filteredSections.length > pageLimit"
          class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-
            {{ Math.min(currentPage * pageLimit, filteredSections.length) }}
            dari {{ filteredSections.length }} section
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
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50',
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

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ editingSection ? "Edit Section" : "Create New Section" }}
            </h2>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Category *</label
              >
              <select
                v-model="form.category_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Name *</label
              >
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g., Wilayah Santo Yusuf, Seksi Liturgi"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
                @input="generateSlug"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Slug *</label
              >
              <input
                v-model="form.slug"
                type="text"
                required
                placeholder="wilayah-santo-yusuf"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
              />
              <p class="mt-1 text-xs text-gray-500">
                URL-friendly identifier (lowercase, no spaces)
              </p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Description</label
              >
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Optional description..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
              ></textarea>
            </div>

            <!-- Order Index -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Order Index</label
              >
              <input
                v-model.number="form.order_index"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c58229] focus:border-transparent"
              />
              <p class="mt-1 text-xs text-gray-500">
                Lower numbers appear first
              </p>
            </div>

            <!-- Active Status -->
            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                id="is_active"
                class="w-4 h-4 text-[#c58229] border-gray-300 rounded focus:ring-[#c58229]"
              />
              <label for="is_active" class="ml-2 text-sm text-gray-700">
                Active (visible to users)
              </label>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2 bg-[#c58229] text-white rounded-lg hover:bg-[#a66d1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{
                  submitting
                    ? "Saving..."
                    : editingSection
                      ? "Update Section"
                      : "Create Section"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :title="`Delete ${sectionToDelete?.name}?`"
      message="Are you sure you want to delete this section? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="deleteSection"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

// Types
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
}

interface Section {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  order_index: number;
  is_active: boolean;
  category_name?: string;
  category_slug?: string;
  entries_count?: number;
}

interface SectionForm {
  category_id: string | number;
  name: string;
  slug: string;
  description: string;
  order_index: number;
  is_active: boolean;
}

const { user } = useAuth();

// Check permissions - wait for user data to be available
watch(
  user,
  (newUser: any) => {
    if (
      newUser &&
      ![
        "super_admin",
        "admin_paroki",
        "admin_komsos",
        "admin_sekretariat",
      ].includes(newUser.role)
    ) {
      navigateTo("/admin/dashboard");
    }
  },
  { immediate: true },
);

// State
const loading = ref(true);
const submitting = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const editingSection = ref<Section | null>(null);
const sectionToDelete = ref<Section | null>(null);
const currentPage = ref(1);
const pageLimit = 10;

// Filters
const selectedCategory = ref("");
const searchQuery = ref("");
const statusFilter = ref("");

// Form
const form = ref<SectionForm>({
  category_id: "",
  name: "",
  slug: "",
  description: "",
  order_index: 0,
  is_active: true,
});

// Fetch data
const { data: categoriesData } = await useFetch("/api/kronik/categories");
const categories = computed(
  () => (categoriesData.value?.data as Category[]) || [],
);

const { data: sectionsData, refresh: refreshSections } = await useFetch(
  "/api/admin/kronik/sections",
);
const sections = computed(() => (sectionsData.value?.data as Section[]) || []);

// Computed
const filteredSections = computed(() => {
  let filtered = sections.value;

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (s: Section) => s.category_id === parseInt(selectedCategory.value),
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (s: Section) =>
        s.name.toLowerCase().includes(query) ||
        s.slug.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query),
    );
  }

  if (statusFilter.value) {
    const isActive = statusFilter.value === "active";
    filtered = filtered.filter((s: Section) => s.is_active === isActive);
  }

  return filtered;
});

const totalPages = computed(() => {
  const pages = Math.ceil(filteredSections.value.length / pageLimit);
  return pages > 0 ? pages : 1;
});

const paginatedSections = computed(() => {
  const start = (currentPage.value - 1) * pageLimit;
  return filteredSections.value.slice(start, start + pageLimit);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  return pages;
});

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

watch([selectedCategory, searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

watch(totalPages, (pages: number) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});

// Methods
const openCreateModal = () => {
  editingSection.value = null;
  form.value = {
    category_id: "",
    name: "",
    slug: "",
    description: "",
    order_index: 0,
    is_active: true,
  };
  showModal.value = true;
};

const openEditModal = (section: Section) => {
  editingSection.value = section;
  form.value = {
    category_id: section.category_id,
    name: section.name,
    slug: section.slug,
    description: section.description || "",
    order_index: section.order_index || 0,
    is_active: section.is_active,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingSection.value = null;
};

const generateSlug = () => {
  if (!editingSection.value && form.value.name) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
};

const submitForm = async () => {
  submitting.value = true;
  try {
    if (editingSection.value) {
      // Update
      await $fetch(`/api/admin/kronik/sections/${editingSection.value.id}`, {
        method: "PUT",
        body: form.value,
      });
    } else {
      // Create
      await $fetch("/api/admin/kronik/sections", {
        method: "POST",
        body: form.value,
      });
    }

    await refreshSections();
    closeModal();

    // Show success message (you can implement toast notification)
    alert(
      editingSection.value
        ? "Section updated successfully!"
        : "Section created successfully!",
    );
  } catch (error: any) {
    console.error("Error saving section:", error);
    alert(error.data?.message || "Failed to save section");
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (section: Section) => {
  sectionToDelete.value = section;
  showDeleteConfirm.value = true;
};

const deleteSection = async () => {
  if (!sectionToDelete.value) return;

  try {
    await $fetch(`/api/admin/kronik/sections/${sectionToDelete.value.id}`, {
      method: "DELETE",
    });

    await refreshSections();
    showDeleteConfirm.value = false;
    sectionToDelete.value = null;

    alert("Section deleted successfully!");
  } catch (error: any) {
    console.error("Error deleting section:", error);
    alert(error.data?.message || "Failed to delete section");
  }
};

loading.value = false;
</script>
