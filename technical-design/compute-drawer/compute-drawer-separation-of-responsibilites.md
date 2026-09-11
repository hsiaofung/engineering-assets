可以。現在把 **System、Drawer、共用 List、Drawer Detail、Routing** 的責任重新切乾淨，會比較容易進入 technical design。

### 1. `ComputeSystemsPage`

**責任：決定「要查哪些 System」**

```text
compute/pages/systems/
└── compute-systems-page/
```

負責：

* 取得目前 Compute Tree / Selection
* 根據 selection 決定 System API query
* System-specific query：

  * Virtual Pool → `unassigned=true`
  * Physical Pool → `unassigned=false`
  * Row → `row=...`
  * Rack → `rack=...`
* 呼叫 `/compute-service/v1/systems`
* 把查詢結果交給 `ComputeResourceList`

**不負責：**

* List UI
* pagination UI
* sort UI
* filter UI
* System row 的 rendering

---

### 2. `ComputeDrawerPage`

**責任：決定「要看哪一個 Drawer，以及 Drawer 的整體頁面」**

```text
compute/pages/drawer/
└── compute-drawer-page/
```

負責：

* 取得目前 Drawer
* 查詢這個 Drawer 的相關資料
* 組合 Drawer page layout
* 上半部放 System List
* 下半部放 Drawer detail
* Drawer-specific query，例如取得這個 Drawer 裡的 Systems

概念：

```text
ComputeDrawerPage
├── ComputeResourceList
│   └── Drawer 裡的 Systems
│
└── Drawer Detail
    ├── Front View
    ├── Rear View
    └── Drawer Information
```

**重點：**

> `ComputeDrawerPage` 代表「一個 Drawer」，不是 Drawer collection。

---

### 3. `ComputeResourceList`

**責任：決定「System List 怎麼呈現」**

```text
compute/pages/compute-resource-list/
```

這是 **Compute-specific shared component**，不是全專案 generic `ResourceList`。

負責：

* pagination
* reload
* sort
* display
* filter UI / behavior
* System list table
* System row rendering
* shared System model
* shared API → UI mapper
* 共用的 row actions，例如：

  * IP address → System resource page
  * Task → Execution History

它可以被：

```text
ComputeSystemsPage
        ↓
ComputeResourceList

ComputeDrawerPage
        ↓
ComputeResourceList
```

兩邊共用同一套 List schema。

---

### 4. `DrawerDetail`

**責任：決定「一個 Drawer 怎麼呈現」**

```text
compute/pages/drawer/
└── drawer-detail/
```

負責：

```text
Drawer
├── Front View
├── Rear View
└── Information Card
    ├── Section A
    └── Section B
```

它不應該知道：

* System List 怎麼查
* Tree selection 怎麼轉 query
* routing 怎麼 resolve
* System table 怎麼 pagination

它只處理 Drawer detail 的 presentation。

---

### 5. `model / mapper`

因為 System 和 Drawer page 裡面的 System List 是同一套資料，因此：

```text
compute/pages/compute-resource-list/
├── model/
│   └── compute-resource-list-model.ts
└── mapper/
    └── compute-api-to-resource-list.ts
```

**共用。**

這也避免：

```text
systems/
├── model/
└── mapper/

drawer/
├── model/
└── mapper/
```

產生重複。

---

### 6. `routing/`

這個責任維持不變。

```text
compute/routing/
├── compute-ancestor.service.ts
├── compute-route.builder.ts
└── compute-resource-resolve.guard.ts
```

它只負責：

```text
resourceId
   ↓
Ancestor API
   ↓
resource context
   ↓
Route Builder
   ↓
canonical route
```

也就是：

> **「這個 resourceId 應該導向哪個 canonical Compute route？」**

不是一般的 navigation service。

---

## 最後可以濃縮成這張責任表

| 元件                    | 核心責任                             |
| --------------------- | -------------------------------- |
| `ComputeSystemsPage`  | **查哪些 Systems**                  |
| `ComputeDrawerPage`   | **看哪一個 Drawer、組合整個 Drawer page** |
| `ComputeResourceList` | **Systems 怎麼列**                  |
| `DrawerDetail`        | **Drawer 怎麼呈現**                  |
| `model / mapper`      | **System list 的資料模型與轉換**         |
| `routing/`            | **resourceId → canonical route** |

最重要的一句可以記成：

> **Page 負責「資料從哪裡來、要查什麼」；List 負責「怎麼列」；Detail 負責「怎麼呈現」；Routing 負責「怎麼找到正確的 resource route」。**

這樣目前的邊界就很清楚，而且沒有為了「抽象化」而過度設計。
