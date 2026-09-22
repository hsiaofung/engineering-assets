import { HttpParams } from '@angular/common/http'
import { appendFilterParams } from './append-filter-params'

export interface DataTableQueryState {
  sortState: () => { column?: string | null; direction?: string | null }
  page: () => number
  pageSize: () => number
  filterState: () => Parameters<typeof appendFilterParams>[0]
}

/**
 * Builds HTTP query parameters from the current data table state.
 * Includes sort, pagination, and applied filters.
 * @param {DataTableQueryState} tableState - The table state containing page, page size, sort, and filters.
 * @returns {HttpParams} The query parameters sent to the API.
 */
export function toTableQueryParams(tableState: DataTableQueryState): HttpParams {
  const sort = tableState.sortState()
  const params = new HttpParams()
    .set('sort', sort.column ?? '')
    .set('direction', sort.direction ?? 'asc')
    .set('page', String(tableState.page()))
    .set('perPage', String(tableState.pageSize()))

  return appendFilterParams(tableState.filterState(), params)
}
