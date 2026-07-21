export default defineEventHandler((event) => {
  // 1. Anti-Clickjacking: Mencegah halaman ini disematkan (embed) dalam iframe oleh situs dari domain lain.
  // Pengecualian hanya berlaku untuk domain yang sama (SAMEORIGIN).
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
  
  // Alternatif modern untuk X-Frame-Options
  setHeader(event, 'Content-Security-Policy', "frame-ancestors 'self'")

  // 2. Anti MIME-Sniffing: Mencegah browser mencoba "menebak" tipe konten (MIME type)
  // yang dapat dieksploitasi untuk XSS jika file disajikan dengan Content-Type yang salah.
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
})
