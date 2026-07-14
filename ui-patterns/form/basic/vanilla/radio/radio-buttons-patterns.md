這一章其實是在延續上一章 **Custom Checkbox**，只是把相同的設計模式套用到 **Radio Button**。

真正重要的不是 Font Awesome，而是理解 **自訂 Radio Button 的實作模式**。

---

# 1. Checkbox 和 Radio 的實作方式幾乎完全相同 ⭐⭐⭐⭐⭐

講師一開始就說：

> 基本上和 Checkbox 一樣。

流程仍然是：

```text
原生 radio
        │
        ▼
隱藏它(opacity:0)
        │
        ▼
span::before 畫新的 UI
        │
        ▼
input:checked
        │
        ▼
切換 icon
```

也就是：

> **保留功能，自己畫 UI。**

---

# 2. HTML 結構有一點不同 ⭐⭐⭐⭐

Checkbox：

```html
<input>
<span></span>
<label>Apple</label>
```

Radio：

```html
<label>
    <input>
    <span></span>
    Apple
</label>
```

講師改成：

```html
<label>
    ...
</label>
```

把所有內容包起來。

原因有兩個：

---

### (1) 點擊範圍更大

不用一定點到 radio。

點文字也可以。

```
○ Apple
```

整塊都能點。

---

### (2) Responsive 比較容易

例如：

Desktop

```
○ Apple   ○ Banana
```

Mobile

```
○ Apple
○ Banana
```

label 包住全部，比較容易排版。

---

# 3. Radio 也是利用 `::before` 畫出來 ⭐⭐⭐⭐

真正看到的不是：

```html
<input type="radio">
```

而是：

```css
span::before
```

畫出：

```
○
```

之後：

```
◉
```

也是改：

```css
content
```

而已。

---

# 4. 一樣隱藏原生 Radio ⭐⭐⭐⭐⭐

同樣：

不是

```css
display:none;
```

而是：

```css
position:absolute;
opacity:0;
```

原因完全相同：

* 保留 Accessibility
* 保留 keyboard navigation
* 保留 form submit
* 保留 JS 操作

---

# 5. Radio 的重點：General Sibling (`~`) ⭐⭐⭐⭐⭐

這一章唯一的新知識，就是：

```css
input:checked ~ span::before
```

講師特別介紹：

> `~`

叫做：

**General Sibling Selector**

意思：

```
input

↓

span

↓

文字

↓

其它元素
```

只要：

span 在 input 後面，

都可以選到。

例如：

```html
<input>

<span></span>

Some text
```

CSS

```css
input:checked ~ span::before
```

即可生效。

---

為什麼不用：

```css
+
```

因為：

`+`

只能：

```
input + span
```

必須是：

**下一個兄弟元素**

而：

```
~
```

可以：

```
input

...

...

span
```

中間可以隔其他元素。

因此更有彈性。

---

# 6. Responsive Layout ⭐⭐⭐⭐

講師最後花不少時間在：

Media Query

Desktop：

```
○ Male      ○ Female
```

Mobile：

```
○ Male

○ Female
```

所以：

label

要能：

```
display:inline-block
```

配合 Media Query。

也就是：

Radio UI

除了漂亮，

還要 Responsive。

---

# 7. UI 與 State 分離 ⭐⭐⭐⭐⭐

真正控制狀態的是：

```
input
```

真正畫畫面的是：

```
span::before
```

資料流程：

```
使用者點 label

↓

input checked

↓

CSS :checked

↓

改 span::before

↓

畫面更新
```

所以：

UI 和 State 是分離的。

---

# 這堂課新增的重要觀念

相比上一堂 Checkbox，這一堂真正新增的知識有三點：

| 新觀念                                | 為什麼重要                                         |
| ---------------------------------- | --------------------------------------------- |
| **Implicit Label（隱式 Label）**       | 用 `<label>` 包住 `input`，擴大可點擊區域並簡化排版。          |
| **General Sibling Selector (`~`)** | 能根據 `input:checked` 狀態，選取後方的 `span` 並更新自訂 UI。 |
| **Responsive 排版**                  | 自訂 Radio 不只要好看，也要能在不同螢幕尺寸下水平或垂直排列。            |

## 對你的工程資產有什麼價值？

以你目前正在建立的 **UI Pattern Library（Angular + NG-ZORRO）** 來看，這兩堂課可以整理成一個共用的設計模式，而不是分別記錄 Checkbox 和 Radio：

> **Custom Form Controls Pattern**

內容包含：

* 保留原生 `<input>` 作為狀態來源（Source of Truth）。
* 使用 `opacity: 0` 而非 `display: none` 隱藏原生控制項。
* 使用 `span::before` 或 `span::after` 繪製自訂 UI。
* 利用 CSS 狀態（如 `:checked`、`:focus`、`:disabled`）同步更新外觀。
* 透過 `<label>` 擴大點擊範圍並提升可存取性。
* 配合 Media Query 實作響應式排列。

這是一個可以重複套用到 **Checkbox、Radio、Switch、Toggle** 等元件的通用 UI Pattern。
