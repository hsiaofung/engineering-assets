import { Injectable } from '@angular/core'
import { ComputeResourceContext } from './compute-resource-context.model'

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ComputeRouteBuilder {
  private readonly podId = 'Pod'

  /**
   * Builds the navigation route array for a compute resource.
   * Determines the pool type (virtual or physical) based on the resource context.
   * @param {string} resourceId - The unique identifier of the compute resource.
   * @param {ComputeResourceContext} context - The context containing resource hierarchy and assignment information.
   * @returns {string[]} An array of route segments representing the full path to the resource.
   */
  buildResourceRoute(resourceId: string, context: ComputeResourceContext): string[] {
    const pool = context.unassigned ? 'virtual-pool' : 'physical-pool'

    return ['/compute', this.podId, pool, 'appliance', resourceId]
  }
}
