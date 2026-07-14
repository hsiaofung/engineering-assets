## 自訂切換開關（Toggle Switch）重點整理

### 1. 核心概念：用 Checkbox 實作 Toggle Switch

Toggle Switch 本質上仍然是一個 **checkbox**，只是透過 CSS 將原本的方形核取方塊改造成滑動式開關。

設計目標：

* 保留 checkbox 的語意與可存取性（Accessibility）
* 隱藏原始 checkbox UI
* 使用 `<span>` + CSS 建立自訂外觀
* 利用 `:checked` 狀態控制切換效果

基本 HTML 結構：

```html
<label class="toggleSwitch">
  <input type="checkbox">
  <span class="checkbox-value" aria-hidden="true"></span>
  Enable feature
</label>
```

結構：

```
label
 ├── input[type="checkbox"]  → 真正控制狀態
 ├── span.checkbox-value     → 自訂滑動開關外觀
 └── 文字                    → Label 描述
```

---

# 2. Accessibility（無障礙）設計

## `aria-hidden="true"`

範例：

```html
<span class="checkbox-value" aria-hidden="true"></span>
```

作用：

* 瀏覽器畫面仍然看得到
* 螢幕閱讀器會忽略此元素

原因：

這個 `<span>` 只是視覺裝飾，不應該被讀屏工具解讀。

真正有意義的是：

```html
<input type="checkbox">
```

因為它提供：

* checked 狀態
* keyboard 操作
* screen reader 支援

---

# 3. Label 基礎樣式

Toggle Switch 的外層：

```css
.toggleSwitch {
  cursor: pointer;
  display: flex;
  align-items: center;
}
```

主要用途：

| CSS                | 功能             |
| ------------------ | -------------- |
| cursor:pointer     | 滑鼠變手指          |
| display:flex       | 水平排列文字與 switch |
| align-items:center | 垂直置中           |

---

# 4. 隱藏原始 Checkbox

瀏覽器預設 checkbox：

```
☐ Enable feature
```

需要移除：

```css
input[type="checkbox"] {
  display:none;
}
```

原因：

Toggle Switch 要完全使用自己的 UI。

但注意：

不要移除 checkbox 本身，只隱藏外觀。

因為 checkbox 還負責：

* 狀態管理
* 表單提交
* Accessibility

---

# 5. 使用 Span 建立 Toggle 外框

主要元素：

```html
<span class="checkbox-value"></span>
```

CSS：

```css
.checkbox-value {
  background-color: gray;
  border-radius: 20px;
  width: 50px;
  height: 25px;
  position: relative;
  transition: .3s;
}
```

建立：

```
┌─────────┐
│         │
└─────────┘
```

也就是 Toggle 的膠囊外框。

---

## 重要 CSS 技巧

### `border-radius`

建立 pill shape：

```
████████
```

變成：

```
╭────────╮
╰────────╯
```

---

### `position: relative`

原因：

後面的圓點需要相對定位。

結構：

```
checkbox-value
(position:relative)

       ●
       ↑
 position:absolute
```

---

# 6. 使用 `::before` 建立滑塊

不用額外 HTML：

```css
.checkbox-value::before {
  content:"";
  position:absolute;
  width:20px;
  height:20px;
  border-radius:50%;
}
```

產生：

```
┌─────────┐
│ ●       │
└─────────┘
```

重點：

Pseudo Element：

* `::before`
* `::after`

可以建立純 CSS 元件。

---

# 7. 使用 `:checked` 控制狀態

核心：

```css
input[type="checkbox"]:checked
```

代表：

checkbox 被勾選。

例如：

未啟用：

```
[ ●------ ]
```

啟用：

```
[ ------● ]
```

---

# 8. 移動滑塊

未勾選：

```css
.checkbox-value::before {
  left:0;
}
```

勾選：

```css
input:checked + .checkbox-value::before {
  left:80%;
}
```

利用：

```
checkbox state
       ↓
:checked
       ↓
修改 pseudo element
       ↓
滑塊移動
```

---

# 9. Transition 產生動畫效果

```css
transition: .3s;
```

沒有 transition：

```
● ---------> ●
```

有 transition：

```
● -----> ●
```

形成平滑滑動效果。

---

# 10. 覆蓋之前 Checkbox Icon

前面自訂 checkbox 可能有：

```css
input[type="checkbox"]:checked + span::before {
  content:"✓";
}
```

但是 Toggle Switch 不需要打勾符號。

因此需要更高 specificity：

```css
.toggleSwitch input:checked + .checkbox-value::before {
  content:"";
}
```

概念：

> 新元件要覆蓋舊元件 CSS，需要提高 selector specificity。

---

# Toggle Switch 實作流程

```
1. 建立 checkbox HTML
        ↓
2. 使用 span 當視覺容器
        ↓
3. 隱藏原始 checkbox
        ↓
4. CSS 建立 pill 外框
        ↓
5. ::before 建立滑塊
        ↓
6. :checked 改變背景
        ↓
7. :checked 移動滑塊
        ↓
8. transition 增加動畫
```

---

# 工程資產化分類建議（對你的 Angular + NG-ZORRO 知識庫）

這堂課適合放：

```
ui-patterns/
└── form/
    ├── vanilla/
    │   └── toggle-switch/
    │       ├── README.md
    │       ├── toggle-switch.html
    │       └── toggle-switch.css
    │
    └── angular-ng-zorro/
        └── toggle-switch/
            ├── toggle-switch.component.ts
            ├── toggle-switch.component.html
            └── toggle-switch.component.scss
```

Asset 核心問題可以定義為：

> How to create a custom toggle switch while preserving checkbox semantics and accessibility?

---

# 可複用的工程決策（Engineering Decision）

| 問題               | 解決方案                    |
| ---------------- | ----------------------- |
| Checkbox 外觀無法客製化 | 隱藏原始 checkbox           |
| 保留表單能力           | 保留 input[type=checkbox] |
| 自訂 UI            | span + CSS              |
| 滑動動畫             | transition              |
| 滑塊建立             | pseudo element          |
| 狀態控制             | :checked selector       |
| Accessibility    | aria-hidden 裝飾元素        |

---

## 最重要的學習點

> **不要把 Toggle Switch 當成新的元件，而是把 Checkbox 視覺化。**

這個設計模式可以延伸到：

* Custom Checkbox
* Custom Radio Button
* Toggle Button
* Switch Component
* Angular ControlValueAccessor 元件封裝

對 Angular 開發來說，下一步就是把這個 pattern 封裝成可重用的 `ToggleSwitchComponent`，並透過 `ControlValueAccessor` 支援 Reactive Form。
