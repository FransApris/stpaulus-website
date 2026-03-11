import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-31',

  modules: [
    '@nuxt/image'
  ],

  // Auto-import components from nested folders
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/editor',
      pathPrefix: false,
    },
    {
      path: '~/components/admin',
      pathPrefix: false,
    }
  ],

  // Disable DevTools temporarily to test if it's causing the SSR warning
  devtools: {
    enabled: true // Re-enable since we disabled devLogs
  },

  // Suppress false-positive SSR warnings in development
  vueCompilerOptions: {
    suppressHydrationMismatchWarnings: true
  },

  // Reduce log noise - suppress non-critical warnings
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'info',

  // Disable dev-server-logs for SSR warnings (development only)
  experimental: {
    devLogs: false
  },

  // Disable client-side rendering of SSR logs
  hooks: {
    'devtools:customTabs': () => [],
  },

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/tailwind.css',
    '~/assets/css/prose-custom.css'
  ],

  postcss: {
    plugins: {
      'postcss-import': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Performance optimization for Google Maps
  app: {
    head: {
      title: 'Paroki St. Paulus - Juanda, Sidoarjo',
      titleTemplate: '%s - Paroki St. Paulus Juanda',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
        { name: 'keywords', content: 'Gereja Katolik, Paroki St. Paulus, Juanda, Sidoarjo, Surabaya, jadwal misa, kegiatan gereja, umat katolik' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
        { property: 'og:title', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
        { property: 'og:description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
        { property: 'og:image', content: 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Logo Paroki St. Paulus Juanda' },
        { property: 'og:url', content: 'https://stpaulusjuanda.org' },
        { property: 'og:locale', content: 'id_ID' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
        { name: 'twitter:description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
        { name: 'twitter:image', content: 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png' },
        { name: 'twitter:image:alt', content: 'Logo Paroki St. Paulus Juanda' }
      ],
      link: [
        // Preconnect to Google Maps for faster loading
        { rel: 'preconnect', href: 'https://www.google.com' },
        { rel: 'preconnect', href: 'https://maps.google.com' },
        { rel: 'preconnect', href: 'https://maps.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://www.google.com' },
        { rel: 'dns-prefetch', href: 'https://maps.google.com' },
        // Font Awesome for footer social icons
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ]
    },
    // Disable prefetch for client-only pages to avoid 404 errors
    pageTransition: false,
  },

  // Router configuration
  router: {
    options: {
      linkPrefetchedClass: 'nuxt-link-prefetched',
      linkExactActiveClass: 'nuxt-link-exact-active',
      linkActiveClass: 'nuxt-link-active',
    }
  },

  // Image optimization configuration (requires @nuxt/image module)
  // Uncomment if you have @nuxt/image installed
  // image: {
  //   format: ['webp', 'avif', 'png', 'jpg'],
  //   quality: 80,
  //   screens: {
  //     xs: 320,
  //     sm: 640,
  //     md: 768,
  //     lg: 1024,
  //     xl: 1280,
  //     xxl: 1536,
  //   }
  // },

  // Build optimization
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            ui: ['@vueuse/core', 'tw-elements']
            // Removed editor chunk - let Vite handle it automatically for client-only components
          }
        }
      }
    },
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        path: 'path-browserify',
        process: 'process/browser',
      },
    },
  },

  // Penambahan blok nitro untuk menghilangkan warning
  nitro: {
    compatibilityDate: '2025-11-09',
    externals: {
      inline: ['xlsx']
    },
    logLevel: 'info', // Reduce SSR log noise
    experimental: {
      // Enable multipart form data handling
      asyncContext: true
    },
    // Increase body size limit for file uploads (e.g., 50MB)
    bodyParser: {
      maxBodyLength: 52428800 // 50MB in bytes
    },
    devProxy: {
      // Disable SSR logs forwarding in development
      changeOrigin: false
    },
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          // 🔒 SECURITY: Whitelist specific origins instead of '*'
          // In production, set ALLOWED_ORIGINS in .env to your actual domain
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Access-Control-Allow-Credentials': 'true',
          'cache-control': 'public,max-age=60'
        }
      },
      '/**': {
        headers: {
          // 🔒 Security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        }
      },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public,max-age=31536000'
        }
      },
      '/images/**': {
        headers: {
          'cache-control': 'public,max-age=86400'
        }
      }
    }
  },

  runtimeConfig: {
    // JWT Secret for token verification - using stable hardcoded value for dev consistency
    jwtSecret: 'stpaulus-cms-stable-jwt-secret-key-2025-dev-only',

    // Database configuration for MySQL
    database: {
      client: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'new_cms_user',
      password: process.env.MYSQL_PASSWORD || 'secure_app_password_2025',
      database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
    },

    // Variabel ini HANYA tersedia di sisi server (aman)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,

    // Variabel ini bisa diakses publik (di browser)
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
      apiBase: process.env.API_BASE || '' // Use relative path by default (same origin)
    },

    // Konfigurasi untuk auth endpoints
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
    },

    // Groq API configuration for chatbot
    groq: {
      apiKey: process.env.GROQ_API_KEY
    },

    // Google Gemini API configuration for AI narration
    geminiApiKey: process.env.GEMINI_API_KEY || '',

    // Google Photos API configuration for gallery integration
    googlePhotos: {
      clientId: process.env.GOOGLE_PHOTOS_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_PHOTOS_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_PHOTOS_REDIRECT_URI || 'http://localhost:3000/api/google-photos/callback',
      userEmail: process.env.GOOGLE_PHOTOS_USER_EMAIL || '',
      downloadThumbnails: process.env.GOOGLE_PHOTOS_DOWNLOAD_THUMBNAILS === 'true',
      thumbnailSize: parseInt(process.env.GOOGLE_PHOTOS_THUMBNAIL_SIZE || '400')
    }
  },


})
