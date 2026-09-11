好，目前我們已經討論過幾輪，可以把 `ComputeResourceList` 的 Contract 收斂成這一版。

## `ComputeResourceList` Contract

### Input

`ComputeResourceList` 只需要接收 **API 取得並轉換後的 System data**。

```text
Input
└── data
```

也就是：

```text
ComputeSystemsPage ──┐
                     ├──→ ComputeResourceList
ComputeDrawerPage ───┘
```

兩個 Page 都把 Systems data 傳給它。

---

### Internal State

這些都是 **所有 Compute System Monitor List 共通的狀態**，因此由 `ComputeResourceList` 自己管理：

```text
Internal State
├── page
├── pageSize
├── sort
├── filter
├── reload
└── selection
```

| State       | 用途                 |
| ----------- | ------------------ |
| `page`      | 目前 pagination page |
| `pageSize`  | 每頁筆數               |
| `sort`      | 目前排序欄位與方向          |
| `filter`    | 目前 filter 條件       |
| `reload`    | 重新取得目前 List        |
| `selection` | 使用者目前選取的 System    |

這些 state **不應該由 `ComputeSystemsPage` / `ComputeDrawerPage` 管理**。

因為不管在哪個 Page：

> 都是在 Monitor Compute Systems，所以 List 的操作狀態是一致的。

---

### Output

目前真正需要對外通知的只有：

```text
Output
└── selectionChange
```

原因是未來 List 上會有 operation，例如：

```text
Select System
     ↓
selectionChange
     ↓
Page
     ↓
System Operation
```

而：

* `page`
* `pageSize`
* `sort`
* `filter`
* `reload`

都是 List 自己處理的，不需要 Output。

`ipAddressClick`、`taskClick` 也不需要 Output，因為目前 navigation 可以由 List 自己處理。

---

## 最終 Contract

```text
                    ComputeResourceList
┌──────────────────────────────────────────────┐
│                                              │
│  Input                                       │
│  └── data                                    │
│                                              │
│  Internal State                              │
│  ├── page                                    │
│  ├── pageSize                                │
│  ├── sort                                    │
│  ├── filter                                  │
│  ├── reload                                  │
│  └── selection                               │
│                                              │
│  Output                                      │
│  └── selectionChange                         │
│                                              │
└──────────────────────────────────────────────┘
```

### Page 與 List 的最終責任

```text
ComputeSystemsPage
    └── 決定「查哪些 Systems」
        └── unassigned / row / rack

ComputeDrawerPage
    └── 決定「查哪個 Drawer 裡的 Systems」
        └── drawer

ComputeResourceList
    └── 決定「Systems List 怎麼操作與呈現」
        ├── page
        ├── pageSize
        ├── sort
        ├── filter
        ├── reload
        ├── selection
        └── selectionChange
```

這樣就形成一個很清楚的邊界：

> **Page 負責 Query；`ComputeResourceList` 負責 List State + List UI。**
