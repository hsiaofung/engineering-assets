# 樣式化 Select 下拉選單（上）重點整理

## 1. Select 下拉選單的核心問題

HTML 原生：

```html
<select>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</select>
```

優點：

* 原生支援表單提交
* 支援鍵盤操作
* 支援 Accessibility
* 行動裝置有原生互動體驗

缺點：

* 不同瀏覽器呈現差異大
* CSS 可控制範圍有限
* `<option>` 樣式幾乎無法完整客製化

---

# 2. 第一個必要改善：確保 Select 有 Border

## 問題

某些行動裝置瀏覽器：

* 移除 select 外框
* 移除下拉箭頭
* 導致使用者不知道這是選單

例如：

Desktop：

```
┌─────────▼──┐
│ Option A   │
└────────────┘
```

Mobile：

```
Option A
```

看起來像普通文字。

---

## 基本修正

至少加入：

```css
select {
  border: 1px solid #ccc;
}
```

重點：

> 所有表單 input 元件都應確認在 mobile browser 上仍然具有清楚的視覺邊界。

包含：

* input
* textarea
* select
* checkbox
* radio

---

# 3. 第二種方式：Custom CSS Style Select

架構：

```html
<div class="custom-select">
  <select>
    <option value="">Select item</option>
    <option value="a">Option A</option>
  </select>
</div>
```

增加 wrapper：

```html
<div class="custom-select">
```

原因：

需要一個父層來控制：

* 自訂箭頭位置
* relative positioning
* 裝飾元素

---

# 4. Custom Select 外觀設計

## Wrapper

```css
.custom-select {
  position: relative;
}
```

用途：

建立定位環境。

後面的箭頭：

```css
::before
```

會依靠它定位。

---

# 5. 移除瀏覽器原生 Select 外觀

核心 CSS：

```css
select {
  appearance: none;
}
```

作用：

移除 OS 預設：

* 箭頭
* 邊框
* 原生樣式

讓我們可以自己設計。

---

## Browser Prefix

以前需要：

```css
-webkit-appearance:none;
-moz-appearance:none;
appearance:none;
```

原因：

不同瀏覽器支援時間不同。

目前：

```css
appearance:none;
```

已足夠支援大部分現代瀏覽器。

---

# 6. 自訂 Select 外觀

例如：

```css
.custom-select select {
  background: linear-gradient(...);
  border-radius: 5px;
  border:1px solid #ccc;

  width:100%;
  padding:10px;

  color:#333;
}
```

可以控制：

| 屬性            | 用途   |
| ------------- | ---- |
| background    | 背景   |
| border        | 邊框   |
| border-radius | 圓角   |
| box-shadow    | 陰影   |
| width         | 寬度   |
| padding       | 內距   |
| color         | 文字顏色 |
| line-height   | 高度控制 |

---

# 7. 使用 Pseudo Element 建立自訂箭頭

HTML 不增加元素：

```html
<div class="custom-select">
  <select></select>
</div>
```

CSS：

```css
.custom-select::before {
  content:"\f078";
}
```

利用：

* Font Awesome icon
* CSS pseudo element

產生箭頭。

---

# 8. `:before` vs `::before`

兩種寫法：

```css
.element:before
```

或：

```css
.element::before
```

差異：

| 寫法       | 時代   |
| -------- | ---- |
| :before  | CSS2 |
| ::before | CSS3 |

現代瀏覽器：

兩者皆可。

建議：

新的專案使用：

```css
::before
```

因為語意更清楚：

* pseudo-class → `:`
* pseudo-element → `::`

---

# 9. 箭頭定位技巧

通常：

父層：

```css
.custom-select {
  position:relative;
}
```

箭頭：

```css
.custom-select::before {
  position:absolute;
  right:10px;
  top:50%;
}
```

形成：

```
custom-select
┌───────────────┐
│ Option     ▼  │
└───────────────┘
```

---

# 10. `pointer-events:none` 的重要性

問題：

箭頭是 pseudo element：

```
┌─────────┐
│ text ▼  │
└─────────┘
```

如果箭頭可以接收 click：

可能造成：

* 點箭頭無法開啟 select
* 點擊事件被 icon 攔截

解決：

```css
pointer-events:none;
```

效果：

```
click
 ↓
arrow
 ↓
select
```

點擊穿透到 select。

---

# 11. IE 修正

課程提到：

```css
display:inline-block;
```

原因：

某些舊版 Microsoft browser：

* pseudo element rendering
* positioning

存在差異。

現代專案通常可視需求保留。

---

# 12. Focus 狀態設計

Select 被選取：

```css
select:focus {
  box-shadow:0 0 5px;
}
```

目的：

提供使用者操作回饋。

好的表單元件：

Normal：

```
┌─────────┐
│ Option ▼│
└─────────┘
```

Focus：

```
╔═════════╗
║ Option ▼║
╚═════════╝
```

---

# 13. 純 CSS Select 的限制

可以控制：

✅ Select 外框
✅ 背景
✅ 箭頭
✅ Focus 狀態
✅ 尺寸

但是：

❌ Option 樣式控制有限

例如：

```html
<option>
```

很難控制：

* padding
* icon
* layout
* hover style
* complex UI

---

# Select Customization 實作流程

```
原生 Select
      ↓
加入 wrapper
      ↓
position:relative
      ↓
appearance:none
      ↓
自訂背景/邊框
      ↓
::before 建立箭頭
      ↓
pointer-events:none
      ↓
focus 狀態
      ↓
完成
```

---

# 工程資產化建議（符合你的 UI Pattern 架構）

放置：

```
ui-patterns/
└── form/
    ├── vanilla/
    │   └── custom-select/
    │       ├── README.md
    │       ├── custom-select.html
    │       └── custom-select.css
    │
    └── angular-ng-zorro/
        └── select/
            ├── select.component.ts
            └── select.component.scss
```

---

# Engineering Asset 定義

**Problem**

> Browser default select styles are inconsistent and difficult to customize.

**Solution**

> Keep native select behavior but customize visual appearance using wrapper + CSS.

**Decision**

* Preserve `<select>` for accessibility
* Remove native appearance
* Create custom arrow with pseudo element
* Use `pointer-events:none` for decorative elements

---

# 與 Angular / NG-ZORRO 的關聯

這堂課的價值不是「如何做漂亮 select」，而是理解：

> UI Component 的本質 = Native Behavior + Custom Presentation

Angular Material、NG-ZORRO 的 Select 元件也是同樣概念：

```
Native interaction
        +
Component abstraction
        +
Custom rendering
```

後續如果做自己的 Angular Select Component，可以延伸：

* ControlValueAccessor
* Reactive Form integration
* Keyboard navigation
* Accessibility (ARIA)
* Custom option rendering

這會比單純改 CSS 更接近真正 Design System 元件設計。
