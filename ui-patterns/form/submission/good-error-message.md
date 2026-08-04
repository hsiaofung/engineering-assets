# 良好的錯誤訊息（Good Error Messages）重點整理

## 為什麼錯誤訊息重要？

沒有任何系統能完全避免錯誤：

錯誤來源可能是：

* 使用者輸入錯誤
* 系統故障
* 網路問題
* 資料狀態問題

錯誤處理方式會直接影響：

* 使用者體驗（UX）
* 使用者信任
* 完成任務的成功率

> **好的錯誤訊息不是只告訴使用者「錯了」，而是幫助使用者「解決問題」。**

---

# 好的錯誤訊息三大要素

每個好的錯誤訊息包含：

1. **清楚的文字訊息（Clear Message）**
2. **正確的位置（Correct Placement）**
3. **良好的視覺設計（Good Visual Design）**

---

# 1. 清楚的文字訊息

## 錯誤訊息應回答三件事：

### ① 發生什麼問題？

例如：

❌

```
Error
```

使用者不知道：

* 哪裡錯？
* 為什麼錯？

---

### ② 為什麼發生？

例如：

❌

```
Email invalid
```

較好的：

✅

```
Email 格式錯誤，因為缺少 @
```

---

### ③ 如何修正？

例如：

✅

```
請輸入有效的 Email，例如 name@example.com
```

---

# 錯誤訊息應像人與人對話

好的錯誤訊息：

* 自然
* 禮貌
* 容易理解
* 沒有技術術語

---

## 避免技術用語

❌

```
ValidationException: regex failed
```

使用者不知道：

* regex 是什麼？
* 要怎麼處理？

---

✅

```
密碼需要包含至少一個數字
```

---

# 不要責怪使用者

錯誤訊息不是責備。

❌

```
你輸入錯誤
```

❌

```
你忘記填寫 Email
```

---

✅

```
請輸入 Email 地址
```

---

# 使用品牌語氣

錯誤訊息也是品牌體驗的一部分。

例如：

一般：

```
Password incorrect
```

較友善：

```
密碼不正確，請再試一次
```

---

## 幽默要小心

可以使用：

* 親切語氣
* 品牌特色

但優先順序：

1. 清楚
2. 有幫助
3. 再考慮幽默

不要為了幽默讓使用者不知道如何修正。

---

# 2. 錯誤訊息位置（Placement）

## 錯誤訊息應靠近問題位置

最佳：

```
Email
[abc.com]

❌ Email 格式錯誤，請包含 @
```

---

不要：

```
表單底部：

共有 5 個錯誤
```

原因：

使用者需要：

* 找錯誤位置
* 對應欄位
* 重新理解問題

增加認知負擔。

---

# 避免錯誤摘要（Error Summary）

錯誤摘要：

```
請修正以下錯誤：

1. Email
2. Password
3. Address
```

適合：

* 很長的表單
* 多步驟流程

但一般欄位：

應優先：

> Inline Error（欄位附近錯誤）

---

# 3. 視覺設計（Visual Design）

## 清楚可見

錯誤訊息需要：

* 明顯
* 容易閱讀
* 不被忽略

---

## 色彩對比

常見：

🔴 紅色

表示：

* Error
* Danger

也可以使用：

🟡 黃色
🟠 橘色

表示：

* Warning
* Attention

---

但重點：

> 顏色必須有足夠對比，符合無障礙要求。

---

# 不要只靠顏色

錯誤不能只用：

```
紅色文字
```

原因：

色盲使用者可能無法辨識。

---

應搭配：

## Icon

例如：

```
⚠ Email 格式錯誤
```

或：

```
❌ Password incorrect
```

---

# Error Message 範例比較

## Email 欄位

### 差

```
Invalid input
```

問題：

* 不知道哪裡錯
* 不知道怎麼修

---

### 好

```
Email 格式不正確，請輸入包含 @ 的有效地址。
```

---

## 密碼欄位

### 差

```
Password error
```

---

### 好

```
密碼至少需要 8 個字元，並包含一個大寫字母和數字。
```

---

# 驗證錯誤類型

常見錯誤：

| 類型         | 範例          |
| ---------- | ----------- |
| Required   | 請輸入 Email   |
| Format     | Email 格式錯誤  |
| Length     | 密碼至少 8 字元   |
| Range      | 年齡需介於 18–65 |
| Conflict   | 此帳號已存在      |
| Permission | 沒有操作權限      |

---

# 表單錯誤訊息最佳流程

```
User Input
     ↓
Validation
     ↓
Error Detected
     ↓
Show Error Near Field
     ↓
Explain Problem
     ↓
Tell User How To Fix
```

---

# Angular / Frontend 實務對應

Angular Reactive Forms：

```typescript
control.errors
```

取得錯誤：

```typescript
if(control.hasError('required')){
  message = 'Email is required';
}

if(control.hasError('email')){
  message = 'Please enter a valid email';
}
```

HTML：

```html
<div *ngIf="email.invalid">
  {{errorMessage}}
</div>
```

---

# Accessibility 注意事項

錯誤訊息需要支援：

## Screen Reader

例如：

```html
<div aria-live="polite">
  Email format is invalid
</div>
```

讓螢幕閱讀器知道：

> 有新的錯誤訊息出現。

---

## Focus 管理

提交失敗時：

不要讓使用者自己找錯誤。

可以：

Focus 到第一個錯誤欄位。

---

# UI / UX Checklist

錯誤訊息設計：

* ✅ 說明發生什麼問題
* ✅ 說明如何修正
* ✅ 使用人類語言
* ✅ 避免技術術語
* ✅ 不責怪使用者
* ✅ 放在錯誤欄位附近
* ✅ 容易被看到
* ✅ 有足夠色彩對比
* ✅ 不只依靠顏色
* ✅ 搭配 icon
* ✅ 支援 Screen Reader

---

# 核心觀念（一句話）

> **好的錯誤訊息不是通知使用者「你錯了」，而是像一位好的助手，告訴使用者「發生什麼事，以及下一步該怎麼做」。**
