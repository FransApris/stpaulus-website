import type { H3Event } from 'h3'
import { createHash } from 'crypto'

/**
 * Get client IP address from request
 */
export function getClientIp(event: H3Event): string {
  const headers = getHeaders(event)
  
  // Check various headers for real IP
  const forwarded = headers['x-forwarded-for']
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim())
    return ips[0]
  }
  
  const realIp = headers['x-real-ip']
  if (realIp) return realIp as string
  
  const cfConnecting = headers['cf-connecting-ip']
  if (cfConnecting) return cfConnecting as string
  
  // Fallback to Node's connection remote address
  const req = event.node.req
  return req.socket.remoteAddress || '0.0.0.0'
}

/**
 * Generate a unique fingerprint for the client
 * Combines IP + User Agent + Session for uniqueness
 */
export function getClientFingerprint(event: H3Event): string {
  const ip = getClientIp(event)
  const userAgent = getHeader(event, 'user-agent') || ''
  const acceptLanguage = getHeader(event, 'accept-language') || ''
  const acceptEncoding = getHeader(event, 'accept-encoding') || ''
  
  // Combine factors
  const fingerprint = `${ip}|${userAgent}|${acceptLanguage}|${acceptEncoding}`
  
  // Hash to create consistent identifier
  return createHash('sha256').update(fingerprint).digest('hex').substring(0, 32)
}

/**
 * Check if client has already interacted
 */
export function getClientSession(event: H3Event): string {
  // Try to get session from cookie first
  const sessionCookie = getCookie(event, 'stpaulus_session')
  if (sessionCookie) return sessionCookie
  
  // Generate new session ID
  return getClientFingerprint(event)
}
