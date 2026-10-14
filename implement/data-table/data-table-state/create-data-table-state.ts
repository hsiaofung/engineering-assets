import { signal } from '@angular/core'

import {
  FilterChangeEvent,
  FilterState,
  PageChangeEvent,
  SortChangeEvent,
  SortState,
} from '@app/shared/design-system/global-component/data-table-v1'

export interface DataTableStateOptions {
  page?: number
  pageSize?: number
  sort?: SortState
  filters?: FilterState
}

/**
 * Creates a reactive data table state with pagination, sorting, filtering,
 * and change handlers that trigger a bound loader refresh.
 * @template T - The type of items displayed in the table.
 * @param {DataTableStateOptions} options - Initial configuration for page, page size, sort, filters, and data loader.
 * @returns {object} An object containing table state signals and event handlers.
 */
export function createDataTableState(options: DataTableStateOptions = {}) {
  const page = signal(options.page ?? 1)
  const pageSize = signal(options.pageSize ?? 10)
  const sortState = signal<SortState>(options.sort ?? { column: null, direction: 'asc' })
  const filterState = signal<FilterState>(options.filters ?? {})

  const resetPage = (): void => {
    page.set(1)
  }

  return {
    page,
    pageSize,
    sortState,
    filterState,
    resetPage,
    onPageChange: (event: PageChangeEvent) => {
      page.set(event.currentPage)
      pageSize.set(event.pageSize)
    },
    onSortChange: (event: SortChangeEvent) => {
      sortState.set(event)
      resetPage()
    },
    onFilterChange: (event: FilterChangeEvent) => {
      filterState.set(event.filters)
      resetPage()
    },
  }
}

export type DataTableState = ReturnType<typeof createDataTableState>
