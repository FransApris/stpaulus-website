// 🔒 Rate Limiting Middleware for Login Endpoints
// Prevents brute force attacks

import { defineEventHandler, getRequestHeader, createError } from 'h3'

interface RateLimitEntry {
    count: number
    resetTime: number
    blockedUntil?: number
}

// In-memory store for rate limiting (consider Redis for production with multiple servers)
const loginAttempts = new Map<string, RateLimitEntry>()

// Configuration
const MAX_ATTEMPTS = 5 // Maximum attempts per time window
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000 // Block for 15 minutes after max attempts
const CLEANUP_INTERVAL = 60 * 60 * 1000 // Clean up old entries every hour

// Periodic cleanup to prevent memory leaks
setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of loginAttempts.entries()) {
        if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
            loginAttempts.delete(ip)
        }
    }
}, CLEANUP_INTERVAL)

export default defineEventHandler((event) => {
    const path = event.path

    // Only apply rate limiting to login endpoints
    if (path !== '/api/auth/login' && path !== '/api/admin/login') {
        return // Skip rate limiting for other routes
    }

    // Get client IP (support proxies)
    const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0].trim()
        || getRequestHeader(event, 'x-real-ip')
        || 'unknown'

    const now = Date.now()
    const entry = loginAttempts.get(ip)

    if (entry) {
        // Check if IP is currently blocked
        if (entry.blockedUntil && now < entry.blockedUntil) {
            const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000)

            console.warn(`🚫 [SECURITY] Blocked login attempt from IP: ${ip} (${remainingMinutes} minutes remaining)`)

            throw createError({
                statusCode: 429,
                statusMessage: `Too many login attempts. Your IP has been temporarily blocked. Please try again in ${remainingMinutes} minute(s).`
            })
        }

        // Reset counter if time window has passed
        if (now >= entry.resetTime) {
            loginAttempts.set(ip, {
                count: 1,
                resetTime: now + WINDOW_MS
            })
        } else {
            // Increment attempt counter
            entry.count++

            // Block if max attempts reached
            if (entry.count > MAX_ATTEMPTS) {
                entry.blockedUntil = now + BLOCK_DURATION_MS

                console.warn(`🚫 [SECURITY] IP blocked due to ${entry.count} failed login attempts: ${ip}`)

                throw createError({
                    statusCode: 429,
                    statusMessage: `Too many login attempts. Your IP has been temporarily blocked for ${Math.ceil(BLOCK_DURATION_MS / 60000)} minutes.`
                })
            }

            // Warning when approaching limit
            if (entry.count >= MAX_ATTEMPTS - 1) {
                console.warn(`⚠️ [SECURITY] IP approaching rate limit (${entry.count}/${MAX_ATTEMPTS}): ${ip}`)
            }
        }
    } else {
        // First attempt from this IP
        loginAttempts.set(ip, {
            count: 1,
            resetTime: now + WINDOW_MS
        })
    }

    // Log all login attempts for security monitoring
    console.log(`🔐 [SECURITY] Login attempt from IP: ${ip} (attempt ${loginAttempts.get(ip)?.count}/${MAX_ATTEMPTS})`)
})
