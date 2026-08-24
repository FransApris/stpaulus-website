/**
 * server/middleware/02.securityHeaders.ts
 *
 * Comprehensive HTTP Security Headers Middleware.
 * Protects against Clickjacking, MIME-Sniffing, MITM/HTTP Downgrade, XSS, and Feature Abuse.
 *
 * Referensi IR/DRP: §1.3 Hardening Pasca-Insiden & Defense-in-Depth
 *
 * External resources inventoried from nuxt.config.ts:
 *   - fonts.googleapis.com  → Google Fonts CSS
 *   - fonts.gstatic.com     → Google Fonts woff2 files
 *   - cdnjs.cloudflare.com  → Font Awesome CSS + webfont files
 *   - stpaulusjuanda.org    → Production domain (self-referencing OG images)
 *   - Inline JSON-LD script → Structured data (schema.org/CatholicChurch)
 *   - CKEditor              → Bundled locally (no CDN needed)
 */
export default defineEventHandler((event) => {
  // ── 1. Content-Security-Policy (Full Policy) ────────────────────────────
  // Directives are ordered: default-src → specific overrides → sandbox directives
  const csp = [
    // Fallback for any directive not explicitly listed below
    "default-src 'self'",

    // JavaScript: 'self' + 'unsafe-inline' (WAJIB untuk Nuxt 3 SSR)
    //
    // ⚠️ MENGAPA 'unsafe-inline' DIPERLUKAN DI PRODUCTION:
    // Nuxt 3 menyuntikkan inline script di setiap halaman untuk Vue hydration:
    //   <script>window.__NUXT__ = { data: {...}, state: {...} }</script>
    // Tanpa 'unsafe-inline', browser MEMBLOKIR script ini → Vue gagal hydrate
    // → seluruh halaman menjadi tidak interaktif (broken).
    //
    // ⚠️ MENGAPA 'unsafe-eval' DIPERLUKAN:
    // Nuxt 3 + Vite menggunakan Function() constructor & eval() untuk:
    //   - Vue template compiler runtime
    //   - Vite HMR (hot module replacement)
    //   - Dynamic import() polyfills di beberapa browser
    //
    // 🛡️ XSS TETAP TERLINDUNGI OLEH LAPISAN LAIN:
    // Karena kita tidak bisa menghapus 'unsafe-inline' dari script-src tanpa
    // implementasi Nonce (kompleks), pertahanan XSS kita bertumpu pada:
    //   1. DOMPurify.sanitize() di artikel/berita/kronik (Stored XSS)
    //   2. escapeHtml() di highlightText (Reflected XSS)
    //   3. Parameterized SQL queries (SQL Injection → XSS chain)
    //   4. requireUserManagementPermission RBAC gate
    // CSP tetap memberikan nilai dengan membatasi img-src, connect-src,
    // object-src, form-action, dan frame-ancestors.
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,

    // CSS: self + Google Fonts + Font Awesome (cdnjs).
    // 'unsafe-inline' required for Vue scoped styles, Tailwind utilities, and CKEditor.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",

    // Fonts: Google Fonts files (gstatic) + Font Awesome webfonts (cdnjs)
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",

    // Images: self + data URIs (CKEditor preview) + production domain + Cloudinary CDN
    // res.cloudinary.com = uploaded article/news/gallery images stored on Cloudinary
    "img-src 'self' data: blob: https://stpaulusjuanda.org https://res.cloudinary.com https://lh3.googleusercontent.com",

    // Fetch/XHR/WebSocket: only same origin (all API calls are relative)
    "connect-src 'self'",

    // Media (audio/video): only self-hosted
    "media-src 'self'",

    // Object/embed tags: block all (no Flash/PDF embeds needed)
    "object-src 'none'",

    // Base tag restriction: prevent base-tag hijacking attacks
    "base-uri 'self'",

    // Form submissions: only to same origin
    "form-action 'self'",

    // Framing: only allow same origin (replaces X-Frame-Options)
    "frame-ancestors 'self'",

    // Frame/Child sources: allow Google Maps embeds via iframe
    // Required for <MapEmbed> component that uses google.com/maps/d/embed
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "child-src 'self' https://www.google.com https://maps.google.com",

    // Workers (Service Workers, Web Workers): only self
    "worker-src 'self' blob:",
  ].join('; ')

  setHeader(event, 'Content-Security-Policy', csp)

  // ── 2. Anti-Clickjacking ─────────────────────────────────────────────────
  // Kept for legacy browsers that don't support CSP frame-ancestors
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')

  // ── 3. Anti MIME-Sniffing ────────────────────────────────────────────────
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  // ── 4. HTTP Strict Transport Security (HSTS) ─────────────────────────────
  // Force HTTPS for 1 year, including all subdomains. Add to HSTS preload list.
  setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // ── 5. Referrer Policy ───────────────────────────────────────────────────
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')

  // ── 6. Legacy XSS Filter (IE/old Chrome fallback) ────────────────────────
  setHeader(event, 'X-XSS-Protection', '1; mode=block')

  // ── 7. Permissions Policy ────────────────────────────────────────────────
  // Disable access to sensitive device APIs not used by this website.
  // geolocation=(self) diperlukan agar <MapEmbed> getDirections() dapat meminta
  // koordinat pengguna untuk navigasi ke lokasi paroki.
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=(), display-capture=()')

  // ── 8. Cross-Domain Policy ───────────────────────────────────────────────
  setHeader(event, 'X-Permitted-Cross-Domain-Policies', 'none')
})

