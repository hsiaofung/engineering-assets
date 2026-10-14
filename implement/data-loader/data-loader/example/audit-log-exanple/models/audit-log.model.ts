import { PaginatedResponse } from '@app/core-modules/task/work-flow/models/work-flow.model'

export type AuditLogResponse = PaginatedResponse<AuditLog>

export interface AuditLog {
  id: number
  errorCode: string
  eventTime: string
  messageArgs: string
  message: string
  username: string
  ipAddress: string
  deviceType: string
  kedb: {
    errorCode: string
    prefix: string
    sequence: string
    severity: string
    service: string
    category: string
    subcategory: string
    message: string
    detailedDescription: string
  }
}

// UI format for a single audit log item
export interface AuditLogUiItem {
  id: number
  errorCode: string
  eventTime: string // eventTime → timestamp
  message: string
  username: string
  ipAddress: string // ipAddress → sourceIP
  deviceType: string
  severity: string // kedb.severity
  category: string // kedb.category
  subcategory: string // kedb.subcategory
}
// UI format for the complete audit log response
export interface AuditLogUiResponse {
  page: number
  perPage: number
  totalCount: number
  totalPages: number
  items: AuditLogUiItem[]
}
export interface FilterOption {
  label: string
  value: string
}

// Audit Log specific filter options
export const SEVERITY_OPTIONS: FilterOption[] = [
  { label: 'Warning', value: 'Warning' },
  { label: 'Critical', value: 'Critical' },
  { label: 'Info', value: 'Info' },
]

export const CATEGORY_OPTIONS: FilterOption[] = [
  { label: 'Automation', value: 'Automation' },
  { label: 'Device Management', value: 'Device Management' },
  { label: 'SCC Configuration', value: 'SCC Configuration' },
  { label: 'Security', value: 'Security' },
]

export interface TableParams {
  page: number
  perPage: number
  sort?: string
  direction?: 'asc' | 'desc'
  severity?: string
  category?: string
  subcategory?: string
  username?: string
  id?: string
  errorCode?: string
  message?: string
  ipAddress?: string
  deviceType?: string
  eventTime?: string
  startTime?: string // ISO string
  endTime?: string // ISO string
}

/** Default table parameters for Audit Log */
export const DEFAULT_AUDIT_LOG_PARAMS: TableParams = {
  page: 1,
  perPage: 10,
  sort: 'eventTime',
  direction: 'desc',
}

export interface FilterParams {
  filters: {
    severity?: string
    category?: string
    subcategory?: string
    user?: string
    sourceIP?: string
    startTime?: string // ISO string
    endTime?: string // ISO string
    message?: string
    ipAddress?: string
    deviceType?: string
    id?: string
    errorCode?: string
    eventTime?: string
  }
}
