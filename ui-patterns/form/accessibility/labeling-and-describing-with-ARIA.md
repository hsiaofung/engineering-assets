# 使用 ARIA 進行標籤與描述（ARIA Labels & Descriptions）重點整理

## 什麼是 ARIA？

**ARIA（Accessible Rich Internet Applications）** 是一組 HTML 屬性，用來提升網頁的無障礙性，讓輔助技術（例如螢幕閱讀器、語音控制）更容易理解網頁內容。

主要目的：

* 幫助視障使用者
* 幫助聽障使用者
* 提升輔助工具對網頁的理解能力
* 補足原生 HTML 無法表達的資訊

> **ARIA 是「補充」HTML，不是「取代」HTML。**

---

# ARIA 何時使用？

只有當**原生 HTML 無法解決無障礙問題時**，才使用 ARIA。

例如：

✅ 原生 HTML

```html
<form>
```

就已經具有：

* form 的語意
* 可被 Screen Reader 辨識

因此：

```html
<div role="form">
```

反而是不必要的。

---

# ARIA 的兩大組成

## 1. Roles（角色）

Role 用來告訴輔助工具：

> 「這個元素是什麼？」

例如：

```html
<div role="button">
```

代表：

> 這是一個按鈕。

常見 Role：

| Role         | 意義        |
| ------------ | --------- |
| `button`     | 按鈕        |
| `dialog`     | 對話框       |
| `navigation` | 導覽區       |
| `banner`     | 網站 Header |
| `main`       | 主要內容      |
| `form`       | 表單        |

---

## 2. ARIA Attributes（屬性）

所有 ARIA 屬性都以：

```text
aria-
```

開頭。

例如：

```html
aria-label
aria-labelledby
aria-describedby
aria-hidden
aria-expanded
aria-required
aria-invalid
```

---

# ARIA Attribute 分成兩類

## States（狀態）

會因互動而改變。

例如：

```html
aria-expanded="true"
```

使用者展開 Menu：

```text
false → true
```

另一個例子：

```html
aria-checked="true"
```

Checkbox：

```text
false → true
```

---

## Properties（屬性）

通常固定，不太改變。

例如：

```html
aria-label="Search"
```

Label 不會一直改。

---

# ARIA 第一原則（最重要）

影片反覆強調：

> **能用原生 HTML，就不要用 ARIA。**

例如：

不要寫：

```html
<div role="button">
```

應該直接：

```html
<button>
```

不要：

```html
<div role="checkbox">
```

應該：

```html
<input type="checkbox">
```

因為：

* HTML 已經有完整語意
* 瀏覽器原生支援
* Screen Reader 已完全支援
* 不需要自己模擬

---

# 不要改變 HTML 原本語意

例如：

不要把：

```html
<button>
```

改成：

```html
<button role="link">
```

會造成：

* Screen Reader 混亂
* 使用者困惑

---

# 所有互動元件都必須可用鍵盤操作

如果使用：

```html
<div role="button">
```

還必須：

```html
tabindex="0"
```

才能：

* Tab 到此元素
* 使用 Enter
* 使用 Space

否則：

滑鼠可以點

鍵盤卻不能。

---

# tabindex="0"

一般 div：

```html
<div>
```

不能取得焦點。

加入：

```html
<div tabindex="0">
```

就可以：

Tab →

聚焦到此元素。

---

# 不要對可聚焦元素使用 aria-hidden

例如：

```html
<button aria-hidden="true">
```

或

```html
<input aria-hidden="true">
```

都是錯誤。

原因：

使用者：

Tab →

聚焦到了按鈕

但 Screen Reader：

卻說：

> 沒有東西

造成：

> 我到底聚焦到哪？

非常困惑。

---

# 不要對可聚焦元素使用 role="presentation"

例如：

```html
<button role="presentation">
```

會把按鈕語意拿掉。

Screen Reader：

不知道它是按鈕。

因此：

> **任何可聚焦元素都不要使用 `role="presentation"`。**

---

# 所有互動元件都要有 Accessible Name

影片提到：

> Every interactive element must have an accessible name.

意思就是：

Screen Reader 必須知道：

> 這個元件叫什麼？

例如：

```html
<button aria-label="Close">
```

Screen Reader：

> Close button

而不是：

> Button

---

# 表單應加入適當 ARIA

必要時：

可以加入：

```html
aria-required="true"
```

```html
aria-invalid="true"
```

```html
aria-describedby
```

讓：

* Screen Reader
* Voice Control

更容易理解。

---

# 最佳實務（Best Practices）

## 1. 優先使用原生 HTML

✅

```html
<form>
<button>
<input>
<select>
<label>
```

❌

```html
<div role="form">
<div role="button">
```

---

## 2. ARIA 是補充，不是替代

ARIA：

✔ 補充資訊

HTML：

✔ 提供真正語意

---

## 3. 自訂控制元件要支援鍵盤

如果真的做：

```html
<div role="button">
```

至少要：

```html
tabindex="0"
```

並支援：

* Enter
* Space
* Tab

---

## 4. 每個互動元件都有 Accessible Name

例如：

* Label
* aria-label
* aria-labelledby

不能只有：

```html
<button>
```

沒有任何名稱。

---

## 5. 不要隱藏可聚焦元素

不要：

```html
aria-hidden="true"
```

或：

```html
role="presentation"
```

放在：

* button
* input
* select
* a
* tabindex="0"

---

# 常見 ARIA 屬性

| 屬性                 | 用途          |
| ------------------ | ----------- |
| `aria-label`       | 提供元件名稱      |
| `aria-labelledby`  | 使用其他元素作為名稱  |
| `aria-describedby` | 提供補充說明      |
| `aria-required`    | 必填欄位        |
| `aria-invalid`     | 欄位驗證失敗      |
| `aria-hidden`      | 隱藏給螢幕閱讀器    |
| `aria-expanded`    | 展開/收合狀態     |
| `aria-checked`     | Checkbox 狀態 |
| `aria-disabled`    | 停用狀態        |

---

# UI / UX Checklist

設計元件時，可快速檢查：

* ✅ 優先使用原生 HTML 元素
* ✅ 只有在 HTML 不足時才使用 ARIA
* ✅ 不隨意改變 HTML 原本語意
* ✅ 自訂互動元件支援鍵盤操作
* ✅ 使用 `tabindex="0"` 讓自訂元件可聚焦
* ✅ 每個互動元件都有 Accessible Name
* ✅ 不在可聚焦元素使用 `aria-hidden`
* ✅ 不在可聚焦元素使用 `role="presentation"`
* ✅ 善用 `aria-label`、`aria-labelledby`、`aria-describedby` 提升可理解性

---

# 核心觀念（一句話）

> **ARIA 的角色是補強原生 HTML 的無障礙能力，而不是取代 HTML；遵循「能用原生 HTML，就不要用 ARIA」是最重要的原則。**
