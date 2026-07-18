// middleware/signage-auth.ts
// Middleware khusus untuk proteksi halaman Digital Signage

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return

  const accessToken = sessionStorage.getItem('admin_access_token')
  if (!accessToken) {
    return navigateTo('/admin/login')
  }

  try {
    const auth = useAuth()
    
    // Pastikan data user sudah ter-fetch
    await auth.fetchUserData()

    const user = auth.user.value
    if (!user) {
      return navigateTo('/admin/login')
    }

    // Hanya izinkan super_admin dan admin_sekretariat
    const allowedRoles = ['super_admin', 'admin_sekretariat']
    const hasAccess = allowedRoles.includes(user.role)

    console.log(`[SIGNAGE AUTH] User Role: ${user.role} | Access: ${hasAccess}`)

    if (!hasAccess) {
      // Jika tidak punya akses, redirect ke dashboard admin atau 404
      console.log(`[SIGNAGE AUTH] ❌ Akses ditolak. Redirecting...`)
      return navigateTo('/admin/dashboard')
    }

    console.log(`[SIGNAGE AUTH] ✅ Akses diizinkan untuk role: ${user.role}`)
  } catch (error) {
    console.error('Signage auth middleware error:', error)
    return navigateTo('/admin/login')
  }
})
