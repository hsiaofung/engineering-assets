## 日期與日期選擇器（Dates and Date Pickers）課程重點整理

### 1. 日期輸入控制項（Date Input）的用途

* 日期選擇是表單中常見的功能，尤其應用於：

  * 航班預訂
  * 飯店訂房
  * 生日填寫
  * 入職日期
  * 日期區間搜尋

* 日期輸入控制項本質上是一種文字輸入欄位，但限制使用者輸入日期格式。

* 設計時應提供：

  * 日期格式提示（例如 `YYYY-MM-DD`）
  * 視覺化選擇方式，降低輸入錯誤

---

## 2. HTML5 Date Picker

HTML5 提供原生日期選擇器：

```html
<input type="date">
```

使用後：

* 使用者點擊欄位時會開啟日曆
* 可以切換：

  * 月份
  * 年份
  * 日期

優點：

✅ 不需要額外 JavaScript 套件
✅ 瀏覽器原生支援
✅ 使用者操作直覺

---

## 3. 瀏覽器支援問題

`<input type="date">` 並不是所有瀏覽器都有完整支援。

| 瀏覽器               | 支援狀況    |
| ----------------- | ------- |
| Chrome            | ✅ 完整支援  |
| Edge              | ✅ 支援    |
| Internet Explorer | ❌ 不支援   |
| Safari Desktop    | ❌ 不支援   |
| Firefox           | ⚠️ 部分支援 |

注意：

即使瀏覽器不支援日期選擇器：

* 使用者仍然可以手動輸入日期
* 功能不會完全失效

因此正式專案使用前，需要確認：

* Target Browser
* 使用者環境
* 是否需要第三方 Date Picker Library

---

# 4. 自訂日期圖示（Custom Calendar Icon）

### 問題

HTML5 日期欄位預設外觀：

* 瀏覽器提供自己的日曆箭頭
* 不同瀏覽器樣式不一致

例如：

* Chrome 有自己的日期圖示
* Safari 沒有日曆 popup
* Firefox 行為不同

導致 UI 不一致。

---

## 解決方式

加入自己的 Font Awesome 日曆圖示：

HTML：

```html
<i class="fa-solid fa-calendar"></i>
```

放在日期欄位旁：

```html
<div class="date-wrapper">
  <input type="date">
  <i class="fa-solid fa-calendar"></i>
</div>
```

---

# 5. 使用 CSS 定位自訂圖示

因為 icon 需要覆蓋在 input 上方，因此使用：

```css
position: absolute;
```

常見設定：

```css
.calendar-icon {
  position: absolute;
  top: 50%;
  right: 10px;
}
```

作用：

* 控制 icon 位置
* 調整大小
* 設定顏色

---

## pointer-events: none

重要設定：

```css
pointer-events: none;
```

作用：

讓滑鼠事件穿透 icon。

例如：

```
使用者點擊 icon
        ↓
icon 不攔截事件
        ↓
input date 收到 click
        ↓
開啟原生日曆
```

避免：

* 點 icon 沒反應
* 需要額外寫 JavaScript 處理

---

# 6. 隱藏瀏覽器預設日期箭頭

瀏覽器原生日期控制項會有自己的 UI。

需要隱藏：

## Chrome / Edge

例如：

```css
::-webkit-calendar-picker-indicator {
    opacity: 0;
}
```

效果：

* 隱藏預設日曆按鈕
* 保留原本 date picker 功能

---

## Safari 支援

Safari 使用 WebKit 前綴：

```css
::-webkit-calendar-picker-indicator {
    opacity: 0;
}
```

需要針對 WebKit 引擎處理。

---

# 7. 自訂 Date Picker 的設計流程

完整流程：

```
<input type="date">
        |
        ↓
加入 Font Awesome Calendar Icon
        |
        ↓
CSS absolute 定位
        |
        ↓
pointer-events:none
        |
        ↓
隱藏瀏覽器預設 icon
        |
        ↓
保留原生 date picker 功能
```

---

# 8. UI / UX 設計重點

好的日期選擇器：

✅ 提供明確視覺提示
✅ 減少使用者輸入錯誤
✅ 保持跨瀏覽器一致性
✅ 保留原生功能與可用性

設計原則：

> 不一定要重新製作 Date Picker，而是可以利用 HTML5 原生功能，再透過 CSS 調整外觀。

---

# 9. 實務開發注意事項（Angular / 前端）

在 Angular 專案中：

### 簡單需求

直接使用：

```html
<input type="date" formControlName="departureDate">
```

搭配 CSS 即可。

---

### 複雜需求

例如：

* 日期區間選擇
* 禁止過去日期
* 多國語系
* 自訂格式
* Range Picker

可以考慮：

* Angular Material Datepicker
* NG-ZORRO DatePicker
* Flatpickr
* PrimeNG Calendar

---

## 本課核心觀念

> HTML5 `<input type="date">` 提供基本日期選擇能力，但不同瀏覽器外觀與支援程度不同。實務開發時，可以保留原生功能，再透過 CSS + 自訂 icon 提升 UI 一致性與使用者體驗。
