# Title
Implement ComputeTreeComponent

# 內容
建立：
```text
compute/
└── tree/
    ├── compute-tree.component.ts
    ├── compute-tree.mapper.ts
    ├── compute-tree.service.ts
    └── models/
```
Component 負責：
- 建立 compute-tree.component.ts
- 呼叫 ComputeTreeService
- 整合 TreeViewV1Component
- 管理 tree data
- 管理 loading state
- 管理 loading keys
- 管理 selected key
- 管理 expanded keys
- 實作 loadRoot()
- 將 ComputeTreeNode 轉成 UI TreeNode(實作 domain model → UI model 的轉換)
- 處理 node click
- 處理 node expand
- lazy loading children

```ts
private toTreeNode(node: ComputeTreeNode): TreeNode<ComputeTreeNode>
```

```text
ComputeTreeService
       ↓
ComputeTreeComponent
       ↓
TreeViewV1Component
```

Component 負責 UI state：

```text
data
loading
loadingKeys
selectedKey
expandedKeys
```

以及：
```ts
onNodeExpand()
onNodeClick()
```

# 驗收

- Compute Tree 可以顯示
- Root data 可以載入
- Row → Rack 可以 expand
- Rack → Drawer 可以 expand
- Drawer → System 可以正確顯示
- loading indicator 正確
- API error 不會讓頁面 crash
- node selection 正常