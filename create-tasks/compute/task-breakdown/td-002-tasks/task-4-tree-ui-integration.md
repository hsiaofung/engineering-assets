1. 先做 ComputeTreeContainer

建議結構：

compute/
├── tree/
│   ├── models/
│   │   ├── compute-tree-node.model.ts
│   │   └── compute-tree-api.model.ts
│   ├── compute-tree.mapper.ts
│   ├── compute-tree.service.ts
│   └── compute-tree.component.ts   ← 下一步

它負責：

ComputeTreeComponent
       │
       ├── ComputeTreeService
       │       ↓
       │   API / Mapper
       │
       └── TreeViewV1Component

也就是：

ComputeTreeComponent 負責「Compute Tree 的行為」，TreeViewV1Component 負責「Tree UI」。