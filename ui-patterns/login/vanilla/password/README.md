# 密碼可見性切換（Password Visibility）重點整理

## 1. 提供密碼顯示／隱藏切換

現代登入表單通常會提供「顯示密碼」功能，讓使用者自行決定是否要看到輸入內容。

主要目的：

* 降低輸入錯誤
* 提升使用體驗（UX）
* 避免再次輸入密碼（Confirm Password）所造成的額外負擔
* 讓使用者保有控制權

> **設計原則：將控制權交給使用者（User Control）**

---

## 2. Password Visibility 的優點

加入顯示／隱藏密碼功能可帶來以下好處：

* 減少打字錯誤
* 不必反覆刪除重新輸入
* 避免增加「再次輸入密碼」欄位
* 對手機使用者尤其友善
* 提升登入成功率

---

## 3. HTML 結構調整

密碼欄位除了 `input` 外，再加入一個眼睛圖示。

結構概念：

```text
Password Label
        │
        ▼
+-------------------------+
| Password Input      👁 |
+-------------------------+
```

眼睛圖示（例如 Font Awesome）作為切換密碼顯示狀態的控制元件。

---

## 4. 使用 Wrapper 包住 Input 與 Icon

將密碼輸入框與圖示放進同一個容器：

```text
Password Wrapper
 ├── Input
 └── Eye Icon
```

好處：

* 可視為一個完整元件
* 容易控制版面
* 方便加入共同邊框與背景

---

## 5. 使用 Flex 排版

將 Wrapper 設為 Flex Container。

效果：

```text
+--------------------------------+
| Password Input           👁    |
+--------------------------------+
```

Flex 可讓：

* Input 自動撐滿剩餘空間
* Icon 固定靠右
* 垂直置中
* 排版更簡潔

---

## 6. CSS 樣式重點

### Wrapper

負責：

* Border
* Border Radius
* Background
* Flex Layout

讓整個密碼欄位看起來像一個完整的 Input。

---

### Input

移除自己的：

* Border
* Outline（依設計需求）

避免產生雙重邊框。

---

### Eye Icon

設定：

* 深色圖示
* Cursor Pointer
* Margin
* Hover 效果

讓使用者知道它可以點擊。

---

## 7. JavaScript 切換邏輯

主要流程：

```text
點擊眼睛
      │
      ▼
判斷目前是否隱藏
      │
      ├── 是
      │     ▼
      │ 顯示密碼
      │
      └── 否
            ▼
         隱藏密碼
```

核心就是切換 Input 的 `type`：

* `password`
* `text`

---

## 8. 同步切換圖示

除了改變 Input Type，也要同步更新圖示。

例如：

```text
Password Hidden
👁

↓

Password Visible
🙈（或 👁️‍🗨️）
```

課程使用 Font Awesome：

* `fa-eye`
* `fa-eye-slash`

讓使用者立即知道目前狀態。

---

## 9. 狀態管理

課程以布林值記錄目前狀態：

```text
passwordHidden = true

↓

Click

↓

passwordHidden = false
```

每次點擊：

1. 更新 Input Type
2. 更新 Icon
3. 更新狀態

形成完整的切換流程。

---

## 10. Password Toggle 流程

```text
Password (••••••)
        │
        ▼
Click Eye
        │
        ▼
Password (abc123)
        │
        ▼
Eye Slash Icon
        │
        ▼
Click Again
        │
        ▼
Password (••••••)
```

---

## 11. UX 設計重點

這個功能背後的重要 UX 原則包括：

* **User Control（使用者控制權）**：由使用者決定是否顯示密碼。
* **Reduce Errors（降低錯誤）**：可快速檢查是否輸入正確。
* **Reduce Friction（減少操作阻力）**：避免因密碼輸入錯誤而重複操作。
* **Consistency（一致性）**：眼睛圖示已成為常見介面慣例，使用者容易理解。

---

## 12. Angular 實作建議

若使用 Angular，可避免額外的布林變數，直接根據元件狀態綁定：

* 使用一個 `showPassword` 狀態控制顯示與隱藏。
* 透過屬性綁定切換 `input` 的 `type`（`password` 或 `text`）。
* 透過 `ngClass` 或屬性綁定同步切換眼睛圖示。
* 點擊圖示時，只需切換 `showPassword` 的值即可。

這種做法更符合 Angular 的宣告式設計，避免直接操作 DOM。

---

# 本課核心重點（適合筆記）

* Password Visibility 是現代登入表單的重要功能，可提升使用者體驗。
* 使用 Wrapper 將 Input 與 Eye Icon 視為同一個元件，方便統一排版與樣式管理。
* Flex Layout 是密碼輸入框搭配圖示的常見實作方式。
* 密碼顯示／隱藏的核心做法是切換 Input 的 `type`（`password` ↔ `text`）。
* 圖示應與密碼狀態同步更新（`fa-eye` ↔ `fa-eye-slash`），提供清楚的視覺回饋。
* Angular 中可透過狀態綁定與事件處理實作，避免直接操作 DOM，更符合框架最佳實務。
