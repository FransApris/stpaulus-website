const fs = require('fs');

const path = 'pages/admin/users.vue';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `          <div v-else class="overflow-x-auto">
            <table class="min-w-full table-auto">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('username')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Username
                      <span class="text-xs">
                        <span v-if="sortField === 'username' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'username' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('full_name')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Nama
                      <span class="text-xs">
                        <span v-if="sortField === 'full_name' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'full_name' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left font-semibold">Email</th>
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('user_category')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Kategori
                      <span class="text-xs">
                        <span v-if="sortField === 'user_category' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'user_category' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left">
                    <button 
                      @click="sortBy('role_id')" 
                      class="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Tipe
                      <span class="text-xs">
                        <span v-if="sortField === 'role_id' && sortOrder === 'asc'">▲</span>
                        <span v-else-if="sortField === 'role_id' && sortOrder === 'desc'">▼</span>
                        <span v-else class="text-gray-400">⇅</span>
                      </span>
                    </button>
                  </th>
                  <th class="px-4 py-2 text-left font-semibold">Status</th>
                  <th class="px-4 py-2 text-left font-semibold">Kuota</th>
                  <th class="px-4 py-2 text-left font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" class="border-t hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-2">{{ user.username }}</td>
                  <td class="px-4 py-2">{{ user.full_name }}</td>
                  <td class="px-4 py-2">{{ user.email }}</td>
                  <td class="px-4 py-2">
                    <span v-if="user.user_category" class="text-sm">{{ user.user_category }}</span>
                    <span v-else class="text-gray-400 text-sm italic">-</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                      :class="getRoleBadge(user).class"
                    >
                      {{ getRoleBadge(user).icon }} {{ getRoleBadge(user).label }}
                    </span>
                  </td>
                  <td class="px-4 py-2">
                    <span v-if="!user.account_status || user.account_status === 'ACTIVE'" class="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Aktif</span>
                    <span v-else-if="user.account_status === 'PENDING'" class="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Menunggu</span>
                    <span v-else class="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Nonaktif</span>
                  </td>
                  <!-- Kuota column: show override badge if set -->
                  <td class="px-4 py-2">
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
                  <td class="px-4 py-2">
                    <!-- Approve / Reject buttons for PENDING users (only sekretariat & super admin) -->
                    <template v-if="user.account_status === 'PENDING' && (isSuperAdmin || isAdminSekretariat)">
                      <button @click="approveUser(user)" title="Setujui" class="text-green-600 hover:text-green-800 mr-1 p-1 inline-flex items-center text-xs font-medium border border-green-400 rounded hover:bg-green-50">
                        ✓ Setujui
                      </button>
                      <button @click="rejectUser(user)" title="Tolak" class="text-red-600 hover:text-red-800 mr-2 p-1 inline-flex items-center text-xs font-medium border border-red-400 rounded hover:bg-red-50">
                        ✗ Tolak
                      </button>
                    </template>
                    <button @click="editUser(user)" title="Edit" class="text-blue-600 hover:text-blue-800 mr-2 p-1 inline-flex items-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <!-- Quota Override Button: Super Admin + booking users only -->
                    <button
                      v-if="isSuperAdmin && (!user.role_id || user.role_id === 0)"
                      @click="openQuotaModal(user)"
                      title="Atur Kuota Individual"
                      class="text-purple-600 hover:text-purple-800 mr-2 p-1 inline-flex items-center"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </button>
                    <button v-if="isSuperAdmin" @click="openResetPasswordModal(user)" title="Reset Password" class="text-orange-600 hover:text-orange-800 mr-2 p-1 inline-flex items-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                      </svg>
                    </button>
                    <button
                      v-if="user.role_name !== 'super_admin' && user.id !== currentUser?.id"
                      @click="deleteUser(user)"
                      :disabled="deletingId === user.id"
                      title="Hapus"
                      class="text-red-600 hover:text-red-800 p-1 inline-flex items-center disabled:opacity-40 disabled:cursor-not-allowed">
                      <svg v-if="deletingId !== user.id" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>`;

const newStr = `          <div v-else>
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
                    <!-- Approve / Reject buttons for PENDING users -->
                    <template v-if="user.account_status === 'PENDING' && (isSuperAdmin || isAdminSekretariat)">
                      <button @click="approveUser(user)" title="Setujui" class="text-green-600 hover:text-green-800 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        ✓
                      </button>
                      <button @click="rejectUser(user)" title="Tolak" class="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        ✗
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
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-semibold">Email</th>
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
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-semibold">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-semibold">Kuota</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-semibold">Aksi</th>
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
            </div>`;

if (content.includes(targetStr.trim().slice(0, 100))) {
  console.log("String found!");
  // I will just replace using substring logic to be safe against newlines
  const startIndex = content.indexOf('<div v-else class="overflow-x-auto">');
  const endIndex = content.indexOf('</div>', content.indexOf('</table>', startIndex)) + 6;
  
  if (startIndex !== -1 && endIndex > startIndex) {
    const finalContent = content.slice(0, startIndex) + newStr + content.slice(endIndex);
    fs.writeFileSync(path, finalContent, 'utf8');
    console.log("Successfully replaced table structure!");
  } else {
    console.log("Could not find start/end bounds.");
  }
} else {
  // Try fallback string replacing whitespace
  const startIndex = content.indexOf('<div v-else class="overflow-x-auto">');
  if (startIndex !== -1) {
    const endIndex = content.indexOf('</div>', content.indexOf('</table>', startIndex)) + 6;
    const finalContent = content.slice(0, startIndex) + newStr + content.slice(endIndex);
    fs.writeFileSync(path, finalContent, 'utf8');
    console.log("Successfully replaced table structure via fallback!");
  } else {
    console.log("Target string NOT FOUND at all.");
  }
}
