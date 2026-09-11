可以。這篇我會整理成「**可重複套用的 layout 原則**」，而不是只記錄這次 Drawer 的修改。

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
        └── tbody ← scroll
```

這通常需要 Data Table component 本身支援。

### B. Resource List container scroll

```text
Page
└── Resource List ← scroll
    └── Data Table
```

這是 page-level FE layout 的責任。

### C. Whole Page scroll

```text
Page ← scroll
├── Resource List
├── Detail
└── Footer
```

如果 UX 要求內容自然長高，通常應採用這種方式。

---

# 2. `overflow: auto` 決定誰負責 Scroll

例如：

```scss
.drawer-page__list {
  overflow: auto;
}
```

代表：

```text
.drawer-page__list
        ↓
     scroll container
```

因此即使 table 本身沒有設定 scroll，scrollbar 仍然會出現在 Resource List 外層。

如果 UX 要求整個 Page scroll，就不應該在中間的 content section 設置：

```scss
overflow: auto;
```

除非有明確需求。

---

# 3. Flex 本身沒有問題

`flex` 可以繼續使用。

問題通常不是：

```scss
display: flex;
```

而是：

```scss
flex: 50%;
```

搭配固定高度時，會把內容限制在固定比例。

例如：

```scss
.drawer-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-page__list {
  flex: 50%;
}

.drawer-page__detail {
  flex: 50%;
}
```

這會讓：

```text
Drawer Page
├── List   ≈ 50%
└── Detail ≈ 50%
```

當 Table 內容超過 List 的 50% 高度時，就必須：

* overflow
* 壓縮內容
* 或產生 scrollbar

這與「內容自然長高」的需求不一致。

---

# 4. Content-driven Layout

如果內容應該自然決定高度，可以改成：

```scss
.drawer-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.drawer-page__list,
.drawer-page__detail {
  flex: 0 0 auto;
}
```

核心概念：

> 不要為了讓兩個區塊看起來各佔 50%，而限制內容高度。

而是：

```text
List
  ↓
content determines height
  ↓
Detail
  ↓
content determines height
```

---

# 5. Footer 必須能被 Content 推下去

常見 Page Shell：

```html
<div class="page">
  <main>
    <breadcrumbs />

    <div class="content">
      <router-outlet />
    </div>

    <footer />
  </main>
</div>
```

如果：

```scss
.page {
  height: 100%;
}
```

同時：

```scss
.content {
  flex: 1;
  min-height: 0;
}
```

Content 可能被限制在剩餘 viewport 高度內。

這種結構適合：

> Content 自己 scroll。

但不一定適合：

> Content 自然長高，Footer 往下，整個 Page scroll。

---

# 6. Content-driven Page Shell

如果需求是整個 Page scroll，可以讓 Page 高度至少填滿 viewport，但允許被內容撐高：

```scss
.compute-page {
  display: flex;
  min-height: 100%;
}
```

Main：

```scss
.compute-page__main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  padding: 0 24px;
}
```

Content：

```scss
.compute-page__content {
  flex: 1 0 auto;
}
```

這裡的重點是：

```scss
min-height: 100%;
```

而不是：

```scss
height: 100%;
```

前者表示：

> 至少要有這麼高，但內容可以把它撐得更高。

後者比較容易造成：

> 高度被限制在父層高度。

---

# 7. Sidebar 高度

如果 Sidebar 必須跟著整個 Page 高度延伸，可以使用 flex stretch：

```scss
.compute-page {
  display: flex;
  min-height: 100%;
}

.compute-page__sidebar {
  flex: 0 0 auto;
  align-self: stretch;
  min-height: 100%;
}
```

如果 Tree container 本身需要填滿 Sidebar：

```scss
.compute-page__sidebar app-tree-view-v1-container {
  height: 100%;
}
```

概念：

```text
compute-page
├── sidebar ───────────────┐
│                          │
│                          │  same page height
│                          │
└── main ─────────────────┤
    ├── content            │
    │   └── grows          │
    │                      │
    └── footer             │
                           │
```

當 Main Content 變高時，整個 `compute-page` 變高，Sidebar 也跟著延伸。

---

# 8. `min-height: 0` 要小心使用

`min-height: 0` 在 flex layout 中很常見。

它的作用之一是允許 flex item 被壓縮：

```scss
.content {
  flex: 1;
  min-height: 0;
}
```

這對「內部 scroll container」非常有用。

例如：

```text
Page
└── Content
    └── Scroll Area
