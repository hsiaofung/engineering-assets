# Form Toolkit CSS 使用說明

此文件說明 `_form-layout.scss`、`_form-typography.scss`、`_form-validation.scss` 與 `_form-utils.scss` 中的常用 class 與 mixin，用於表單排版、字型、驗證與間距控制。

---

## 1️⃣ Form Layout (\_form-layout.scss)

| Class / Selector            | 說明                                                             |
| --------------------------- | ---------------------------------------------------------------- |
| `.form-row`                 | 表單欄位一行排列，使用 flex 排版，預設欄位間距 `gap: 20px`。     |
| `.form-row .form-item`      | 單一欄位容器，flex: 1 平均分配寬度，min-width: 0 避免 overflow。 |
| `.form-row nz-select`       | 下拉選單寬度填滿父容器。                                         |
| `.form-row` (margin-bottom) | 欄位底部間距 20px，可調整。                                      |

**使用範例：**

```html
<div class="form-row">
  <div class="form-item">
    <input type="text" />
  </div>
  <div class="form-item">
    <nz-select></nz-select>
  </div>
</div>
```

---

## 2️⃣ Form Typography (\_form-typography.scss)

| Class / Selector | 說明                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| `.title`         | 表單區塊標題，使用 `f-subtitle-1` 字型，顏色 var(--shades-color-1)，上下 margin 20px。 |
| `.info-icon`     | 說明圖示，左間距 6px，顏色 #1c7bcf。                                                   |
| `.label`         | 欄位標籤，字型大小 13px，底部 margin 5px。                                             |
| `input`          | 表單輸入欄位字型大小 13px。                                                            |

---

## 3️⃣ Form Validation (\_form-validation.scss)

| Class / Selector | 說明                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `.required`      | 標示必填欄位，文字顏色 #f24f7c，左邊距 4px。                         |
| `.errorShower`   | 顯示驗證錯誤訊息，文字顏色 #f24f7c，字型大小 13px，頂部 margin 2px。 |
| `.error-border`  | 表單輸入錯誤邊框，1px 實線紅色 #f24f7c。                             |

---

## 4️⃣ Form Utils (\_form-utils.scss)

| Class / Selector | 說明                   |
| ---------------- | ---------------------- |
| `.mt-20`         | 元素上方 margin 20px。 |
| `.mr-60`         | 元素右方 margin 60px。 |

---

## 使用建議

1. 建議在表單元件上統一套用 `.form-row` + `.form-item` 來保持欄位間距一致。
2. 標題使用 `.title`，必要說明圖示加 `.info-icon`。
3. 驗證訊息統一使用 `.errorShower`，並搭配 `.error-border` 改變 input 邊框。
4. 常用間距工具如 `.mt-20`、`.mr-60` 可快速調整版面間距。
5. SCSS 使用 `@use 'shared/design-system/style-sheet.scss' as *;` 引入即可。
