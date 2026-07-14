## 密碼強度指示器（Password Strength）課程重點整理

### 1. 功能目的：提供即時回饋（Real-time Feedback）

* 密碼欄位通常只能讓使用者輸入內容，但不知道是否符合安全規範。
* 加入**密碼強度指示器（Password Strength Indicator）**後：

  * 使用者輸入密碼時立即知道目前強度。
  * 引導使用者建立更安全的密碼。
  * 降低註冊失敗率，提升使用者體驗（UX）。

---

## 2. 密碼驗證規則設計

本課程設定密碼必須符合以下條件：

| 條件         | 說明        |
| ---------- | --------- |
| 最少 10 個字元  | 增加密碼長度    |
| 至少 1 個大寫字母 | A-Z       |
| 至少 1 個小寫字母 | a-z       |
| 至少 1 個數字   | 0-9       |
| 至少 1 個特殊符號 | 如 `!@#$%` |

每符合一項條件，就增加密碼強度分數。

---

# 3. HTML：使用 `<progress>` 建立強度條

使用 HTML5 提供的 `<progress>` 元素：

```html
<progress 
  id="strength"
  max="100"
  value="0"
  aria-label="password strength progress bar">
</progress>
```

### 重要屬性

| 屬性              | 用途                 |
| --------------- | ------------------ |
| `max="100"`     | 設定最大值              |
| `value="0"`     | 初始強度為 0            |
| `id="strength"` | JavaScript 操作目標    |
| `aria-label`    | 提升無障礙支援，讓螢幕閱讀器理解用途 |

---

# 4. CSS：設計視覺化強度條

## 基本樣式

設定：

* 寬度（width）
* 高度（height）
* 邊框（border）
* 圓角（border-radius）
* 背景色（background）
* 間距（margin）

讓原本瀏覽器預設的 progress bar 變成符合 UI 設計的元件。

---

## 瀏覽器相容處理

不同瀏覽器對 `<progress>` 的內部結構不同：

* WebKit：

  * Chrome
  * Safari

* Mozilla：

  * Firefox

因此需要使用：

```css
::-webkit-progress-bar
::-webkit-progress-value
::-moz-progress-bar
```

分別控制樣式。

---

# 5. 強度等級與顏色設計

透過不同 CSS class 表示密碼強度：

| Class   | 強度 | 顏色 |
| ------- | -- | -- |
| `pb20`  | 很弱 | 紅色 |
| `pb40`  | 弱  | 橙色 |
| `pb60`  | 普通 | 黃色 |
| `pb80`  | 良好 | 青色 |
| `pb100` | 強  | 綠色 |

使用者可以透過顏色快速理解密碼安全程度。

---

# 6. JavaScript：動態計算密碼強度

## 監聽輸入事件

使用：

```javascript
keyup
```

事件：

流程：

```
使用者輸入密碼
        ↓
keyup 觸發
        ↓
checkPassword()
        ↓
檢查密碼規則
        ↓
計算分數
        ↓
更新 progress bar
```

---

# 7. 使用 Regex 驗證密碼條件

利用正規表示式檢查：

### 是否包含數字

```regex
[0-9]
```

---

### 是否包含大寫字母

```regex
[A-Z]
```

---

### 是否包含小寫字母

```regex
[a-z]
```

---

### 是否包含特殊符號

```regex
[!@#$%^&*]
```

---

### 長度檢查

```javascript
password.length >= 10
```

---

# 8. 強度計算邏輯

概念：

```
初始分數 = 0

符合長度 → +20
符合大寫 → +20
符合小寫 → +20
符合數字 → +20
符合符號 → +20

總分最高 100
```

例如：

| 密碼          | 分數  |
| ----------- | --- |
| abc         | 20  |
| abc1234567  | 40  |
| Abc1234567! | 100 |

---

# 9. 使用 Switch 更新 UI

依照分數套用不同 class：

概念：

```javascript
switch(score){
  case 20:
    add pb20
    break;

  case 40:
    add pb40
    break;

  ...

  case 100:
    add pb100
}
```

結果：

```
弱密碼
 ↓
紅色

中等密碼
 ↓
黃色

強密碼
 ↓
綠色
```

---

# 10. UX 設計重點

密碼強度指示器是一種：

> **Progressive Feedback（漸進式回饋）**

好的設計應該：

✅ 使用者輸入時立即反應
✅ 讓使用者知道改善方向
✅ 不等提交表單才顯示錯誤
✅ 用視覺化降低理解成本

---

# 11. 前端開發可延伸思考（Angular）

若套用到 Angular：

可能拆成：

```
PasswordStrengthComponent
        |
        ├── password input
        ├── strength calculator service
        ├── validation rules
        └── progress UI
```

可以使用：

* Reactive Forms Validator
* Custom Validator
* Signal / Observable 即時監控 valueChanges

例如：

```
password.valueChanges
        ↓
calculateStrength()
        ↓
update strength signal
        ↓
更新 UI
```

---

## 本課核心概念

> 密碼強度指示器不是單純顯示「密碼強或弱」，而是透過即時回饋引導使用者完成正確操作，提升表單完成率與安全性。

這堂課的重點可以歸納為：

**HTML 建立元件 → CSS 視覺化 → JavaScript 驗證邏輯 → 即時 UX 回饋**。
