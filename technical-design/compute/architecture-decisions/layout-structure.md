# 架構

```text
ComputeComponent
│
├── Header
├── ComputeTreeComponent
├── RouterOutlet
└── Footer
        │
        ▼
ComputeSystemsPageComponent
        │
        ▼
ComputeSystemsTableComponent
```

也就是只有 **三個主要層次**：

### 1. `ComputeComponent` — Module Shell

負責整個 Compute 頁面的外框：

```text
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────────┬───────────────────────────┤
│              │                           │
│ ComputeTree  │ RouterOutlet              │
│              │                           │
│              │ ComputeSystemsPage        │
│              │                           │
├──────────────┴───────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

它只負責：

- Header
- Tree
- Footer
- RouterOutlet
- Tree selection → navigation

**不負責 Systems API。**

---

### 2. `ComputeSystemsPageComponent` — Page Level

這個就是你說的 **table-level 對應的 Page**。

它負責：

- 根據 route/context 判斷目前是哪個 level
- Physical Pool
- Virtual Pool
- Row
- Rack
- 準備 Systems 查詢條件
- 管理 page-level loading/error/context

然後：

```text
ComputeSystemsPageComponent
        │
        ▼
data-table-v1
```

---

### 3. data-table-v1 - Table Level

只負責：

- 接收 systems data
- 顯示 table
- row rendering
- empty state
- loading state（如果你希望 table 自己管理）

---

所以整體就是：

```text
ComputeComponent
│
├── Header
├── ComputeTreeComponent
│
├── RouterOutlet
│     │
│     ├── ComputeSystemsPageComponent
│     │      └── data-table-v1
│     │
│     ├── ComputeDrawerPageComponent
│     │
│     └── ComputeSystemPageComponent
│
└── Footer
```

# 各自責任

ComputeComponent

- 整體 Compute layout
- Header / Tree / Footer
- RouterOutlet
- Tree node selection → navigation

ComputeSystemsPageComponent

- Systems page
- 根據目前 route / context 決定 API query
- 呼叫 Compute API
- 整理 data
- 傳給 data-table-v1

data-table-v1

- 純 UI component
- columns
- rows
- sorting / pagination 等 table 行為

所以這裡其實形成很標準的：

```text
Feature Container
       ↓
Feature Page
       ↓
Shared UI Component
```

而且 Physical Pool / Virtual Pool / Row / Rack 全部共用 ComputeSystemsPageComponent：

```text
Physical Pool ─┐
Virtual Pool ──┤
Row ───────────┼──→ ComputeSystemsPageComponent
Rack ──────────┘              │
                              ↓
                        data-table-v1
```

這樣就不用為了「資料不同但 UI 相同」建立四個 component。

```text
┌──────────────────────────────────────────────────┐
│                | Compute              Breadcrumb │
|                ├─────────────────────────────────┤
│                │                                 │
│ Compute Tree   │ System                          │
│                │                                 │
│                │                                 │
│                │ ┌─────────────────────────────┐ │
│                │ │ data-table-v1               │ │
│                │ └─────────────────────────────┘ │
│                │                                 │
|                ├─────────────────────────────────┤
│                |      Footer                     │
└──────────────────────────────────────────────────┘
```

```text
┌──────────────────────────────────────────────────┐
│                | Compute              Breadcrumb │
|                ├─────────────────────────────────┤
│                │                                 │
│ Compute Tree   │ ┌─────────────────────────────┐ │
│                │ │ Carousel                    │ │ ← 只有 Overview
│                │ └─────────────────────────────┘ |
│                │                                 │
│                │ Processor                       │
│                │ ┌─────────────────────────────┐ │
│                │ │ data-table-v1               │ │
│                │ └─────────────────────────────┘ │
│                │                                 │
|                ├─────────────────────────────────┤
|                │ Footer                          │
└──────────────────────────────────────────────────┘
```

```text
ComputeComponent
│
├── Tree
│
├── Header
│   ├── Compute
│   └── Breadcrumb
│
└── RouterOutlet
      │
      ├── SystemsPage
      │     └── data-table-v1
      │
      ├── DrawerPage
      │     ├── data-table-v1
      │     ├── Image
      │     └── Cards
      │
      └── SystemPage
            │
            ├── Carousel
            │
            └── RouterOutlet
                  │
                  ├── PhysicalAssets
                  │     ├── System Image
                  │     └── Cards
                  │
                  ├── Processor
                  │     └── data-table-v1
                  │
                  ├── Memory
                  │     └── data-table-v1
                  │
                  ├── LocalStorage
                  │     ├── Tabs
                  │     └── data-table-v1 × N
                  │
                  ├── Adapter
                  │     │
                  │     ├── NIC
                  │     │     └── data-table-v1
                  │     │
                  │     └── GPU
                  │           └── data-table-v1
                  │
                  ├── FRU
                  │     └── Cards
                  │
                  └── DMI
                        └── Cards
```
