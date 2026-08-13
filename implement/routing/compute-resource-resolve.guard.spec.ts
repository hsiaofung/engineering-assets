import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { firstValueFrom, of, throwError } from 'rxjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ComputeAncestorService } from './compute-ancestor.service'
import { ComputeResourceContext } from './compute-resource-context.model'
import { computeResourceResolveGuard } from './compute-resource-resolve.guard'
import { ComputeRouteBuilder } from './compute-route.builder'

describe('computeResourceResolveGuard', () => {
  let ancestorService: {
    getAncestor: ReturnType<typeof vi.fn>
  }

  let routeBuilder: {
    buildResourceRoute: ReturnType<typeof vi.fn>
  }

  let router: {
    createUrlTree: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    ancestorService = {
      getAncestor: vi.fn(),
    }

    routeBuilder = {
      buildResourceRoute: vi.fn(),
    }

    router = {
      createUrlTree: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ComputeAncestorService,
          useValue: ancestorService,
        },
        {
          provide: ComputeRouteBuilder,
          useValue: routeBuilder,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    })
  })

  /**
   * Creates a mock ActivatedRouteSnapshot for testing purposes.
   * Configures the paramMap to return the provided resourceId when the key is 'resourceId'.
   * @param {string} [resourceId] - Optional resource ID to be returned by paramMap.get('resourceId').
   * @returns {ActivatedRouteSnapshot} A mocked ActivatedRouteSnapshot instance.
   */
  function createRoute(resourceId?: string): ActivatedRouteSnapshot {
    const route = new ActivatedRouteSnapshot()

    Object.defineProperty(route, 'paramMap', {
      value: {
        get: (key: string) => (key === 'resourceId' ? (resourceId ?? null) : null),
      },
    })

    return route
  }

  /**
   * Creates a mock RouterStateSnapshot for testing purposes.
   * @param {string} [resourceId] - Optional resource ID to be included in the URL.
   * @returns {RouterStateSnapshot} A mocked RouterStateSnapshot instance.
   */
  function createRouterState(resourceId?: string): RouterStateSnapshot {
    return {
      root: new ActivatedRouteSnapshot(),
      url: resourceId ? `/compute/resource/${resourceId}` : '/compute/resource',
    } as RouterStateSnapshot
  }

  it('should redirect a physical system to the physical route', async () => {
    const context: ComputeResourceContext = {
      unassigned: false,
      rowId: 'ROW-001',
      rowLocation: 'row-1',
      rackId: 'RCK-001',
      rackLocationId: 'rack-1',
      drawerId: 'DRW-001',
      drawerType: 'SN',
    }

    const commands = ['/compute', 'Pod', 'physical-pool', 'appliance', 'SYS-001']

    const urlTree = {} as UrlTree

    ancestorService.getAncestor.mockReturnValue(of(context))
    routeBuilder.buildResourceRoute.mockReturnValue(commands)
    router.createUrlTree.mockReturnValue(urlTree)

    const result = TestBed.runInInjectionContext(() =>
      computeResourceResolveGuard(createRoute('SYS-001'), createRouterState('SYS-001')),
    )

    const resolvedUrlTree = await firstValueFrom(result as ReturnType<typeof of>)

    expect(ancestorService.getAncestor).toHaveBeenCalledWith('SYS-001')

    expect(routeBuilder.buildResourceRoute).toHaveBeenCalledWith('SYS-001', context)

    expect(router.createUrlTree).toHaveBeenCalledWith(commands)

    expect(resolvedUrlTree).toBe(urlTree)
  })

  it('should redirect a virtual system to the virtual route', async () => {
    const context: ComputeResourceContext = {
      unassigned: true,
      rowId: 'ROW-002',
      rowLocation: 'row-2',
      rackId: 'RCK-002',
      rackLocationId: 'rack-2',
      drawerId: 'DRW-002',
      drawerType: 'SN',
    }

    const commands = ['/compute', 'Pod', 'virtual-pool', 'appliance', 'SYS-002']

    const urlTree = {} as UrlTree

    ancestorService.getAncestor.mockReturnValue(of(context))
    routeBuilder.buildResourceRoute.mockReturnValue(commands)
    router.createUrlTree.mockReturnValue(urlTree)

    const result = TestBed.runInInjectionContext(() =>
      computeResourceResolveGuard(createRoute('SYS-002'), createRouterState('SYS-002')),
    )

    const resolvedUrlTree = await firstValueFrom(result as ReturnType<typeof of>)

    expect(ancestorService.getAncestor).toHaveBeenCalledWith('SYS-002')

    expect(routeBuilder.buildResourceRoute).toHaveBeenCalledWith('SYS-002', context)

    expect(router.createUrlTree).toHaveBeenCalledWith(commands)

    expect(resolvedUrlTree).toBe(urlTree)
  })

  it('should fallback to compute top when resource is invalid', async () => {
    const urlTree = {} as UrlTree

    ancestorService.getAncestor.mockReturnValue(throwError(() => new Error('404 Not Found')))

    router.createUrlTree.mockReturnValue(urlTree)

    const result = TestBed.runInInjectionContext(() =>
      computeResourceResolveGuard(createRoute('XXX-001'), createRouterState('XXX-001')),
    )

    const resolvedUrlTree = await firstValueFrom(result as ReturnType<typeof of>)

    expect(ancestorService.getAncestor).toHaveBeenCalledWith('XXX-001')

    expect(router.createUrlTree).toHaveBeenCalledWith(['/compute'])

    expect(resolvedUrlTree).toBe(urlTree)
  })

  it('should fallback to compute top when ancestor API fails', async () => {
    const urlTree = {} as UrlTree

    ancestorService.getAncestor.mockReturnValue(throwError(() => new Error('Network timeout')))

    router.createUrlTree.mockReturnValue(urlTree)

    const result = TestBed.runInInjectionContext(() =>
      computeResourceResolveGuard(createRoute('SYS-001'), createRouterState('SYS-001')),
    )

    const resolvedUrlTree = await firstValueFrom(result as ReturnType<typeof of>)

    expect(ancestorService.getAncestor).toHaveBeenCalledWith('SYS-001')

    expect(router.createUrlTree).toHaveBeenCalledWith(['/compute'])

    expect(resolvedUrlTree).toBe(urlTree)
  })

  it('should fallback to compute top when resource id is missing', async () => {
    const urlTree = {} as UrlTree

    router.createUrlTree.mockReturnValue(urlTree)

    const result = TestBed.runInInjectionContext(() => computeResourceResolveGuard(createRoute(), createRouterState()))

    expect(ancestorService.getAncestor).not.toHaveBeenCalled()

    expect(router.createUrlTree).toHaveBeenCalledWith(['/compute'])

    expect(result).toBe(urlTree)
  })
})
