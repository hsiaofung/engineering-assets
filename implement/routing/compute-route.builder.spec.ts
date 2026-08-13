import { describe, expect, it } from 'vitest'

import { ComputeResourceContext } from './compute-resource-context.model'
import { ComputeRouteBuilder } from './compute-route.builder'

describe('ComputeRouteBuilder', () => {
  const builder = new ComputeRouteBuilder()

  it('should build a physical system route', () => {
    const context: ComputeResourceContext = {
      unassigned: false,
      rowId: 'ROW-001',
      rowLocation: 'row-1',
      rackId: 'RCK-001',
      rackLocationId: 'rack-1',
      drawerId: 'DRW-001',
      drawerType: 'SN',
    }

    const result = builder.buildResourceRoute('SYS-001', context)

    expect(result).toEqual(['/compute', 'Pod', 'physical-pool', 'appliance', 'SYS-001'])
  })

  it('should build a virtual system route', () => {
    const context: ComputeResourceContext = {
      unassigned: true,
      rowId: 'ROW-002',
      rowLocation: 'row-2',
      rackId: 'RCK-002',
      rackLocationId: 'rack-2',
      drawerId: 'DRW-002',
      drawerType: 'SN',
    }

    const result = builder.buildResourceRoute('SYS-002', context)

    expect(result).toEqual(['/compute', 'Pod', 'virtual-pool', 'appliance', 'SYS-002'])
  })

  it('should preserve the resource id in the route', () => {
    const context: ComputeResourceContext = {
      unassigned: false,
      rowId: 'ROW-001',
      rowLocation: 'row-1',
      rackId: 'RCK-001',
      rackLocationId: 'rack-1',
      drawerId: 'DRW-001',
      drawerType: 'SN',
    }

    const result = builder.buildResourceRoute('SYS-123', context)

    expect(result).toEqual(['/compute', 'Pod', 'physical-pool', 'appliance', 'SYS-123'])
  })
})
