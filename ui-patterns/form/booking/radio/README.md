## 建立自訂單選按鈕（Creating Custom Radio Buttons）重點整理

### 1. 單選按鈕（Radio Button）的用途

* 使用 `<input type="radio">` 建立。
* 適合**只能選擇一個選項**的情境，例如：

  * 性別
  * 付款方式
  * 旅行類型（Trip Type）

> **Radio Button vs Checkbox**
>
> | Radio Button | Checkbox |
> | ------------ | -------- |
> | 只能選一個        | 可選多個     |
> | 同一組互斥        | 各選項彼此獨立  |

---

## 2. 自訂 Radio Button 的設計概念

瀏覽器預設的 Radio Button 樣式較普通，因此可以：

* 隱藏原生 Radio Button
* 利用 `<span>` 製作新的圓形按鈕
* 使用 CSS 製作動畫效果
* 提升點擊範圍
* 統一整體 UI 風格

流程如下：

```
input (隱藏)
        │
        ▼
span (外圈)
        │
        ▼
span::after (內圈)
        │
        ▼
checked 時顯示動畫
```

---

## 3. HTML 結構

每個 radio 都新增一個 `<span>`：

```html
<label>
    <input type="radio">
    <span></span>
    One Way
</label>
```

其中：

* `input`

  * 保留原本功能
* `span`

  * 當作自訂 Radio Button
* 文字

  * 顯示選項名稱

> **重點：** `<span>` 必須放在 input 後、文字前。

---

## 4. 隱藏原生 Radio Button

不直接刪除，而是隱藏：

* 移出畫面
* 保留可操作性
* 保留表單提交功能
* 保留鍵盤操作與可存取性（Accessibility）

---

## 5. 利用 `<span>` 製作外圈

外圈通常會設定：

* 固定寬高
* 圓形 (`border-radius: 50%`)
* 邊框
* 背景色
* 絕對定位

形成灰色空心圓。

---

## 6. 使用 `::after` 製作內圈

利用偽元素：

```css
span::after
```

建立：

* 小圓點
* 置中
* 初始大小為 0
* 初始透明

這個小圓點就是選取後會出現的部分。

---

## 7. 使用 `:checked` 控制動畫

核心技巧：

```
input:checked + span::after
```

表示：

> 當 radio 被選取時，修改旁邊 span 的 after。

動畫效果包含：

* opacity
* width
* height
* transition

因此會看到：

```
○
↓

◉
```

並伴隨縮放動畫。

---

## 8. 使用 `transition` 提升互動體驗

若沒有 transition：

```
○ → ◉
```

會瞬間切換。

加入 transition：

```
○
 ↓
(動畫)
 ↓
◉
```

使用者體驗更自然。

---

## 9. Label 定位技巧

課程也調整了：

```css
.form-group{
    position: relative;
}

label{
    position:absolute;
}
```

作用：

* 精確控制 Label 位置
* 可製作浮動 Label（Floating Label）
* 避免影響其他元素排列

---

## 10. 響應式（Responsive）排列

### 小螢幕

採用：

```
○ One Way

○ Return

○ Multi-city
```

垂直排列。

---

### 大螢幕

使用：

```css
display:inline-block;
```

呈現：

```
○ One Way   ○ Return   ○ Multi-city
```

水平排列。

---

## 11. Media Query 的應用

根據螢幕大小：

* 小尺寸：

  * 垂直排列
* 大尺寸：

  * 水平排列
* 修正 margin
* 修正 label 對齊

讓不同裝置都有良好的閱讀與操作體驗。

---

# 本課程重點

* 理解 **Radio Button 與 Checkbox** 的使用時機。
* 隱藏原生 Radio Button，保留其功能與可存取性。
* 使用 `<span>` 建立自訂外圈，並以 `::after` 建立內圈。
* 透過 `:checked + span::after` 控制選取狀態與動畫。
* 加入 `transition` 提升互動流暢度。
* 利用 `position` 精準控制 Label 與 Radio Button 的位置。
* 使用 **Media Query** 實現小螢幕垂直、大螢幕水平的響應式排列。

---

## UI/UX 設計重點

* **保留原生功能**：隱藏原生 Radio，而非自行實作互動邏輯，兼顧表單功能與無障礙支援。
* **放大可點擊區域**：透過 `<label>` 包覆選項，提升操作便利性，特別適合觸控裝置。
* **提供明確視覺回饋**：使用動畫與內圈變化，讓使用者清楚知道目前的選取狀態。
* **維持視覺一致性**：自訂 Radio Button 能與整體表單設計風格保持一致，避免不同瀏覽器的預設樣式差異。
* **兼顧響應式設計**：依螢幕尺寸調整排列方式，在手機與桌機上都能維持良好的可讀性與操作體驗。
