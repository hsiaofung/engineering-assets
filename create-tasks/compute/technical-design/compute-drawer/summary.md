可以。這次以你剛確認的架構為準，整理成一份**可以直接拿去實作的 Technical Design**。

# Compute Drawer Technical Design

## 1. Goal

新增 `ComputeDrawerPage`，呈現單一 Drawer 及其包含的 Systems。

頁面分成上下兩個區域：

```text
┌──────────────────────────────────────────────────┐
│                  System List                     │
│ Pagination / Reload / Sort / Display / Filter    │
├──────────────────────┬───────────────────────────┤
│                      │                           │
│   Drawer Front View  │      Drawer Information   │
│                      │                           │
│   Drawer Rear View   │      ...                  │
│                      │                           │
└──────────────────────┴───────────────────────────┘
```

---

# 2. Component Architecture

固定的 component hierarchy：

```text
ComputeDrawerPage
│
└── DataLoader
    │
    ├── ComputeResourceList
    │
    └── DrawerDetail
```

Template：

```html
<app-data-loader
  #dataLoader="dataLoader"
  [getFn]="getSystems"
>
  <app-compute-resource-list
    [tableState]="tableState"
    (selectionChange)="onSelectionChange($event)"
  />

  <app-drawer-detail
    [data]="dataLoader.data()"
  />
</app-data-loader>
```

這個 hierarchy 是設計的一部分：

> `ComputeResourceList` 永遠是 `DataLoader` 的直接 child。

因此 ResourceList 可以透過 Angular DI 取得 parent `DataLoader`。

---

# 3. Responsibility

## ComputeDrawerPage

負責：

* Drawer resource context
* Drawer-specific query
* `getSystems()`
* `tableState`
* 組合 Drawer Page

核心責任：

> **決定要查什麼。**

---

## DataLoader

使用現有 `DataLoaderComponent<T>`。

負責：

* 執行 `getFn`
* API request lifecycle
* `data`
* `isLoading`
* `error`
* `refresh()`

核心責任：

> **負責取得與管理 API data。**

---

## ComputeResourceList

負責：

* System List UI
* DataTable
* pagination UI
* filter UI
* sort UI
* reload UI
* selection UI
* System List navigation actions

核心責任：

> **負責 System List 怎麼呈現與操作。**

ResourceList **不負責 API request，也不持有 resource-specific query。**

---

## DrawerDetail

負責：

* Drawer Front View
* Drawer Rear View
* Drawer Information

核心責任：

> **負責 Drawer 怎麼呈現。**

不負責 API request。

---

# 4. Data Flow

Drawer：

```text
Drawer Selection
      │
      ↓
ComputeDrawerPage
      │
      ├── tableState
      │
      └── getSystems()
              │
              ↓
          DataLoader
              │
              ↓
       Systems API
              │
              ↓
   ComputeSystemsUiResponse
          ↙          ↘
         ↓            ↓
ComputeResourceList  DrawerDetail
```

因此同一份 API data 可以同時被：

```text
ComputeResourceList
DrawerDetail
```

使用。

---

# 5. DataLoader / ResourceList Relationship

這是本次設計的重要決定。

`ComputeResourceList` 不接：

```html
[getFn]="getSystems"
```

因為 `getSystems()` 取得的資料不只是 List 使用，DrawerDetail 也需要。

因此：

```text
DataLoader
├── data
│
├── ComputeResourceList
└── DrawerDetail
```

DataLoader 是兩者共同的 data owner。

---

# 6. ResourceList 如何取得 DataLoader

因為 architecture 保證：

```text
DataLoader
└── ComputeResourceList
```

所以 ResourceList 可以透過 Angular DI 取得 parent `DataLoaderComponent`。

概念：

```ts
private readonly dataLoader = inject(DataLoaderComponent)
```

必要時使用 host/parent DI 限制，避免往更上層尋找。

因此 ResourceList 不需要：

```html
[data]="dataLoader.data()"
[loading]="dataLoader.isLoading()"
[error]="..."
```

這些都可以直接從 parent DataLoader 取得。

---

# 7. ComputeResourceList State

`tableState` **不搬進 ResourceList**。

原因是：

```text
tableState
    ↓
getSystems()
    ↓
buildQueryParams()
    ↓
API
```

它不只是 UI state，而是 **API query state**。

因此由 Page 持有：

```text
ComputeDrawerPage
│
├── tableState
│
├── getSystems()
│
└── DataLoader
      └── ComputeResourceList
```

ResourceList 接收：

```html
[tableState]="tableState"
```

用來控制 DataTable。

---

# 8. DataTable Event Flow

`DataTableV1` 被 `ComputeResourceList` 包住：

```text
ComputeResourceList
└── DataTableV1
```

DataTable events：

```text
filterChange
sortChange
pageChange
reload
selectionChange
```

不需要全部 Output 回 Page。

ResourceList 直接處理：

```text
DataTableV1
    ↓
ComputeResourceList
    │
    ├── tableState.onFilterChange()
    ├── tableState.onSortChange()
    ├── tableState.onPageChange()
    ├── dataLoader.refresh()
    │
    └── selectionChange → Output
```

所以：

```text
filterChange
sortChange
pageChange
reload
```

都是 **ResourceList 內部處理的 List 操作**。

只有真正需要 Page 知道的：

```text
selectionChange
```

才 Output。

---

# 9. Event Flow

例如 Filter：

```text
DataTableV1
   │
   ↓ filterChange
ComputeResourceList
   │
   ↓
tableState.onFilterChange()
   │
   ↓
signal state changed
   │
   ↓
getSystems() dependency changed
   │
   ↓
DataLoader effect
   │
   ↓
API
```

