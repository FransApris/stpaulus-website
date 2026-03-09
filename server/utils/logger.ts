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

    constructor() {
        // Use relative path from project root
        const projectRoot = process.cwd().replace(/\\/g, '/')
        this.logDir = path.join(projectRoot, 'logs').replace(/\\/g, '/')
        this.securityLogFile = path.join(this.logDir, 'security.log').replace(/\\/g, '/')
        this.errorLogFile = path.join(this.logDir, 'error.log').replace(/\\/g, '/')

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
        console.log(`ℹ️ [${entry.level}] ${message}`, meta || '')
    }

    warn(message: string, meta?: any) {
        const entry = this.createLogEntry(LogLevel.WARN, message, meta)
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

        // TODO: Add alert mechanism (email, Slack, etc.)
        this.sendAlert(entry)
    }

    private sendAlert(entry: LogEntry) {
        // TODO: Implement email/Slack/SMS notification for critical events
        // For now, just log to console
        console.error('🚨 CRITICAL ALERT:', entry)
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
}

// Export singleton instance
export const logger = new SecurityLogger()

// Export for use in other modules
export default logger
