<template>
  <div class="flex flex-col min-h-[calc(100vh-10rem)]">
    <!-- Header -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
      <div>
        <h1 class="text-2xl sm:text-3xl font-cinzel font-bold text-gray-900">Pesan Masuk</h1>
        <p class="text-xs sm:text-sm text-gray-600">Daftar pertanyaan dan pesan kontak dari pengunjung website</p>
      </div>
      <div class="flex items-center gap-3 self-end sm:self-auto">
        <span class="text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm font-medium">
          Total: {{ pagination.total_messages }} pesan
        </span>
        <button
          @click="fetchMessages(pagination.current_page)"
          class="p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
          title="Refresh Data"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content with Master-Detail Layout -->
    <div id="messages-container" class="flex-1 bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row min-h-[560px] scroll-mt-4">
      <!-- Master: Message List (Full width di HP saat belum ada pesan dipilih, berdampingan di Desktop) -->
      <div
        :class="selectedMessage ? 'hidden lg:flex' : 'flex'"
        class="w-full lg:w-96 xl:w-[420px] border-r border-gray-200 flex-col bg-white"
      >
        <!-- Filter Tabs -->
        <div class="border-b border-gray-200 bg-gray-50/70 p-1.5">
          <div class="flex gap-1 bg-gray-200/70 p-1 rounded-lg">
            <button
              @click="filterStatus = 'all'"
              :class="filterStatus === 'all' ? 'bg-white text-[#882f1d] shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900 font-medium'"
              class="flex-1 px-3 py-2 text-xs sm:text-sm rounded-md transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Semua</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px]" :class="filterStatus === 'all' ? 'bg-amber-100 text-[#882f1d]' : 'bg-gray-100 text-gray-600'">
                {{ pagination.total_messages }}
              </span>
            </button>
            <button
              @click="filterStatus = 'unread'"
              :class="filterStatus === 'unread' ? 'bg-white text-[#882f1d] shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900 font-medium'"
              class="flex-1 px-3 py-2 text-xs sm:text-sm rounded-md transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Belum Dibaca</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px]" :class="unreadCount > 0 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'">
                {{ unreadCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Message List Items -->
        <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
          <div v-if="loading" class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
            <p class="text-xs text-gray-500 mt-2">Memuat pesan...</p>
          </div>
          
          <div v-else-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center py-16 px-4 text-gray-500 text-center">
            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-700">Tidak ada pesan</p>
            <p class="text-xs text-gray-400 mt-1">Belum ada pesan yang masuk pada filter ini</p>
          </div>

          <div v-else>
            <div
              v-for="message in filteredMessages"
              :key="message.id"
              @click="viewMessage(message.id)"
              :class="[
                'p-4 cursor-pointer transition-all duration-150 relative',
                selectedMessage?.id === message.id ? 'bg-amber-50/70 border-l-4 border-l-[#882f1d]' : 'hover:bg-gray-50/80',
                !message.is_read ? 'bg-blue-50/40' : ''
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div
                  :class="!message.is_read ? 'bg-[#882f1d] text-white' : 'bg-gray-200 text-gray-700'"
                  class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
                >
                  {{ message.name ? message.name.charAt(0).toUpperCase() : '?' }}
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-1 mb-1">
                    <h3
                      :class="!message.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-800'"
                      class="text-sm truncate"
                    >
                      {{ message.name }}
                    </h3>
                    <span class="text-[11px] text-gray-500 shrink-0 font-medium">
                      {{ formatShortDate(message.created_at) }}
                    </span>
                  </div>

                  <p class="text-xs text-gray-600 truncate mb-0.5">{{ message.email }}</p>
                  <p v-if="message.phone" class="text-[11px] text-gray-500 truncate mb-1">📞 {{ message.phone }}</p>
                  
                  <p class="text-xs text-gray-600 line-clamp-2 leading-snug">
                    {{ message.message_preview || message.message }}
                  </p>

                  <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100/80">
                    <span v-if="!message.is_read" class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Belum Dibaca
                    </span>
                    <span v-else class="text-[10px] text-gray-400 font-medium">Sudah dibaca</span>
                    
                    <span class="text-[11px] text-[#882f1d] font-semibold flex items-center gap-0.5">
                      Buka &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="border-t border-gray-200 p-3 flex items-center justify-between bg-gray-50">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="!pagination.has_prev"
            class="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-100 transition-colors"
          >
            ← Sebelumnya
          </button>
          <span class="text-xs text-gray-600 font-medium">
            Hal {{ pagination.current_page }} / {{ pagination.total_pages }}
          </span>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="!pagination.has_next"
            class="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-100 transition-colors"
          >
            Selanjutnya →
          </button>
        </div>
      </div>

      <!-- Detail: Message Detail (Full width di HP saat pesan dipilih, berdampingan di Desktop) -->
      <div
        :class="!selectedMessage ? 'hidden lg:flex' : 'flex'"
        class="flex-1 flex-col bg-white"
      >
        <!-- Mobile Back Button Header (Hanya muncul di Layar HP) -->
        <div v-if="selectedMessage" class="lg:hidden p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <button
            @click="closeDetail"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#882f1d] hover:text-[#6b2416] px-3 py-1.5 rounded-lg bg-white border border-amber-300 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>← Kembali ke Daftar Pesan</span>
          </button>
          <span class="text-[11px] text-gray-600 font-medium">Detail Pesan</span>
        </div>

        <!-- Desktop Empty State -->
        <div v-if="!selectedMessage" class="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
          <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4 border border-gray-100">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <p class="text-base font-bold text-gray-700">Pilih pesan untuk melihat detail</p>
          <p class="text-xs text-gray-500 mt-1">Klik salah satu pesan di daftar sebelah kiri untuk membaca isinya.</p>
        </div>

        <!-- Selected Message Detail View -->
        <div v-else class="flex-1 flex flex-col">
          <!-- Message Header -->
          <div class="border-b border-gray-200 p-4 sm:p-6 bg-gray-50/50">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div class="flex items-start gap-3.5">
                <div class="w-12 h-12 rounded-full bg-[#882f1d] flex items-center justify-center text-white text-base font-bold shrink-0 shadow-sm">
                  {{ selectedMessage?.name?.charAt(0).toUpperCase() || '?' }}
                </div>
                <div class="min-w-0">
                  <h2 class="text-base sm:text-lg font-bold text-gray-900 leading-snug">{{ selectedMessage?.name || 'N/A' }}</h2>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
                    <a :href="`mailto:${selectedMessage?.email}`" class="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      {{ selectedMessage?.email || 'N/A' }}
                    </a>
                    <a v-if="selectedMessage?.phone" :href="`tel:${selectedMessage?.phone}`" class="text-gray-700 hover:underline flex items-center gap-1">
                      <span>📞</span> {{ selectedMessage.phone }}
                    </a>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-1.5">
                    Dikirim pada {{ selectedMessage?.created_at ? formatDate(selectedMessage.created_at) : 'N/A' }}
                  </p>
                </div>
              </div>

              <!-- Delete Button -->
              <button
                @click="deleteMessage(selectedMessage.id)"
                class="self-end sm:self-start inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                title="Hapus pesan"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Hapus</span>
              </button>
            </div>
          </div>

          <!-- Message Body -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            <div class="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200/80 shadow-inner">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Isi Pesan:</p>
              <p class="text-sm sm:text-base text-gray-900 whitespace-pre-wrap leading-relaxed">{{ selectedMessage?.message || 'Tidak ada pesan' }}</p>
            </div>
          </div>

          <!-- Message Actions Footer -->
          <div class="border-t border-gray-200 p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-2.5">
            <a
              :href="`mailto:${selectedMessage?.email || ''}?subject=Re: Pesan Kontak Gereja St. Paulus`"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#882f1d] hover:bg-[#6b2416] text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>Balas via Email</span>
            </a>
            
            <button
              @click="closeDetail"
              class="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-4 right-4 px-5 py-2.5 rounded-lg shadow-lg text-white font-medium text-sm z-50',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        ]"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const messages = ref([])
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_messages: 0,
  has_next: false,
  has_prev: false
})
const selectedMessage = ref(null)
const loading = ref(false)
const filterStatus = ref('all')
const toast = ref({ show: false, message: '', type: 'success' })

