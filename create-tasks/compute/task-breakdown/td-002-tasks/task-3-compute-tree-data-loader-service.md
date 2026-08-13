現在 `Model + Mapper + Mapper Test` 都完成了，下一步我會做 **Tree Service / Tree State**，而不是馬上接 Component。

目前架構：

```text
Backend API
    ↓
API Service
    ↓
ComputeTreeMapper       ← 已完成
    ↓
ComputeTreeNode         ← 已完成
    ↓
???                     ← 下一步
    ↓
Tree Component
```

### 下一個 Task：Compute Tree Data Loader / Service

因為你的 API 是 **lazy loading**，所以需要一個東西負責：

* 載入 Pod top-level
* 展開 Physical Pool → 載入 Rows
* 展開 Row → 載入 Rack
* 展開 Rack → 取得 Drawers
* 展開 Drawer → 取得 Systems
* 呼叫 Mapper
* 管理目前 Tree nodes

我會建議先不要把這些邏輯塞進 Component。

例如：

```text id="6jz3fm"
tree/
├── compute-tree-node.model.ts
├── compute-tree.mapper.ts
├── compute-tree.mapper.spec.ts
├── compute-tree.service.ts        ← 下一步
└── compute-tree.service.spec.ts
```

### Service 的責任

例如：

```ts id="m0n5t4"
loadRoot()
loadRows(parentId)
loadRack(parentId)
loadDrawers(parentId)
loadSystems(parentId)
```

概念上：

```text id="u0a8so"
Tree Component
      │
      │ expand Row
      ▼
ComputeTreeService
      │
      ▼
Backend API
      │
      ▼
ComputeTreeMapper
      │
      ▼
ComputeTreeNode[]
      │
      ▼
Tree State
```

### 不過有一個重要的順序

在寫 Service 前，我建議先把**現有 Tree API endpoint 對應關係**整理出來：

```text
Pod
 ↓ API ?

Physical Pool
 ↓ API ?

Row
 ↓ API ?

Rack
 ↓ API ?

Drawer
 ↓ API ?
```

因為你目前給我的 response 已經知道資料長什麼樣，但還不知道每一層實際呼叫哪個 endpoint、需要哪些 parameters。

所以現在最適合的下一步不是直接寫 Service，而是：

> **把 Compute Tree API contract 整理完整。**

你把目前 Tree 使用的 API endpoint / method / request parameter 貼給我，我們就可以直接設計 `ComputeTreeService`。
