<template>
  <!-- Navbar Content with shrink effect on scroll -->
  <nav :class="[
    'px-4 sm:px-[5%] md:px-[7%] lg:px-[10%] flex items-center justify-between overflow-visible relative z-[99999] transition-all duration-300',
    scrolled ? 'py-1.5' : 'py-2'
  ]">
    <NuxtLink to="/" class="flex items-center transition-all duration-300">
      <GerejaLogo :show-text="false" :logo-size="scrolled ? 'h-9' : 'h-10'"
        :title-size="scrolled ? 'text-xs' : 'text-sm'" :title-classes="'text-white'"
        :custom-classes="'hover:opacity-90'"
        :class="['transition-all duration-300', scrolled ? 'scale-95' : 'scale-100']" />
    </NuxtLink>

    <!-- Desktop Links -->
    <ul class="hidden md:flex flex-nowrap items-center space-x-1 lg:space-x-2 xl:space-x-3">
      <li v-for="link in navLinks" :key="link.path || link.title" class="relative flex-shrink-0">
        <template v-if="link.dropdown">
          <!-- Dropdown Menu -->
          <button :ref="el => setDropdownButtonRef(el, link.title)" @click="toggleDropdown(link.title)"
            @mouseenter="showDropdown(link.title)" @mouseleave="hideDropdown(link.title)"
            @keydown.enter="toggleDropdown(link.title)" @keydown.space.prevent="toggleDropdown(link.title)"
            :aria-expanded="activeDropdown === link.title" :aria-haspopup="true" :class="[
              'font-barlow font-thin transition-all duration-300 py-1 focus:outline-none relative text-xs md:text-sm lg:text-base xl:text-lg uppercase tracking-tighter md:tracking-tight nav-link whitespace-nowrap',
              activeDropdown === link.title ? 'text-[#c58229]' : '',
              isDropdownActive(link) ? 'text-[#c58229] active' : 'text-white hover:text-[#c58229]'
            ]">
            {{ link.title }}
            <svg class="inline-block w-2.5 h-2.5 ml-0.5 transition-transform duration-300"
              :class="{ 'rotate-180': activeDropdown === link.title }" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <!-- Dropdown Items using Teleport -->
          <Teleport to="body">
            <transition name="dropdown">
              <div v-if="activeDropdown === link.title" @mouseenter="showDropdown(link.title)"
                @mouseleave="hideDropdown(link.title)" :style="getDropdownStyle(link.title)"
                class="fixed w-72 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                style="z-index: 999999 !important;">

                <!-- Breadcrumb Header -->
                <div class="px-4 py-3 bg-gradient-to-r from-[#882f1d] to-[#6b2416] border-b border-gray-200">
                  <div class="flex items-center gap-2 text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span class="text-xs font-semibold uppercase tracking-wider">{{ link.title }}</span>
                  </div>
                  <p class="text-xs text-white/80 mt-1">Pilih menu untuk informasi lebih lanjut</p>
                </div>

                <!-- Menu Items -->
                <div class="py-2">
                  <template v-for="(item, index) in link.items" :key="item.path">
                    <NuxtLink :to="item.path" @click="closeDropdown" :class="[
                      'flex items-start gap-3 px-4 py-3 text-gray-700 hover:bg-[#882f1d] hover:text-white transition-all duration-300 hover:pl-5 group',
                      route.path === item.path ? 'bg-[#882f1d]/10 text-[#882f1d] font-semibold border-l-4 border-[#882f1d]' : ''
                    ]">
                      <!-- SVG Icon with scale animation on hover -->
                      <svg class="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                        :class="route.path === item.path ? 'text-[#882f1d]' : 'text-gray-400 group-hover:text-white'"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          :d="iconPaths[item.icon]" />
                      </svg>
                      <!-- Text content -->
                      <div class="flex-1 min-w-0">
                        <div class="font-medium leading-tight">{{ item.title }}</div>
                        <div class="text-xs opacity-75 mt-0.5 leading-tight">{{ item.description }}</div>
                      </div>
                    </NuxtLink>
                    <!-- Garis pemisah dengan margin kiri-kanan -->
                    <div v-if="index < link.items.length - 1" class="mx-[20%] border-b border-gray-200 my-1"></div>
                  </template>
                </div>
              </div>
            </transition>
          </Teleport>
        </template>
        <template v-else>
          <!-- Regular Link -->
          <NuxtLink :to="link.path" :class="[
            'font-barlow font-thin transition-all duration-300 py-1 relative text-xs md:text-sm lg:text-base xl:text-lg uppercase tracking-tighter md:tracking-tight nav-link whitespace-nowrap',
            route.path === link.path ? 'text-[#c58229] active' : 'text-white hover:text-[#c58229]'
          ]">
            {{ link.title }}
          </NuxtLink>
        </template>
      </li>
    </ul>

    <!-- Desktop Search Bar with suggestions -->
    <div class="hidden xl:flex items-center gap-2 relative transition-all duration-300 flex-shrink-0">
      <input ref="searchInputRef" v-model="desktopSearchQuery" @input="handleDesktopSearch" @focus="handleSearchFocus"
        @blur="handleSearchBlur" type="text" placeholder="Cari..." :class="[
          'px-3 pl-9 text-sm bg-white/10 border border-[#c58229]/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#c58229] focus:border-transparent transition-all duration-300',
          scrolled ? 'w-32 xl:w-40 py-1.5' : 'w-36 xl:w-44 py-2'
        ]" />
      <svg :class="[
        'absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/70 transition-all duration-300',
        scrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'
      ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 20l-4.35-4.35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Search Icon untuk layar Medium & Large -->
    <button @click="$emit('openSearch')"
      class="hidden md:flex xl:hidden items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-all duration-300 flex-shrink-0"
      type="button">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 20l-4.35-4.35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <ClientOnly>
      <!-- User Menu (Desktop) - When Logged In -->
      <div v-if="isLoggedIn" class="relative" data-user-menu>
        <button ref="userButtonRef" @click="toggleUserDropdown" :class="[
          'flex items-center gap-1.5 px-2 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-all duration-300',
          scrolled ? 'text-sm' : 'text-base'
        ]" type="button" :title="`${user?.full_name || user?.username || 'User'} - ${getUserRole}`">
          <!-- Avatar -->
          <div :class="[
            'bg-gradient-to-br from-paulus-blue to-blue-700 rounded-full flex items-center justify-center text-white font-bold',
            scrolled ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
          ]">
            {{ getUserInitials }}
          </div>
          <!-- Dropdown Icon -->
          <svg :class="[
            'transition-transform duration-300',
            scrolled ? 'w-3 h-3' : 'w-4 h-4',
            { 'rotate-180': showUserDropdown }
          ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- User Dropdown Menu -->
        <Teleport to="body">
          <transition name="dropdown">
            <div v-if="showUserDropdown" :style="userDropdownPosition"
              class="fixed w-72 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
              style="z-index: 999999 !important;">
              <!-- User Info Header -->
              <div class="px-4 py-4 bg-gradient-to-br from-paulus-blue to-blue-700 text-white">
                <div class="flex items-center gap-3">
                  <div
                    class="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-base backdrop-blur-sm border border-white/30 flex-shrink-0">
                    {{ getUserInitials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-bold truncate text-sm">{{ user?.full_name || user?.username }}</div>
                    <div class="text-xs text-blue-100 truncate mt-0.5">🏷️ {{ user?.user_category || user?.unit_name || 'Umat Paroki' }}</div>
                  </div>
                </div>

                <!-- Live User Quota Badge in Dropdown -->
                <div v-if="userQuota" class="mt-3 bg-white/15 backdrop-blur-xs rounded-lg p-2 text-xs border border-white/20">
                  <div class="flex items-center justify-between gap-1">
                    <span class="opacity-90 font-medium text-[11px]">📊 Sisa Kuota:</span>
                    <span v-if="userQuota.is_unlimited" class="px-2 py-0.5 bg-purple-200/90 text-purple-900 rounded font-bold text-[10px]">
                      Tanpa Batas
                    </span>
                    <span v-else :class="userQuota.remaining > 0 ? 'bg-emerald-200/90 text-emerald-900' : 'bg-amber-200/90 text-amber-950'" class="px-2 py-0.5 rounded font-bold text-[10px]">
                      {{ userQuota.remaining }} / {{ userQuota.max_allowed }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Quick Access Menu -->
              <div class="py-1.5 divide-y divide-gray-100">
                <div class="py-1">
                  <!-- Profil Saya Modal Trigger -->
                  <button @click="showLoginModal = true; showUserDropdown = false"
                    class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group">
                    <div class="w-8 h-8 bg-blue-100 group-hover:bg-paulus-blue text-paulus-blue group-hover:text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-800 text-xs">Profil Akun Saya</div>
                      <div class="text-[11px] text-gray-500">Lihat rincian data & kuota</div>
                    </div>
                  </button>

                  <!-- Pemesanan Saya -->
                  <button @click="navigateToBookingSection('#pemesanan-saya')"
                    class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors text-left group">
                    <div class="w-8 h-8 bg-purple-100 group-hover:bg-purple-600 text-purple-600 group-hover:text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-800 text-xs">Riwayat Booking Saya</div>
                      <div class="text-[11px] text-purple-700 font-medium">Status & daftar transaksi sewa</div>
                    </div>
                  </button>

                  <!-- Pemesanan Ruang -->
                  <button @click="navigateToBookingSection('')"
                    class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left group">
                    <div class="w-8 h-8 bg-green-100 group-hover:bg-green-600 text-green-600 group-hover:text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-800 text-xs">Katalog & Pesan Ruang</div>
                      <div class="text-[11px] text-green-700 font-medium">Pilih fasilitas & buat sewa baru</div>
                    </div>
                  </button>

                  <!-- Kelola Kronik (Untuk Pengurus/DPP/Wilayah/Seksi) -->
                  <NuxtLink v-if="canAccessKronik" to="/kronik/manage" @click="showUserDropdown = false"
                    class="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors group">
                    <div class="w-8 h-8 bg-amber-100 group-hover:bg-amber-600 text-amber-700 group-hover:text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-800 text-xs">Kelola Kronik</div>
                      <div class="text-[11px] text-gray-500">Catatan peristiwa paroki</div>
                    </div>
                  </NuxtLink>
                </div>
              </div>

              <!-- Logout -->
              <div class="border-t border-gray-100 p-2 bg-gray-50/50">
                <button @click="handleLogout"
                  class="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Keluar / Logout</span>
                </button>
              </div>
            </div>
          </transition>
        </Teleport>
      </div>

      <!-- Login Button (Desktop) - When Not Logged In -->
      <button v-else @click="showLoginModal = true" :class="[
        'flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-medium transition-all duration-300 flex-shrink-0',
        scrolled ? 'text-xs' : 'text-sm'
      ]" type="button">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Login</span>
      </button>
    </ClientOnly>

    <!-- Search Suggestions Dropdown -->
    <Teleport to="body">
      <transition name="dropdown">
        <div v-if="showSearchSuggestions && searchResults.length > 0 && desktopSearchQuery.trim().length >= 2"
          :style="searchSuggestionsPosition"
          class="fixed bg-white rounded-xl shadow-2xl py-2 w-80 max-h-96 overflow-y-auto border border-gray-200"
          style="z-index: 999999 !important;" @mousedown.prevent>

          <!-- Header -->
          <div class="px-4 py-2 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hasil Pencarian
              </span>
              <span class="text-xs text-gray-400">
                {{ searchResults.length }} hasil
              </span>
            </div>
          </div>

          <!-- Results -->
          <div class="py-1">
            <NuxtLink v-for="(result, index) in searchResults.slice(0, 8)" :key="result.id"
              :to="getSearchResultPath(result)" @click="closeSearchSuggestions"
              class="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group">
              <div class="flex items-start gap-3">
                <!-- Type Icon -->
                <div class="flex-shrink-0 mt-0.5">
                  <span
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-[#882f1d] group-hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="result.type === 'article' || result.type === 'news'" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path v-else-if="result.type === 'agenda'" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z" />
                    </svg>
                  </span>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 truncate group-hover:text-[#882f1d]">
                    {{ result.title }}
                  </div>
                  <div class="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    <span class="capitalize">{{ getTypeName(result.type) }}</span>
                    <span v-if="result.created_at" class="text-gray-400">
                      • {{ formatDate(result.created_at) }}
                    </span>
                  </div>
                </div>

                <!-- Arrow -->
                <svg class="w-4 h-4 text-gray-400 group-hover:text-[#882f1d] transition-colors flex-shrink-0 mt-1"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </NuxtLink>
          </div>

          <!-- Footer - View All -->
          <div v-if="searchResults.length > 8" class="border-t border-gray-100 px-4 py-2">
            <NuxtLink :to="`/search?q=${encodeURIComponent(desktopSearchQuery)}`" @click="closeSearchSuggestions"
              class="text-sm text-[#882f1d] hover:text-[#6b2416] font-medium flex items-center justify-center gap-1">
              Lihat semua hasil ({{ searchResults.length }})
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </transition>
    </Teleport>
    <!-- Mobile Controls: Search + Hamburger (User Menu is handled by avatar dropdown) -->
    <div class="md:hidden flex items-center gap-1.5 relative z-[100]">
      <!-- Login Button (Mobile) - When Not Logged In -->
      <ClientOnly>
        <button v-if="!isLoggedIn" @click="showLoginModal = true"
          class="p-2 text-white hover:text-[#c58229] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none rounded"
          aria-label="Login" type="button">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </ClientOnly>

      <!-- Search Button (Mobile) -->
      <button @click="openMobileSearch" @keydown.enter="openMobileSearch" @keydown.space.prevent="openMobileSearch"
        class="p-2 text-white hover:text-[#c58229] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none rounded"
        aria-label="Search" type="button">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z" />
        </svg>
      </button>

      <!-- Mobile Menu (Hamburger) -->
      <button @click="toggleMobileMenu" @keydown.enter="toggleMobileMenu" @keydown.space.prevent="toggleMobileMenu"
        class="p-2 text-white hover:text-[#c58229] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none rounded"
        :aria-expanded="isMobileMenuOpen" aria-label="Toggle mobile menu" type="button">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <transition name="dropdown">
      <div v-show="isMobileMenuOpen" ref="mobileMenu"
        class="md:hidden absolute top-full left-0 right-0 bg-white border-2 border-[#882f1d] rounded-lg shadow-xl py-4 z-[99999] mt-2 max-h-[80vh] overflow-y-auto"
        style="z-index: 99999 !important;" @click.stop>

        <!-- User Info Section (Mobile) - When Logged In -->
        <ClientOnly>
          <div v-if="isLoggedIn" class="px-4 pb-4 mb-4 border-b border-gray-200">
            <div class="flex items-center gap-3 p-3 bg-gradient-to-br from-paulus-blue to-blue-700 rounded-lg text-white">
              <div
                class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {{ getUserInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold truncate text-base">{{ user?.full_name || user?.username }}</div>
                <div class="text-sm opacity-90 truncate">{{ user?.unit_name || user?.user_category || 'Umat Paroki' }}
                </div>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 mt-1">
                  {{ getUserRole }}
                </span>
              </div>
            </div>

            <!-- Quick Access (Mobile) -->
            <div class="mt-3 space-y-2">
              <NuxtLink v-if="canAccessKronik" to="/kronik/manage" @click="closeMobileMenu"
                class="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-base">
                <svg class="w-5 h-5 text-paulus-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="font-medium text-gray-800">Kelola Kronik</span>
              </NuxtLink>

              <NuxtLink to="/booking" @click="closeMobileMenu"
                class="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-base">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="font-medium text-gray-800">Pemesanan Ruang</span>
              </NuxtLink>
            </div>
          </div>
        </ClientOnly>

        <!-- Navigation Links -->
        <ul class="flex flex-col space-y-2 px-4">
          <li v-for="link in navLinks" :key="link.path || link.title">
            <template v-if="link.dropdown">
              <!-- Mobile Dropdown -->
              <div class="py-2">
                <button @click="toggleMobileDropdown(link.title)" type="button"
                  class="flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all duration-200 text-[#882f1d] hover:text-white hover:bg-[#882f1d] font-medium text-base focus:outline-none">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <!-- Icon -->
                    <svg v-if="link.icon" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                      <path :d="iconPaths[link.icon]" />
                    </svg>
                    <div class="flex-1 min-w-0 text-left">
                      <div>{{ link.title }}</div>
                      <div v-if="link.description" class="text-xs text-gray-500 mt-0.5 font-normal">{{ link.description
                        }}</div>
                    </div>
                  </div>
                  <svg class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': activeMobileDropdown === link.title }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <transition name="dropdown">
                  <div v-if="activeMobileDropdown === link.title" class="ml-4 mt-2 space-y-2">
                    <div v-for="item in link.items" :key="item.path">
                      <NuxtLink :to="item.path" @click="closeMobileMenuAndDropdown"
                        class="flex items-start gap-3 py-3 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group">
                        <!-- Icon -->
                        <svg
                          class="w-6 h-6 flex-shrink-0 text-[#882f1d] group-hover:text-[#c58229] transition-colors mt-0.5"
                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" viewBox="0 0 24 24">
                          <path :d="iconPaths[item.icon]" />
                        </svg>
                        <!-- Text Content -->
                        <div class="flex-1 min-w-0">
                          <div class="font-medium text-gray-900 group-hover:text-[#882f1d] transition-colors text-base">
                            {{ item.title }}
                          </div>
                          <div class="text-sm text-gray-500 mt-0.5 leading-tight">
                            {{ item.description }}
                          </div>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
            <template v-else>
              <!-- Mobile Regular Link -->
              <NuxtLink :to="link.path" @click="closeMobileMenu" @keydown.enter="closeMobileMenu"
                @keydown.space.prevent="closeMobileMenu"
                :class="`flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 font-medium text-base focus:outline-none ${route.path === link.path ? 'text-white bg-[#882f1d]' : 'text-[#882f1d] hover:text-white hover:bg-[#882f1d]'}`">
                <!-- Icon -->
                <svg v-if="link.icon" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path :d="iconPaths[link.icon]" />
                </svg>
                <div class="flex-1 min-w-0">
                  <div>{{ link.title }}</div>
                  <div v-if="link.description"
                    :class="`text-xs mt-0.5 font-normal ${route.path === link.path ? 'text-white/80' : 'text-gray-500'}`">
                    {{ link.description }}</div>
                </div>
              </NuxtLink>
            </template>
          </li>
        </ul>
      </div>
    </transition>

    <!-- Mobile Search Overlay -->
    <SearchOverlay :is-open="isMobileSearchOpen" @close="isMobileSearchOpen = false" />

    <!-- Login Modal -->
    <LoginModal v-model="showLoginModal" />
  </nav>
</template>

<script setup>
// Props
const props = defineProps({
  showHero: { type: Boolean, default: false }
})

// Composable
const route = useRoute()

// Local State
const isMobileMenuOpen = ref(false)
const mobileMenu = ref(null)
const scrolled = ref(false)
const dropdownButtonRefs = ref({})
const dropdownPositions = ref({})
const activeDropdown = ref(null)
const dropdownTimeout = ref(null)
const isNavigating = ref(false) // Flag to prevent race conditions during navigation
const activeMobileDropdown = ref(null)

// Search State
const desktopSearchQuery = ref('')
const isMobileSearchOpen = ref(false)
const showSearchSuggestions = ref(false)
const searchInputRef = ref(null)
const searchSuggestionsPosition = ref({ top: 0, left: 0 })
const { searchResults, isSearching, clearSearch, setSearchQuery, debouncedSearch } = useSearch()

// Auth State
const isLoggedIn = ref(false)
const user = ref(null)
const showUserDropdown = ref(false)
const userButtonRef = ref(null)
const userDropdownPosition = ref({ top: 0, left: 0 })
const showLoginModal = ref(false)

// Watch login modal close to refresh auth
watch(showLoginModal, (newVal) => {
  if (!newVal) {
    // Modal ditutup, cek apakah ada perubahan auth
    checkAuthStatus()
  }
})

// Nav Links
const navLinks = [
  { title: 'BERANDA', path: '/', icon: 'home', description: 'Halaman utama paroki' },
  {
    title: 'PROFIL PAROKI',
    icon: 'user-circle',
    description: 'Informasi tentang gereja',
    dropdown: true,
    items: [
      {
        title: 'Sejarah Paroki',
        path: '/sejarah',
        icon: 'book-open',
        description: 'Perjalanan sejarah paroki kami'
      },
      {
        title: 'Kronik Paroki',
        path: '/kronik',
        icon: 'document-text',
        description: 'Catatan kegiatan & peristiwa paroki'
      },
      {
        title: 'Teritorial Paroki',
        path: '/teritorial-paroki',
        icon: 'map',
        description: 'Wilayah dan batas paroki'
      },
      {
        title: 'Romo yang Bertugas',
        path: '/romo-bertugas',
        icon: 'users',
        description: 'Tim pastoral kami'
      },
      {
        title: 'BGKP Paroki',
        path: '/bgkp-paroki',
        icon: 'user-group',
        description: 'Badan Gereja Katolik Paroki'
      },
      {
        title: 'DPP Paroki',
        path: '/dpp-paroki',
        icon: 'users',
        description: 'Dewan Pastoral Paroki'
      },
      {
        title: 'Data Statistik Paroki',
        path: '/data-statistika-paroki',
        icon: 'chart-bar',
        description: 'Data dan statistik umat'
      }
    ]
  },
  {
    title: 'KONTEN',
    icon: 'collection',
    description: 'Berita, artikel, dan galeri',
    dropdown: true,
    items: [
      {
        title: 'Artikel',
        path: '/artikel',
        icon: 'pencil',
        description: 'Artikel rohani dan inspirasi'
      },
      {
        title: 'Berita',
        path: '/berita',
        icon: 'newspaper',
        description: 'Berita terkini paroki'
      },
      {
        title: 'Dokumen Paroki',
        path: '/dokumen-paroki',
        icon: 'document',
        description: 'Dokumen resmi dan surat'
      },
      {
        title: 'Galeri Foto',
        path: '/galeri',
        icon: 'photograph',
        description: 'Album foto kegiatan'
      }
    ]
  },
  {
    title: 'KEGIATAN & JADWAL',
    icon: 'calendar',
    description: 'Agenda dan jadwal misa',
    dropdown: true,
    items: [
      {
        title: 'Jadwal Misa',
        path: '/misa',
        icon: 'clock',
        description: 'Jadwal misa lengkap'
      },
      {
        title: 'Agenda Paroki',
        path: '/agenda',
        icon: 'calendar',
        description: 'Kegiatan dan acara'
      }
    ]
  },
  { title: 'PEMESANAN RUANGAN', path: '/booking', icon: 'office-building', description: 'Booking fasilitas gereja' },
  { title: 'KONTAK', path: '/kontak', icon: 'phone', description: 'Hubungi kami' }
]

// Icon SVG paths (Heroicons style)
const iconPaths = {
  'book-open': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'document-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'map': 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'pencil': 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  'newspaper': 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  'document': 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'photograph': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'user-group': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  'user-circle': 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'collection': 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  'office-building': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'phone': 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
}

// Methods
const toggleMobileMenu = () => {
  console.log('Toggle mobile menu clicked, current state:', isMobileMenuOpen.value)
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  console.log('New state:', isMobileMenuOpen.value)
}

const closeMobileMenu = () => {
  console.log('Closing mobile menu')
  isMobileMenuOpen.value = false
  activeMobileDropdown.value = null
}

const closeMobileMenuAndDropdown = () => {
  isMobileMenuOpen.value = false
  activeMobileDropdown.value = null
}

// Dropdown button ref management
const setDropdownButtonRef = (el, title) => {
  if (el) {
    dropdownButtonRefs.value[title] = el
    updateDropdownPosition(title)
  }
}

const updateDropdownPosition = (title) => {
  const button = dropdownButtonRefs.value[title]
  if (button) {
    const rect = button.getBoundingClientRect()
    dropdownPositions.value[title] = {
      top: rect.bottom + 8,
      left: rect.left
    }
  }
}

const getDropdownStyle = (title) => {
  const pos = dropdownPositions.value[title]
  if (!pos) return {}
  return {
    top: `${pos.top}px`,
    left: `${pos.left}px`
  }
}

const toggleDropdown = (title) => {
  if (activeDropdown.value === title) {
    activeDropdown.value = null
  } else {
    updateDropdownPosition(title)
    activeDropdown.value = title
  }
}

const showDropdown = (title) => {
  // Don't reopen dropdown if we're navigating
  if (isNavigating.value) return

  if (dropdownTimeout.value) {
    clearTimeout(dropdownTimeout.value)
  }
  updateDropdownPosition(title)
  activeDropdown.value = title
}

const hideDropdown = (title) => {
  // Don't interfere if we're navigating
  if (isNavigating.value) return

  dropdownTimeout.value = setTimeout(() => {
    if (activeDropdown.value === title && !isNavigating.value) {
      activeDropdown.value = null
    }
  }, 150)
}

const closeDropdown = () => {
  // Set navigating flag and force close immediately
  isNavigating.value = true

  // Clear any pending timeout to ensure immediate close
  if (dropdownTimeout.value) {
    clearTimeout(dropdownTimeout.value)
    dropdownTimeout.value = null
  }
  activeDropdown.value = null

  // Reset navigating flag after a short delay
  setTimeout(() => {
    isNavigating.value = false
  }, 100)
}

const toggleMobileDropdown = (title) => {
  if (activeMobileDropdown.value === title) {
    activeMobileDropdown.value = null
  } else {
    activeMobileDropdown.value = title
  }
}

// Search Methods
const handleDesktopSearch = () => {
  const query = desktopSearchQuery.value.trim()

  // Show suggestions when typing (minimum 2 characters)
  if (query.length >= 2) {
    // Trigger search using the composable
    setSearchQuery(query)
    showSearchSuggestions.value = true
    updateSearchSuggestionsPosition()
  } else {
    showSearchSuggestions.value = false
  }
}

const handleSearchFocus = () => {
  if (desktopSearchQuery.value.trim().length >= 2 && searchResults.value.length > 0) {
    showSearchSuggestions.value = true
    updateSearchSuggestionsPosition()
  }
}

const handleSearchBlur = () => {
  // Delay to allow click on suggestions
  setTimeout(() => {
    showSearchSuggestions.value = false
  }, 200)
}

const closeSearchSuggestions = () => {
  showSearchSuggestions.value = false
  desktopSearchQuery.value = ''
}

const updateSearchSuggestionsPosition = () => {
  if (searchInputRef.value) {
    const rect = searchInputRef.value.getBoundingClientRect()
    const dropdownWidth = 320 // w-80 = 320px
    const viewportWidth = window.innerWidth

    // Calculate left position, ensuring dropdown doesn't go off-screen
    let leftPosition = rect.left

    // If dropdown would overflow right edge, align it to the right of search input
    if (leftPosition + dropdownWidth > viewportWidth - 20) {
      leftPosition = rect.right - dropdownWidth
    }

    // Ensure minimum 20px from left edge
    leftPosition = Math.max(20, leftPosition)

    searchSuggestionsPosition.value = {
      top: `${rect.bottom + 8}px`,
      left: `${leftPosition}px`
    }
  }
}

const getSearchResultPath = (result) => {
  const typeMap = {
    'article': '/artikel',
    'news': '/berita',
    'agenda': '/agenda'
  }
  return `${typeMap[result.type] || '/search'}/${result.slug || result.id}`
}

const getTypeName = (type) => {
  const names = {
    'article': 'Artikel',
    'news': 'Berita',
    'agenda': 'Agenda'
  }
  return names[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const openMobileSearch = () => {
  // Emit event to open mobile search overlay
  // This will be handled by the parent component or global state
  isMobileSearchOpen.value = true
}

// Scroll handler for sticky navbar shrink effect
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
  // Close search suggestions on scroll
  if (showSearchSuggestions.value) {
    showSearchSuggestions.value = false
  }
}

// Auth Methods
const userQuota = ref(null)

const loadNavbarUserQuota = async () => {
  if (!process.client) return
  const token = localStorage.getItem('auth_token')
  if (!token) return
  try {
    const data = await $fetch('/api/bookings/my-quota', {
      headers: { Authorization: `Bearer ${token}` }
    })
    userQuota.value = data
  } catch (err) {}
}

const checkAuthStatus = async () => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const response = await $fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        user.value = response
        isLoggedIn.value = true
        loadNavbarUserQuota()
      } catch (error) {
        console.error('[Navbar] Auth check failed:', error)
        localStorage.removeItem('auth_token')
        isLoggedIn.value = false
        user.value = null
        userQuota.value = null
      }
    }
  }
}

const getUserInitials = computed(() => {
  if (!user.value) return '?'
  const name = user.value.full_name || user.value.username || ''
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const getUserRole = computed(() => {
  if (!user.value) return 'User'
  const category = (user.value.user_category || '').toLowerCase()
  const unitName = (user.value.unit_name || '').toLowerCase()

  if (unitName.includes('ketua')) return 'Ketua'
  if (category === 'parish_council' || category === 'categorical_group' ||
    category === 'region' || category === 'community' || category.includes('dpp') || category.includes('seksi') || category.includes('komsos')) return 'Pengurus'
  return 'User'
})

const canAccessKronik = computed(() => {
  if (!user.value) return false
  const category = (user.value.user_category || '').toLowerCase()
  const unitName = (user.value.unit_name || '').toLowerCase()
  const validCategories = [
    'parish_council',
    'categorical_group',
    'region',
    'community',
    'dpp',
    'bgkp',
    'wilayah',
    'lingkungan',
    'seksi',
    'komsos',
    'komunitas',
    'kategorial'
  ]
  return validCategories.some(cat => category.includes(cat)) || unitName.length > 0
})

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
  if (showUserDropdown.value) {
    updateUserDropdownPosition()
    loadNavbarUserQuota()
  }
}

const navigateToBookingSection = async (sectionHash = '') => {
  showUserDropdown.value = false
  if (!process.client) return

  const targetId = sectionHash === '#pemesanan-saya' ? 'pemesanan-saya' : 'katalog-ruangan'

  const doScroll = () => {
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (route.path === '/booking') {
    // Delay 50ms agar dropdown unmount dengan bersih sebelum scroll dipicu
    setTimeout(doScroll, 50)
  } else {
    await navigateTo(`/booking${sectionHash}`)
    setTimeout(doScroll, 450)
  }
}

const updateUserDropdownPosition = () => {
  if (userButtonRef.value) {
    const rect = userButtonRef.value.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const dropdownWidth = Math.min(288, viewportWidth - 24) // 288px (w-72) or viewport - 24px

    // Default right alignment to user button right edge
    let leftPosition = rect.right - dropdownWidth

    // If overflowing right edge of screen, align to right margin
    if (leftPosition + dropdownWidth > viewportWidth - 12) {
      leftPosition = viewportWidth - dropdownWidth - 12
    }

    // Clamp left edge so it never goes off the left screen edge (< 12px)
    if (leftPosition < 12) {
      leftPosition = 12
    }

    userDropdownPosition.value = {
      top: `${rect.bottom + 8}px`,
      left: `${leftPosition}px`,
      maxWidth: `calc(100vw - 24px)`
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  isLoggedIn.value = false
  user.value = null
  showUserDropdown.value = false
  navigateTo('/')
}

// Event listeners for interactivity
onMounted(() => {
  checkAuthStatus()
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('scroll', updateAllDropdownPositions)
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateAllDropdownPositions)
  window.addEventListener('resize', updateSearchSuggestionsPosition)

  // Otomatis buka modal profil / login saat URL mengandung ?login=required
  if (route.query.login === 'required' || route.query.login === 'true') {
    showLoginModal.value = true
  }
})

watch(() => route.query.login, (val) => {
  if (val === 'required' || val === 'true') {
    showLoginModal.value = true
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('scroll', updateAllDropdownPositions)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateAllDropdownPositions)
  window.removeEventListener('resize', updateSearchSuggestionsPosition)
})

const updateAllDropdownPositions = () => {
  if (activeDropdown.value) {
    updateDropdownPosition(activeDropdown.value)
  }
  if (showUserDropdown.value) {
    updateUserDropdownPosition()
  }
}

const handleClickOutside = (event) => {
  // Check if click is outside mobile menu and not on the hamburger button
  const hamburgerButton = event.target.closest('button[aria-label="Toggle mobile menu"]')
  if (isMobileMenuOpen.value && mobileMenu.value && !mobileMenu.value.contains(event.target) && !hamburgerButton) {
    closeMobileMenu()
  }

  // Check if click is outside desktop dropdown
  const dropdownButton = event.target.closest('button[aria-haspopup="true"]')
  const dropdownMenu = event.target.closest('.fixed.w-72.bg-white')
  if (activeDropdown.value && !dropdownButton && !dropdownMenu) {
    closeDropdown()
  }

  // Check if click is outside user dropdown
  const userButton = event.target.closest('[data-user-menu]')
  if (showUserDropdown.value && !userButton) {
    showUserDropdown.value = false
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// Computed for link classes with active state indicator
const getLinkClasses = (linkPath) => {
  const isActive = route.path === linkPath
  const baseClasses = "font-medium transition-all duration-300 pb-1 relative"

  // Active state dengan garis bawah dan warna berbeda
  const activeClasses = isActive
    ? "border-b-2 border-[#c58229] scale-105 font-bold"
    : "hover:border-b-2 hover:border-[#c58229] hover:scale-105"

  // Warna teks berdasarkan kondisi
  const colorClasses = props.showHero
    ? (isActive ? 'text-[#c58229]' : 'text-white hover:text-[#c58229]')
    : (isActive ? 'text-[#882f1d] font-bold' : 'text-[#c58229] hover:text-[#882f1d]')

  return `${baseClasses} ${activeClasses} ${colorClasses}`
}

// Check if any dropdown item is active
const isDropdownActive = (link) => {
  if (!link.dropdown || !link.items) return false
  return link.items.some(item => route.path === item.path)
}
</script>

<style scoped>
/* Smooth dropdown animation with scale and fade */
.dropdown-enter-active {
  animation: dropdown-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-leave-active {
  animation: dropdown-out 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdown-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
}

/* Enhanced hover effect untuk dropdown items */
.dropdown-item-hover {
  position: relative;
  overflow: hidden;
}

.dropdown-item-hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(136, 47, 29, 0.1), rgba(136, 47, 29, 0));
  transition: width 0.3s ease;
}

.dropdown-item-hover:hover::before {
  width: 100%;
}

/* Smooth transitions for all interactive elements */
a,
button {
  -webkit-tap-highlight-color: transparent;
}

/* Icon pulse animation on hover */
@keyframes icon-pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

/* Enhanced shadow on dropdown hover */
.group:hover {
  box-shadow: inset 0 0 0 1px rgba(136, 47, 29, 0.1);
}

/* Smooth underline animation for nav links */
.nav-link {
  position: relative;
  padding-bottom: 0.375rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #c58229, transparent);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.nav-link:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.active::after {
  transform: translateX(-50%) scaleX(1);
  background: linear-gradient(90deg, transparent, #c58229, transparent);
}

/* Smooth hover effect dengan glow */
.nav-link:hover {
  text-shadow: 0 0 12px rgba(197, 130, 41, 0.4);
  transform: translateY(-1px);
}

.nav-link.active {
  text-shadow: 0 0 12px rgba(197, 130, 41, 0.5);
}

/* Paulus Blue Color */
.paulus-blue {
  background-color: #1e40af;
}

.bg-paulus-blue {
  background-color: #1e40af;
}

.text-paulus-blue {
  color: #1e40af;
}

.from-paulus-blue {
  --tw-gradient-from: #1e40af;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(30, 64, 175, 0));
}

.border-paulus-blue {
  border-color: #1e40af;
}

.hover\:bg-paulus-blue:hover {
  background-color: #1e40af;
}

.hover\:text-paulus-blue:hover {
  color: #1e40af;
}

.group:hover .group-hover\:bg-paulus-blue {
  background-color: #1e40af;
}

.group:hover .group-hover\:text-paulus-blue {
  color: #1e40af;
}
</style>
