# Purpose

- 更新 Compute Tree 的資料模型以符合 SCC 4.0。
- 將 Compute domain tree 與 UI TreeView 的資料結構解耦。
- Service 不直接處理 API response structure，Component 也不需要知道 Backend schema。

# Scope
- 定義 Tree Node model
- 支援 Physical Pool
- 支援 Virtual Pool
- 支援 Row / Rack / Drawer / System

# 內容
- 建立 ComputeTreeNode
- 定義 ComputeTreeNodeKind
- 定義：
    - id
    - kind
    - name
    - parentId
    - isLeaf
- 建立 API response models

# Acceptance Criteria
- 定義一個可以支援 lazy-loaded hierarchy 的 Compute Tree Node Model。
- Tree 可以表示所有 Compute Resource
- Node Model 與 Routing Model 一致
- Compute Tree domain model 完成
- TypeScript compile pass
- Model spec 明確

# 建立 Compute Tree 專用的 domain model。

```text 
tree/
└── models/
    ├── compute-tree-api.model.ts
    └── compute-tree-node.model.ts
```

# 定義：

```ts
export type ComputeTreeNodeKind =
  | 'pod'
  | 'physical-pool'
  | 'virtual-pool'
  | 'row'
  | 'rack'
  | 'drawer'
  | 'system'

export interface ComputeTreeNode {
  id: string
  kind: ComputeTreeNodeKind
  name: string
  parentId?: string
  isLeaf: boolean
}
```
