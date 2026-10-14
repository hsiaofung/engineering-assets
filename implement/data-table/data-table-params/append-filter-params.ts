import { HttpParams } from '@angular/common/http'
import { FilterState } from '@app/shared/design-system/global-component/data-table-v1'
import { FILTER_OPERATOR } from './filter-operator'

export interface TableQueryColumn {
  filterOperator?: 'eq' | 'ilike' | 'raw'
  filterable?: boolean
  sortKey?: string
}

/**
 * Appends filter state values to HTTP query parameters.
 * Skips `null` values and columns marked `filterable: false`.
 * Date ranges become `gte`/`lte`. String filters default to `ilike` unless a column sets `eq` or `raw`.
 * @param {FilterState} filters - The current table filter state.
 * @param {HttpParams} params - The existing HTTP query parameters to extend.
 * @param {Record<string, TableQueryColumn>} [columns] - Optional column config used to skip or format filters.
 * @returns {HttpParams} The updated HTTP query parameters including the applied filters.
 */
export function appendFilterParams(
  filters: FilterState,
  params: HttpParams,
  columns: Record<string, TableQueryColumn> = {},
): HttpParams {
  for (const [key, value] of Object.entries(filters)) {
    if (value === null || columns[key]?.filterable === false) {
      continue
    }

    if (Array.isArray(value)) {
      params = params
        .append(key, `${FILTER_OPERATOR.GTE}.${value[0].toISOString()}`)
        .append(key, `${FILTER_OPERATOR.LTE}.${value[1].toISOString()}`)
      continue
    }

    if (typeof value === 'string') {
      params = params.set(key, formatStringFilter(key, value, columns[key]?.filterOperator))
      continue
    }

    params = params.set(key, String(value))
  }

  return params
}

/**
 * Formats a string filter based on its operator.
 * @param {string} key - The filter key. Reserved for callers that need column-specific formatting.
 * @param {string} value - The raw string filter value.
 * @param {TableQueryColumn['filterOperator']} operator - The filter operator. Defaults to `ilike` when omitted.
 * @returns {string} The formatted filter value.
 */
function formatStringFilter(key: string, value: string, operator: TableQueryColumn['filterOperator']): string {
  if (operator === 'raw') {
    return value
  }
  if (operator === 'eq') {
    return `${FILTER_OPERATOR.EQ}.${value}`
  }
  return `${FILTER_OPERATOR.ILIKE}.${value}`
}
