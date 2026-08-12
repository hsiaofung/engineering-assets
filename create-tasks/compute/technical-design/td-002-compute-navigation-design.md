# TD-002 Compute Navigation Design

## 目標（Goal）

定義 Compute Navigation 如何與 Router、Tree View、Navigation View 互動。

Navigation 包含三種獨立操作：

* Expand Node（展開節點）
* Click Node（點擊節點）
* View Switch（切換檢視模式）

---

# Navigation Interaction

## 1. Expand Node（展開節點）

### 目的

* 載入子資源（child resources）。
* 不改變目前 route。

### Flow

```text
使用者點擊展開箭頭
        │
        ▼
載入子資源 (Tree API)
        │
        ▼
更新 Tree
```

### 說明

* Expand 是 Tree 的資料載入行為。
* Expand 失敗不影響目前 route。
* Expand 不負責導航。

---

# 2. Click Node（點擊節點）

### 目的

* 導航至選取的 resource。
* 目標頁面負責載入自己的資料。

### Flow

```text
使用者點擊 Node
        │
        ▼
Router.navigate(resourceId)
        │
        ▼
Routing Resolver
        │
        ▼
Ancestor API
        │
        ▼
Canonical Route
        │
        ▼
Load System List /
Load Physical Assets
```

### 說明

* Tree 只提供 `resourceId`。
* Routing Resolver 負責將 `resourceId` 正規化成 canonical route。
* Tree 不負責組合 route path。
* Selected state 由目前 route 決定，不依賴頁面資料是否成功載入。

---

# 3. View Switch（檢視切換）

### 目的

切換：

* Tree View
* Navigation View

### Flow

```text
使用者點擊 View Switch
        │
        ▼
改變 Active View
        │
        ▼
Render Tree View
或
Render Navigation View
```

### 說明

* View Switch 只改變 presentation layer。
* 切換後需要保留：

  * Selected resourceId
  * Expanded path
  * Tree 狀態
  * Navigation context

---

# Decisions（設計決策）

## Decision 1

Tree Node 代表 Resource，而不是 Hierarchy URL。

---

## Decision 2

Tree 負責展示 Resource。

Tree **不負責 Routing Resolution**。

---

## Decision 3

Expand Node 與 Click Node 是不同操作。

* Expand Node → 載入子資源
* Click Node → 執行導航

---

## Decision 4

Routing Resolution 集中管理於 Compute Routing Resolver。

Tree 只提供：

```text
resourceId
```

---

## Decision 5

Tree Node Model 不依賴 Route Segment 命名。

---

## Decision 6

Physical Pool 與 Virtual Pool 是不同 Navigation Context。

```text
Compute
├── Physical Pool
└── Virtual Pool
```

兩個 context 不共享 Selected State。

---

## Decision 7

Router 是 Navigation State 的 Source of Truth。

Tree 不維護 Route State。

當 route 發生變化：

例如：

* Browser Back / Forward
* Direct URL Access
* 其他頁面導航

Tree 必須根據目前 route 重新取得：

* Selected Node
* Expanded Path

---

## Decision 8

Tree Data Loading 與 Routing 使用不同 API。

```text
Expand Node

↓

Tree API


Click Node

↓

Navigation API
(via Routing Resolver)
```

---

## Decision 9

Expand 是資料載入，Click 是導航。

* Expand failure 不影響目前 route。
* Selected state 永遠由 route 決定。
* Tree 不因 Click 成功與否自行改變 route state。

---

# Decision 10

## Tree Data 在多人環境下採用 Eventual Consistency（最終一致性）

### 原則

* Tree 是 Backend Resource State 的 Client-side Projection。
* Backend 是唯一 Source of Truth。
* Frontend Tree 狀態可能因其他使用者修改 Resource 而暫時過期。
* 需要定義 Tree State Sync Strategy
* 同步時機只有：
  - Current user mutation（自己新增/刪除/移動成功）
  - Node Expand（重新展開時取得最新 children）
  - Manual Refresh（使用者主動重新整理）
  - Page Reload（重新進入頁面）

其他使用者的變更： 不保證立即反映。

* 我們需要支援 Tree 的一致性嗎？
如果答案是「需要」，那 Backend 可能要提供能力，例如：

Tree version API
Subtree refresh API
Resource change event（WebSocket/SSE）

如果答案是「不需要」，那 FE 就可以明確採用 eventual consistency，不需要為了同步把所有已展開節點重新打一遍。

---

## 使用者自己發起的 Mutation

當目前使用者：

* Create Resource
* Delete Resource
* Move Resource

成功後：

* Frontend Tree 應立即反映變化。
* 必要時重新同步 affected subtree。

例如：

