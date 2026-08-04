# CSS 驗證（CSS Validation）重點整理

## CSS 驗證的目的

線上表單常見問題：

* 只有一堆輸入欄位
* 缺少指引
* 使用者不知道輸入是否正確

透過 CSS，可以根據表單狀態提供**即時視覺回饋**，改善使用者體驗。

---

# CSS 表單偽類別（Pseudo-class）

CSS 可以利用以下狀態控制表單樣式：

| 偽類別         | 意義        |
| ----------- | --------- |
| `:valid`    | 輸入符合規則    |
| `:invalid`  | 輸入不符合規則   |
| `:required` | 必填欄位      |
| `:optional` | 選填欄位      |
| `:focus`    | 使用者目前操作欄位 |
| `:disabled` | 停用狀態      |

---

# 1. :valid / :invalid

## :valid

當輸入符合：

* required
* minlength
* maxlength
* pattern
* type

等限制時觸發。

例如：

```css
input:valid {
  border-color: green;
}
```

效果：

使用者輸入正確 → 顯示成功狀態。

---

## :invalid

輸入不符合規則：

```css
input:invalid {
  border-color: red;
}
```

效果：

使用者知道：

> 這個欄位需要修正。

---

# 問題：太早顯示錯誤

直接使用：

```css
input:invalid {
  border:red;
}
```

會有 UX 問題。

例如：

表單剛載入：

```
Password
[          ]  ← 空白
```

因為：

```html
required
```

所以：

```
invalid
```

立即成立。

結果：

使用者還沒開始輸入：

就看到紅色錯誤。

---

## 更好的方式

不要單獨使用：

```
:invalid
```

而是組合狀態：

例如：

```css
input:not(:placeholder-shown):invalid
```

意思：

只有使用者開始輸入後才顯示錯誤。

---

# 2. :required / :optional

## :required

表示必填：

```css
input:required {
}
```

---

## :optional

表示選填：

```css
input:optional {
}
```

---

但是：

通常 Label 已經說明：

```
Email *
```

所以：

單獨為 required 設計樣式通常價值有限。

更常見：

與 valid / invalid 組合。

例如：

```css
input:required:valid
```

---

# CSS 狀態組合

CSS 可以串接多個偽類別：

例如：

```css
input:required:valid {
}
```

代表：

* 必填欄位
* 且輸入正確

---

例如：

```css
input:required:invalid {
}
```

代表：

* 必填欄位
* 目前錯誤

---

# HTML5 驗證屬性搭配 CSS

CSS 驗證依賴 HTML5 Constraint Validation。

例如：

```html
<input
 type="password"
 minlength="8"
 maxlength="17"
 required>
```

瀏覽器會自動判斷：

有效：

```
valid
```

無效：

```
invalid
```

---

# Password Pattern 驗證

影片使用：

```html
pattern
```

搭配 Regex。

例如要求：

密碼包含：

* 數字
* 小寫字母
* 大寫字母
* 特殊符號

概念：

```
(?=.*[0-9])
(?=.*[a-z])
(?=.*[A-Z])
(?=.*[!@#$])
```

---

## Lookahead（先行斷言）

影片提到：

Regex 使用 Lookahead。

目的：

> 檢查某個條件存在，但不消耗字串位置。

例如：

```regex
(?=.*[0-9])
```

意思：

從目前位置往後看：

是否存在數字。

---

# CSS 驗證回饋範例

## 有效欄位

```css
input:not([type="submit"]):valid {
  border-color: green;
  box-shadow: 0 0 5px green;
}
```

效果：

輸入符合條件：

* 邊框變化
* 增加提示

---

## 輸入提示控制

例如密碼規則：

原本：

```
Password rules:
✓ 8 characters
✓ Number
✓ Uppercase
```

不要一直顯示。

可以：

只有：

* hover
* focus
* active

才顯示。

---

例如：

```css
input:hover + .requirements,
input:focus + .requirements {
  display:block;
}
```

---

# 表單 CSS 常見樣式

影片中的 CSS 包含：

## Form 基本樣式

例如：

* form
* fieldset
* legend
* label
* input

---

## Input type 特定樣式

例如：

```css
input[type="password"]
```

---

## Button 樣式

包含：

* background
* text color

---

## Disabled 狀態

例如：

```css
input:disabled {
}
```

---

## Focus 狀態

重要：

```css
input:focus {
  background:white;
  border:black;
}
```

目的：

讓鍵盤使用者知道：

> 目前焦點在哪裡。

---

# HTML 結構注意事項

影片提醒：

以下結構雖然瀏覽器可能正常運作：

```html
<label>
  Password
  <input>
  <ul>
    <li>Requirement</li>
  </ul>
</label>
```

但 HTML 驗證會失敗。

原因：

`label`

是 inline element。

`ul`

是 block element。

不符合 HTML 規範。

---

較好的方式：

```html
<label>
  Password
</label>

<input>

<ul>
</ul>
```

---

# CSS 驗證優點

優點：

✅ 不需要 JavaScript
✅ 即時回饋
✅ 效能好
✅ 實作簡單
✅ 與 HTML5 validation 搭配良好

---

# CSS 驗證限制

缺點：

❌ 客製化有限
❌ 複雜邏輯難處理
❌ 無法呼叫 API
❌ 無法處理跨欄位驗證

例如：

「確認密碼是否一致」

通常需要 JavaScript。

---

# Angular 對應

Angular Reactive Forms 通常不依賴純 CSS 驗證，而是：

```
FormControl
 ↓
Validator
 ↓
statusChanges
 ↓
CSS class
```

例如：

```html
<input
 [class.invalid]="password.invalid">
```

搭配：

```ts
Validators.required
Validators.minLength(8)
Validators.pattern()
```

---

# 最佳實務 Checklist

表單 CSS 驗證：

* ✅ 使用 `:valid`
* ✅ 使用 `:invalid`
* ✅ 避免頁面載入立即顯示錯誤
* ✅ 結合 `:focus` 控制提示時機
* ✅ 使用 `required`、`minlength`、`maxlength`
* ✅ 複雜規則使用 JavaScript
* ✅ 保留清楚錯誤訊息
* ✅ 提供視覺回饋但不要造成干擾
* ✅ Focus 狀態必須明顯

---

# 核心觀念（一句話）

> **CSS 驗證的價值在於利用 HTML5 驗證狀態提供即時、低成本的視覺回饋；但複雜驗證仍需要 JavaScript 或框架驗證機制。**
