import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { catchError, map, of } from 'rxjs'

import { ComputeAncestorService } from './compute-ancestor.service'
import { ComputeRouteBuilder } from './compute-route.builder'

export const computeResourceResolveGuard: CanActivateFn = (route) => {
  const router = inject(Router)
  const ancestorService = inject(ComputeAncestorService)
  const routeBuilder = inject(ComputeRouteBuilder)

  const resourceId = route.paramMap.get('resourceId')

  if (!resourceId) {
    return router.createUrlTree(['/compute'])
  }

  return ancestorService.getAncestor(resourceId).pipe(
    map((context) => {
      const commands = routeBuilder.buildResourceRoute(resourceId, context)

      return router.createUrlTree(commands)
    }),
    catchError(() => {
      return of(router.createUrlTree(['/compute']))
    }),
  )
}
