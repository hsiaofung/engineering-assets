# 浮動標籤（Float Labels）重點整理

本堂課介紹 **Float Label（浮動標籤）設計模式**，透過 CSS 偽類與 transform 動畫，讓表單欄位的 label 同時扮演 placeholder 與固定提示文字的角色。

核心概念：

> 初始狀態 label 顯示在 input 內部，當使用者輸入或 focus 時，label 會縮小並移動到 input 上方。

---

# 1. 傳統表單 vs Float Label

## 傳統表單

```html
<label>Name</label>
<input>
```

缺點：

* 需要額外佔用垂直空間
* placeholder 與 label 可能重複資訊
* 使用者輸入後容易忘記欄位用途

---

## Float Label

初始：

```
+----------------+
| Name           |
+----------------+
```

Focus / 有值：

```
Name
+----------------+
| John           |
+----------------+
```

優點：

* 節省空間
* 保留欄位名稱
* 增加互動體驗

---

# 2. HTML 結構設計

範例：

```html
<div class="field">
    <input 
        type="text"
        placeholder=""
    >

    <label>Name</label>
</div>
```

重要：

## input 必須設定空 placeholder

```html
placeholder=""
```

原因：

後面會使用 CSS：

```css
:placeholder-shown
```

判斷：

* input 是否仍顯示 placeholder
* input 是否已經有內容

---

# 3. 利用 Flex 改變 label / input 順序

HTML：

```html
<input>
<label>
```

但是希望：

```
label
input
```

所以使用：

```css
.field {
    display:flex;
    flex-direction:column-reverse;
}
```

效果：

原本：

```
input
label
```

反轉：

```
label
input
```

這是一個 CSS 排版技巧：

> 不一定需要修改 HTML 順序，可以利用 layout 控制呈現。

---

# 4. Input Focus 樣式

使用：

```css
input:focus
```

控制取得焦點時的效果。

例如：

```css
input:focus {
    outline:none;
    border-bottom:2px solid;
}
```

效果：

原本：

```
+---------+
|         |
+---------+
```

變成：

```
---------
```

只有底線提示。

---

# 5. 使用 Transition 製造動畫

浮動標籤的重點：

不是突然跳動，而是平滑移動。

例如：

```css
label {
    transition: .3s ease;
}
```

效果：

沒有 transition：

```
Name
↓
突然移動
```

有 transition：

```
Name
  ↓
   ↓
    Name
```

---

# 6. `:placeholder-shown` 偽類（核心技巧）

這是 Float Label 的關鍵。

語法：

```css
input:placeholder-shown
```

代表：

> input 目前正在顯示 placeholder。

狀態：

## 空欄位

```html
<input placeholder="">
```

符合：

```css
:placeholder-shown
```

---

## 有輸入內容

```html
<input value="John">
```

不符合：

```css
:placeholder-shown
```

---

因此可以利用它判斷：

* 空白狀態
* 已輸入狀態

---

# 7. 使用 transform 移動 label

初始狀態：

```css
label {
    transform:
      translate(0, 0)
      scale(1);
}
```

表示：

```
Name
```

在 input 裡。

---

移動後：

```css
transform:
    translateY(-20px)
    scale(.8);
```

效果：

```
Name
+-------------+
| John        |
+-------------+
```

---

# 8. `transform-origin`

設定縮放基準點：

```css
transform-origin:left;
```

效果：

從左邊開始縮小：

```
Name
 ↓
Name
```

而不是：

```
   Name
    ↓
Name
```

避免文字移動時位置怪異。

---

# 9. 控制 Float 狀態

最後的核心 CSS：

```css
input:focus + label,
input:not(:placeholder-shown) + label {
    transform:
      translateY(-20px)
      scale(.8);
}
```

意思：

只要符合其中之一：

### 情況 1：使用者正在輸入

```css
input:focus
```

↓

label 浮動。

### 情況 2：input 已經有值

```css
input:not(:placeholder-shown)
```

↓

label 保持浮動。

---

# 10. 為什麼需要 `:not(:placeholder-shown)`？

避免這種問題：

使用者輸入：

```
John
```

然後移開 focus：

如果只使用：

```css
input:focus
```

label 會掉回去：

```
+-------+
| John  |
+-------+

Name 消失
```

不合理。

所以：

```css
:not(:placeholder-shown)
```

讓有內容時保持浮動。

---

# 11. touch-action

課程提到：

```css
touch-action
```

用途：

控制觸控操作。

例如：

* 手指滑動
* pinch zoom
* touch delay

類似：

```css
pointer-events
```

但用途不同：

| 屬性             | 控制   |
| -------------- | ---- |
| pointer-events | 滑鼠事件 |
| touch-action   | 觸控行為 |

---

# 12. 完整互動流程

```
初始
 |
 | placeholder-shown
 ↓

Label 在 input 裡


使用者 click
 |
 | focus
 ↓

Label 上移縮小


使用者輸入
 |
 | not(:placeholder-shown)
 ↓

Label 保持浮動
```

---

# 13. Float Label 的設計價值

優點：

✅ 節省表單空間
✅ 保留欄位提示
✅ 增加 UX 互動感
✅ 適合登入、註冊、設定頁面

缺點：

❌ 不一定適合所有網站
❌ 動畫過度可能造成干擾
❌ 需要使用者理解互動方式

---

# 與 Angular / NG-ZORRO 的關聯

這個技巧本質上就是現代 UI Component 的底層實作概念。

例如：

* Angular Material Form Field
* Material Design Text Field

都有類似：

```
Label
 |
 | focus / value change
 ↓
Floating Label
```

在 Angular Reactive Form 中：

```typescript
formControl.valueChanges
```

可以控制：

* 是否有值
* 是否 active
* 是否浮動

不過現代框架通常會把這些狀態管理封裝起來。

---

# 核心學習重點

1. **利用 placeholder-shown 判斷 input 狀態**
2. **利用 transform 實現 label 移動與縮放**
3. **利用 focus + value 狀態控制 UI**
4. **HTML 保持語意化，CSS 控制呈現**
5. **動畫不是裝飾，而是提升使用者理解**

---

一句話總結：

> Float Label 是利用 CSS 偽類（`:focus`、`:placeholder-shown`）與 transform 動畫，讓 label 從 placeholder 轉變成固定欄位標示的一種表單 UX 技巧。
