import { ComputeTreeNode } from '../models/compute-tree-node.model'

import {
  ComputeDrawerResponse,
  ComputePoolResponse,
  ComputeRackResponse,
  ComputeRowDetailResponse,
  ComputeRowsResponse,
} from '../models/compute-tree-api.model'

/**
 * Mapper class responsible for transforming compute resource API responses
 * into hierarchical tree node structures used by the compute tree view.
 */
export class ComputeApiToTreeNodeMapper {
  /**
   * Maps a compute pool response into virtual and physical pool tree nodes.
   * @param {ComputePoolResponse} response - The pool response containing virtual and physical pool data.
   * @param {string} parentId - The ID of the parent node in the tree.
   * @returns {ComputeTreeNode[]} An array containing the virtual-pool and physical-pool tree nodes.
   */
  mapPoolResponse(response: ComputePoolResponse, parentId: string): ComputeTreeNode[] {
    return [
      {
        id: 'virtual-pool',
        kind: 'virtual-pool',
        name: 'Virtual Pool',
        parentId,
        isLeaf: response.virtualPool.isLeaf,
      },
      {
        id: 'physical-pool',
        kind: 'physical-pool',
        name: 'Physical Pool',
        parentId,
        isLeaf: response.physicalPool.isLeaf,
      },
    ]
  }

  /**
   * Maps a list of compute rows into tree nodes.
   * @param {ComputeRowsResponse} response - The response containing row items.
   * @param {string} parentId - The ID of the parent node in the tree.
   * @returns {ComputeTreeNode[]} An array of row tree nodes.
   */
  mapRows(response: ComputeRowsResponse, parentId: string): ComputeTreeNode[] {
    return response.items.map((row) => ({
      id: row.id,
      kind: 'row',
      name: row.location,
      parentId,
      isLeaf: row.isLeaf,
    }))
  }

  /**
   * Maps a single compute rack response into a tree node.
   * @param {ComputeRowDetailResponse} response - The rack response data.
   * @returns {ComputeTreeNode} A single rack tree node.
   */
  mapRacks(response: ComputeRowDetailResponse): ComputeTreeNode[] {
    return response.racks.map((rack) => ({
      id: rack.id,
      kind: 'rack',
      name: rack.location,
      parentId: response.id,
      isLeaf: rack.isLeaf,
    }))
  }

  /**
   * Maps drawers from a rack response into tree nodes.
   * @param {ComputeRackResponse} response - The rack response containing drawer data.
   * @returns {ComputeTreeNode[]} An array of drawer tree nodes.
   */
  mapDrawers(response: ComputeRackResponse): ComputeTreeNode[] {
    return response.drawers.map((drawer) => ({
      id: drawer.id,
      kind: 'drawer',
      name: drawer.location,
      parentId: response.id,
      isLeaf: drawer.systems.length === 0,
    }))
  }

  /**
   * Maps systems from a drawer response into tree nodes.
   * @param {ComputeDrawerResponse} response - The drawer response containing system data.
   * @returns {ComputeTreeNode[]} An array of system tree nodes (always leaf nodes).
   */
  mapSystems(response: ComputeDrawerResponse): ComputeTreeNode[] {
    return response.systems.map((system) => ({
      id: system.id,
      kind: 'system',
      name: system.location,
      parentId: response.id,
      isLeaf: true,
    }))
  }
}
