import { TreeNode } from '@app/shared/design-system/global-component/tree-view-v1/models/tree-view.types'
import { ComputeSelectionContext } from '../../selection/compute-selection-context.model'
import { ComputeDrawerAncestor, ComputeSystemAncestor } from '../../selection/compute-selection-restore.service'
import { ComputeTreeNode } from './compute-tree-node.model'

export interface ComputeTreeSelectionRestoreState {
  getData(): TreeNode<ComputeTreeNode>[]
  setData(data: TreeNode<ComputeTreeNode>[]): void

  expand(node: TreeNode<ComputeTreeNode>): void

  addLoadingKey(key: string): void
  removeLoadingKey(key: string): void

  findNode(id: string): TreeNode<ComputeTreeNode> | null
  findNodeByKind(kind: ComputeTreeNode['kind']): TreeNode<ComputeTreeNode> | null

  updateChildren(
    nodes: TreeNode<ComputeTreeNode>[],
    parentKey: string,
    children: ComputeTreeNode[],
  ): TreeNode<ComputeTreeNode>[]

  select(node: ComputeTreeNode, target: ComputeSelectionContext): void
}

export interface ComputeTreeSelectionRestoreResult {
  row: ComputeTreeNode
  rack: ComputeTreeNode
  drawer: ComputeTreeNode
  ancestor: ComputeDrawerAncestor
}

export interface ComputeTreeSystemSelectionRestoreResult {
  row: ComputeTreeNode
  rack: ComputeTreeNode
  drawer: ComputeTreeNode
  system: ComputeTreeNode
  ancestor: ComputeSystemAncestor
}

/**
 * Action type indicating how a tree selection should be restored based on the target kind.
 */
export type ComputeTreeSelectionRestoreAction = 'pool' | 'row' | 'rack' | 'drawer' | 'system' | 'none'
