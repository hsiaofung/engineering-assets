# Title

Implement ComputeTreeService for Compute Tree data loading

# Purpose
- 建立 Compute Tree API service 
```text
compute-tree.service.ts
```

# 內容
建立：
```ts
loadPod()
loadPhysicalPool()
loadRacks()
loadDrawers()
loadChildren()
```
並處理：
```ts
applianceType: 'Systems'
```

以及 Drawer → System 的資料關係。

--- 

# 負責
```text
loadPod()
loadPhysicalPool()
loadRacks(rowId)
loadDrawers(rackId)
loadChildren(node)

因為你的 API 是 **lazy loading**，所以需要一個東西負責：

* 載入 Pod top-level
* 展開 Physical Pool → 載入 Rows
* 展開 Row → 載入 Rack
* 展開 Rack → 取得 Drawers
* 展開 Drawer → 取得 Systems
* 呼叫 Mapper
* 管理目前 Tree nodes
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

---

# 目前架構：

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

---

# API hierarchy：
```text
Pod
 │
 ├── Virtual Pool
 │
 └── Physical Pool
      │
      └── Row
           │
           └── Rack
                │
                ├── Drawer
                │    └── System
                │
                └── ...
```    
並統一透過：
```text
loadChildren(node: ComputeTreeNode)
```
根據 node.kind dispatch 到對應 API。

---            

### 檔案架構
```text id="6jz3fm"
tree/
├── compute-tree-node.model.ts
├── compute-tree.mapper.ts
├── compute-tree.mapper.spec.ts
├── compute-tree.service.ts        ← 下一步
└── compute-tree.service.spec.ts
```

# 驗收

- Pod API 可以取得 Virtual / Physical Pool
- Physical Pool 可以取得 Row
- Row 可以取得 Rack
- Rack 可以取得 Drawer
- Drawer 對應的 System 可以正確取得
- Service 使用 Mapper 轉換資料

---

# handle rack -> drawer/system data

Backend 的 Rack API 一次回傳：

```text
Rack
 ├── Drawer
 │    ├── System
 │    └── System
 └── Drawer
      └── System
```

因此不建立 Drawer API。(後端沒有提供Drawer API)

Service 在取得 Rack response 時，同時保存 Drawer → System mapping：

```ts
this.drawerSystems.set(
  drawer.id,
  this.mapper.mapSystems(drawer)
)
```

這解決：

Drawer 與 System 都由 Rack API 提供，但 System 必須等使用者展開 Drawer 後才顯示。




