import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { AuditLogUiResponse } from '../models/audit-log.model'
import { toUI } from './audit-log.mapper'

/**
 * Returns a mock Observable for audit log data.
 *
 * Simulates an API response with pagination metadata and a sample audit log item.
 * Includes a 1-second delay to mimic real network latency.
 * @returns {Observable<AuditLogUiResponse>} An observable that emits mock audit log response data after a short delay.
 */
export function getMockAuditLogData(): Observable<AuditLogUiResponse> {
  // Explicitly typed as AuditLogResponse
  const mockItems = [
    {
      id: 4569,
      errorCode: 'CFG002',
      eventTime: '2026-06-11T07:30:54.504Z',
      messageArgs: 'string',
      message: 'Failed to execute reboot command on device Rack-05-PDU01 (timeout)',
      username: 'Witty Stark',
      ipAddress: '192.168.1.1',
      deviceType: 'Compute',
      kedb: {
        errorCode: '',
        prefix: 'string',
        sequence: 'string',
        severity: 'Warning',
        service: 'string',
        category: 'SCC Configuration',
        subcategory: 'NTP',
        message: '',
        detailedDescription: 'string',
      },
    },
    {
      id: 4570,
      errorCode: 'CFG002',
      eventTime: '2026-06-11T07:30:54.504Z',
      messageArgs: 'string',
      message: 'Failed to execute reboot command on device Rack-05-PDU01 (timeout)',
      username: 'Witty Stark',
      ipAddress: '192.168.1.1',
      deviceType: 'Compute',
      kedb: {
        errorCode: '',
        prefix: 'string',
        sequence: 'string',
        severity: 'Critical',
        service: 'string',
        category: 'SCC Configuration',
        subcategory: 'NTP',
        message: '',
        detailedDescription: 'string',
      },
    },
    {
      id: 4570,
      errorCode: 'CFG002',
      eventTime: '2026-06-11T07:30:54.504Z',
      messageArgs: 'string',
      message: 'Failed to execute reboot command on device Rack-05-PDU01 (timeout)',
      username: 'Witty Stark',
      ipAddress: '192.168.1.1',
      deviceType: 'Compute',
      kedb: {
        errorCode: '',
        prefix: 'string',
        sequence: 'string',
        severity: 'Info',
        service: 'string',
        category: 'SCC Configuration',
        subcategory: 'NTP',
        message: '',
        detailedDescription: 'string',
      },
    },
  ]

  const mockResponse = {
    page: 1,
    perPage: 10,
    totalCount: 1,
    totalPages: 1,
    items: mockItems,
  }

  // Simulate 1 second delay
  return of(mockResponse).pipe(
    toUI(), // Transform to UI format if needed
    delay(1000),
  )
}
