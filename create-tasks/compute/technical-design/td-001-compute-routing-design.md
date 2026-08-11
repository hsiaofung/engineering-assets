# 處理：如何找到resource? (URL怎麼產生?)
  ## Router 如何找到正確頁面。
    - Pod level
    - Pool level (Virtual, Physical)
    - Row level
    - Rack level
    - Drawer level
    - Appliance level

---

# 目標是：

- 把 Compute 從 hierarchy-based routing 改成 resource-based routing。

---

# Decisions:
- Decision 1: 從 Hierarchy-based Routing 改成 Resource-based Routing
- Decision 2: Ancestor API Responsibility 放在 Routing Resolver，不放在 Component
- Decision 3: 使用 Canonical URL
- Decision 4: URL 不包含 Ancestor Information
- Decision 5: Neutral Entry Point
- Decision 6: Routing Resolver 負責 Scope 判斷
- Decision 7: Route Migration Strategy

## Compute Routing Design Decisions (整體架構怎麼設計?)

- 採用 Resource-based Routing
- 使用 computeResourceResolveGuard
- Component 不直接呼叫 Ancestor API
- API 透過 ComputeAncestorService 抽象
- Canonical URL 統一由 Route Builder 產生

---

對，**這樣才是最乾淨的設計**。你這個修正也把前面的 route conflict 問題一起解掉了。

我現在會明確建議：

```text
/compute/resource/SYS-001
```

作為 **Neutral Resource Entry Point**。

而不是：

```text
/compute/Pod/SYS-001
```

---

### 為什麼 `/compute/resource/:resourceId` 比較好？

因為你現在既有 routing：

```text
/compute/:podId
/compute/:podId/physical-pool
/compute/:podId/virtual-pool
```

其中：

```text
podId = Pod
```

所以 `/compute/Pod/SYS-001` 其實是在混用兩種語意：

```text
Pod
└── SYS-001
```

看起來像 hierarchy route。

而：

```text
/compute/resource/SYS-001
```

一眼就知道：

> 這不是 hierarchy；這是一個 resource entry。

---

## 最終架構

### 1. User Click

```text
Compute Resource List
        │
        │ systemId = SYS-001
        ▼
/compute/resource/SYS-001
```

Component 完全不需要知道 resource 在哪裡。

---

### 2. Angular Router

```text
/compute/resource/SYS-001
        │
        ▼
computeResourceResolveGuard
```

Guard：

```text
SYS-001
   │
   ▼
Ancestor API
   │
   ▼
Resource Context
```

例如：

```json
{
  "unassigned": true,
  "rowId": "ROW-...",
  "rowLocation": "row-1",
  "rackId": "RCK-...",
  "rackLocationId": "rack-1",
  "drawerId": "DRW-...",
  "drawerType": "SN"
}
```

---

### 3. Resolver 判斷 Scope

```text
unassigned = true
        ↓
virtual-pool
```

或：

```text
unassigned = false
        ↓
physical-pool
```

---

### 4. Route Builder

例如：

```text
/compute/Pod/virtual-pool/appliance/SYS-001
```

或：

```text
/compute/Pod/physical-pool/appliance/SYS-001
```

---

# 這樣「舊 Route」和「新 Entry Route」完全分離

```text
/compute
   │
   ├── /:podId
   │
   ├── /:podId/virtual-pool
   │
   ├── /:podId/physical-pool
   │
   └── /resource/:resourceId       ← NEW
```

甚至你可以把 resource route 放在最前面：

```ts
export const cloudComputeV1Routes: Routes = [
  {
    path: 'resource/:resourceId',
    canActivate: [computeResourceResolveGuard],
  },

  {
    path: '',
    component: CloudComputeV1Component,
    children: [
      // existing hierarchy routes...
    ],
  },
];
```

這樣語意非常清楚。

---

## 而這也讓你原本的 7 個 Decisions 全部串起來

```text
Resource-based Routing
        │
        ▼
/compute/resource/:resourceId
        │
        ▼
Neutral Entry Point
        │
        ▼
computeResourceResolveGuard
        │
        ▼
Ancestor API
        │
        ▼
Scope Resolution
        │
        ▼
Route Builder
        │
        ▼
Canonical URL
```

所以現在我會把你的核心設計定義成：

> **Resource-based routing does not mean the canonical URL contains only the resource ID. It means resource ID is the entry identity, while hierarchy is resolved internally and used only to construct the canonical route.**

這其實就是你原本那個設計最漂亮的地方。

**所以現在 `computeResourceResolveGuard` 我會保留。**
真正要拆出來的是 Guard 裡面的責任：

* `computeResourceResolveGuard` → routing lifecycle / redirect
* `ComputeAncestorService` → 查 ancestor
* `ComputeResourceResolver` → 判斷 scope / 建立 context
* `ComputeRouteBuilder` → context → canonical URL

這樣就不會變成一個「肥大的 Guard」。
