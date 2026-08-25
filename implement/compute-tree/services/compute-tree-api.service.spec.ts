import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom } from 'rxjs'

import {
  ComputePoolResponse,
  ComputeRackResponse,
  ComputeRowDetailResponse,
  ComputeRowsResponse,
} from '../models/compute-tree-api.model'
import { ComputeTreeNode } from '../models/compute-tree-node.model'
import { ComputeTreeApiService } from './compute-tree-api.service'

describe('ComputeTreeService', () => {
  let service: ComputeTreeApiService
  let httpTesting: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComputeTreeApiService, provideHttpClient(), provideHttpClientTesting()],
    })

    service = TestBed.inject(ComputeTreeApiService)
    httpTesting = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTesting.verify()
  })

  describe('loadPod', () => {
    it('should load virtual and physical pools', async () => {
      const response: ComputePoolResponse = {
        virtualPool: {
          isLeaf: true,
        },
        physicalPool: {
          isLeaf: false,
        },
      }

      const expected: ComputeTreeNode[] = [
        {
          id: 'virtual-pool',
          kind: 'virtual-pool',
          name: 'Virtual Pool',
          parentId: 'Pod',
          isLeaf: true,
        },
        {
          id: 'physical-pool',
          kind: 'physical-pool',
          name: 'Physical Pool',
          parentId: 'Pod',
          isLeaf: false,
        },
      ]

      const resultPromise = firstValueFrom(service.loadPod())

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree')

      expect(request.request.method).toBe('GET')

      request.flush(response)

      const result = await resultPromise

      expect(result).toEqual(expected)
    })
  })

  describe('loadPhysicalPool', () => {
    it('should load rows under the physical pool', async () => {
      const response: ComputeRowsResponse = {
        items: [
          {
            id: 'ROW-001',
            location: 'row1',
            isLeaf: true,
          },
          {
            id: 'ROW-002',
            location: 'row2',
            isLeaf: false,
          },
        ],
      }

      const expected: ComputeTreeNode[] = [
        {
          id: 'ROW-001',
          kind: 'row',
          name: 'row1',
          parentId: 'physical-pool',
          isLeaf: true,
        },
        {
          id: 'ROW-002',
          kind: 'row',
          name: 'row2',
          parentId: 'physical-pool',
          isLeaf: false,
        },
      ]

      const resultPromise = firstValueFrom(service.loadPhysicalPool())

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree/root')

      expect(request.request.method).toBe('GET')

      request.flush(response)

      const result = await resultPromise

      expect(result).toEqual(expected)
    })
  })

  describe('loadRacks', () => {
    it('should load racks under a row', async () => {
      const response: ComputeRowDetailResponse = {
        id: 'ROW-001',
        location: 'row1',
        isLeaf: false,
        racks: [
          {
            id: 'RCK-001',
            location: 'rack1',
            size: 42,
            isLeaf: false,
            hasPdu: false,
            hasInRackCdu: true,
            hasRdhx: false,
          },
          {
            id: 'RCK-002',
            location: 'rack2',
            size: 42,
            isLeaf: true,
            hasPdu: true,
            hasInRackCdu: false,
            hasRdhx: true,
          },
        ],
        inRowCdus: [],
        sidecars: [],
      }

      const expected: ComputeTreeNode[] = [
        {
          id: 'RCK-001',
          kind: 'rack',
          name: 'rack1',
          parentId: 'ROW-001',
          isLeaf: false,
        },
        {
          id: 'RCK-002',
          kind: 'rack',
          name: 'rack2',
          parentId: 'ROW-001',
          isLeaf: true,
        },
      ]

      const resultPromise = firstValueFrom(service.loadRacks('ROW-001'))

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree/rows/ROW-001')

      expect(request.request.method).toBe('GET')

      request.flush(response)

      const result = await resultPromise

      expect(result).toEqual(expected)
    })
  })

  describe('loadDrawers', () => {
    it('should load drawers under a rack', async () => {
      const response: ComputeRackResponse = {
        id: 'RCK-001',
        location: 'rack1',
        size: 42,
        isLeaf: false,
        row: {
          id: 'ROW-001',
          location: 'row1',
        },
        drawers: [
          {
            id: 'DRW-001',
            location: '1',
            type: 'CDU',
            systems: [],
          },
          {
            id: 'DRW-002',
            location: '19',
            type: 'SN',
            systems: [
              {
                id: 'SYS-001',
                location: '1',
                ipv4: '10.184.14.110',
              },
            ],
          },
        ],
      }

      const expected: ComputeTreeNode[] = [
        {
          id: 'DRW-001',
          kind: 'drawer',
          name: '1',
          parentId: 'RCK-001',
          isLeaf: true,
        },
        {
          id: 'DRW-002',
          kind: 'drawer',
          name: '19',
          parentId: 'RCK-001',
          isLeaf: false,
        },
      ]

      const resultPromise = firstValueFrom(service.loadDrawers('RCK-001'))

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree/racks/RCK-001')

      expect(request.request.method).toBe('GET')

      request.flush(response)

      const result = await resultPromise

      expect(result).toEqual(expected)
    })
  })

  describe('loadChildren', () => {
    it('should load children for a pod', async () => {
      const response: ComputePoolResponse = {
        virtualPool: {
          isLeaf: true,
        },
        physicalPool: {
          isLeaf: false,
        },
      }

      const node: ComputeTreeNode = {
        id: 'Pod',
        kind: 'pod',
        name: 'Pod',
        isLeaf: false,
      }

      const resultPromise = firstValueFrom(service.loadChildren(node))

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree')

      request.flush(response)

      const result = await resultPromise

      expect(result[0].kind).toBe('virtual-pool')
      expect(result[1].kind).toBe('physical-pool')
    })

    it('should load children for a physical pool', async () => {
      const response: ComputeRowsResponse = {
        items: [
          {
            id: 'ROW-001',
            location: 'row1',
            isLeaf: false,
          },
        ],
      }

      const node: ComputeTreeNode = {
        id: 'physical-pool',
        kind: 'physical-pool',
        name: 'Physical Pool',
        isLeaf: false,
      }

      const resultPromise = firstValueFrom(service.loadChildren(node))

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree/root')

      request.flush(response)

      const result = await resultPromise

      expect(result).toEqual([
        {
          id: 'ROW-001',
          kind: 'row',
          name: 'row1',
          parentId: 'physical-pool',
          isLeaf: false,
        },
      ])
    })

    it('should load children for a row', async () => {
      const response: ComputeRowDetailResponse = {
        id: 'ROW-001',
        location: 'row1',
        isLeaf: false,
        racks: [
          {
            id: 'RCK-001',
            location: 'rack1',
            size: 42,
            isLeaf: false,
            hasPdu: false,
            hasInRackCdu: true,
            hasRdhx: false,
          },
        ],
        inRowCdus: [],
        sidecars: [],
      }

      const node: ComputeTreeNode = {
        id: 'ROW-001',
        kind: 'row',
        name: 'row1',
        parentId: 'physical-pool',
        isLeaf: false,
      }

      const resultPromise = firstValueFrom(service.loadChildren(node))

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree/rows/ROW-001')

      request.flush(response)

      const result = await resultPromise

      expect(result).toEqual([
        {
          id: 'RCK-001',
          kind: 'rack',
          name: 'rack1',
          parentId: 'ROW-001',
          isLeaf: false,
        },
      ])
    })

    it('should load children for a rack', async () => {
      const response: ComputeRackResponse = {
        id: 'RCK-001',
        location: 'rack1',
        size: 42,
        isLeaf: false,
        row: {
          id: 'ROW-001',
          location: 'row1',
        },
        drawers: [
          {
            id: 'DRW-001',
            location: '1',
            type: 'CDU',
            systems: [],
          },
        ],
      }

      const node: ComputeTreeNode = {
        id: 'RCK-001',
        kind: 'rack',
        name: 'rack1',
        parentId: 'ROW-001',
        isLeaf: false,
      }

      const resultPromise = firstValueFrom(service.loadChildren(node))

      const request = httpTesting.expectOne('/rackconfig-service/v1/tree/racks/RCK-001')

      request.flush(response)

      const result = await resultPromise

      expect(result).toEqual([
        {
          id: 'DRW-001',
          kind: 'drawer',
          name: '1',
          parentId: 'RCK-001',
          isLeaf: true,
        },
      ])
    })

    it('should return an empty array for unsupported node kinds', async () => {
      const node: ComputeTreeNode = {
        id: 'SYS-001',
        kind: 'system',
        name: 'System 1',
        isLeaf: true,
      }

      const result = await firstValueFrom(service.loadChildren(node))

      expect(result).toEqual([])
    })
  })
})
