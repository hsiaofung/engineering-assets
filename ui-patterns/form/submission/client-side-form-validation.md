### 用戶端表單驗證（Client-side Form Validation）重點整理

### 什麼是用戶端驗證？

在資料送到伺服器之前，先由瀏覽器檢查：

* 必填欄位是否已填

* 格式是否正確

* 是否符合欄位限制

這就是 Client-side Validation（用戶端驗證）。

### 為什麼需要用戶端驗證？

### 目的：提升使用者體驗（UX）

沒有驗證：

* 填完整份表單

* 送出

* 等待伺服器回應

* 才發現錯誤

* 重新修改

有驗證：

* 輸入時立即檢查

* 立即看到錯誤

* 立即修正

* 直接送出成功

越早發現錯誤，使用者體驗越好。

### 常見驗證訊息

使用者經常會看到：

* 「此欄位為必填」

* 「不能留空」

* 「請輸入有效的電子郵件地址」

* 「電話格式不正確」

* 「密碼需 8–17 個字元，包含大寫字母與符號」

這些都屬於 表單驗證（Form Validation）。

### 驗證流程

![The Quick-and-Dirty Web Application Security Checklist](https://images.openai.com/static-rsc-4/dxViUcZ-kSzPrfeoo-r33dU6WCdDEf2xk_PMZHqHEBA5SZYLT3yGr6SByP9pXzttaMv2Lp5YhWF3hHOXsZMuZC13IfiQ1CRgelyxiF8lVHyUSkGHp4cxwdhpI19YTK5D53UFBkY_e9NknqeOuGjbR9jeZ28ZEK9UU1Jpcv28aGdeQKA8AKR3YMKUOAnGDpVJ?purpose=fullsize)

### 用戶端驗證 vs 伺服器端驗證

| 用戶端驗證  | 伺服器端驗證     |
| ------ | ---------- |
| 在瀏覽器執行 | 在伺服器執行     |
| 立即回饋   | 需要等待請求     |
| 提升 UX  | 確保資料安全與正確性 |
| 可被繞過   | 不可省略       |

課程重點放在 Client-side Validation。

### 兩種用戶端驗證方式

### 1. HTML5 內建驗證（Built-in Validation）

優點：

* 不需要 JavaScript

* 瀏覽器原生支援

* 效能通常較好

* 實作快速

缺點：

* 客製化能力有限

* 錯誤訊息樣式較難控制

### 2. JavaScript 驗證

優點：

* 完全可客製化

* 可做複雜規則

* 可即時驗證

* 可搭配 UI/UX 設計

缺點：

* 需要自行開發

* 維護成本較高

* 可能需要使用函式庫

### HTML5 常用驗證屬性

### required

欄位必填。

HTML

```
<input required>
```

### minlength

最少字元數。

HTML

```
<input minlength="8">
```

### maxlength

最多字元數。

HTML

```
<input maxlength="17">
```

### min / max

數值範圍限制。

HTML

```
<input type="number" min="1" max="100">
```

### type

指定資料格式。

HTML

```
<input type="email">
<input type="number">
<input type="date">
```

瀏覽器會自動檢查格式。

### pattern

使用正則表達式（Regex）定義格式。

例如台灣手機：

HTML

```
<input pattern="09\d{8}">
```

### 驗證成功與失敗

### Valid（有效）

符合所有規則：

* 必填已填

* 長度符合

* 格式正確

* 數值範圍正確

→ 可以提交。

### Invalid（無效）

任何一項不符合：

* 空白

* 太短

* 太長

* Email 格式錯誤

* 不符合 Pattern

→ 顯示錯誤訊息。

### HTML5 驗證範例

HTML

```
<form>
  <label>Email</label>
  <input
    type="email"
    required
  >

  <label>Password</label>
  <input
    type="password"
    required
    minlength="8"
    maxlength="17"
  >

  <button type="submit">
    Sign Up
  </button>
</form>
```

瀏覽器會自動檢查：

* Email 是否有效

* Password 是否有填

* Password 長度是否介於 8–17

### JavaScript 驗證適合什麼情況？

當規則比較複雜時，例如：

* 密碼需包含大小寫、數字、符號

* 確認密碼是否一致

* 帳號是否已存在（AJAX）

* 跨欄位驗證

* 即時驗證（輸入中就檢查）

### Angular 開發實務

由於你使用 Angular Reactive Forms，實際上就是 JavaScript 驗證的進階版。

常見寫法：

TypeScript

```
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(17)
  ]]
});
```

對應 HTML5：

| HTML5        | Angular Validator      |
| ------------ | ---------------------- |
| required     | Validators.required    |
| minlength    | Validators.minLength() |
| maxlength    | Validators.maxLength() |
| type="email" | Validators.email       |
| pattern      | Validators.pattern()   |

### 最佳實務（Best Practices）

### 1. 同時使用 Client + Server 驗證

不要只做前端。

前端：

* 提升 UX

後端：

* 保護資料

* 防止惡意請求

### 2. 錯誤訊息要具體

❌

Invalid input

✅

Email 格式不正確

### 3. 在適當時機顯示錯誤

建議：

* 欄位失焦（blur）

* 或送出後

避免：

* 使用者打第一個字就一直跳錯誤

### 4. 保留使用者輸入

驗證失敗時：

* 不要清空整份表單

* 只提示需要修改的欄位

### UI / UX Checklist

設計表單驗證時，可快速檢查：

* ✅ 必填欄位有 `required`

* ✅ Email 使用 `type="email"` 或 `Validators.email`

* ✅ 密碼設定合理長度限制

* ✅ 數值欄位有 `min` / `max`

* ✅ 特殊格式使用 `pattern`

* ✅ 錯誤訊息清楚且具體

* ✅ 驗證回饋即時但不干擾

* ✅ 驗證失敗不清空使用者資料

* ✅ 仍保留伺服器端驗證

### 核心觀念（一句話）

用戶端驗證的目的不是保證資料安全，而是讓使用者在送出前就能立即發現並修正錯誤，提供快速且流暢的填表體驗。
