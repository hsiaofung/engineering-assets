# Technocal Desing
1. 責任區分。
2. 檔案架構。

-----------------

對，現在**不要急著寫 code**。責任和檔案架構確定後，下一步應該把「資料流」和「介面契約」定下來。

我建議依這個順序：

### 1. 先定 Drawer Page 的資料來源

先回答：

> Drawer page 進來之後，需要哪些 API？

例如：

```text
ComputeDrawerPage
│
├── Drawer information API
│
└── Systems API
      └── drawer = xxx
```

要確認：

* Drawer 本身的資料從哪個 API 來
* Drawer 裡 8 個 System 從哪個 API 來
* Front / Rear View 的資料從哪裡來
* 是否需要額外 API

---

### 2. 定義 Drawer → Systems 的 query

這個很重要，因為它會直接決定 `ComputeDrawerPage` 和 `ComputeResourceList` 的責任。

例如：

```text
Drawer ID
   ↓
ComputeDrawerPage
   ↓
build Drawer Systems query
   ↓
GET /compute-service/v1/systems
   ↓
ComputeResourceList
```

要確認 BE 到底是：

```text
drawer=xxx
```

還是其他 parameter。

---

### 3. 定義 `ComputeResourceList` 的 Input / Output

這是抽 component 前最重要的 interface。

例如概念上：

```text
ComputeResourceList
├── Input
│   ├── data
│   ├── loading
│   └── ...
│
└── Output
    ├── selectionChange
    ├── ipAddressClick
    └── taskClick
```

然後確認：

> 哪些 state 應該留在 List？哪些 state 應該由 Page 控制？

---

### 4. 定義 Drawer Detail 的資料模型

例如：

```text
DrawerDetail
├── Front View
├── Rear View
└── Information
    ├── Section A
    └── Section B
```

這時才確認 `drawer-detail-model` 是否需要存在。

**不要現在就為每個 section 建 model。**

---

### 5. 最後才畫 Component Data Flow

最後整理成：

```text
                Tree Selection
                      │
                      ↓
              ComputeDrawerPage
                 │          │
                 │          └── Drawer API
                 │
                 └── Systems API
                       │
                       ↓
              ComputeResourceList
                       │
                       ↓
                  System rows


              Drawer API
                  │
                  ↓
             DrawerDetail
             ├── Front
             ├── Rear
             └── Information
```

---

所以我會把接下來的工作定義成：

> **① API → ② Query → ③ Component Input/Output → ④ Drawer Detail Model → ⑤ Data Flow**

做到這一步，technical design 基本就完成了，**再開始 refactor `ComputeSystemsPage` 成 `ComputeResourceList`**。

而且我建議我們下一步就先做 **① API：把 Drawer page 需要的 API 列出來**，不要一次跳到 code。


