可以，依照剛才定下來的責任，我會整理成這個檔案架構：

```text
compute/
├── api/
│
├── doc/
│
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
│       │
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
│   ├── compute-ancestor.service.ts
│   ├── compute-route.builder.ts
│   └── compute-resource-resolve.guard.ts
│
├── selection/
│
└── tree/
```

### 這個架構的重點

```text
pages/
│
├── compute-resource-list/   ← Compute 共用的 System List
│
├── systems/                 ← System collection page
│
└── drawer/                  ← 單一 Drawer page
    ├── compute-drawer-page/ ← Page composition
    └── drawer-detail/       ← Drawer 本身的詳細呈現
```

尤其是這兩個要區分：

```text
systems/
```

代表 **System List / 多個 System**

而：

```text
drawer/
```

代表 **單一 Drawer resource**

所以不需要：

```text
drawers/
compute-drawers-page/
```

### 我會再做一個小調整

`compute-resource-list` 裡面的 `model` / `mapper` 如果確定**只服務這個 List**，放在這裡是合理的：

```text
compute-resource-list/
├── model/
└── mapper/
```

因為它們已經不是「System domain 全域 model」，而是：

> **Compute Resource List 所需要的資料模型與轉換。**

這樣整個架構的依賴方向也很自然：

```text
ComputeSystemsPage ──────┐
                         ↓
                  ComputeResourceList
                         ↑
ComputeDrawerPage ───────┘

ComputeDrawerPage
        ↓
   DrawerDetail

routing/
        ↓
resource route resolution
```

我認為這版已經可以作為 **Drawer technical design 的初版檔案架構**。
