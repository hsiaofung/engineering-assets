import { describe, expect, it } from 'vitest'

import { createDataTableState } from './create-data-table-state'

describe('createDataTableState', () => {
  it('should use default page and pageSize', () => {
    const table = createDataTableState()

    expect(table.page()).toBe(1)
    expect(table.pageSize()).toBe(10)
  })

  it('should reset page when filter changes', () => {
    const table = createDataTableState()

    table.page.set(3)
    table.onFilterChange({
      filters: { ipv4: '10.184.24.5' },
      changedColumn: 'ipv4',
    })

    expect(table.filterState()).toEqual({ ipv4: '10.184.24.5' })
    expect(table.page()).toBe(1)
  })

  it('should reset page when sort changes', () => {
    const table = createDataTableState()

    table.page.set(3)
    table.onSortChange({ column: 'location', direction: 'desc' })

    expect(table.sortState()).toEqual({ column: 'location', direction: 'desc' })
    expect(table.page()).toBe(1)
  })

  it('should update page and pageSize when page changes', () => {
    const table = createDataTableState()

    table.onPageChange({ currentPage: 2, pageSize: 20 })

    expect(table.page()).toBe(2)
    expect(table.pageSize()).toBe(20)
  })

  it('should accept initial sort', () => {
    const table = createDataTableState({
      sort: { column: 'location', direction: 'asc' },
    })

    expect(table.sortState()).toEqual({ column: 'location', direction: 'asc' })
  })
})