```text
User A 刪除 System001

DELETE /system001
        │
        ▼
Backend 成功
        │
        ▼
移除目前 Tree 上的 System001
        │
        ▼
重新同步 Parent Node
```

---

## 其他使用者造成的 Mutation

例如：

User A：

```text
Delete System001
```

User B：

```text
Drawer
 ├── System001
 └── System002
```

User B 的 Tree 可能暫時仍看到 System001。

處理原則：

* 不要求 Tree 即時同步。
* 接受短暫 stale state。
* 透過以下事件重新同步：

  * Node Expand
  * View Switch
  * Route Change
  * Tab Focus
  * Manual Refresh

若產品需要即時更新，可再導入：

* WebSocket
* SSE

---

# Decision 11

- API DTO 和 FE Domain Model 不應該硬要使用相同命名。
- API DTO naming follows backend contract; ComputeTreeNode uses normalized domain naming.
- 這樣未來 API 欄位改名，只需要修改 mapper，不需要修改整個 Tree UI。

```text
             API Layer
                 │
        API-specific DTO
                 │
                 ▼
              Mapper
                 │
                 ▼
       ComputeTreeNode
                 │
                 ▼
             Tree UI
```
## Use case :

不同 resource：

```text
Pod
    name

Physical Pool
    name

Row
    location → name

Rack
    location → name

Drawer
    ?
    
System
    ?
```

如果我們直接把 API 欄位帶進 Domain Model：

```ts
interface ComputeTreeNode {
  id: string
  location?: string
  name?: string
}
```
最後會變成：
```ts
if (node.kind === 'row') {
  node.location
} else if (node.kind === 'system') {
  node.name
}
```
這反而讓 Tree component 很難寫。

所以我會定義一個明確 boundary

```text
             API Layer
                 │
        API-specific DTO
                 │
                 ▼
              Mapper
                 │
                 ▼
       ComputeTreeNode
                 │
                 ▼
             Tree UI
```
例如:

```ts
// API DTO
interface RowResponse {
  id: string
  location: string
  isLeaf: boolean
}
```
轉成:
```ts
// Domain Model
interface ComputeTreeNode {
  id: string
  kind: 'row'
  name: string
  parentId?: string
  isLeaf: boolean
}
```
這樣 Tree UI 永遠只需要：
```html
{{ node.name }}
```
而不用知道：

Row API 叫 location，Rack API 也許叫 location，System API 又可能叫其他東西。

---

# Compute Tree Structure

```text
Pod
│
├── Physical Pool
│      └── Row
│             └── Rack
│                    └── Drawer
│                           └── System
│
└── Virtual Pool
       └── System
```

---

# Node Definition（Node 定義）

每個 Node 包含：

* `nodeType`
* `resourceId`
* `parentId`
* `displayName`

Optional / Derived fields：

* `isExpandable`
* `hasChildren`

---

## Node Identity 原則

Node Identity 使用 Backend Resource Identity。

例如：

```typescript
interface TreeNode {
  nodeType: ResourceType;
  resourceId: string;
  parentId?: string;
  displayName: string;
}
```

不要使用：

```text
parentId + resourceId
```

作為 identity。

原因：

Resource Move 時：

Before:

```text
Rack A
 └── System001
```

After:

```text
Rack B
 └── System001
```

Resource 沒有改變，只是 Parent 改變。

---

# Edge Cases（例外情境）

| Scenario                                      | Handling Principle                            |
| --------------------------------------------- | --------------------------------------------- |
| Expand API 失敗                                 | Tree 顯示該 Node error state，不影響目前 route         |
| 點擊目前已選 Node                                   | No-op 或只 focus Node                           |
| 使用者自己刪除 Resource                              | Mutation 成功後更新 Tree，必要時重新同步 subtree           |
| 其他使用者刪除或修改 Resource                           | Tree 可暫時 stale，透過 sync trigger 更新             |
| Permission 改變導致 Resource 消失                   | Tree 根據目前 route state 重新同步                    |
| Browser Back / Forward / Direct URL           | Tree 根據新 route 重新建立 expanded / selected state |
| Physical Pool 與 Virtual Pool 切換               | 視為不同 Navigation Context，Selected State 不共用    |
| 其他使用者將 System 從 Physical Pool 移到 Virtual Pool | Tree 最終需反映新的 location，Selected Node 需重新 sync  |

---

# Open Questions（待確認事項）

* Tree Cache Strategy：

  * Cache duration
  * Cache invalidation
  * Mutation 後是否自動 refresh expanded node children

* `hasChildren` 是否：

  * 由 Tree API 回傳
  * Client-side 推導

* Resource Change 是否需要 Real-time Synchronization。
