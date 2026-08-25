export type ComputeTreeNodeKind = 'pod' | 'physical-pool' | 'virtual-pool' | 'row' | 'rack' | 'drawer' | 'system'

export interface ComputeTreeNode {
  id: string
  kind: ComputeTreeNodeKind
  name: string
  parentId?: string
  isLeaf: boolean
}
