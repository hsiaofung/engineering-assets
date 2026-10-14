import { HttpParams } from '@angular/common/http'
import { appendFilterParams, TableQueryColumn } from './append-filter-params'

export interface DataTableQueryState {
  sortState: () => { column?: string | null; direction?: string | null }
  page: () => number
  pageSize: () => number
  filterState: () => Parameters<typeof appendFilterParams>[0]
}

/**
 * Builds HTTP query parameters from the current data table state.
 * Maps sort and filter columns to their API keys when a column config is provided.
 * @param {DataTableQueryState} tableState - The table state containing page, page size, sort, and filters.
 * @param {Record<string, TableQueryColumn>} [columns] - Optional column config used to map UI keys to API sort and filter keys.
 * @returns {HttpParams} The query parameters sent to the API.
 */
export function toTableQueryParams(
  tableState: DataTableQueryState,
  columns: Record<string, TableQueryColumn> = {},
): HttpParams {
  const sort = tableState.sortState()
  const sortColumn = sort.column ?? ''
  const params = new HttpParams()
    .set('sort', columns[sortColumn]?.sortKey ?? sortColumn)
    .set('direction', sort.direction ?? 'asc')
    .set('page', String(tableState.page()))
    .set('perPage', String(tableState.pageSize()))

  return appendFilterParams(tableState.filterState(), params, columns)
}
