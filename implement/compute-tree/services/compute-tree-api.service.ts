import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable, of } from 'rxjs'
import { ComputeApiToTreeNodeMapper } from '../mapper/compute-api-to-tree-node.mapper'
import {
  ComputePoolResponse,
  ComputeRackResponse,
  ComputeRowDetailResponse,
  ComputeRowsResponse,
} from '../models/compute-tree-api.model'
import { ComputeTreeNode } from '../models/compute-tree-node.model'

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ComputeTreeApiService {
  private readonly http = inject(HttpClient)
  private readonly mapper = new ComputeApiToTreeNodeMapper()
  private readonly applianceType = 'System'
  private readonly drawerSystems = new Map<string, ComputeTreeNode[]>()

  /**
   * Loads the top-level pod structure containing virtual and physical pools.
   * @returns {Observable<ComputeTreeNode[]>} An observable emitting the virtual-pool and physical-pool tree nodes.
   */
  loadPod(): Observable<ComputeTreeNode[]> {
    return this.http
      .get<ComputePoolResponse>('/rackconfig-service/v1/tree', { params: { applianceType: this.applianceType } })
      .pipe(map((response) => this.mapper.mapPoolResponse(response, 'pod')))
  }

  /**
   * Loads the rows under the physical pool.
   * @returns {Observable<ComputeTreeNode[]>} An observable emitting the row tree nodes under the physical pool.
   */
  loadPhysicalPool(): Observable<ComputeTreeNode[]> {
    return this.http
      .get<ComputeRowsResponse>('/rackconfig-service/v1/tree/root', { params: { applianceType: this.applianceType } })
      .pipe(map((response) => this.mapper.mapRows(response, 'physical-pool')))
  }

  /**
   * Loads the racks belonging to a specific row.
   * @param {string} rowId - The unique identifier of the row.
   * @returns {Observable<ComputeTreeNode[]>} An observable emitting the rack tree nodes under the given row.
   */
  loadRacks(rowId: string): Observable<ComputeTreeNode[]> {
    return this.http
      .get<ComputeRowDetailResponse>(`/rackconfig-service/v1/tree/rows/${rowId}`, {
        params: { applianceType: this.applianceType },
      })
      .pipe(map((response) => this.mapper.mapRacks(response)))
  }

  /**
   * Loads the drawers of a specific rack and caches their systems.
   * Fetches drawer data with appliance type set to "Systems", maps the systems
   * for each drawer into a cache, and returns the drawer tree nodes.
   * @param {string} rackId - The unique identifier of the rack.
   * @returns {Observable<ComputeTreeNode[]>} An observable emitting the drawer tree nodes under the given rack.
   */
  loadDrawers(rackId: string): Observable<ComputeTreeNode[]> {
    return this.http
      .get<ComputeRackResponse>(`/rackconfig-service/v1/tree/racks/${rackId}`, {
        params: {
          applianceType: 'System',
        },
      })
      .pipe(
        map((response) => {
          for (const drawer of response.drawers) {
            this.drawerSystems.set(drawer.id, this.mapper.mapSystems(drawer))
          }

          return this.mapper.mapDrawers(response)
        }),
      )
  }

  /**
   * Loads the child nodes of a given compute tree node based on its kind.
   * Dispatches to the appropriate loader method according to the node type.
   * @param {ComputeTreeNode} node - The parent tree node whose children should be loaded.
   * @returns {Observable<ComputeTreeNode[]>} An observable emitting the child tree nodes, or an empty array for unsupported kinds.
   */
  loadChildren(node: ComputeTreeNode): Observable<ComputeTreeNode[]> {
    switch (node.kind) {
      case 'pod':
        return this.loadPod()

      case 'physical-pool':
        return this.loadPhysicalPool()

      case 'row':
        return this.loadRacks(node.id)

      case 'rack':
        return this.loadDrawers(node.id)

      case 'drawer':
        return of(this.drawerSystems.get(node.id) ?? [])

      default:
        return of([])
    }
  }
}
