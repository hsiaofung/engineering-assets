這一段的**核心重點不是 Font Awesome**，而是**如何利用 CSS 偽元素建立自訂 Checkbox，而不是直接修改瀏覽器原生 Checkbox**。

可以整理成以下幾個重點：

## 1. 原生 Checkbox 很難直接修改樣式 ⭐⭐⭐⭐⭐

瀏覽器內建的 checkbox：

* 每個瀏覽器長得不同
* CSS 能修改的地方有限
* Focus 樣式不好控制
* 很難符合 Design System

因此大部分 UI Framework 都會：

> **隱藏原生 checkbox → 自己畫一個新的 checkbox**

---

## 2. HTML 結構

由

```html
<input type="checkbox">
<label>...</label>
```

變成

```html
<input type="checkbox">
<span></span>
<label>...</label>
```

其中：

* `input`：保留功能
* `span`：負責畫 UI
* `label`：負責文字

也就是：

```
input (真正控制 checked)
      ↓
span (畫 checkbox)
      ↓
label
```

---

## 3. 使用 `::before` 畫出 Checkbox ⭐⭐⭐⭐

真正看到的 Checkbox 並不是 `<input>`。

而是：

```css
.checks span::before {
    content: "...";
}
```

利用

* `::before`
* `content`
* Font Awesome Unicode

產生

```
□
```

或

```
☑
```

因此：

> **Checkbox UI 完全是 CSS 畫出來的。**

---

## 4. 隱藏真正的 Checkbox ⭐⭐⭐⭐⭐

不是：

```css
display:none;
```

而是

```css
opacity:0;
position:absolute;
```

原因：

因為真正的 checkbox 還要：

* 接收滑鼠點擊
* 接收鍵盤操作
* 被 label 控制
* 被 JavaScript 存取
* 被表單提交

如果

```css
display:none;
```

很多功能都會失效。

所以最佳做法：

```css
opacity:0;
position:absolute;
```

只讓它看不到。

---

## 5. 利用 `:checked` 切換圖示 ⭐⭐⭐⭐⭐

最重要的一句：

```css
input:checked + span::before
```

意思就是：

> 當 input 被勾選時，
> 修改旁邊 span 的 before。

例如

未勾選：

```
□
```

已勾選：

```
☑
```

只是改變：

```css
content
```

即可。

---

## 6. 真正控制狀態的是 Input，不是 Span ⭐⭐⭐⭐

很多初學者會以為：

```
span
```

就是 checkbox。

其實不是。

真正有 checked 狀態的是：

```
input
```

span 只是：

```
UI
```

所以資料流程是：

```
使用者點擊

↓

input checked=true

↓

CSS :checked 生效

↓

span::before 換 icon

↓

畫面更新
```

---

## 7. 自訂 Checkbox 的設計模式 ⭐⭐⭐⭐⭐

幾乎所有 UI Library 都是這個模式：

```
<input type="checkbox">

↓

opacity:0

↓

<div/span>
畫自己的 checkbox

↓

input:checked

↓

改變 div/span 外觀
```

例如：

* Angular Material
* NG-ZORRO
* Bootstrap
* Ant Design
* MUI
* Chakra UI

本質都十分相似。

---

# 這堂課真正想教的是什麼？

這堂課的核心不是「如何使用 Font Awesome」，而是介紹一種**建立自訂表單控制項（Custom Form Controls）**的設計模式：

1. 保留原生 `<input>`，維持可存取性與表單功能。
2. 用 `opacity: 0` 等方式隱藏原生外觀，而不是移除元素。
3. 使用 `span`、`div` 搭配 `::before` 或 `::after` 繪製自訂 UI。
4. 利用 `:checked`、`:focus`、`:disabled` 等狀態同步更新自訂 UI。

這是一種非常常見且可重複使用的 UI Pattern，也是現代 Design System 中自訂 Checkbox、Radio、Switch 等元件的基礎實作方式。
