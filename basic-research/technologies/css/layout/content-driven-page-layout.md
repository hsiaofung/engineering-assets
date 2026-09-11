# CSS Layout — Content-Driven Page with Footer and Sidebar

## Problem

在一個常見的 Page Layout 中：

* 左側是固定的 Sidebar / Tree
* 右側是 Main Content
* Main Content 上方可能有 Breadcrumb
* 中間是主要內容，例如 Resource List、Data Table、Detail Card
* 底部有 Footer

容易遇到一個問題：

> Main Content 內容變多時，應該讓哪一層產生 scrollbar？

例如：

```text
Page
├── Sidebar
└── Main
    ├── Breadcrumb
    ├── Content
    │   ├── Resource List
    │   └── Detail
    └── Footer
```

如果 Content 被限制在固定高度，可能造成：

* Data Table 自己出現 scrollbar
* Resource List container 出現 scrollbar
* Detail Card 無法自然往下移
* Footer 停留在原本的位置
* Sidebar 高度與 Main Content 不一致

因此，首先要確認 **scroll ownership**，再決定 CSS 結構。

---

## UX Requirement

如果 UX 定義：

> Table 不需要獨立 scroll。
> Table 高度隨內容增加，下面的 Card 往下移。
> 超出 viewport 時，由整個 Page scroll。

那麼 Layout 應該是：

```text
Page
├── Sidebar
│
└── Main
    ├── Breadcrumb
    ├── Content
    │   ├── Resource List
    │   │   └── Table
    │   │       └── Natural height
    │   │
    │   └── Detail Card
    │
    └── Footer
```

內容增加時：

```text
Table height increases
        ↓
Resource List height increases
        ↓
Content height increases
        ↓
Detail Card moves downward
        ↓
Footer moves downward
        ↓
Page exceeds viewport
        ↓
Whole Page scrolls
```

---

# Key Principle

## 1. Scroll ownership must follow UX

不要先看到 scrollbar 就直接修改 table。

先確認：

> Scrollbar 應該屬於哪一層？

常見選擇：

### A. Table body scroll

```text
Page
└── Resource List
    └── Data Table
```

### sorce code

```scss
.compute-page {
  display: flex;

  // Allow the page to grow with its content instead of fixing it to the viewport.
  min-height: 100%;
}

.compute-page__sidebar {
  flex: 0 0 auto;

  // Stretch the sidebar to match the full height of the compute page.
  align-self: stretch;

  min-height: 100%;
}

.compute-page__sidebar app-tree-view-v1-container {
  height: 100%;
}

.compute-page__main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  padding: 0 24px;
}

.compute-page__content {
  // Allow content to grow naturally and push the footer downward.
  flex: 1 0 auto;
}
```