## 使用工具提示（Tooltips）重點整理

### 1. Tooltip 的用途

* **Tooltip（工具提示）** 是一種「按需顯示（On-demand）」的提示訊息。
* 當使用者 **滑鼠懸停（Hover）、點擊（Click）、觸碰（Touch）或聚焦（Focus）** 元素時才會顯示。
* 適合提供：

  * 欄位說明
  * 操作提示
  * 額外背景資訊
  * 為什麼需要某項資料

> 核心目的：**提供必要資訊，同時保持介面簡潔。**

---

### 2. Tooltip 的設計原則

良好的 Tooltip 應該：

* 只提供補充資訊，不取代主要內容。
* 不要讓所有說明都直接顯示在畫面上。
* 只有真正需要的人才會點開閱讀。
* 內容保持簡短、明確。

例如：

* Password

  * 說明密碼規則
* City

  * 說明收集城市資訊的原因

---

### 3. HTML 結構

Tooltip 通常包含：

* 觸發圖示（例如 Font Awesome 問號）
* 提示內容 (`span.helper-text`)
* 小三角形（箭頭）
* 關閉圖示（可選）

概念結構：

```html
<div class="wrapper">
    <input ...>

    <i class="tooltip">
        ?
        <span class="helper-text">
            說明內容
        </span>
    </i>
</div>
```

---

### 4. CSS 重點

#### (1) 父元素使用 `position: relative`

```css
.wrapper {
    position: relative;
}
```

原因：

讓 Tooltip 可以使用

```css
position: absolute;
```

相對於 Wrapper 精準定位。

---

#### (2) Tooltip 使用絕對定位

例如：

```css
.helper-text {
    position: absolute;
}
```

方便控制：

* 出現位置
* 左右距離
* 上下距離

---

#### (3) 使用 Class 控制顯示

例如：

```css
.show
.hide
```

JavaScript 不直接修改 style，而是切換 class。

這種做法：

* 容易維護
* 樣式集中管理
* 可加入動畫效果

---

### 5. JavaScript 控制

流程十分簡單：

1. 找到 Tooltip 元素
2. 初始加入 `hide`
3. 點擊問號
4. 切換 `show/hide`

概念：

```
Click ?

↓

目前是 hide？

↓

是
→ 改 show

否
→ 改 hide
```

這就是最常見的 Toggle（切換）模式。

---

### 6. UX（使用者體驗）設計

課程中特別提到一個不錯的小細節：

除了點擊問號之外，

**點擊 Tooltip 本身也可以關閉。**

好處：

* 使用者不用再找小小的 X。
* 操作更自然。
* 降低誤操作。

這就是提升 UX 的細節。

---

### 7. 除錯方式

如果 Tooltip 沒有正常運作：

先開啟：

```
Developer Tools
    ↓
Console
```

通常可以立即看到：

* 找不到元素
* JavaScript 錯誤
* CSS Class 拼錯
* Selector 錯誤

Console 是前端除錯最重要的工具之一。

---

## 實務開發建議（Angular）

在 Angular 中，不建議自行實作 Tooltip，建議直接使用 UI 元件庫提供的 Tooltip，例如 **NG-ZORRO** 的 Tooltip 元件。

優點：

* 已支援 Hover、Click、Focus 等互動方式。
* 具備動畫、定位、自動避開邊界等功能。
* 支援無障礙（Accessibility）。
* 可搭配 Angular 資料綁定，維護成本較低。

只有在 Tooltip 樣式或互動需求較特殊時，才考慮自行實作。

---

## 本章重點總結

* Tooltip 是提供額外資訊的「按需顯示」元件。
* 適合說明欄位用途、輸入規則或收集資料原因。
* 使用 **HTML + CSS + JavaScript** 即可實作基本 Tooltip。
* 父元素使用 `position: relative`，Tooltip 使用 `position: absolute` 定位。
* 透過 `show` / `hide` CSS 類別控制顯示狀態，而非直接修改樣式。
* 使用 JavaScript 切換（Toggle）Tooltip 的顯示與隱藏。
* 良好的 Tooltip 能減少介面雜亂，提升表單的可理解性與使用者體驗。
* 在 Angular 專案中，建議優先使用 **NG-ZORRO Tooltip** 等成熟元件，而非自行從零實作。
