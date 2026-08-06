export interface AdminMenuItem {
  title: string
  route: string
  icon: string
  prefetch?: boolean
  allowedRoles: string[]
}

export interface AdminNavGroup {
  id?: string
  title: string
  route?: string // Untuk menu single seperti Dashboard
  icon: string
  allowedRoles: string[]
  children?: AdminMenuItem[]
}

export const ADMIN_NAVIGATION: AdminNavGroup[] = [
  // 0. Dashboard
  {
    title: 'Dashboard',
    route: '/admin/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
  },

  // 1. PROFIL & STRUKTUR PAROKI
  {
    id: 'profil_paroki',
    title: 'Profil & Struktur Paroki',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat'],
    children: [
      {
        title: 'Romo Bertugas',
        route: '/admin/pastors',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'DPP Paroki',
        route: '/admin/dpp',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'BGKP Paroki',
        route: '/admin/bgkp',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Wilayah & Lingkungan',
        route: '/admin/teritorial',
        icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Statistik Umat Paroki',
        route: '/admin/parish-statistics',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      }
    ]
  },

  // 2. PUBLIKASI & KONTEN MEDIA (KHUSUS SUPER ADMIN & ADMIN KOMSOS)
  {
    id: 'publikasi',
    title: 'Publikasi & Konten Media',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    allowedRoles: ['super_admin', 'admin_komsos'],
    children: [
      {
        title: 'Kelola Berita',
        route: '/admin/news',
        icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
        prefetch: false,
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Kelola Artikel & Inspirasi',
        route: '/admin/articles',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        prefetch: false,
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Kategori Berita & Artikel',
        route: '/admin/article-categories',
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Kelola Galeri Foto',
        route: '/admin/gallery',
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Kategori Galeri',
        route: '/admin/gallery-categories',
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Pengumuman Gereja',
        route: '/admin/church-announcements',
        icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Banner Pengumuman',
        route: '/admin/announcements',
        icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
        allowedRoles: ['super_admin', 'admin_komsos']
      }
    ]
  },

  // 3. PERIBADATAN & AGENDA
  {
    id: 'peribadatan',
    title: 'Peribadatan & Agenda',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat'],
    children: [
      {
        title: 'Kelola Jadwal Misa',
        route: '/admin/mass-schedules',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Kelola Jenis Liturgi',
        route: '/admin/liturgy-types',
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        prefetch: false,
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Kelola Agenda Paroki',
        route: '/admin/agenda',
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Kategori Agenda',
        route: '/admin/categories',
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      }
    ]
  },

  // 4. LAYANAN PEMESANAN RUANG (KHUSUS SUPER ADMIN & ADMIN SEKRETARIAT)
  {
    id: 'booking',
    title: 'Layanan Pemesanan Ruang',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    allowedRoles: ['super_admin', 'admin_sekretariat'],
    children: [
      {
        title: 'Kelola Pemesanan Masuk',
        route: '/admin/bookings-new',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        allowedRoles: ['super_admin', 'admin_sekretariat']
      },
      {
        title: 'Master Ruangan & Fasilitas',
        route: '/admin/rooms',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        allowedRoles: ['super_admin', 'admin_sekretariat']
      },
      {
        title: 'Laporan & Statistik Pemesanan',
        route: '/admin/bookings-report',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        allowedRoles: ['super_admin', 'admin_sekretariat']
      }
    ]
  },

  // 5. KRONIK PAROKI
  {
    id: 'kronik',
    title: 'Kronik Paroki',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat'],
    children: [
      {
        title: 'Kelola Catatan Kronik',
        route: '/admin/kronik',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Pengaturan Seksi BGKP & DPP',
        route: '/admin/kronik/sections',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      }
    ]
  },

  // 6. DOKUMEN & INTERAKSI UMAT
  {
    id: 'dokumen_interaksi',
    title: 'Dokumen & Interaksi Umat',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat'],
    children: [
      {
        title: 'Kelola Dokumen Paroki',
        route: '/admin/documents',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        allowedRoles: ['super_admin', 'admin_sekretariat']
      },
      {
        title: 'Kategori Dokumen',
        route: '/admin/document-categories',
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        allowedRoles: ['super_admin', 'admin_sekretariat']
      },
      {
        title: 'Pesan Masuk (Kontak)',
        route: '/admin/contact-messages',
        icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        allowedRoles: ['super_admin', 'admin_sekretariat']
      },
      {
        title: 'Kelola Chatbot FAQ Umat',
        route: '/admin/chatbot-faqs',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Kategori FAQ',
        route: '/admin/chatbot-faq-categories',
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      }
    ]
  },

  // 7. PENGATURAN SISTEM & AKSES
  {
    id: 'pengaturan_sistem',
    title: 'Pengaturan Sistem & Akses',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat'],
    children: [
      {
        title: 'Kelola Pengguna (User)',
        route: '/admin/users',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
        allowedRoles: ['super_admin', 'admin_komsos', 'admin_sekretariat']
      },
      {
        title: 'Kategori Pengguna',
        route: '/admin/user-categories',
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        allowedRoles: ['super_admin', 'admin_sekretariat']
      },
      {
        title: 'Pengelola Tema Hero',
        route: '/admin/hero-themes',
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Pengaturan Footer',
        route: '/admin/footer-settings',
        icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
        allowedRoles: ['super_admin', 'admin_komsos']
      },
      {
        title: 'Maintenance Halaman',
        route: '/admin/maintenance',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        allowedRoles: ['super_admin']
      },
      {
        title: 'Database Backup',
        route: '/admin/backup',
        icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
        allowedRoles: ['super_admin']
      },
      {
        title: 'Database Restore',
        route: '/admin/restore',
        icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        allowedRoles: ['super_admin']
      },
      {
        title: 'DB Migrations',
        route: '/admin/migrations',
        icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
        allowedRoles: ['super_admin']
      },
      {
        title: 'Laporan Aktivitas Konten',
        route: '/admin/content-report',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        allowedRoles: ['super_admin', 'admin_komsos']
      }
    ]
  }
]
