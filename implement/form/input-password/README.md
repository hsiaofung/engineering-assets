# Password Toggle Directive

一個輕量的 Angular directive，可以在原生 `<input>` 上加上顯示／隱藏密碼的按鈕。

## 使用方式

```html
<input appPasswordToggle type="password" />
```

Directive 會：
- 在 input 右側建立眼睛圖示按鈕
- 切換 input 的 type（`password` ↔ `text`）
- 根據目前狀態更新圖示顏色

## 需求

input 的父元素必須允許相對定位。Directive 會自動將父元素設為 `position: relative`，並在 input 加上右側 padding，避免文字被按鈕蓋住。

## 樣式

圖示顏色使用設計系統的 CSS 變數：

| 狀態 | 顏色 |
|------|------|
| 隱藏（password） | `var(--shades-color-4)` |
| 顯示（text） | `var(--primary-color-1)` |

按鈕使用絕對定位，固定在右側並垂直置中。

## 範例

```html
<label>
  Password
  <input appPasswordToggle type="password" placeholder="Enter password" />
</label>
```

## 注意事項

- 此 directive 僅適用於簡單的原生 input。
- 若需要完整功能（ControlValueAccessor、錯誤樣式、設計系統整合），請使用 `InputPasswordComponent`。
- 此 directive 不處理表單驗證或 CVA 綁定。
