import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { computeApiURL } from '../../api/compute-api-url'
import { ComputeSelectionContext } from '../../selection/compute-selection-context.model'
import { ComputeSelectionService } from '../../selection/compute-selection.service'
import { ComputeResourceListComponent } from './compute-resource-list.component'

describe('ComputeResourceListComponent', () => {
  let fixture: ComponentFixture<ComputeResourceListComponent>
  let component: ComputeResourceListComponent
  let httpMock: HttpTestingController
  let selectionService: ComputeSelectionService

  const selection: ComputeSelectionContext = {
    kind: 'physical-pool',
    id: 'physical-pool',
    name: 'Physical Pool',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputeResourceListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents()

    fixture = TestBed.createComponent(ComputeResourceListComponent)
    component = fixture.componentInstance
    httpMock = TestBed.inject(HttpTestingController)
    selectionService = TestBed.inject(ComputeSelectionService)

    selectionService.select(selection)
  })

  afterEach(() => {
    httpMock.verify()
  })

  describe('getSystems', () => {
    it('should send page and perPage query parameters', () => {
      component.page.set(2)
      component.pageSize.set(20)

      component.getSystems().subscribe()

      const request = httpMock.expectOne((req) => req.url === computeApiURL.systems)

      expect(request.request.params.get('page')).toBe('2')
      expect(request.request.params.get('perPage')).toBe('20')

      request.flush({ items: [], page: 2, perPage: 20, total: 0 })
    })

    it('should send sort and direction query parameters', () => {
      component.sortState.set({ column: 'location', direction: 'desc' })

      component.getSystems().subscribe()

      const request = httpMock.expectOne((req) => req.url === computeApiURL.systems)

      expect(request.request.params.get('sort')).toBe('location')
      expect(request.request.params.get('direction')).toBe('desc')

      request.flush({ items: [], page: 1, perPage: 10, total: 0 })
    })

    it('should send string filters with ilike operator', () => {
      component.filterState.set({ ipv4: '10.184.24.5' })

      component.getSystems().subscribe()

      const request = httpMock.expectOne((req) => req.url === computeApiURL.systems)

      expect(request.request.params.get('ipv4')).toBe('ilike.10.184.24.5')

      request.flush({ items: [], page: 1, perPage: 10, total: 0 })
    })

    it('should send date range filters with gte and lte operators', () => {
      const startTime = new Date('2026-08-25T00:00:00.000Z')
      const endTime = new Date('2026-08-31T23:59:59.999Z')

      component.filterState.set({ updateTime: [startTime, endTime] })

      component.getSystems().subscribe()

      const request = httpMock.expectOne((req) => req.url === computeApiURL.systems)

      expect(request.request.params.getAll('updateTime')).toEqual([
        `gte.${startTime.toISOString()}`,
        `lte.${endTime.toISOString()}`,
      ])

      request.flush({ items: [], page: 1, perPage: 10, total: 0 })
    })

    it('should reset page to 1 when filter changes', () => {
      component.page.set(3)

      component.tableState.onFilterChange({
        filters: { ipv4: '10.184.24.5' },
        changedColumn: 'ipv4',
      })

      expect(component.page()).toBe(1)
    })

    it('should reset page to 1 when sort changes', () => {
      component.page.set(3)

      component.tableState.onSortChange({ column: 'location', direction: 'desc' })

      expect(component.page()).toBe(1)
    })

    it('should update page and pageSize when page changes', () => {
      component.tableState.onPageChange({ currentPage: 2, pageSize: 20 })

      expect(component.page()).toBe(2)
      expect(component.pageSize()).toBe(20)
    })

    it('should update filter state when filter changes', () => {
      const filters = { ipv4: '10.184.24.5' }

      component.tableState.onFilterChange({ filters, changedColumn: 'ipv4' })

      expect(component.filterState()).toEqual(filters)
    })

    it('should update sort state when sort changes', () => {
      const sort = { column: 'location', direction: 'desc' } as const

      component.tableState.onSortChange(sort)

      expect(component.sortState()).toEqual(sort)
    })

    it('should send drawer filter from parentName and name', () => {
      selectionService.select({
        kind: 'drawer',
        id: 'DRW-1',
        name: '21',
        parentName: 'rack-1',
      })

      component.getSystems().subscribe()

      const request = httpMock.expectOne((req) => req.url === computeApiURL.systems)

      expect(request.request.params.get('drawer')).toBe('eq.rack-1:21')

      request.flush({
        items: [],
        page: 1,
        perPage: 10,
        total: 0,
      })
    })
  })
})
