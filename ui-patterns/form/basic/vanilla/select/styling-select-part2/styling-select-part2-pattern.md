## 樣式化 Select 下拉選單（下）重點整理

本堂課介紹如何透過 **CSS + JavaScript** 建立一個完全自訂外觀的 Select 下拉選單，突破原生 `<select>` 元件受限於瀏覽器樣式的問題。

---

# 1. 為什麼需要 JavaScript 自訂 Select？

原生 `<select>` 有以下限制：

* 不同瀏覽器的預設樣式不同
* CSS 可控制範圍有限
* 很難做到高度客製化的 UI

因此解決方式：

1. 保留原本 `<select>` 作為資料來源
2. 使用 JavaScript 動態建立新的 HTML 結構
3. 使用 CSS 完全控制新建立的 UI

架構概念：

```
Original Select
      |
      | JavaScript 轉換
      ↓
Custom Dropdown UI

<select>
    ↓
<div class="select">
    <div class="select-styled">
    <ul class="select-options">
        <li>
        <li>
    </ul>
</div>
```

---

# 2. 保留原始 Select，支援優雅降級（Graceful Degradation）

重要設計：

> 不直接移除原本的 `<select>`，而是隱藏它。

原因：

如果：

* JavaScript 被關閉
* JavaScript 發生錯誤
* 輔助工具需要原生表單

使用者仍然可以操作原本的 select。

流程：

```
有 JavaScript
    ↓
隱藏原生 select
    ↓
顯示自訂 dropdown


沒有 JavaScript
    ↓
顯示原生 select
    ↓
仍可使用
```

這是一個良好的前端設計原則：

> Enhance existing HTML instead of replacing it completely.

---

# 3. JavaScript 動態建立 UI

JavaScript 主要工作：

## (1) 找到指定 Select

例如：

```html
<select class="fancy-select">
```

JavaScript 尋找這些 select。

---

## (2) 讀取所有 option

例如：

```html
<select>
  <option>UPS</option>
  <option>FedEx</option>
  <option>DHL</option>
</select>
```

JavaScript 取得：

```
UPS
FedEx
DHL
```

---

## (3) 建立新的 HTML

動態產生：

```html
<div class="select">
    <div class="select-styled">
        UPS
    </div>

    <ul class="select-options">
        <li>UPS</li>
        <li>FedEx</li>
        <li>DHL</li>
    </ul>
</div>
```

---

# 4. 使用 class 控制狀態

這個實作大量使用 class 來控制 UI 狀態。

主要 class：

| Class            | 用途             |
| ---------------- | -------------- |
| `select-hidden`  | 隱藏原始 select    |
| `select`         | 自訂 select 外層容器 |
| `select-styled`  | 顯示目前選取值        |
| `select-options` | 下拉選項列表         |
| `active`         | 控制開啟狀態         |

---

# 5. 隱藏原生 Select

CSS：

```css
select.select-hidden {
    display: none;
}
```

原本：

```
<select>
```

變成：

```
(select 隱藏)

<div class="select-styled">
    Preferred Shipping Method
</div>
```

---

# 6. 使用 `<ul>` + `<li>` 取代 Option

為什麼不用另一個 select？

因為：

`ul/li` 更容易 CSS 客製化。

例如：

可以控制：

* 背景
* border
* padding
* hover
* 動畫
* icon
* spacing

結構：

```
<ul>
 ├── <li>
 ├── <li>
 └── <li>
```

比：

```
<option>
```

自由很多。

---

# 7. Dropdown 開關控制

JavaScript 透過：

```
active class
```

控制狀態。

關閉：

```html
<div class="select">
```

開啟：

```html
<div class="select active">
```

CSS 根據狀態改變：

* 背景
* 箭頭方向
* 選項顯示

---

# 8. 使用 CSS 偽元素製作箭頭

使用：

```css
:after
```

建立三角形。

例如：

```css
.select-styled:after {
    border: 7px solid transparent;
    border-top-color: white;
}
```

效果：

```
▼
```

開啟：

```
▲
```

透過：

```css
.active:after
```

改變方向。

---

# 9. Dropdown Options 顯示控制

預設：

```css
.select-options {
    display:none;
}
```

點擊後：

JavaScript：

```javascript
display:block
```

結果：

關閉：

```
<select-options>
    hidden
</select-options>
```

開啟：

```
<select-options>
    visible
</select-options>
```

---

# 10. Option 樣式化

`li` 可以自由設計：

例如：

### 分隔線

```css
li {
    border-top:1px solid;
}
```

### Hover 效果

```css
li:hover {
    background-color;
}
```

---

# 11. 避免第一個 Option 重複顯示

因為第一個 option 通常是 placeholder：

例如：

```
Preferred Shipping Method
```

已經顯示在：

```
select-styled
```

所以：

```css
li:first-child {
    display:none;
}
```

避免：

```
Preferred Shipping Method

Preferred Shipping Method
UPS
FedEx
```

---

# 12. 完整流程整理

```
HTML
 |
 | 原始 Select
 |
 ↓
JavaScript
 |
 | 讀取 options
 | 建立 div + ul + li
 |
 ↓
CSS
 |
 | 隱藏 select
 | 設計 dropdown
 | 控制 hover
 | 控制 active
 |
 ↓
完成 Custom Select
```

---

# 核心學習重點

## 1. 不要破壞原始 HTML

保留：

```html
<select>
```

作為 fallback。

---

## 2. JavaScript 負責「結構」

JavaScript：

* 建立元素
* 管理狀態
* 切換 class

---

## 3. CSS 負責「呈現」

CSS：

* 外觀
* 動畫
* hover
* active 狀態

---

## 4. 用資料來源與 UI 分離

原始：

```
<select>
```

是資料來源。

自訂：

```
<ul><li>
```

是 UI。

這是一種常見前端設計模式：

```
Data Layer
    |
    ↓
Presentation Layer
```

---

# 與現代 Angular / React 開發的關聯

這個技巧其實就是現代 UI Component 的基礎：

例如：

* Angular Material Select
* NG-ZORRO Select
* React Select

底層概念都是：

```
Hidden Native Control
+
Custom Rendered UI
+
State Management
```

差別只是現代框架把：

* DOM 操作
* event handling
* state sync

封裝起來。

---

## 一句話總結

> 完全自訂 Select 的核心方法，是保留原生 `<select>` 作為可靠資料來源，利用 JavaScript 動態建立可控制的 UI 結構，再透過 CSS 與 class 狀態管理打造高度客製化的下拉選單。
