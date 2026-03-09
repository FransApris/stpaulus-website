// Path utilities for Windows compatibility with ESM
import * as path from 'path'

/**
 * Get project root directory with proper path normalization for Windows
 * Converts backslashes to forward slashes to avoid ESM loader issues
 */
export function getProjectRoot(): string {
    return process.cwd().replace(/\\/g, '/')
}

/**
 * Join paths and normalize for Windows ESM compatibility
 */
export function joinPath(...segments: string[]): string {
    return path.join(...segments).replace(/\\/g, '/')
}

/**
 * Resolve paths and normalize for Windows ESM compatibility  
 */
export function resolvePath(...segments: string[]): string {
    return path.resolve(...segments).replace(/\\/g, '/')
}

/**
 * Get public directory path
 */
export function getPublicPath(...segments: string[]): string {
    return joinPath(getProjectRoot(), 'public', ...segments)
}

/**
 * Get uploads directory path
 */
export function getUploadsPath(...segments: string[]): string {
    return joinPath(getProjectRoot(), 'public', 'uploads', ...segments)
}
