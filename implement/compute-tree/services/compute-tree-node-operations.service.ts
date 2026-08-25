import { inject, Injectable } from '@angular/core'
import { TreeNode } from '@app/shared/design-system/global-component/tree-view-v1/models/tree-view.types'
import { ComputeTreeNodeToUiMapper } from '../mapper/compute-tree-node-to-ui.mapper'
import { ComputeTreeNode } from '../models/compute-tree-node.model'

/**
 *
 */
@Injectable()
export class ComputeTreeNodeOperationsService {
  private readonly treeNodeToUiMapper = inject(ComputeTreeNodeToUiMapper)

  /**
   * Recursively updates the children of a specific node.
   * @param {TreeNode<ComputeTreeNode>[]} nodes - Current tree structure.
   * @param {string} parentKey - Parent node key.
   * @param {ComputeTreeNode[]} children - New children.
   * @returns {TreeNode<ComputeTreeNode>[]} Updated tree structure.
   */
  updateChildren(
    nodes: TreeNode<ComputeTreeNode>[],
    parentKey: string,
    children: ComputeTreeNode[],
  ): TreeNode<ComputeTreeNode>[] {
    return nodes.map((node) => {
      if (node.key === parentKey) {
        return {
          ...node,
          children: children.map((child) => this.treeNodeToUiMapper.toUiTreeNode(child)),
        }
      }

      if (node.children?.length) {
        return {
          ...node,
          children: this.updateChildren(node.children, parentKey, children),
        }
      }

      return node
    })
  }

  /**
   * Finds a tree node by ID.
   * @param {TreeNode<ComputeTreeNode>[]} nodes - Tree nodes to search.
   * @param {string} id - The target node ID.
   * @returns {TreeNode<ComputeTreeNode> | null} The matching node.
   */
  findNode(nodes: TreeNode<ComputeTreeNode>[], id: string): TreeNode<ComputeTreeNode> | null {
    for (const node of nodes) {
      if (node.key === id) {
        return node
      }

      if (node.children?.length) {
        const result = this.findNode(node.children, id)

        if (result) {
          return result
        }
      }
    }

    return null
  }

  /**
   * Finds the first tree node matching the specified kind.
   * @param {TreeNode<ComputeTreeNode>[]} nodes - Tree nodes to search.
   * @param {ComputeTreeNode['kind']} kind - The target node kind.
   * @returns {TreeNode<ComputeTreeNode> | null} The matching node.
   */
  findNodeByKind(nodes: TreeNode<ComputeTreeNode>[], kind: ComputeTreeNode['kind']): TreeNode<ComputeTreeNode> | null {
    for (const node of nodes) {
      if (node.data?.kind === kind) {
        return node
      }

      if (node.children?.length) {
        const result = this.findNodeByKind(node.children, kind)

        if (result) {
          return result
        }
      }
    }

    return null
  }
}
