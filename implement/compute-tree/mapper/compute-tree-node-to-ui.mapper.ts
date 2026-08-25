import { TreeNode } from '@app/shared/design-system/global-component/tree-view-v1/models/tree-view.types'
import { ComputeTreeNode } from '../models/compute-tree-node.model'

/**
 * Maps compute tree domain nodes to UI tree nodes.
 */
export class ComputeTreeNodeToUiMapper {
  /**
   * Converts a domain `ComputeTreeNode` into a UI `TreeNode`.
   * @param {ComputeTreeNode} node - The domain tree node.
   * @returns {TreeNode<ComputeTreeNode>} A UI tree node.
   */
  toUiTreeNode(node: ComputeTreeNode): TreeNode<ComputeTreeNode> {
    return {
      key: node.id,
      label: node.name,
      leaf: node.isLeaf,
      data: node,
      children: [],
    }
  }
}
