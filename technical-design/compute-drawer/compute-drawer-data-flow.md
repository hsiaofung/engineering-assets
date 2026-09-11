可以，先把剛才確認過的 **Drawer Data Flow** 整理乾淨，再進入第 3 步。

## Drawer Page Data Flow

整體可以分成 **Page → API → List** 和 **Page → Detail** 兩條流。

```text
                         Tree / Route Selection
                                  │
                                  ↓
                        ComputeDrawerPage
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 │                                 │
                 ↓                                 ↓
        Build Drawer Query                  Drawer Page Layout
                 │                                 │
                 ↓                         ┌───────┴───────┐
        GET /systems                       │               │
                 │                         ↓               ↓
                 │                ComputeResourceList   DrawerDetail
                 │                         │               │
                 ↓                         ↓               ↓
      ComputeSystemsResponse          System List      Front / Rear /
                                                   Information
```

### ① `ComputeDrawerPage` → Systems API

Drawer Page 先根據目前的 Drawer selection 建立 query。

```text
selection
├── parentName = rack-1
└── name       = 21
```

↓

```text
drawerLocation = rack-1:21
```

↓

```text
GET /compute-service/v1/systems
  ?drawer=eq.rack-1:21
  &sort=location
  &direction=asc
  &page=1
  &perPage=10
```

↓

```text
ComputeSystemsResponse
```

---

### ② API → `ComputeResourceList`

API 回傳的 Systems：

```text
ComputeSystemsResponse
        ↓
API → UI Mapper
        ↓
Compute Resource List Model
        ↓
ComputeResourceList
```

`ComputeResourceList` 負責把這些 System **呈現成 List**。

包括：

* pagination
* sort
* filter
* reload
* display
* System rows
* IP Address action
* Task action

---

### ③ `ComputeDrawerPage` → `DrawerDetail`

另外一條是 Drawer 本身的 UI。

```text
ComputeDrawerPage
        ↓
DrawerDetail
        ├── Front View
        ├── Rear View
        └── Information
```

目前我們已確認：

> **沒有另外的 Drawer API。**

所以 Drawer Page 的資料來源目前就是 **Systems API**；Drawer Detail 如果只是根據既有 selection / page context 呈現，就不需要另外建立 API。

---

## 最終 Data Flow

可以濃縮成：

```text
                         Selection
                            │
                            ↓
                   ComputeDrawerPage
                     │             │
                     │             │
              build query          │
                     │             │
                     ↓             ↓
              Systems API     DrawerDetail
                     │          │    │
                     ↓          │    │
              API → UI Mapper   │    │
                     │          │    │
                     ↓          ↓    ↓
             ComputeResourceList
                     │
                     ↓
              Systems in Drawer
```

### 最重要的責任邊界

```text
ComputeDrawerPage
    = 決定「這個 Drawer 要查什麼」

ComputeResourceList
    = 決定「Systems 怎麼列」

DrawerDetail
    = 決定「Drawer 怎麼呈現」
```

而 **Systems API 是唯一資料來源**：

```text
ComputeDrawerPage
        ↓
GET /compute-service/v1/systems
        ↓
ComputeResourceList
```

這樣 Data Flow 就可以定案了。

**下一步才進入 ③：`ComputeResourceList` 的 Input / Output Contract。**
