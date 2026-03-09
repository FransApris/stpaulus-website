import { runQuery } from '../database/db'
import type { H3Event } from 'h3'

// Audit action types
export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SOFT_DELETE: 'SOFT_DELETE',
  RESTORE: 'RESTORE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT'
} as const

export type AuditActionType = typeof AuditAction[keyof typeof AuditAction]

// Audit log data interface
export interface AuditLogData {
  userId: number
  action: AuditActionType
  entityType: string
  entityId: number
  oldValue?: any
  newValue?: any
  ipAddress?: string
  userAgent?: string
}

// Booking history data interface
export interface BookingHistoryData {
  bookingId: number
  userId: number
  action: AuditActionType
  oldStatus?: string
  newStatus?: string
  reason?: string
}

// Get client information from request
export function getClientInfo(event: H3Event) {
  const headers = getHeaders(event)
  const ipAddress = headers['x-forwarded-for'] || 
                   headers['x-real-ip'] || 
                   event.node.req.socket.remoteAddress || 
                   'unknown'
  const userAgent = headers['user-agent'] || 'unknown'
  
  return { ipAddress, userAgent }
}

// Create audit log entry
export async function createAuditLog(data: AuditLogData) {
  try {
    await runQuery(`
      INSERT INTO audit_logs (
        user_id, action, entity_type, entity_id, 
        old_value, new_value, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.userId,
      data.action,
      data.entityType,
      data.entityId,
      data.oldValue ? JSON.stringify(data.oldValue) : null,
      data.newValue ? JSON.stringify(data.newValue) : null,
      data.ipAddress || null,
      data.userAgent || null
    ])
    
    console.log('[AUDIT] Log created:', {
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId
    })
  } catch (error) {
    console.error('[AUDIT] Failed to create log:', error)
  }
}

// Create booking history entry
export async function createBookingHistory(data: BookingHistoryData) {
  try {
    await runQuery(`
      INSERT INTO booking_history (
        booking_id, user_id, action, old_status, new_status, reason
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      data.bookingId,
      data.userId,
      data.action,
      data.oldStatus || null,
      data.newStatus || null,
      data.reason || null
    ])
    
    console.log('[BOOKING_HISTORY] Entry created:', {
      bookingId: data.bookingId,
      action: data.action,
      oldStatus: data.oldStatus,
      newStatus: data.newStatus
    })
  } catch (error) {
    console.error('[BOOKING_HISTORY] Failed to create entry:', error)
  }
}

// Combined function to log booking action with both audit and history
export async function logBookingAction(
  event: H3Event,
  userId: number,
  bookingId: number,
  action: AuditActionType,
  oldData: any,
  newData: any,
  reason?: string
) {
  const { ipAddress, userAgent } = getClientInfo(event)
  
  // Create audit log
  await createAuditLog({
    userId,
    action,
    entityType: 'booking',
    entityId: bookingId,
    oldValue: oldData,
    newValue: newData,
    ipAddress,
    userAgent
  })
  
  // Create booking history for status changes
  if (oldData?.status !== newData?.status) {
    await createBookingHistory({
      bookingId,
      userId,
      action,
      oldStatus: oldData?.status,
      newStatus: newData?.status,
      reason
    })
  }
}

// Simplified audit logging function
export async function logAudit(
  event: H3Event,
  data: {
    action: string
    target_type: string
    target_id: string | number
    changes?: any
    user_id: number
  }
) {
  const { ipAddress, userAgent } = getClientInfo(event)
  
  try {
    await runQuery(`
      INSERT INTO audit_logs (
        user_id, action, entity_type, entity_id, 
        old_value, new_value, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.user_id,
      data.action,
      data.target_type,
      data.target_id,
      null, // old_value
      data.changes ? JSON.stringify(data.changes) : null,
      ipAddress,
      userAgent
    ])
    
    console.log('[AUDIT] Log created:', {
      userId: data.user_id,
      action: data.action,
      targetType: data.target_type,
      targetId: data.target_id
    })
  } catch (error) {
    console.error('[AUDIT] Failed to create log:', error)
  }
}
