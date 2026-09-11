可以。既然現在已經把 **Responsibility、Data Flow、API、Model、Mapper、Page boundary** 都釐清了，我會把下面這版當作最終 Technical Design。

# Compute Drawer Page — Technical Design

## 1. Objective

新增 **Compute Drawer Page**，提供：

1. Drawer 底下的 Systems List
2. Drawer Detail
3. 保留既有 Systems List 的 pagination、reload、sort、filter、selection 與 actions
4. 與既有 Compute resource routing / selection 架構整合

Drawer hierarchy：

```text
Row
└── Rack
    └── Drawer
        └── Systems
```

---

# 2. Final Component Architecture

```text
ComputeSystemsPage
└── ComputeResourceList

ComputeDrawerPage
├── ComputeResourceList
└── DrawerDetail
```

### `ComputeResourceList`

負責所有 Compute resource level 共用的 **Systems List responsibility**：

```text
Pod
Pool
Row
Rack
Drawer
  ↓
ComputeResourceList
  ↓
Systems List
```

System / Appliance level 不使用此 component，因為 System 本身不再包含 Systems List。

---

# 3. Responsibility

## ComputeSystemsPage

負責 Systems page 的 page/container boundary。

不再直接負責：

* API query
* DataLoader
* table state
* DataTable
* System actions

這些責任全部移至 `ComputeResourceList`。

---

## ComputeDrawerPage

負責 Drawer page 的 composition：

```text
ComputeDrawerPage
├── Systems List
└── Drawer Detail
```

它本身不負責 Systems List 的細節。

---

## ComputeResourceList

唯一責任：

> **取得並呈現目前 Compute resource 底下的 Systems。**

包含：

```text
getSystems()
buildQueryParams()
tableState
DataLoader
DataTableV1
onIpAddressClick()
onTaskClick()
selection
```

---

## DrawerDetail

負責：

> **取得並呈現 Drawer 本身的資訊。**

例如：

* Drawer Front View
* Drawer Rear View
* chassis information
* product information
* manufacturer
* form factor
* number of nodes
* power supply
* Systems links

---

# 4. Data Flow

Drawer Page 會有兩條獨立的 data flow。

### Systems List

```text
Compute Selection
      ↓
ComputeResourceList
      ↓
buildQueryParams()
      ↓
DataLoader
      ↓
GET /compute-service/v1/systems
      ↓
System Mapper
      ↓
ComputeSystemModel
      ↓
DataTableV1
```

### Drawer Detail

```text
Compute Selection
      ↓
ComputeDrawerPage
      ↓
DrawerDetail
      ↓
DataLoader
      ↓
GET /compute-service/v1/drawers/{id}
      ↓
Drawer Mapper
      ↓
ComputeDrawerModel
      ↓
Drawer Detail UI
```

兩條 flow **不要合併**。

因為它們是兩個不同 API、不同 response schema、不同 domain responsibility。

---

# 5. Systems API

`ComputeResourceList` 繼續使用：

```text
GET /compute-service/v1/systems
```

依目前 selection 決定 query parameter。

```text
Virtual Pool
→ unassigned=true

Physical Pool
→ unassigned=false

Row
→ row=...

Rack
→ rack=...

Drawer
→ drawer=...
```

Drawer example：

```text
GET /compute-service/v1/systems
  ?drawer=eq.rack-1:21
  &sort=location
  &direction=asc
  &page=1
  &perPage=10
```

因此 `buildQueryParams()` 只需要增加 Drawer case。

---

# 6. Drawer Detail API

Drawer Detail 使用獨立 API：

```text
GET /compute-service/v1/drawers/{id}
```

例如：

```text
GET /compute-service/v1/drawers/eq.DRW-531100e1-7113-4f77-bd93-ab2cd8841a21
```

Response schema：

```text
Drawer
├── id
├── location
├── chassisPartNumber
├── chassisSerialNumber
├── productPartNumber
├── productSerialNumber
├── manufacturer
├── formFactor
├── numberOfNodes
├── powerSupply
└── links[]
```

`links[]` 已經包含 Systems API resource links。

因此 Drawer Detail **不需要再自行查 Systems API**。

Systems List 仍由 `ComputeResourceList` 負責。

---

# 7. Model Design

Model 位於 Compute domain 層，不放在 individual page 底下。

```text
compute/
└── model/
    ├── compute-system-model.ts
    └── compute-drawer-model.ts
```

原因：

* `ComputeSystemModel` 是 Compute domain 的 System model
* `ComputeDrawerModel` 是 Compute domain 的 Drawer model
* 它們不是某個 Page 專屬資料

### System

```text
API System Response
        ↓
ComputeSystemModel
```

### Drawer

```text
API Drawer Response
        ↓
ComputeDrawerModel
```

---

# 8. Mapper Design

因為 System API 與 Drawer API 的 response schema 不同，所以 Mapper 分開。

```text
compute/
└── mapper/
    ├── compute-system-mapper.ts
    └── compute-drawer-mapper.ts
```

Data flow：

```text
System API Response
       ↓
compute-system-mapper
       ↓
ComputeSystemModel
```

```text
Drawer API Response
       ↓
compute-drawer-mapper
       ↓
ComputeDrawerModel
```

**不 copy System Mapper 給 Drawer。**

因為兩者不是同一個 mapping responsibility。

---

# 9. DataLoader

沿用既有 `DataLoaderComponent`。

Drawer Page 會有兩個 DataLoader instance：

```text
ComputeDrawerPage
│
├── DataLoader<Systems>
│     └── ComputeResourceList
│
└── DataLoader<Drawer>
      └── DrawerDetail
```

