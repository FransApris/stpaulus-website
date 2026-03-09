export default defineNuxtPlugin(() => {
  const originalFetch = (globalThis as any).fetch as typeof fetch;

  // Helper function to check if JWT token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return Date.now() >= exp * 1000;
    } catch (error) {
      console.warn('[Auth Plugin] Failed to decode token:', error);
      return true; // Treat as expired if can't decode
    }
  };

  // Helper function to check if token expires soon (within 15 minutes)
  const isTokenExpiringSoon = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
      return Date.now() >= (exp * 1000) - fifteenMinutes;
    } catch (error) {
      return false;
    }
  };

  // Check token expiration periodically and warn user
  if (typeof window !== 'undefined') {
    setInterval(() => {
      const token = localStorage.getItem('admin_access_token');
      if (token && !isTokenExpired(token) && isTokenExpiringSoon(token)) {
        console.warn('[Auth Plugin] Token will expire soon. Please save your work.');
        // You can add a toast notification here
      }
    }, 60000); // Check every minute
  }

  (globalThis as any).fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // Only apply admin token for admin API routes
    if (url && url.includes('/api/admin')) {
      const token = localStorage.getItem('admin_access_token');
      console.log('[Auth Plugin] Request to:', url, '| Token length:', token?.length || 0);

      if (token && !isTokenExpired(token)) {
        init = init || {};
        init.headers = new Headers(init.headers);
        init.headers.set('Authorization', `Bearer ${token}`);
        console.log('[Auth Plugin] Adding admin Authorization header to request:', url);
      } else {
        if (token) {
          console.log('[Auth Plugin] Token expired, not adding Authorization header for request:', url);
          // Clear expired token
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          
          // Redirect to login if on admin page (only in browser)
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
            console.log('[Auth Plugin] Redirecting to login due to expired token');
            window.location.href = '/admin/login?expired=true';
          }
        } else {
          console.log('[Auth Plugin] No token found for request:', url);
        }
      }
    }
    return originalFetch(input, init);
  };

  // Return empty object to satisfy plugin interface
  return {}
});
