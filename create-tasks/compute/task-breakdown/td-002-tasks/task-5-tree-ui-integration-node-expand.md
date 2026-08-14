# 使用既有的 reusable component：

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

---

# 建議結構：
```text
compute/
├── tree/
│   ├── models/
│   │   ├── compute-tree-node.model.ts
│   │   └── compute-tree-api.model.ts
│   ├── compute-tree.mapper.ts
│   ├── compute-tree.service.ts
│   └── compute-tree.component.ts   ← 下一步
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
