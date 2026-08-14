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

## 使用既有的 reusable component：

```html
<app-tree-view-v1
  [data]="data()"
  [loading]="loading()"
  [loadingKeys]="loadingKeys()"
  [(selectedKey)]="selectedKey"
  [(expandedKeys)]="expandedKeys"
  (nodeExpand)="onNodeExpand($event)"
  (nodeClick)="onNodeClick($event)"
/>
```
因此 Compute Tree 不需要自己實作：

Tree rendering
expand/collapse UI
keyboard navigation
selection UI
loading UI
empty state
search infrastructure

這些由 TreeViewV1Component 負責。

## 建議結構：
```text
compute/
├── tree/
│   ├── models/
│   │   ├── compute-tree-node.model.ts
│   │   └── compute-tree-api.model.ts
│   ├── compute-tree.mapper.ts
│   ├── compute-tree.service.ts
│   └── compute-tree.component.ts   ← 下一步

---

# 驗收

- Compute Tree 可以顯示
- Root data 可以載入
- Row → Rack 可以 expand
- Rack → Drawer 可以 expand
- Drawer → System 可以正確顯示
- loading indicator 正確
- API error 不會讓頁面 crash
- node selection 正常


---


```

---

# 負責：

```text
ComputeTreeComponent
       │
       ├── ComputeTreeService
       │       ↓
       │      API 
       |       ↓
       |     Mapper
       |       ↓
       |    ComputeTreeNode[]
       |       ↓
       |    ComputeTreeComponent     
       |       ↓
       |     TreeNode[]
       |       ↓              
       └── TreeViewV1Component
```

也就是：

ComputeTreeComponent 負責「Compute Tree 的行為」，TreeViewV1Component 負責「Tree UI」。