// Toast notification function
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Computed properties
const unreadCount = computed(() => {
  return messages.value.filter(m => !m.is_read).length
})

const filteredMessages = computed(() => {
  if (filterStatus.value === 'unread') {
    return messages.value.filter(m => !m.is_read)
  }
  return messages.value
})

// Fetch messages
const fetchMessages = async (page = 1) => {
  loading.value = true
  try {
    const response = await $fetch(`/api/admin/contact-messages?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    messages.value = response.messages
    pagination.value = response.pagination
  } catch (error) {
    if (error.statusCode === 401) {
      sessionStorage.removeItem('admin_token')
      navigateTo('/admin/login')
      return
    }
    console.error('Error fetching messages:', error)
  } finally {
    loading.value = false
  }
}

const scrollToTop = () => {
  nextTick(() => {
    const target = document.getElementById('messages-container')
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

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchMessages(page)
    selectedMessage.value = null
    scrollToTop()
  }
}

// View message detail
const viewMessage = async (id) => {
  try {
    const message = await $fetch(`/api/admin/contact-messages/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    
    console.log('Received message:', message)
    
    // Ensure message has all required properties
    if (message && message.id) {
      selectedMessage.value = message
      
      // Update is_read status in the list
      const messageIndex = messages.value.findIndex(m => m.id === id)
      if (messageIndex !== -1) {
        messages.value[messageIndex].is_read = true
      }
    } else {
      showToast('Data pesan tidak lengkap', 'error')
      console.error('Invalid message structure:', message)
    }
  } catch (error) {
    if (error.statusCode === 401) {
      sessionStorage.removeItem('admin_token')
      navigateTo('/admin/login')
      return
    }
    console.error('Error fetching message detail:', error)
    showToast('Gagal memuat detail pesan', 'error')
  }
}

// Delete message
const deleteMessage = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
    // Optimistic update: Remove from UI immediately
    const index = messages.value.findIndex(m => m.id === id)
    const deletedMessage = index !== -1 ? { ...messages.value[index] } : null
    
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
    
    // Close detail if deleted message is currently selected
    if (selectedMessage.value?.id === id) {
      selectedMessage.value = null
    }
    
    try {
      await $fetch(`/api/admin/contact-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
        }
      })
      
      showToast('Pesan berhasil dihapus')
      
      // Update pagination count
      pagination.value.total_messages--
    } catch (error) {
      if (error.statusCode === 401) {
        sessionStorage.removeItem('admin_token')
        navigateTo('/admin/login')
        return
      }
      console.error('Error deleting message:', error)
      showToast('Gagal menghapus pesan', 'error')
      
      // Rollback: Re-add the deleted message
      if (deletedMessage && index !== -1) {
        messages.value.splice(index, 0, deletedMessage)
      }
    }
  }
}

// Close detail
const closeDetail = () => {
  selectedMessage.value = null
}

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format short date for sidebar
const formatShortDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Kemarin'
  } else if (diffDays < 7) {
    return `${diffDays} hari lalu`
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }
}

// Watch filter status
watch(filterStatus, () => {
  selectedMessage.value = null
})

// Initial load
onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
