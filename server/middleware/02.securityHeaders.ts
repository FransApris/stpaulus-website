/**
 * server/middleware/02.securityHeaders.ts
 *
 * Comprehensive HTTP Security Headers Middleware.
 * Protects against Clickjacking, MIME-Sniffing, MITM/HTTP Downgrade, XSS, and Feature Abuse.
 *
 * Referensi IR/DRP: §1.3 Hardening Pasca-Insiden & Defense-in-Depth
 */
export default defineEventHandler((event) => {
  // 1. Anti-Clickjacking: Mencegah framing halaman di domain asing
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
  setHeader(event, 'Content-Security-Policy', "frame-ancestors 'self'")

  // 2. Anti MIME-Sniffing: Paksa browser mematuhi Content-Type yang diberikan
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  // 3. HTTP Strict Transport Security (HSTS): Paksa koneksi HTTPS selama 1 tahun (31,536,000 detik)
  setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // 4. Referrer Policy: Lindungi informasi URL privat dari penelusuran referrer eksternal
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')

  // 5. XSS Protection Filter (Browser Legacy Support)
  setHeader(event, 'X-XSS-Protection', '1; mode=block')

  // 6. Permissions Policy (Feature Policy): Matikan akses ke API perangkat sensitif yang tidak digunakan
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), display-capture=()')

  // 7. Cross-Domain Policy Constraint
  setHeader(event, 'X-Permitted-Cross-Domain-Policies', 'none')
})