這兩個 loader 的生命週期彼此獨立。

例如：

```text
Reload Systems
→ 只 refresh Systems DataLoader

Reload Drawer Detail
→ 只 refresh Drawer DataLoader
```

不需要建立新的 DataLoader abstraction。

---

# 10. Resource List State

`ComputeResourceList` 內部擁有：

```text
tableState
DataLoader
DataTableV1
```

因此：

```text
ComputeResourceList
├── tableState
├── DataLoader
└── DataTableV1
```

`tableState` 不再由 Page 持有。

這讓 Resource List 的責任完整封裝：

> query state → API query → data loading → table presentation

---

# 11. Resource Selection

`ComputeResourceList` 透過既有 `ComputeSelectionService` 取得目前 resource selection。

因此：

```text
ComputeSelectionService
        ↓
ComputeResourceList
        ↓
buildQueryParams()
```

Resource List 根據 selection kind 決定 API query。

```text
selection.kind
├── virtual-pool
├── physical-pool
├── row
├── rack
└── drawer
```

這也是 Drawer 能自然加入 Resource List 的原因。

---

# 12. Component Structure

建議最終目錄：

```text
compute/
├── api/
│
├── mapper/
│   ├── compute-system-mapper.ts
│   └── compute-drawer-mapper.ts
│
├── model/
│   ├── compute-system-model.ts
│   └── compute-drawer-model.ts
│
├── navigation/
├── routing/
├── selection/
├── tree/
│
└── pages/
    ├── resource-list/
    │   └── compute-resource-list/
    │       ├── compute-resource-list.component.ts
    │       ├── compute-resource-list.component.html
    │       └── compute-resource-list.component.scss
    │
    ├── systems/
    │   └── compute-systems-page/
    │       ├── compute-systems-page.component.ts
    │       ├── compute-systems-page.component.html
    │       └── compute-systems-page.component.scss
    │
    └── drawer/
        ├── compute-drawer-page/
        │   ├── compute-drawer-page.component.ts
        │   ├── compute-drawer-page.component.html
        │   └── compute-drawer-page.component.scss
        │
        └── drawer-detail/
            ├── drawer-detail.component.ts
            ├── drawer-detail.component.html
            └── drawer-detail.component.scss
```

---

# 13. UI Layout

Drawer Page：

```text
┌───────────────────────────────────────────────┐
│               Systems List                    │
│                                               │
│  Filter / Sort / Reload / Display             │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │             DataTableV1                │  │
│  │                                         │  │
│  │             Systems                    │  │
│  └─────────────────────────────────────────┘  │
│                                               │
├───────────────────┬───────────────────────────┤
│                   │                           │
│ Drawer Front/Rear │      Drawer Detail       │
│                   │                           │
│      1/3          │           2/3             │
│                   │                           │
│                   │  ┌────────┬───────────┐  │
│                   │  │ Title  │ Content   │  │
│                   │  ├────────┼───────────┤  │
│                   │  │ Title  │ Content   │  │
│                   │  └────────┴───────────┘  │
└───────────────────┴───────────────────────────┘
```

Drawer Detail 右側：

```text
DrawerDetail
├── Information
│   ├── Title
│   └── Content
│
├── Chassis
│   ├── Title
│   └── Content
│
├── Product
│   ├── Title
│   └── Content
│
└── ...
```

---

# 14. Copy / Refactoring Strategy

這次不是直接重寫 Systems Page，而是：

```text
Existing ComputeSystemsPage
        ↓
Extract
        ↓
ComputeResourceList
        ↓
SystemsPage uses ResourceList
        ↓
DrawerPage uses ResourceList
```

實作順序建議：

### Step 1 — Extract Resource List

從 `ComputeSystemsPage` 搬移：

```text
getSystems()
buildQueryParams()
tableState
DataLoader
DataTable
onIpAddressClick()
onTaskClick()
selection
```

Systems Page 改成使用：

```html
<app-compute-resource-list />
```

先確保既有 Systems Page 行為完全不變。

### Step 2 — Add Drawer query

在 `buildQueryParams()` 增加：

```text
drawer
```

case。

### Step 3 — Create Drawer Model / Mapper

建立：

```text
ComputeDrawerModel
ComputeDrawerMapper
```

### Step 4 — Create DrawerDetail

使用 Drawer API：

```text
/drawers/{id}
```

### Step 5 — Compose Drawer Page

```text
ComputeDrawerPage
├── ComputeResourceList
└── DrawerDetail
```

### Step 6 — Tests

每一步完成後先跑相關 tests，再進下一步。

---

# 15. Final Design Decision

最後整體架構可以濃縮成：

```text
                    ComputeSelectionService
                              │
                              ▼
                     ComputeResourceList
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
             DataLoader              tableState
                  │
                  ▼
             /systems
                  │
                  ▼
          ComputeSystemModel
                  │
                  ▼
             DataTableV1


ComputeDrawerPage
       │
       ├────────────── ComputeResourceList
       │
       └────────────── DrawerDetail
                           │
                       DataLoader
                           │
                       /drawers/{id}
                           │
                           ▼
                   ComputeDrawerModel
```

### 核心設計原則

> **`ComputeResourceList` 抽象的是「Systems List responsibility」，而不是「某個 Page」。**

所以它可以被：

```text
Pool
Row
Rack
Drawer
```

共同使用，而 System / Appliance level 不使用。

而：

> **Model 依 domain responsibility 共用；Mapper 依 API response schema 分離；Page 依 use case 分離。**

這版我認為已經可以作為正式 Technical Design，後續 implementation 就按照這個 boundary 做，不需要再為了 DRY 做第二輪架構調整。
