<template>
  <div class="space-y-6">
    <!-- Add User Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-2">Tambah Pengguna Baru</h2>
      <form @submit.prevent="createUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Tipe User Selection -->
        <div class="md:col-span-2 mb-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipe Pengguna *</label>
          <div class="grid grid-cols-2 gap-4">
            <div 
              @click="newUser.role = 'user'" 
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                newUser.role === 'user' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-300'
              ]"
            >
              <div class="flex items-center">
                <input 
                  type="radio" 
                  v-model="newUser.role" 
                  value="user" 
                  class="mr-3"
                  required
                />
                <div>
                  <div class="font-semibold text-gray-900">👤 User (Booking)</div>
                  <div class="text-xs text-gray-600 mt-1">
                    Untuk pemesanan ruangan saja.<br/>
                    TIDAK dapat akses panel admin.
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              v-if="isSuperAdmin"
              @click="newUser.role = 'admin'" 
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                newUser.role === 'admin' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              ]"
            >
              <div class="flex items-center">
                <input 
                  type="radio" 
                  v-model="newUser.role" 
                  value="admin" 
                  class="mr-3"
                />
                <div>
                  <div class="font-semibold text-gray-900">🔐 Admin</div>
                  <div class="text-xs text-gray-600 mt-1">
                    Dapat akses panel admin.<br/>
                    TIDAK dapat booking ruangan.
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              v-if="!isSuperAdmin"
              class="p-4 border-2 border-gray-200 bg-gray-100 rounded-lg opacity-60"
            >
              <div class="flex items-center">
                <div>
                  <div class="font-semibold text-gray-500">🔐 Admin</div>
                  <div class="text-xs text-gray-500 mt-1">
                    Hanya Super Admin yang dapat<br/>
                    membuat akun admin.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Opsi Kontributor Berita: Terlihat oleh Admin Komsos DAN Super Admin -->
          <div
            v-if="isSuperAdmin || isAdminKomsos"
            @click="newUser.role = 'kontributor_berita'"
            :class="[
              'mt-3 p-4 border-2 rounded-lg cursor-pointer transition-all',
              newUser.role === 'kontributor_berita'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-red-300'
            ]"
          >
            <div class="flex items-center">
              <input
                type="radio"
                v-model="newUser.role"
                value="kontributor_berita"
                class="mr-3"
              />
              <div>
                <div class="font-semibold text-gray-900">Kontributor Berita</div>
                <div class="text-xs text-gray-600 mt-1">
                  Bisa menulis berita/kegiatan paroki via Portal Kontributor.<br/>
                  Tulisan harus disetujui Admin Komsos sebelum tayang di website.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Role Selection (only if admin type selected) -->
        <div v-if="newUser.role === 'admin' && isSuperAdmin" class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Role Admin *</label>
          <select v-model="newUser.adminRole" class="border p-2 rounded w-full" required>
            <option value="">Pilih Role Admin</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin_komsos">Admin Komsos</option>
            <option value="admin_sekretariat">Admin Sekretariat</option>
          </select>
        </div>

        <input v-model="newUser.username" type="text" placeholder="Username *" class="border p-2 rounded" required />
        <input v-model="newUser.email" type="email" placeholder="Email *" class="border p-2 rounded" required />
        <input v-model="newUser.password" type="password" placeholder="Password *" class="border p-2 rounded" required minlength="6" />
        <input v-model="newUser.full_name" type="text" placeholder="Nama Lengkap *" class="border p-2 rounded" required />
        <input v-model="newUser.contact_phone" type="text" placeholder="No. Telepon" class="border p-2 rounded" />
        <select v-model="newUser.user_category" class="border p-2 rounded" required>
          <option value="">Pilih Kategori *</option>
          <option v-for="category in userCategories.filter(c => c.is_active)" :key="category.id" :value="category.name">
            {{ category.display_name }}
          </option>
        </select>
        <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 md:col-span-2">
          {{ loading ? 'Membuat...' : (newUser.role === 'admin' ? '🔐 Buat Admin' : newUser.role === 'kontributor_berita' ? '✍️ Buat Kontributor' : '👤 Buat User') }}
        </button>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>        <!-- Users List -->
        <div class="bg-white p-6 rounded-lg shadow">
          <!-- Pending approval banner -->
          <div v-if="pendingCount > 0 && activeTab !== 'pending'" class="mb-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-center justify-between">
            <div class="flex items-center gap-2 text-yellow-800">
              <span>⏳</span>
              <span class="font-medium text-sm">{{ pendingCount }} akun menunggu persetujuan</span>
            </div>
            <button @click="activeTab = 'pending'" class="text-yellow-700 text-sm font-semibold hover:underline">
              Lihat →
            </button>
          </div>

          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Daftar Pengguna</h2>
            <div class="flex items-center gap-4">
              <div class="text-xs text-gray-500">
                Total: {{ totalItems }} pengguna
              </div>
              <div class="text-sm text-gray-600">
                <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded mr-2">
                  🔐 Admin
                </span>
                <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">
                  👤 User Booking
                </span>
              </div>
              <!-- Tombol hapus semua user booking (super admin only) -->
              <button
                v-if="isSuperAdmin"
                @click="showClearModal = true; clearConfirmText = ''"
                class="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
              >
                🗑️ Hapus Semua User Booking
              </button>
            </div>
          </div>

          <!-- Tab navigation + Search bar -->
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <!-- Tab pills -->
            <div class="flex gap-2 border-b border-gray-200 flex-shrink-0">
              <button
                @click="activeTab = 'active'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors',
                  activeTab === 'active' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:text-gray-800'
                ]"
              >Aktif</button>
              <button
                @click="activeTab = 'pending'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors flex items-center gap-1',
                  activeTab === 'pending' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' : 'border-transparent text-gray-600 hover:text-gray-800'
                ]"
              >
                ⏳ Menunggu
                <span v-if="pendingCount > 0" class="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ pendingCount }}
                </span>
              </button>
              <button
                @click="activeTab = 'inactive'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors',
                  activeTab === 'inactive' ? 'border-red-500 text-red-700 bg-red-50' : 'border-transparent text-gray-600 hover:text-gray-800'
                ]"
              >Nonaktif</button>
              <button
                @click="activeTab = 'all'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors',
                  activeTab === 'all' ? 'border-gray-500 text-gray-700 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-800'
                ]"
              >Semua</button>
            </div>

            <!-- Search bar -->
            <div class="relative w-full sm:w-72">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="user-search"
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama, username, email…"
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <!-- Clear button -->
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                title="Hapus pencarian"
                type="button"
              >
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="users.length === 0" class="text-gray-500">Belum ada pengguna.</div>

          <!-- Empty state: data ada tapi hasil pencarian/filter kosong -->
          <div v-else-if="sortedUsers.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg class="h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
            </svg>
            <p class="text-sm font-medium">Tidak ada hasil ditemukan</p>
            <p class="text-xs mt-1">Coba ubah kata kunci atau filter tab yang aktif</p>
            <button v-if="searchQuery" @click="searchQuery = ''" class="mt-3 text-xs text-blue-600 hover:underline" type="button">
              Hapus pencarian
            </button>
          </div>

          <div v-else>
            <!-- Mobile/Tablet Card View -->
            <div class="xl:hidden space-y-4 mb-4">
              <div v-for="user in paginatedUsers" :key="'card-'+user.id" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div class="flex-1 pr-4">
                    <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ user.full_name }}</h3>
                    <div class="text-sm text-gray-500 mt-1">{{ user.email }}</div>
                    <div class="text-xs text-gray-400 mt-1 font-mono">@{{ user.username }}</div>
                  </div>
                  <div class="flex flex-col space-y-2">
                    <template v-if="user.account_status === 'PENDING' && (isSuperAdmin || isAdminSekretariat)">
                      <button @click="approveUser(user)" title="Setujui" class="text-green-600 hover:text-green-800 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                      <button @click="rejectUser(user)" title="Tolak" class="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </template>
                    <button @click="editUser(user)" title="Edit" class="text-blue-600 hover:text-blue-900 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button v-if="isSuperAdmin && (!user.role_id || user.role_id === 0)" @click="openQuotaModal(user)" title="Atur Kuota Individual" class="text-purple-600 hover:text-purple-800 p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    </button>
                    <button v-if="isSuperAdmin" @click="openResetPasswordModal(user)" title="Reset Password" class="text-orange-600 hover:text-orange-900 p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                    </button>
                    <button v-if="user.role_name !== 'super_admin' && user.id !== currentUser?.id" @click="deleteUser(user)" :disabled="deletingId === user.id" title="Hapus" class="text-red-600 hover:text-red-900 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      <svg v-if="deletingId !== user.id" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Kategori</p>
                    <p class="text-gray-900 font-medium">{{ user.user_category || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                    <span v-if="!user.account_status || user.account_status === 'ACTIVE'" class="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Aktif</span>
                    <span v-else-if="user.account_status === 'PENDING'" class="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Menunggu</span>
                    <span v-else class="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Nonaktif</span>
                  </div>
                  <div class="col-span-2 bg-gray-50 rounded-lg p-3">
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tipe Role</p>
                    <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" :class="getRoleBadge(user).class">
                      {{ getRoleBadge(user).icon }} {{ getRoleBadge(user).label }}
                    </span>
                  </div>
                  <div class="col-span-2 bg-gray-50 rounded-lg p-3">
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Kuota</p>
                    <template v-if="!user.role_id || user.role_id === 0">
                      <span v-if="user.quota_is_unlimited_override === true || user.quota_is_unlimited_override === 1"
                        class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"
                        title="Override: Unlimited">♾️ Unlimited*</span>
                      <span v-else-if="user.monthly_quota_override !== null && user.monthly_quota_override !== undefined"
                        class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                        :title="'Override: ' + user.monthly_quota_override + '/bln'">📅 {{ user.monthly_quota_override }}*</span>
                      <span v-else class="text-xs text-gray-400">–</span>
                    </template>
                    <span v-else class="text-xs text-gray-300">–</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden xl:block w-full overflow-x-auto rounded-lg border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button @click="sortBy('username')" class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold">
                        Username
                        <span class="text-xs">
                          <span v-if="sortField === 'username' && sortOrder === 'asc'">▲</span>
                          <span v-else-if="sortField === 'username' && sortOrder === 'desc'">▼</span>
                          <span v-else class="text-gray-400">⇅</span>
                        </span>
                      </button>
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button @click="sortBy('full_name')" class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold">
                        Nama
                        <span class="text-xs">
                          <span v-if="sortField === 'full_name' && sortOrder === 'asc'">▲</span>
                          <span v-else-if="sortField === 'full_name' && sortOrder === 'desc'">▼</span>
                          <span v-else class="text-gray-400">⇅</span>
                        </span>
                      </button>
                    </th>
                    <th class="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button @click="sortBy('user_category')" class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold">
                        Kategori
                        <span class="text-xs">
                          <span v-if="sortField === 'user_category' && sortOrder === 'asc'">▲</span>
                          <span v-else-if="sortField === 'user_category' && sortOrder === 'desc'">▼</span>
                          <span v-else class="text-gray-400">⇅</span>
                        </span>
                      </button>
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button @click="sortBy('role_id')" class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold">
                        Tipe
                        <span class="text-xs">
                          <span v-if="sortField === 'role_id' && sortOrder === 'asc'">▲</span>
                          <span v-else-if="sortField === 'role_id' && sortOrder === 'desc'">▼</span>
                          <span v-else class="text-gray-400">⇅</span>
                        </span>
                      </button>
                    </th>
                    <th class="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</th>
                    <th class="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">Kuota</th>
                    <th class="px-4 py-3 text-right text-xs text-gray-500 uppercase tracking-wider font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.full_name }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span v-if="user.user_category" class="text-sm">{{ user.user_category }}</span>
                      <span v-else class="text-gray-400 text-sm italic">-</span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                        :class="getRoleBadge(user).class"
                      >
                        {{ getRoleBadge(user).icon }} {{ getRoleBadge(user).label }}
                      </span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span v-if="!user.account_status || user.account_status === 'ACTIVE'" class="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Aktif</span>
                      <span v-else-if="user.account_status === 'PENDING'" class="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Menunggu</span>
                      <span v-else class="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Nonaktif</span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <template v-if="!user.role_id || user.role_id === 0">
                        <span v-if="user.quota_is_unlimited_override === true || user.quota_is_unlimited_override === 1"
                          class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"
                          title="Override: Unlimited">♾️ Unlimited*</span>
                        <span v-else-if="user.monthly_quota_override !== null && user.monthly_quota_override !== undefined"
                          class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                          :title="'Override: ' + user.monthly_quota_override + '/bln'">📅 {{ user.monthly_quota_override }}*</span>
                        <span v-else class="text-xs text-gray-400">–</span>
                      </template>
                      <span v-else class="text-xs text-gray-300">–</span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <template v-if="user.account_status === 'PENDING' && (isSuperAdmin || isAdminSekretariat)">
                        <button @click="approveUser(user)" title="Setujui" class="text-green-600 hover:text-green-800 mr-1 p-1.5 inline-flex items-center text-xs font-medium border border-green-400 rounded hover:bg-green-50">
                          ✓ Setujui
                        </button>
                        <button @click="rejectUser(user)" title="Tolak" class="text-red-600 hover:text-red-800 mr-2 p-1.5 inline-flex items-center text-xs font-medium border border-red-400 rounded hover:bg-red-50">
                          ✗ Tolak
                        </button>
                      </template>
                      <button @click="editUser(user)" title="Edit" class="text-blue-600 hover:text-blue-800 mr-2 p-1.5 inline-flex items-center bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button v-if="isSuperAdmin && (!user.role_id || user.role_id === 0)" @click="openQuotaModal(user)" title="Atur Kuota Individual" class="text-purple-600 hover:text-purple-800 mr-2 p-1.5 inline-flex items-center bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                      </button>
                      <button v-if="isSuperAdmin" @click="openResetPasswordModal(user)" title="Reset Password" class="text-orange-600 hover:text-orange-800 mr-2 p-1.5 inline-flex items-center bg-orange-50 rounded hover:bg-orange-100 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                      </button>
                      <button v-if="user.role_name !== 'super_admin' && user.id !== currentUser?.id" @click="deleteUser(user)" :disabled="deletingId === user.id" title="Hapus" class="text-red-600 hover:text-red-800 p-1.5 inline-flex items-center bg-red-50 rounded hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <svg v-if="deletingId !== user.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between border-t pt-4">
            <p class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }}</p>
            <div class="flex items-center gap-2">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                Sebelumnya
              </button>
              <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                class="px-3 py-1 rounded border text-sm"
                :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'">
                {{ page }}
              </button>
              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        <!-- Reset Password Modal -->
        <div v-if="showResetPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Reset Password Pengguna</h3>
            <form @submit.prevent="resetPassword">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                <input
                  v-model="selectedUser.username"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  readonly
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  v-model="resetPasswordData.newPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Masukkan password baru"
                  required
                  minlength="6"
                />
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  v-model="resetPasswordData.confirmPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Konfirmasi password baru"
                  required
                  minlength="6"
                />
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeResetPasswordModal"
                  class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="resetPasswordLoading || resetPasswordData.newPassword !== resetPasswordData.confirmPassword || resetPasswordData.newPassword.length < 6"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ resetPasswordLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </form>
            <p v-if="resetPasswordError" class="mt-2 text-red-600 text-sm">{{ resetPasswordError }}</p>
            <p v-if="resetPasswordMessage" class="mt-2 text-green-600 text-sm">{{ resetPasswordMessage }}</p>
          </div>
        </div>

        <!-- Quota Override Modal (Super Admin only) -->
        <div v-if="showQuotaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-1">⚙️ Override Kuota Individual</h3>
            <p class="text-sm text-gray-500 mb-4">User: <strong>{{ quotaTargetUser?.full_name }}</strong> ({{ quotaTargetUser?.user_category || '–' }})</p>

            <div class="space-y-4">
              <!-- Unlimited toggle -->
              <div class="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <input
                  id="quota-unlimited"
                  v-model="quotaForm.quota_is_unlimited_override"
                  type="checkbox"
                  class="mt-1 w-4 h-4 accent-purple-600"
                />
                <div>
                  <label for="quota-unlimited" class="font-semibold text-purple-800 cursor-pointer">♾️ Unlimited untuk user ini</label>
                  <p class="text-xs text-purple-600 mt-0.5">Abaikan batas kuota bulanan khusus untuk user ini</p>
                </div>
              </div>

              <!-- Monthly quota input -->
              <div :class="quotaForm.quota_is_unlimited_override ? 'opacity-40 pointer-events-none' : ''"
                   class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label class="block text-sm font-semibold text-blue-800 mb-1">📅 Batas Khusus (pemesanan/bulan)</label>
                <input
                  v-model.number="quotaForm.monthly_quota_override"
                  type="number"
                  min="1"
                  max="999"
                  class="border border-blue-300 p-2 rounded w-full text-sm"
                  :disabled="quotaForm.quota_is_unlimited_override"
                  placeholder="Kosongkan untuk mengikuti default kategori"
                />
                <p class="text-xs text-blue-600 mt-1">Kosongkan untuk reset ke default kategori</p>
              </div>

              <!-- Info box -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                <p>* = override individu aktif. Kosongkan semua field dan simpan untuk reset ke default kategori.</p>
              </div>
            </div>

            <p v-if="quotaModalError" class="mt-3 text-red-600 text-sm">{{ quotaModalError }}</p>
            <p v-if="quotaModalMsg" class="mt-3 text-green-600 text-sm">{{ quotaModalMsg }}</p>

            <div class="flex justify-end gap-3 mt-5">
              <button
                type="button"
                @click="showQuotaModal = false; quotaModalError = ''; quotaModalMsg = ''"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >Batal</button>
              <button
                @click="saveQuotaOverride"
                :disabled="quotaModalLoading"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >{{ quotaModalLoading ? 'Menyimpan...' : 'Simpan' }}</button>
            </div>
          </div>
        </div>

        <!-- Modal Konfirmasi Hapus Semua Booking Users -->
        <div v-if="showClearModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div class="text-center mb-4">
              <div class="text-4xl mb-2">⚠️</div>
              <h3 class="text-lg font-bold text-red-700">Hapus Semua User Booking</h3>
            </div>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-800 space-y-1">
              <p class="font-semibold">Tindakan ini tidak dapat dibatalkan!</p>
              <p>Semua akun user booking (bukan admin) akan dihapus permanen.</p>
              <p>Semua data pemesanan milik mereka juga akan terhapus.</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Ketik <strong>HAPUS</strong> untuk konfirmasi:
              </label>
              <input
                v-model="clearConfirmText"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Ketik HAPUS"
              />
            </div>
            <div class="flex gap-3">
              <button
                @click="showClearModal = false; clearConfirmText = ''"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                @click="clearAllBookingUsers"
                :disabled="clearConfirmText !== 'HAPUS' || clearLoading"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
              >
                {{ clearLoading ? 'Menghapus...' : 'Hapus Sekarang' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Edit User Modal -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Edit Pengguna</h3>
            <form @submit.prevent="updateUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="editingUser.username" type="text" placeholder="Username" class="border p-2 rounded" required />
              <input v-model="editingUser.email" type="email" placeholder="Email (opsional)" class="border p-2 rounded" />
              <input v-model="editingUser.full_name" type="text" placeholder="Nama Lengkap" class="border p-2 rounded" required />
              <input v-model="editingUser.contact_phone" type="text" placeholder="No. Telepon" class="border p-2 rounded" />
              <select v-model="editingUser.user_category" @change="onCategoryChange" class="border p-2 rounded">
                <option value="">Pilih Kategori</option>
                <option v-for="category in userCategories.filter(c => c.is_active)" :key="category.id" :value="category.name">
                  {{ category.display_name }}
                </option>
              </select>
              
              <!-- Dropdown Unit Name (Cascading) -->
              <div class="md:col-span-2">
                <!-- WILAYAH ONLY -->
                <template v-if="showWilayahDropdown">
                  <select v-model="selectedWilayah" @change="onWilayahOnlyChange" class="border p-2 rounded w-full" required>
                    <option value="">-- Pilih Wilayah --</option>
                    <option v-for="w in wilayahList" :key="w" :value="w">{{ w }}</option>
                  </select>
                </template>

                <!-- LINGKUNGAN (Wilayah -> Lingkungan) -->
                <template v-else-if="showLingkunganDropdown">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select v-model="selectedWilayah" @change="onWilayahChange" class="border p-2 rounded w-full" :disabled="lingkunganLoading" required>
                      <option value="">{{ lingkunganLoading ? 'Memuat data...' : '-- Pilih Wilayah --' }}</option>
                      <option v-for="w in wilayahList" :key="w" :value="w">{{ w }}</option>
                    </select>
                    <select v-if="selectedWilayah" v-model="selectedLingkungan" @change="onLingkunganChange" class="border p-2 rounded w-full" required>
                      <option value="">-- Pilih Lingkungan --</option>
                      <option v-for="ling in lingkunganByWilayah" :key="ling.id" :value="ling.nama">{{ ling.nama }}</option>
                    </select>
                  </div>
                </template>

                <!-- SEKSI (Bidang -> Seksi) -->
                <template v-else-if="showSeksiDropdown">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select v-model="selectedBidang" @change="onBidangChange" class="border p-2 rounded w-full" :disabled="seksiLoading" required>
                      <option value="">{{ seksiLoading ? 'Memuat data...' : '-- Pilih Bidang --' }}</option>
                      <option v-for="b in bidangList" :key="b" :value="b">{{ b }}</option>
                    </select>
                    <select v-if="selectedBidang" v-model="selectedSeksi" @change="onSeksiChange" class="border p-2 rounded w-full" required>
                      <option value="">-- Pilih Seksi --</option>
                      <option v-for="s in seksiByBidang" :key="s.id" :value="s.nama">{{ s.nama }}</option>
                    </select>
                  </div>
                </template>

                <!-- Text bebas untuk kategori lainnya -->
                <template v-else-if="editingUser.user_category">
                  <input v-model="editingUser.unit_name" type="text" placeholder="Nama Unit / Kelompok (opsional)" class="border p-2 rounded w-full" />
                </template>
              </div>

              <!-- Role / Tipe Pengguna -->
              <div class="md:col-span-2 p-3 bg-gray-50 border border-gray-200 rounded">
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipe Pengguna (Role)</label>
                
                <!-- If Super Admin or Admin Komsos, allow changing role -->
                <select v-if="isSuperAdmin || isAdminKomsos" v-model="editingUser.role" class="border p-2 rounded w-full bg-white">
                  <option value="user">👤 User (Booking)</option>
                  <option value="kontributor_berita">✍️ Kontributor Berita (Saja)</option>
                  <option value="user_kontributor">✍️+👤 User & Kontributor Berita</option>
                  <!-- Only Super Admin can assign admin roles -->
                  <option v-if="isSuperAdmin" value="admin_komsos">🔐 Admin Komsos</option>
                  <option v-if="isSuperAdmin" value="admin_sekretariat">🔐 Admin Sekretariat</option>
                  <option v-if="isSuperAdmin" value="super_admin">👑 Super Admin</option>
                </select>
                
                <!-- Fallback static display for others -->
                <div v-else>
                  <p class="text-sm text-gray-700">
                    <span v-if="editingUser.role === 'kontributor_berita'" class="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">✍️ Kontributor Berita</span>
                    <span v-else-if="editingUser.role_id && editingUser.role_id > 0" class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">🔐 Admin ({{ editingUser.role }})</span>
                    <span v-else class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">👤 User (Booking)</span>
                  </p>
                  <p class="text-xs text-gray-500 mt-2">ℹ️ Anda tidak memiliki izin untuk mengubah role pengguna ini.</p>
                </div>
              </div>
              
              <div class="md:col-span-2 flex justify-end space-x-2">
                <button type="button" @click="closeEditModal" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" :disabled="editLoading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                  {{ editLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </form>
            <p v-if="editMessage" class="mt-2 text-green-600">{{ editMessage }}</p>
            <p v-if="editError" class="mt-2 text-red-600">{{ editError }}</p>
          </div>
        </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const users = useState('admin-users', () => [])
const userCategories = useState('admin-users-categories', () => [])
const newUser = ref({
  username: '',
  email: '',
  password: '',
  full_name: '',
  contact_phone: '',
  user_category: '',
  role: 'user',
  adminRole: ''
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Tab filter for pending approvals
const activeTab = ref('active') // 'active' | 'pending' | 'inactive' | 'all'
const pendingCount = ref(0)

// Sorting state
const sortField = ref('username')
const sortOrder = ref('asc')

// Reset password modal
const showResetPasswordModal = ref(false)
const selectedUser = ref({})
const resetPasswordData = ref({
  newPassword: '',
  confirmPassword: ''
})
const resetPasswordLoading = ref(false)
const resetPasswordMessage = ref('')
const resetPasswordError = ref('')

// Edit modal
const showEditModal = ref(false)
const editingUser = ref({
  id: '',
  username: '',
  email: '',
  full_name: '',
  contact_phone: '',
  user_category: '',
  unit_name: '',
  role: 'user'
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')

// ── Cascading Dropdown State & Helpers (Edit Modal) ───────────
const categoryContains = (catName, keyword) => (catName || '').toLowerCase().includes(keyword.toLowerCase())
const WILAYAH_PAROKI = [
    'Bartolomeus', 'Fransiskus Asisi', 'Maria Regina',
    'Petrus', 'Simon', 'Theresia', 'Vincentius a Paulo', 'Yakobus',
]
const wilayahList = WILAYAH_PAROKI

const allLingkungan = ref([])
const lingkunganLoading = ref(false)
const lingkunganLoaded = ref(false)

const allSeksi = ref([])
const seksiLoading = ref(false)
const seksiLoaded = ref(false)

const selectedWilayah = ref('')
const selectedLingkungan = ref('')
const selectedBidang = ref('')
const selectedSeksi = ref('')

const showWilayahDropdown = computed(() =>
    categoryContains(editingUser.value.user_category, 'wilayah') &&
    !categoryContains(editingUser.value.user_category, 'lingkungan')
)
const showLingkunganDropdown = computed(() => categoryContains(editingUser.value.user_category, 'lingkungan'))
const showSeksiDropdown = computed(() => categoryContains(editingUser.value.user_category, 'seksi'))
const needsLingkunganData = computed(() => showWilayahDropdown.value || showLingkunganDropdown.value)

const lingkunganByWilayah = computed(() => {
    if (!selectedWilayah.value || allLingkungan.value.length === 0) return []
    const target = selectedWilayah.value.toLowerCase()
    const byRelasi = allLingkungan.value.filter(l => {
        const w = ((l.wilayah_display || l.wilayah_nama || l.wilayah_text || '')).trim().toLowerCase()
        return w === target
    })
    if (byRelasi.length > 0) return byRelasi.sort((a, b) => (a.no || 0) - (b.no || 0))
    const byNama = allLingkungan.value.filter(l => (l.nama || '').toLowerCase().includes(target))
    return byNama.sort((a, b) => (a.no || 0) - (b.no || 0))
})

const bidangList = computed(() => {
    const seen = new Set()
    return allSeksi.value
        .map(s => (s.bidang || '').trim())
        .filter(b => b && !seen.has(b) && seen.add(b))
        .sort((a, b) => a.localeCompare(b, 'id'))
})

const seksiByBidang = computed(() => {
    if (!selectedBidang.value) return []
    const seenNama = new Set()
    return allSeksi.value
        .filter(s => (s.bidang || '').trim() === selectedBidang.value)
        .filter(s => {
            const key = (s.nama || '').trim().toLowerCase()
            if (seenNama.has(key)) return false
            seenNama.add(key)
            return true
        })
        .sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id'))
})

const loadLingkungan = async () => {
    if (lingkunganLoaded.value) return
    lingkunganLoading.value = true
    try {
        const res = await $fetch('/api/lingkungan')
        allLingkungan.value = Array.isArray(res) ? res : (res?.data || [])
        lingkunganLoaded.value = true
    } catch (err) { console.error('Gagal load lingkungan', err) } 
    finally { lingkunganLoading.value = false }
}

const loadSeksi = async () => {
    if (seksiLoaded.value) return
    seksiLoading.value = true
    try {
        const rawList = await $fetch('/api/seksi')
        allSeksi.value = Array.isArray(rawList) ? rawList : []
        seksiLoaded.value = true
    } catch (err) { console.error('Gagal load seksi', err) } 
    finally { seksiLoading.value = false }
}

const onCategoryChange = async () => {
    selectedWilayah.value = ''
    selectedLingkungan.value = ''
    selectedBidang.value = ''
    selectedSeksi.value = ''
    editingUser.value.unit_name = ''
    
    if (needsLingkunganData.value) await loadLingkungan()
    if (showSeksiDropdown.value) await loadSeksi()
}

const onWilayahOnlyChange = () => { editingUser.value.unit_name = selectedWilayah.value }
const onWilayahChange = () => { selectedLingkungan.value = ''; editingUser.value.unit_name = '' }
const onLingkunganChange = () => { editingUser.value.unit_name = selectedLingkungan.value }
const onBidangChange = () => { selectedSeksi.value = ''; editingUser.value.unit_name = '' }
const onSeksiChange = () => { editingUser.value.unit_name = selectedSeksi.value }

// Current user info
const currentUser = useState('admin-users-current-user', () => null)

// Pagination state
const currentPage = useState('admin-users-page', () => 1)
const pageLimit = 10

// Track which user is currently being deleted (prevents double-click)
const deletingId = ref(null)

// Check if current user is super admin
const isSuperAdmin = computed(() => {
  return currentUser.value?.role_name === 'super_admin'
})

// Check if current user is admin komsos
const isAdminKomsos = computed(() => {
  return currentUser.value?.role_name === 'admin_komsos'
})

// Check if current user is admin sekretariat (can approve/reject)
const isAdminSekretariat = computed(() => {
  return currentUser.value?.role_name === 'admin_sekretariat'
})

/**
 * Kembalikan badge config (label, icon, class Tailwind) berdasarkan role user.
 * Prioritas: role_name (RBAC, dari JOIN roles) → role (kolom legacy) → role_id fallback.
 */
const getRoleBadge = (user) => {
  // Gunakan role_name dari RBAC join, fallback ke legacy role field
  const roleName = (user.role_name || user.role || '').toLowerCase()

  if (roleName === 'super_admin') {
    return { label: 'Super Admin', icon: '👑', class: 'bg-purple-100 text-purple-800' }
  }
  if (roleName === 'admin_komsos') {
    return { label: 'Admin Komsos', icon: '📣', class: 'bg-indigo-100 text-indigo-800' }
  }
  if (roleName === 'admin_sekretariat') {
    return { label: 'Admin Sekretariat', icon: '📋', class: 'bg-blue-100 text-blue-800' }
  }
  if (roleName === 'kontributor_berita') {
    return { label: 'Kontributor', icon: '✍️', class: 'bg-red-100 text-red-800' }
  }
  if (roleName === 'user_kontributor') {
    return { label: 'User & Kontributor', icon: '✍️', class: 'bg-orange-100 text-orange-800' }
  }
  // Fallback: jika role_id > 0 tapi nama role tidak dikenal (role baru di masa depan)
  if (user.role_id && Number(user.role_id) > 0) {
    return { label: user.role_display_name || user.role || 'Admin', icon: '🔐', class: 'bg-gray-100 text-gray-800' }
  }
  // Default: user biasa
  return { label: 'User', icon: '👤', class: 'bg-green-100 text-green-800' }
}

// Clear all booking users
const showClearModal = ref(false)

// ── Search query untuk filter tabel pengguna ──────────────────────────────────
const searchQuery = ref('')

// ── Quota Override Modal (Super Admin) ────────────────────────────────────────
const showQuotaModal      = ref(false)
const quotaTargetUser     = ref(null)
const quotaModalLoading   = ref(false)
const quotaModalError     = ref('')
const quotaModalMsg       = ref('')
const quotaForm           = ref({
  monthly_quota_override       : null,
  quota_is_unlimited_override  : false
})

const openQuotaModal = (user) => {
  quotaTargetUser.value  = user
  quotaModalError.value  = ''
  quotaModalMsg.value    = ''
  quotaForm.value = {
    monthly_quota_override      : user.monthly_quota_override ?? null,
    quota_is_unlimited_override : Boolean(user.quota_is_unlimited_override)
  }
  showQuotaModal.value = true
}

const saveQuotaOverride = async () => {
  quotaModalLoading.value = true
  quotaModalError.value   = ''
  quotaModalMsg.value     = ''
  try {
    const token = sessionStorage.getItem('admin_access_token')
    const payload = {
      // Kirim nilai boolean eksplisit — jangan gunakan `false || null` karena
      // false || null = null yang diinterpretasikan backend sebagai "reset ke default"
      quota_is_unlimited_override: quotaForm.value.quota_is_unlimited_override === true ? true : false,
      // Jika unlimited aktif, paksa monthly_quota_override = null
      monthly_quota_override     : quotaForm.value.quota_is_unlimited_override
        ? null
        : (quotaForm.value.monthly_quota_override || null)
    }
    const result = await $fetch(`/api/admin/users/${quotaTargetUser.value.id}/quota`, {
      method : 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body   : payload
    })
    // Update local state dari response server (bukan dari payload)
    // agar tipe data konsisten dengan apa yang tersimpan di DB
    const idx = users.value.findIndex(u => u.id === quotaTargetUser.value.id)
    if (idx !== -1 && result?.user) {
      users.value[idx] = {
        ...users.value[idx],
        monthly_quota_override      : result.user.monthly_quota_override,
        quota_is_unlimited_override : result.user.quota_is_unlimited_override
      }
    }
    quotaModalMsg.value = 'Kuota berhasil disimpan'
    setTimeout(() => { showQuotaModal.value = false }, 1200)
  } catch (err) {
    quotaModalError.value = err?.data?.statusMessage || 'Gagal menyimpan kuota'
  } finally {
    quotaModalLoading.value = false
  }
}
const clearLoading = ref(false)
const clearConfirmText = ref('')

const clearAllBookingUsers = async () => {
  if (clearConfirmText.value !== 'HAPUS') return

  clearLoading.value = true
  try {
    const result = await $fetch('/api/admin/users/clear-booking-users', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}` }
    })

    showClearModal.value = false
    clearConfirmText.value = ''
    alert(result.message)
    await loadUsers()
  } catch (err) {
    alert(`Gagal: ${err.data?.statusMessage || 'Terjadi kesalahan'}`)
  } finally {
    clearLoading.value = false
  }
}

// Sorted + filtered users computed property
const sortedUsers = computed(() => {
  if (!users.value || users.value.length === 0) return []

  // Filter by tab
  let filtered = [...users.value]
  if (activeTab.value === 'pending') {
    filtered = filtered.filter(u => u.account_status === 'PENDING')
  } else if (activeTab.value === 'inactive') {
    filtered = filtered.filter(u => u.account_status === 'INACTIVE')
  } else if (activeTab.value === 'active') {
    filtered = filtered.filter(u => !u.account_status || u.account_status === 'ACTIVE')
  }
  // 'all' — no filter

  // ── Filter by search query (nama, username, email) — case-insensitive ────────
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    filtered = filtered.filter(u =>
      (u.full_name  || '').toLowerCase().includes(q) ||
      (u.username   || '').toLowerCase().includes(q) ||
      (u.email      || '').toLowerCase().includes(q)
    )
  }

  const sorted = [...filtered].sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]
    
    // Special handling for role_id (Tipe)
    if (sortField.value === 'role_id') {
      // Convert role_id to sortable value: NULL/0 = 0 (User), > 0 = 1 (Admin)
      aValue = (aValue && aValue > 0) ? 1 : 0
      bValue = (bValue && bValue > 0) ? 1 : 0
    } else {
      // Handle null/undefined values for other fields
      if (!aValue) aValue = ''
      if (!bValue) bValue = ''
      
      // Convert to lowercase for case-insensitive sorting
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
    }
    
    // Compare
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
})

const totalItems = computed(() => sortedUsers.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return sortedUsers.value.slice(start, start + pageLimit)
})
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let page = start; page <= end; page++) pages.push(page)
  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Sort function
const sortBy = (field) => {
  if (sortField.value === field) {
    // Toggle order if same field
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New field, default to ascending
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Load current user info
const loadCurrentUser = async () => {
  try {
    currentUser.value = await $fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load current user', err)
  }
}

// Load user categories
const loadUserCategories = async () => {
  try {
    userCategories.value = await $fetch('/api/admin/user-categories', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    // If 403 Forbidden, set empty categories for restricted users
    if (err.statusCode === 403) {
      userCategories.value = []
      return
    }
    console.error('Failed to load user categories', err)
  }
}

// Load users
const loadUsers = async () => {
  try {
    const response = await $fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    
    // Handle both array response (old) and object response (new)
    users.value = Array.isArray(response) ? response : (response.users || [])
    pendingCount.value = Array.isArray(response) ? 0 : (response.pendingCount || 0)
    
    console.log('[Users Page] Loaded', users.value.length, 'users,', pendingCount.value, 'pending')
  } catch (err) {
    console.error('[Users Page] Failed to load users:', err)
    users.value = []
  }
}

onMounted(async () => {
  await loadCurrentUser()
  await loadUserCategories()
  await loadUsers()
})

watch([sortField, sortOrder, activeTab, searchQuery], () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

const createUser = async () => {
  // Optimistic update: Clone form data before clearing
  const userData = { ...newUser.value }
  
  // Determine the correct role to send to backend
  let roleToSend = 'user'
  if (userData.role === 'admin' && userData.adminRole) {
    roleToSend = userData.adminRole // super_admin, admin_komsos, or admin_sekretariat
  } else if (userData.role === 'kontributor_berita' || userData.role === 'user_kontributor') {
    roleToSend = userData.role
  }
  
  // Prepare clean data for API
  const cleanUserData = {
    username: userData.username || '',
    email: userData.email || '',
    password: userData.password || '',
    full_name: userData.full_name || '',
    contact_phone: userData.contact_phone || '',
    user_category: userData.user_category || '',
    role: roleToSend || 'user'
  }

  console.log('[Create User Frontend] Sending data:', cleanUserData)
  
  loading.value = true
  message.value = ''
  error.value = ''
  
  // Clear form immediately for instant UX
  newUser.value = {
    username: '',
    email: '',
    password: '',
    full_name: '',
    contact_phone: '',
    user_category: '',
    role: 'user',
    adminRole: ''
  }
  
  try {
    const result = await $fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: cleanUserData
    })
    
    console.log('[Create User] Server response:', result)
    console.log('[Create User] User data:', result.user)
    console.log('[Create User] User role_id:', result.user?.role_id)
    
    // Add new user to list instantly
    users.value.unshift(result.user || result)
    
    setTimeout(() => {
      message.value = roleToSend === 'user' ? 'User berhasil dibuat' : 'Admin berhasil dibuat'
    }, 100)
  } catch (err) {
    console.error('[Create User] Error:', err)
    error.value = err.data?.statusMessage || 'Gagal membuat pengguna'
    // Rollback: Re-fetch to ensure consistency
    await loadUsers()
  } finally {
    loading.value = false
  }
}

const editUser = async (user) => {
  // Populate edit form with user data
  editingUser.value = { 
    ...user,
    // Use role_name from RBAC if available, fallback to legacy role field
    role: user.role_name || user.role
  }

  // Pre-fill dropdown selections
  selectedWilayah.value = ''
  selectedLingkungan.value = ''
  selectedBidang.value = ''
  selectedSeksi.value = ''

  if (categoryContains(user.user_category, 'wilayah') && !categoryContains(user.user_category, 'lingkungan')) {
    selectedWilayah.value = user.unit_name || ''
    await loadLingkungan()
  } else if (categoryContains(user.user_category, 'lingkungan')) {
    selectedLingkungan.value = user.unit_name || ''
    await loadLingkungan()
    const foundLing = allLingkungan.value.find(l => l.nama === user.unit_name)
    if (foundLing) {
      selectedWilayah.value = (foundLing.wilayah_display || foundLing.wilayah_nama || foundLing.wilayah_text || '').trim()
    } else if (user.unit_name) {
      const matchedW = WILAYAH_PAROKI.find(w => user.unit_name.toLowerCase().includes(w.toLowerCase()))
      if (matchedW) selectedWilayah.value = matchedW
    }
  } else if (categoryContains(user.user_category, 'seksi')) {
    selectedSeksi.value = user.unit_name || ''
    await loadSeksi()
    const foundSeksi = allSeksi.value.find(s => s.nama === user.unit_name)
    if (foundSeksi) {
      selectedBidang.value = (foundSeksi.bidang || '').trim()
    }
  }

  showEditModal.value = true
}


const deleteUser = async (user, force = false) => {
  // Guard: prevent double-click
  if (deletingId.value === user.id) return

  if (!force) {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.username}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }
  }

  deletingId.value = user.id

  try {
    const url = force
      ? `/api/admin/users/${user.id}?force=true`
      : `/api/admin/users/${user.id}`
    await $fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    // Remove from UI only after success
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) users.value.splice(index, 1)
  } catch (err) {
    if ((err?.status === 409 || err?.statusCode === 409) && !force) {
      const count = err?.data?.data?.activeBookingCount || err?.data?.activeBookingCount || 'beberapa'
      deletingId.value = null
      const proceed = confirm(
        `⚠️ Peringatan: Pengguna "${user.username}" memiliki ${count} pemesanan aktif (PENDING/APPROVED).\n\n` +
        `Jika Anda melanjutkan, semua pemesanan aktif tersebut akan dibatalkan secara otomatis dan pengguna akan dihapus.\n\n` +
        `Lanjutkan penghapusan?`
      )
      if (proceed) {
        await deleteUser(user, true)
      }
      return
    }
    const msg = err?.data?.statusMessage || err?.statusMessage || 'Terjadi kesalahan'
    alert(`Gagal menghapus pengguna "${user.username}": ${msg}`)
  } finally {
    deletingId.value = null
  }
}

// Reset password functions
const openResetPasswordModal = (user) => {
  selectedUser.value = user
  resetPasswordData.value = {
    newPassword: '',
    confirmPassword: ''
  }
  resetPasswordMessage.value = ''
  resetPasswordError.value = ''
  showResetPasswordModal.value = true
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  selectedUser.value = {}
  resetPasswordData.value = {
    newPassword: '',
    confirmPassword: ''
  }
}

const resetPassword = async () => {
  if (resetPasswordData.value.newPassword !== resetPasswordData.value.confirmPassword) {
    resetPasswordError.value = 'Password dan konfirmasi password tidak cocok'
    return
  }

  resetPasswordLoading.value = true
  resetPasswordMessage.value = ''
  resetPasswordError.value = ''

  try {
    const response = await $fetch(`/api/admin/users/${selectedUser.value.id}/reset-password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: {
        newPassword: resetPasswordData.value.newPassword
      }
    })

    resetPasswordMessage.value = response.message
    setTimeout(() => {
      closeResetPasswordModal()
    }, 2000)
  } catch (err) {
    resetPasswordError.value = err.data?.statusMessage || 'Gagal me-reset password'
  } finally {
    resetPasswordLoading.value = false
  }
}

const updateUser = async () => {
  // Optimistic update: Clone form data and close modal
  const userData = { ...editingUser.value }
  const originalUserData = users.value.find(u => u.id === userData.id)
  
  // Clean up data: remove fields that are not editable or should not be sent to API
  const cleanUserData = {
    username: userData.username,
    email: userData.email,
    full_name: userData.full_name,
    contact_phone: userData.contact_phone,
    user_category: userData.user_category,
    unit_name: userData.unit_name,
    role: userData.role
  }
  
  // Gunakan role_name dari RBAC jika ada agar tidak kirim nilai legacy 'admin'
  
  editLoading.value = true
  editMessage.value = ''
  editError.value = ''
  
  // Close modal immediately for instant UX
  showEditModal.value = false
  
  try {
    const result = await $fetch(`/api/admin/users/${userData.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: cleanUserData
    })
    
    // Update user in list instantly
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1) {
      users.value[index] = result.user || result
    }
    
    setTimeout(() => {
      editMessage.value = 'Pengguna berhasil diperbarui'
      setTimeout(() => { editMessage.value = '' }, 3000)
    }, 100)
  } catch (err) {
    console.error('[Update User] Error:', err)
    
    // Show error via alert since modal is closed
    setTimeout(() => {
      alert(`Gagal memperbarui pengguna: ${err.data?.statusMessage || 'Terjadi kesalahan'}`)
    }, 100)
    
    // Rollback: Restore original user data
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1 && originalUserData) {
      users.value[index] = originalUserData
    } else {
      // If can't rollback, re-fetch to ensure consistency
      await loadUsers()
    }
  } finally {
    editLoading.value = false
  }
}

const approveUser = async (user) => {
  if (!confirm(`Setujui pendaftaran akun "${user.username}" (${user.full_name})?`)) return

  // Optimistic: update status immediately
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) users.value[index] = { ...users.value[index], account_status: 'ACTIVE' }
  pendingCount.value = Math.max(0, pendingCount.value - 1)

  try {
    await $fetch(`/api/admin/users/${user.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}` },
      body: { action: 'approve' }
    })
    alert(`Akun ${user.username} berhasil disetujui!`)
  } catch (err) {
    // Rollback
    if (index !== -1) users.value[index] = { ...users.value[index], account_status: 'PENDING' }
    pendingCount.value++
    alert(`Gagal menyetujui: ${err.data?.statusMessage || 'Terjadi kesalahan'}`)
  }
}

const rejectUser = async (user) => {
  if (!confirm(`Tolak pendaftaran akun "${user.username}" (${user.full_name})? Pengguna tidak akan bisa login.`)) return

  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) users.value[index] = { ...users.value[index], account_status: 'INACTIVE' }
  pendingCount.value = Math.max(0, pendingCount.value - 1)

  try {
    await $fetch(`/api/admin/users/${user.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}` },
      body: { action: 'reject' }
    })
    alert(`Pendaftaran ${user.username} berhasil ditolak.`)
  } catch (err) {
    if (index !== -1) users.value[index] = { ...users.value[index], account_status: 'PENDING' }
    pendingCount.value++
    alert(`Gagal menolak: ${err.data?.statusMessage || 'Terjadi kesalahan'}`)
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {
    id: '',
    username: '',
    email: '',
    full_name: '',
    contact_phone: '',
    user_category: '',
    unit_name: '',
    role: 'user'
  }
  editMessage.value = ''
  editError.value = ''
}
</script>
