import { describe, expect, it } from 'vitest'

import {
  ComputeDrawerResponse,
  ComputePoolResponse,
  ComputeRackResponse,
  ComputeRowDetailResponse,
  ComputeRowsResponse,
} from '../models/compute-tree-api.model'

import { ComputeApiToTreeNodeMapper } from '../mapper/compute-api-to-tree-node.mapper'

describe('ComputeTreeMapper', () => {
  const mapper = new ComputeApiToTreeNodeMapper()

  describe('mapPoolResponse', () => {
    it('should map pool nodes', () => {
      const response: ComputePoolResponse = {
        virtualPool: {
          isLeaf: true,
        },
        physicalPool: {
          isLeaf: false,
        },
      }

      const result = mapper.mapPoolResponse(response, 'Pod')

      expect(result).toEqual([
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
      ])
    })
  })

  describe('mapRows', () => {
    it('should map row responses to tree nodes', () => {
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

      const result = mapper.mapRows(response, 'physical-pool')

      expect(result).toEqual([
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
      ])
    })
  })

  describe('mapRacks', () => {
    it('should map racks from row detail response to tree nodes', () => {
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

      const result = mapper.mapRacks(response)

      expect(result).toEqual([
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
      ])
    })
  })

  describe('mapDrawers', () => {
    it('should map drawers and determine leaf state from systems', () => {
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

      const result = mapper.mapDrawers(response)

      expect(result).toEqual([
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
      ])
    })
  })

  describe('mapSystems', () => {
    it('should map systems to leaf nodes', () => {
      const response: ComputeDrawerResponse = {
        id: 'DRW-001',
        location: '19',
        type: 'SN',
        systems: [
          {
            id: 'SYS-001',
            location: '1',
            ipv4: '10.184.14.110',
          },
          {
            id: 'SYS-002',
            location: '2',
            ipv4: '10.184.14.111',
          },
        ],
      }

      const result = mapper.mapSystems(response)

      expect(result).toEqual([
        {
          id: 'SYS-001',
          kind: 'system',
          name: '1',
          parentId: 'DRW-001',
          isLeaf: true,
        },
        {
          id: 'SYS-002',
          kind: 'system',
          name: '2',
          parentId: 'DRW-001',
          isLeaf: true,
        },
      ])
    })
  })
})
