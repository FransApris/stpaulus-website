export default defineEventHandler((event) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'];

  const origin = getHeader(event, 'origin');
  
  // Only log CORS issues, not every request (reduces console noise)
  const isDev = process.env.NODE_ENV === 'development';
  const debugCors = process.env.DEBUG_CORS === 'true';
  
  if (debugCors) {
    console.log('[CORS] Request:', event.method, event.node.req.url, 'Origin:', origin);
  }

  if (origin && allowedOrigins.includes(origin)) {
    if (debugCors) console.log('[CORS] Origin allowed, setting headers');
    setHeader(event, 'Access-Control-Allow-Origin', origin);
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    setHeader(event, 'Access-Control-Allow-Headers', 'Authorization, Content-Type');
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');
    setHeader(event, 'Access-Control-Max-Age', 86400);
  } else if (!origin) {
    // Same-origin requests don't have origin header - this is normal
    setHeader(event, 'Access-Control-Allow-Origin', '*');
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    setHeader(event, 'Access-Control-Allow-Headers', 'Authorization, Content-Type');
  }

  if (event.method === 'OPTIONS') {
    if (debugCors) console.log('[CORS] Handling OPTIONS preflight request');
    setResponseStatus(event, 200);
    return 'ok';
  }
})