```

但如果需求是：

> Content 必須隨內容自然長高。

就要重新確認 `min-height: 0` 是否符合這個 layout。

不要因為某個既有 layout 慣例，就在所有 flex container 都加上 `min-height: 0`。

---

# 9. 不要用 Magic Number 解決 Layout

例如測試：

```scss
.dt__tbody {
  height: 88px;
}
```

如果設定後外層 scrollbar 消失，這可以證明：

> Table body 高度確實影響外層 overflow。

但不代表 `88px` 是正確的 production solution。

因為它可能依賴：

* viewport height
* table header height
* pagination height
* title height
* padding
* gap
* browser size
* responsive layout

因此：

```scss
height: 88px;
```

比較適合作為：

> Diagnostic / experiment

而不是：

> Final layout solution

---

# 10. Recommended Decision Flow

遇到類似問題時，可以按照以下順序處理：

```text
發現 Scrollbar
      ↓
確認 UX 預期
      ↓
Scroll 應該在哪一層？
      │
      ├── Table body
      │      ↓
      │   Data Table component owner
      │
      ├── Section / Resource List
      │      ↓
      │   Page FE layout
      │
      └── Whole Page
             ↓
          Page layout
```

確認 scroll ownership 後，再檢查：

```text
1. 哪一層設定了 overflow？
2. 哪一層設定了 height: 100%？
3. 哪一層設定了 flex: 1 / flex: 50%？
4. 哪一層設定了 min-height: 0？
5. Content 是否可以自然長高？
6. Footer 是否會被 Content 推下去？
7. Sidebar 是否需要跟著 Page 高度延伸？
```

---

# Practical Checklist

遇到「內容超出但 Footer / Sidebar 行為不對」時：

* [ ] 先確認 UX 的 scroll 行為
* [ ] 找出真正的 scroll container
* [ ] 不要先用固定 `height` 解決
* [ ] 不要先用 magic number 壓縮 table
* [ ] 確認 `flex: 1` 是否正在限制 content 高度
* [ ] 確認 `flex: 50%` 是否造成不必要的固定比例
* [ ] Content-driven layout 使用 `min-height` 而不是盲目使用 `height`
* [ ] 讓 Content 自然長高時，確認 Footer 是否跟著移動
* [ ] 如果 Sidebar 必須跟著 Page 高度，使用 flex stretch
* [ ] 只有在 UX 明確要求時才建立局部 scroll container

---

# Example

## Before

```scss
.drawer-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow: auto;
}

.drawer-page__list {
  flex: 50%;
  min-height: 0;
}

.drawer-page__detail {
  flex: 50%;
  min-height: 0;
}
```

這種寫法代表：

```text
Drawer Page
├── List   ≈ 50%
│   └── overflow
│
└── Detail ≈ 50%
```

如果 UX 要求整個 Page scroll，這不是理想的結構。

---

## After

```scss
.compute-page {
  display: flex;
  min-height: 100%;
}

.compute-page__sidebar {
  flex: 0 0 auto;
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
  flex: 1 0 auto;
}

.drawer-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.drawer-page__list,
.drawer-page__detail {
  flex: 0 0 auto;
}
```

結果：

```text
Compute Page
│
├── Sidebar
│
└── Main
    ├── Breadcrumb
    ├── Resource List
    │   └── Table grows naturally
    │
    ├── Detail
    │
    └── Footer
```

Table 增加資料：

```text
Table grows
    ↓
Resource List grows
    ↓
Detail moves down
    ↓
Footer moves down
    ↓
Compute Page grows
    ↓
Whole page scrolls
```

---

# Key Takeaway

> **先決定 Scroll Ownership，再設計 Flex Layout。**

`flex` 不是問題。

真正需要避免的是：

> 用固定高度 / 固定比例 / 局部 `overflow`，把原本應該由 Page 自然承擔的高度限制住。

當 UX 要求「內容自然長高、下面內容往下、Footer 跟著往下、超出 viewport 時整個 Page scroll」時，應優先採用 **content-driven layout**，而不是強迫上下區塊各佔固定比例。
