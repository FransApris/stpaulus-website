// 🔒 Centralized Security Logger
// Logs security events to file for audit trail

import * as fs from 'fs'
import * as path from 'path'

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    SECURITY = 'SECURITY',
    CRITICAL = 'CRITICAL'
}

interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    meta?: any
    pid: number
    environment: string
}

class SecurityLogger {
    private logDir: string
    private securityLogFile: string
    private errorLogFile: string
    private accessLogFile: string

    constructor() {
        // Use relative path from project root
        const projectRoot = process.cwd().replace(/\\/g, '/')
        this.logDir = path.join(projectRoot, 'logs').replace(/\\/g, '/')
        this.securityLogFile = path.join(this.logDir, 'security.log').replace(/\\/g, '/')
        this.errorLogFile = path.join(this.logDir, 'error.log').replace(/\\/g, '/')
        this.accessLogFile = path.join(this.logDir, 'access.log').replace(/\\/g, '/')

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true })
        }
    }

    private formatLogEntry(entry: LogEntry): string {
        return JSON.stringify(entry) + '\n'
    }

    private writeToFile(filePath: string, entry: LogEntry) {
        try {
            const logLine = this.formatLogEntry(entry)
            fs.appendFileSync(filePath, logLine)
        } catch (error) {
            // Fallback to console if file write fails
            console.error('Failed to write to log file:', error)
            console.log('Original log entry:', entry)
        }
    }

    private createLogEntry(level: LogLevel, message: string, meta?: any): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            meta,
            pid: process.pid,
            environment: process.env.NODE_ENV || 'development'
        }
    }

    info(message: string, meta?: any) {
        const entry = this.createLogEntry(LogLevel.INFO, message, meta)
        // Tulis ke access.log DAN console
        this.writeToFile(this.accessLogFile, entry)
        console.log(`ℹ️ [${entry.level}] ${message}`, meta || '')
    }

    warn(message: string, meta?: any) {
        const entry = this.createLogEntry(LogLevel.WARN, message, meta)
        // Tulis ke security.log DAN console (WARN = anomali potensial)
        this.writeToFile(this.securityLogFile, entry)
        console.warn(`⚠️ [${entry.level}] ${message}`, meta || '')
    }

    error(message: string, meta?: any) {
        const entry = this.createLogEntry(LogLevel.ERROR, message, meta)
        this.writeToFile(this.errorLogFile, entry)
        console.error(`❌ [${entry.level}] ${message}`, meta || '')
    }

    security(message: string, meta?: any) {
        const entry = this.createLogEntry(LogLevel.SECURITY, message, meta)
        this.writeToFile(this.securityLogFile, entry)
        console.warn(`🔒 [${entry.level}] ${message}`, meta || '')
    }

    critical(message: string, meta?: any) {
        const entry = this.createLogEntry(LogLevel.CRITICAL, message, meta)
        this.writeToFile(this.securityLogFile, entry)
        this.writeToFile(this.errorLogFile, entry)
        console.error(`🚨 [${entry.level}] ${message}`, meta || '')
        this.sendAlert(entry)
    }

    private alertCooldowns = new Map<string, number>()


    private sendAlert(entry: LogEntry) {
        console.error('🚨 CRITICAL ALERT DETECTED:', entry)

        const cooldownKey = `${entry.message}:${JSON.stringify(entry.meta?.event || '')}`
        const now = Date.now()
        const lastAlertTime = this.alertCooldowns.get(cooldownKey) || 0

        // Throttling: Maksimal 1 alert per 5 menit untuk jenis kejadian yang sama
        if (now - lastAlertTime < 5 * 60 * 1000) {
            console.warn(`[Alert] Skipping email alert due to 5-min cooldown for key: ${cooldownKey}`)
            return
        }

        this.alertCooldowns.set(cooldownKey, now)

        // 1. Dispatch Email Alert (Async, non-blocking)
        import('./email')
            .then(({ sendSecurityAlertEmail }) => {
                sendSecurityAlertEmail({
                    level: entry.level,
                    message: entry.message,
                    meta: entry.meta,
                    timestamp: entry.timestamp
                }).catch(err => console.error('[Alert] Email dispatch failed:', err))
            })
            .catch(err => console.error('[Alert] Could not load email module:', err))

        // 2. Dispatch Webhook Alert (Optional: Discord/Slack/Custom HTTP Webhook)
        this.sendWebhookAlert(entry).catch(err => console.error('[Alert] Webhook dispatch failed:', err))
    }

    private async sendWebhookAlert(entry: LogEntry) {
        const webhookUrl = process.env.SECURITY_ALERT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL
        if (!webhookUrl) return

        try {
            const payload = {
                content: `🚨 **[SECURITY ALERT] ${entry.level}**\n**Pesan:** ${entry.message}\n**Waktu:** ${entry.timestamp}\n\`\`\`json\n${JSON.stringify(entry.meta || {}, null, 2)}\n\`\`\``
            }

            if (typeof fetch !== 'undefined') {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            }
        } catch (err) {
            console.error('[Alert] Webhook request error:', err)
        }
    }


    // Security-specific logging methods
    logFailedLogin(username: string, ip: string, reason: string) {
        this.security('Failed login attempt', {
            event: 'LOGIN_FAILED',
            username,
            ip,
            reason,
            timestamp: new Date().toISOString()
        })
    }

    logSuccessfulLogin(username: string, ip: string, userId: number) {
        this.security('Successful login', {
            event: 'LOGIN_SUCCESS',
            username,
            userId,
            ip,
            timestamp: new Date().toISOString()
        })
    }

    logUnauthorizedAccess(path: string, ip: string, userId?: number) {
        this.security('Unauthorized access attempt', {
            event: 'UNAUTHORIZED_ACCESS',
            path,
            ip,
            userId,
            timestamp: new Date().toISOString()
        })
    }

    logSuspiciousActivity(description: string, meta: any) {
        this.security('Suspicious activity detected', {
            event: 'SUSPICIOUS_ACTIVITY',
            description,
            ...meta,
            timestamp: new Date().toISOString()
        })
    }

    logDataAccess(userId: number, resource: string, action: string) {
        this.info('Data access', {
            event: 'DATA_ACCESS',
            userId,
            resource,
            action,
            timestamp: new Date().toISOString()
        })
    }

    // ── Rate Limiter Events ──────────────────────────────────────────────────

    logBruteForce(ip: string, username: string, attempts: number, blockedUntil: string) {
        this.critical('Brute force attack detected — IP blocked', {
            event: 'BRUTE_FORCE_DETECTED',
            ip,
            username,
            attempts,
            blockedUntil,
            timestamp: new Date().toISOString()
        })
    }

    logBlockedAttempt(ip: string) {
        this.security('Login attempt from blocked IP', {
            event: 'BLOCKED_IP_ATTEMPT',
            ip,
            timestamp: new Date().toISOString()
        })
    }
}

// Export singleton instance
export const logger = new SecurityLogger()

// Export for use in other modules
export default logger
