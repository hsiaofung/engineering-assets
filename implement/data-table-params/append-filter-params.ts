import { HttpParams } from '@angular/common/http'
import { FilterState } from '@app/shared/design-system/global-component/data-table-v1'
import { FILTER_OPERATOR } from './filter-operator'

/**
 * Appends filter state values to HTTP query parameters.
 * Skips `null` values, converts date ranges into `gte`/`lte` bounds,
 * and wraps string filters with `ilike` for partial matching.
 * @param {FilterState} filters - The current filter state to apply.
 * @param {HttpParams} params - The existing HTTP query parameters to extend.
 * @returns {HttpParams} The updated HTTP query parameters including the applied filters.
 */
export function appendFilterParams(filters: FilterState, params: HttpParams): HttpParams {
  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      continue
    }

    if (Array.isArray(value)) {
      params = params
        .append(key, `${FILTER_OPERATOR.GTE}.${value[0].toISOString()}`)
        .append(key, `${FILTER_OPERATOR.LTE}.${value[1].toISOString()}`)
      continue
    }

    if (typeof value === 'string') {
      params = params.set(key, `${FILTER_OPERATOR.ILIKE}.${value}`)
      continue
    }

    params = params.set(key, String(value))
  }

  return params
}
