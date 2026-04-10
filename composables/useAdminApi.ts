export const useAdminApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || ''

  const makeRequest = async (url: string, options: any = {}) => {
    const accessToken = sessionStorage.getItem('admin_access_token')
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      }
    }

    try {
      return await $fetch(`${apiBase}${url}`, options)
    } catch (error: any) {
      // Handle 401 errors by attempting to refresh token
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('admin_refresh_token')
        if (refreshToken) {
          try {
            const refreshResponse = await $fetch(`${apiBase}/api/auth/refresh`, {
              method: 'POST',
              body: { refreshToken }
            })

            // Store new tokens
            sessionStorage.setItem('admin_access_token', refreshResponse.accessToken)
            localStorage.setItem('admin_refresh_token', refreshResponse.refreshToken)

            // Retry original request with new token
            options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${refreshResponse.accessToken}`
            }
            return await $fetch(`${apiBase}${url}`, options)
          } catch (refreshError) {
            // Refresh failed, redirect to login
            sessionStorage.removeItem('admin_access_token')
            localStorage.removeItem('admin_refresh_token')
            await navigateTo('/admin/login')
            throw refreshError
          }
        } else {
          // No refresh token, redirect to login
          await navigateTo('/admin/login')
          throw error
        }
      }
      throw error
    }
  }

  return {
    makeRequest
  }
}
