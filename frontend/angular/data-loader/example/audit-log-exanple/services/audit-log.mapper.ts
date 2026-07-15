import { map, OperatorFunction } from 'rxjs'
import { AuditLogResponse, AuditLogUiResponse } from '../models/audit-log.model'

/**
 * Transforms Audit Log API data into the format required by the UI.
 * Named `toUI` consistently so other modules can follow the same pattern.
 * @returns {OperatorFunction<AuditLogResponse, AuditLogUiResponse>} An RxJS operator function that maps API response to UI format.
 */
export function toUI(): OperatorFunction<AuditLogResponse, AuditLogUiResponse> {
  return map((apiResponse: AuditLogResponse) => ({
    page: apiResponse.page,
    perPage: apiResponse.perPage,
    totalCount: apiResponse.totalCount,
    totalPages: apiResponse.totalPages,
    items: apiResponse.items.map((item) => ({
      id: item.id,
      errorCode: item.errorCode,
      eventTime: item.eventTime,
      message: item.message,
      username: item.username,
      ipAddress: item.ipAddress,
      deviceType: item.deviceType,
      severity: item.kedb?.severity || '',
      category: item.kedb?.category || '',
      subcategory: item.kedb?.subcategory || '',
    })),
  }))
}
