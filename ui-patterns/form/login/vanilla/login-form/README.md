## 建立登入頁面重點整理

### 1. 登入表單應保持簡潔

* 只保留必要欄位：

  * **Email（作為使用者名稱）**
  * **Password（密碼）**
* 避免要求使用者輸入多餘資訊，降低填寫成本。
* 使用 Email 取代自訂 Username，可減少使用者記憶負擔，提升登入成功率。

> **設計原則：減少認知負荷（Reduce Cognitive Load）**

---

### 2. CSS 架構分工

課程將樣式拆分成不同檔案，方便維護。

#### `base.css`

負責網站共用樣式，例如：

* Universal Selector
* `html`
* `body`
* `header`
* Logo
* Wrapper
* 各頁共用版型

#### `form.css`

專門負責：

* Login Form
* Register Form
* Input
* Label
* Button
* Form 元件樣式

> **最佳實務：共用樣式與元件樣式分離，提高可維護性。**

---

### 3. 每個頁面使用不同的 Body ID

例如：

```html
<body id="login-page">
```

原因：

* 每個頁面有不同背景圖片
* 可以依照頁面套用不同背景
* CSS 更容易管理

例如：

```css
#login-page {
    background-image: url(...);
}

#register-page {
    background-image: url(...);
}
```

---

### 4. Wrapper 的用途

整個頁面內容包在：

```html
<div class="wrapper">
```

用途：

* 包住主要內容
* 加入半透明遮罩
* 疊加漸層效果
* 提高背景圖片上的文字可讀性

例如：

```
背景圖片
    ↓
Wrapper 半透明背景
    ↓
Login Form
```

---

### 5. Login Form HTML 結構

登入表單結構十分簡單：

```
Form
 ├─ Label (Email)
 ├─ Input (Email)
 ├─ Label (Password)
 ├─ Input (Password)
 ├─ Button
 └─ Forgot Password Link
```

包含：

* Form
* Label
* Input
* Button
* 忘記密碼連結

屬於典型登入頁配置。

---

### 6. 使用圖示提升辨識度

Label 中加入 **Font Awesome Icon**：

* Email → 信封圖示
* Password → 鎖頭圖示

優點：

* 增加辨識速度
* 提供視覺提示
* 提升介面美觀

但圖示應作為**輔助資訊**，不能取代文字 Label。

---

### 7. 表單 CSS 重點

課程示範了基本表單樣式。

#### Header

* 修改背景色

#### Form

* 半透明白色背景（約 90% 不透明）
* 保留背景插圖若隱若現

例如：

```css
background: rgba(255,255,255,.9);
```

效果：

* 提高可讀性
* 保持設計感

---

#### Label

設定：

* Block
* 字體大小
* 顏色

例如：

```css
label {
    display:block;
}
```

---

#### Input

設定：

* Border
* Padding
* Width

讓輸入區容易點擊且具有一致性。

---

#### Button

登入按鈕有獨立樣式：

* 顏色
* Padding
* Hover

使其成為主要 CTA（Call To Action）。

---

#### Icon

設定 Font Awesome：

* 顏色
* 大小

與整體配色一致。

---

#### Footer Text

例如：

```
Forgot your password?
```

使用較小字體：

* 不搶主按鈕焦點
* 保留可操作性

---

### 8. 視覺層次設計

整體視覺層次如下：

```
背景圖片
      ↓
半透明 Form
      ↓
Label
      ↓
Input
      ↓
Primary Button
      ↓
Forgot Password
```

閱讀流程自然：

1. 標題
2. 欄位
3. 按鈕
4. 次要操作

符合使用者閱讀習慣。

---

### 9. 設計理念

這堂課強調的不只是 CSS，而是登入頁的 UX 原則：

* **只要求必要資訊**
* **使用 Email 作為帳號**
* **降低使用者認知負擔**
* **利用圖示提供輔助提示**
* **保持畫面乾淨、清楚**
* **透過半透明背景提升可讀性**
* **將共用樣式與表單樣式分離，提高維護性**

---

## 本課核心重點（適合筆記）

* 登入表單只保留必要欄位（Email + Password）。
* 使用 Email 作為帳號可降低使用者記憶負擔。
* 將 `base.css`（共用樣式）與 `form.css`（表單樣式）分離，提升維護性。
* 不同頁面可透過 `<body id="">` 套用不同背景與樣式。
* 使用 `.wrapper` 加入半透明遮罩與漸層，提升背景圖片上的文字可讀性。
* Label、Input、Button 採用一致且清晰的樣式，建立良好的視覺層次。
* 使用 Font Awesome 圖示作為輔助提示，但不可取代文字 Label。
* 採用半透明白色表單背景，兼顧美觀與可讀性。
* 登入按鈕應作為最主要的 CTA，而「忘記密碼」則作為次要操作呈現。
* 核心 UX 原則是**降低認知負荷、提升可讀性、保持介面簡潔**。
