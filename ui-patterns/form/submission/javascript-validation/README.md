# JavaScript 驗證（JavaScript Validation）重點整理

## 為什麼需要 JavaScript 驗證？

CSS 驗證雖然可以提供基本回饋，但能力有限。

使用 JavaScript 可以做到：

* 即時驗證使用者輸入
* 控制何時顯示錯誤
* 提供更豐富的視覺回饋
* 自訂錯誤訊息
* 實作複雜驗證規則

例如：

使用者輸入密碼時：

```
☑ 至少 8 個字元
☑ 包含大寫字母
☐ 包含特殊符號
```

條件符合時：

* 變綠色
* 出現勾選圖示

讓使用者立即知道完成狀態。

---

# Client-side Validation 三種層級

| 方式                    | 特色        |
| --------------------- | --------- |
| HTML5 Validation      | 最簡單、瀏覽器內建 |
| CSS Validation        | 提供視覺狀態    |
| JavaScript Validation | 高度客製化     |

---

# JavaScript 驗證優勢

## 1. 即時驗證（Real-time Validation）

使用者輸入時立即檢查：

例如：

輸入：

```
ab
```

立即提示：

```
❌ 至少需要 3 個字元
```

輸入：

```
abc
```

變成：

```
✅ 格式正確
```

---

## 2. 控制回饋時機

避免：

一打開表單：

```
❌ Password required
❌ Username invalid
```

造成壓力。

可以控制：

* focus 時顯示
* 輸入後顯示
* submit 時顯示

---

# JavaScript 驗證架構

主要流程：

```
User Input
    ↓
Event Listener
    ↓
Validation Function
    ↓
Check Rules
    ↓
Update UI
    ↓
Show Feedback
```

---

# 常見實作方式

## 1. 監聽輸入事件

例如：

```javascript
input.addEventListener(
  "input",
  validate
);
```

當使用者輸入：

→ 執行驗證。

---

# 2. 建立驗證規則

每個欄位有自己的規則：

例如：

Username：

```javascript
[
  {
    invalid: value.length < 3,
    message: "至少需要三個字元"
  }
]
```

Password：

```javascript
[
  {
    invalid: 沒有大寫,
    message: "需要大寫字母"
  },
  {
    invalid: 沒有數字,
    message: "需要數字"
  }
]
```

---

# Validation Rule 結構

影片提到每個驗證條件包含三部分：

## 1. is invalid

判斷是否錯誤的 function。

例如：

```javascript
value.length < 8
```

---

## 2. invalidity message

錯誤訊息。

例如：

```
Password 至少需要 8 個字元
```

---

## 3. element

對應顯示訊息的位置。

例如：

```html
<li>
Password must contain number
</li>
```

---

# CSS + JavaScript 配合

JavaScript 負責：

* 判斷狀態
* 加入 class

例如：

有效：

```javascript
element.classList.add("valid");
```

無效：

```javascript
element.classList.add("invalid");
```

---

CSS 負責：

有效：

```css
.valid {
  color: green;
}
```

無效：

```css
.invalid {
  color: orange;
}
```

---

# 使用 :after 顯示圖示

影片使用：

```css
.valid::after {
  content:"✓";
}
```

效果：

```
✓ Password contains uppercase
```

---

# Pattern / Regex 驗證

JavaScript 可以使用 Regex：

例如：

密碼必須包含：

* 數字
* 小寫
* 大寫
* 特殊符號

概念：

```regex
(?=.*[0-9])
(?=.*[a-z])
(?=.*[A-Z])
(?=.*[!@#$])
```

---

# 自訂錯誤訊息

HTML5：

瀏覽器提供：

```
Please fill out this field
```

JavaScript：

可以改成：

```
密碼需要至少包含一個大寫字母
```

更符合產品需求。

---

# Form Submit 控制

驗證失敗：

```
User click submit
        ↓
Validation failed
        ↓
Prevent submit
        ↓
Show error
```

表單不會送出。

例如：

```javascript
event.preventDefault();
```

---

# JavaScript 驗證範例流程

使用者輸入：

```
Pass123
```

檢查：

| 規則      | 結果 |
| ------- | -- |
| 至少 8 字元 | ❌  |
| 包含數字    | ✅  |
| 包含大寫    | ✅  |
| 包含小寫    | ✅  |
| 包含符號    | ❌  |

UI：

```
❌ 至少8個字元
✅ 包含數字
✅ 包含大寫
✅ 包含小寫
❌ 包含特殊符號
```

---

# HTML 結構注意事項

影片再次提醒：

不要：

```html
<label>
 Password
 <input>
 <ul>
 </ul>
</label>
```

原因：

* `label` 是 inline element
* `ul` 是 block element

HTML Validation 會失敗。

建議：

```html
<label>
 Password
</label>

<input>

<ul>
</ul>
```

---

# JavaScript 驗證 vs CSS 驗證

|        | CSS | JavaScript |
| ------ | --- | ---------- |
| 簡單狀態   | ✅   | ✅          |
| 即時提示   | 有限  | ✅          |
| 自訂訊息   | ❌   | ✅          |
| 複雜規則   | ❌   | ✅          |
| API 驗證 | ❌   | ✅          |
| 跨欄位驗證  | ❌   | ✅          |

---

# Angular Reactive Forms 對應

Angular 實務上就是把這套模式框架化：

## Validator

```typescript
Validators.required
Validators.minLength(8)
Validators.pattern()
```

↓

## FormControl 狀態

```typescript
control.valid
control.invalid
control.errors
```

↓

## UI Feedback

```html
<div *ngIf="password.errors?.required">
 Password is required
</div>
```

---

# 最佳實務

## 1. Client + Server Validation 必須並存

不要只依靠前端。

原因：

前端：

✅ 快速回饋
✅ 改善 UX

後端：

✅ 安全
✅ 防止繞過

---

## 2. 錯誤訊息要可操作

❌

```
Invalid input
```

✅

```
Password must contain at least one number
```

---

## 3. 不要過度即時驗證

避免：

使用者剛開始輸入：

```
a
```

立即：

```
❌ 太短
```

可能造成壓力。

---

# UI / UX Checklist

* ✅ 輸入時提供適當回饋
* ✅ 顯示每個驗證條件狀態
* ✅ 使用顏色 + icon 表示狀態
* ✅ 錯誤訊息清楚
* ✅ 驗證失敗阻止提交
* ✅ 使用者知道如何修正
* ✅ 不只依靠顏色（考慮無障礙）
* ✅ Client Validation + Server Validation

---

# 核心觀念（一句話）

> **JavaScript 驗證讓表單不只是「阻止錯誤資料」，而是能在使用者輸入過程中提供即時、清楚、可操作的引導，形成更好的使用者體驗。**