Sort / Page 也是相同概念。

Reload：

```text
DataTableV1
   │
   ↓ reload
ComputeResourceList
   │
   ↓
parent DataLoader.refresh()
   │
   ↓
getSystems()
   │
   ↓
API
```

---

# 10. ResourceList Contract

因此 `ComputeResourceList` 的 public contract 可以非常小：

```text
ComputeResourceList
│
├── Input
│   └── tableState
│
└── Output
    └── selectionChange
```

Data 不需要 Input。

因為：

```text
ComputeResourceList
        │
        ↓
inject parent DataLoader
        │
        └── data()
```

同樣：

```text
loading
error
refresh
```

也不需要透過 Input 傳入。

---

# 11. Drawer API

目前只使用一個 API：

```http
GET /compute-service/v1/systems
```

Drawer query：

```http
GET /compute-service/v1/systems
  ?drawer=eq.rack-1:21
  &sort=location
  &direction=asc
  &page=1
  &perPage=10
```

Drawer location：

```ts
const drawerLocation = selection.parentName
  ? `${selection.parentName}:${selection.name}`
  : selection.name
```

例如：

```text
parentName = rack-1
name = 21

→ drawer=eq.rack-1:21
```

不新增 Drawer Detail API。

---

# 12. Query Responsibility

### System Page

```text
ComputeSystemsPage
       │
       ↓
buildQueryParams(selection)
       │
       ↓
Systems API
```

支援：

```text
Virtual Pool → unassigned=true
Physical Pool → unassigned=false
Row → row=...
Rack → rack=...
```

### Drawer Page

```text
ComputeDrawerPage
       │
       ↓
buildQueryParams(selection)
       │
       ↓
drawer=eq.${parentName}:${name}
       │
       ↓
Systems API
```

因此兩個 Page 都使用相同的：

```text
DataLoader
ComputeResourceList
System Model
Mapper
```

但 query 由各自 Page 決定。

---

# 13. Shared Resource List

因為 System Page 與 Drawer Page 都顯示同一種 Compute System：

```text
same API model
same UI model
same mapper
same columns
same actions
same DataTable behavior
```

抽出：

```text
compute-resource-list/
```

而不是 generic：

```text
resource-list/
```

原因：

> 這個 List 是 Compute domain-specific abstraction，不是全系統 generic resource list。

---

# 14. Shared Model / Mapper

移至：

```text
compute/pages/compute-resource-list/
├── model/
│   └── compute-resource-list-model.ts
│
└── mapper/
    └── compute-api-to-resource-list.ts
```

System 與 Drawer 共用。

---

# 15. Navigation

以下 System actions 在 System Page 與 Drawer Page 都相同：

```text
IP Address
Task Execution
```

直接由 `ComputeResourceList` 處理。

不另外建立 navigation abstraction。

---

# 16. File Structure

```text
compute/
├── api/
├── doc/
├── navigation/
│
├── pages/
│   │
│   ├── compute-resource-list/
│   │   ├── compute-resource-list.component.ts
│   │   ├── compute-resource-list.component.html
│   │   ├── compute-resource-list.component.scss
│   │   │
│   │   ├── model/
│   │   │   └── compute-resource-list-model.ts
│   │   │
│   │   └── mapper/
│   │       └── compute-api-to-resource-list.ts
│   │
│   ├── systems/
│   │   └── compute-systems-page/
│   │       ├── compute-systems-page.component.ts
│   │       ├── compute-systems-page.component.html
│   │       └── compute-systems-page.component.scss
│   │
│   └── drawer/
│       ├── compute-drawer-page/
│       │   ├── compute-drawer-page.component.ts
│       │   ├── compute-drawer-page.component.html
│       │   └── compute-drawer-page.component.scss
│       │
│       └── drawer-detail/
│           ├── drawer-detail.component.ts
│           ├── drawer-detail.component.html
│           └── drawer-detail.component.scss
│
├── routing/
├── selection/
└── tree/
```

---

# 17. Final Responsibility Matrix

| Component             | Responsibility                           |
| --------------------- | ---------------------------------------- |
| `ComputeSystemsPage`  | 決定 System query                          |
| `ComputeDrawerPage`   | 決定 Drawer query + 組合 Drawer Page         |
| `DataLoader`          | 執行 `getFn`、管理 data/loading/error/refresh |
| `ComputeResourceList` | System List UI + List 操作                 |
| `DrawerDetail`        | Drawer Front/Rear/Information            |
| `model`               | Shared System List model                 |
| `mapper`              | API → UI mapping                         |
| `routing`             | resourceId → canonical route             |

---

# 18. Core Design Principle

最後濃縮成：

```text
Page
  → 查什麼

DataLoader
  → 怎麼取得資料

ComputeResourceList
  → System List 怎麼呈現與操作

DrawerDetail
  → Drawer 怎麼呈現

Routing
  → resource route 怎麼解析
```

整體：

```text
                    ComputeDrawerPage
                    │
             ┌──────┴──────┐
             │             │
        tableState      getSystems()
             │             │
             └──────┬──────┘
                    ↓
                DataLoader
                    │
             ComputeSystemsUiResponse
                    │
             ┌──────┴──────┐
             ↓             ↓
      ComputeResourceList  DrawerDetail
             │
        DataTableV1
```

**這版的核心是：`DataLoader` 是資料來源的 owner，`ComputeDrawerPage` 是 query owner，而 `ComputeResourceList` 是 List UI owner。**
這樣既保留你現有 `DataLoader + getFn` 架構，也不會讓 DrawerDetail 拿不到同一份 API data。
