import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ComputeTreeNode } from '../models/compute-tree-node.model'
import { ComputeTreeApiService } from './compute-tree-api.service'

/**
 * Service responsible for loading compute tree data.
 * Acts as a thin wrapper around `ComputeTreeService` for root and child loading.
 */
@Injectable()
export class ComputeTreeLoaderService {
  private readonly treeService = inject(ComputeTreeApiService)

  /**
   * Loads the root pod structure containing virtual and physical pools.
   * @returns {Observable<ComputeTreeNode[]>} An observable emitting the root-level tree nodes.
   */
  loadRoot(): Observable<ComputeTreeNode[]> {
    return this.treeService.loadPod()
  }

  /**
   * Loads the children of a given compute tree node.
   * @param {ComputeTreeNode} node - The parent node whose children should be loaded.
   * @returns {Observable<ComputeTreeNode[]>} An observable emitting the child tree nodes.
   */
  loadChildren(node: ComputeTreeNode) {
    return this.treeService.loadChildren(node)
  }
}
