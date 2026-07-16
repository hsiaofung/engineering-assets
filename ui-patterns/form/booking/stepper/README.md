# 使用步進器元件（Stepper Component）課程重點整理

## 1. Stepper Component 的設計概念

### 傳統方式：Select Dropdown

原本表單使用下拉選單選擇：

* 成人數量（Adults）
* 兒童數量（Children）

例如：

```
Adults:
[ 1 ▼ ]

Children:
[ 0 ▼ ]
```

問題：

* 需要展開選單才能選擇
* 手機操作較不直覺
* 佔用較多視覺空間

---

### 改良方式：Stepper

使用：

```
[-]  2  [+]
```

讓使用者透過：

* `+` 增加數量
* `-` 減少數量

調整人數。

優點：

* 操作更直覺
* 適合行動裝置
* 點擊區域較大
* 適合數量調整類場景

例如：

* 航班乘客數
* 購物車數量
* 房間數量
* 商品數量

---

# 2. HTML 結構設計

## Stepper 基本結構

新增：

```html
<div class="stepper">
    <button>
        <i class="fa fa-minus"></i>
    </button>

    <input type="number" value="0">

    <button>
        <i class="fa fa-plus"></i>
    </button>
</div>
```

結構包含：

| 元件           | 功能     |
| ------------ | ------ |
| Minus Button | 減少數量   |
| Number Input | 顯示目前數值 |
| Plus Button  | 增加數量   |

---

## 其他 HTML 調整

新增 class：

### Form Group

```html
<div class="form-group selectNum">
```

用途：

* 控制人數區塊版面

---

### Travel Class

加入：

```html
class="travel-class"
```

用途：

* 後續 CSS 控制旅行艙等位置

---

# 3. CSS 樣式設計重點

## (1) 加減按鈕

設定：

```css
button {
    border: 1px solid;
    background: white;
    padding: ...;
    cursor: pointer;
}
```

功能：

* 增加可點擊範圍
* 滑鼠移入顯示 pointer
* 美化按鈕

---

## (2) 左右圓角處理

減號按鈕：

```css
.minus {
    border-radius: 左側;
    border-right: none;
}
```

效果：

```
╭───╮
│ - │
╰───╯
```

---

加號按鈕：

```css
.plus {
    border-radius: 右側;
    border-left: none;
}
```

形成：

```
[-] [0] [+]
```

視覺上像一個完整控制元件。

---

## (3) Icon 樣式

調整 Font Awesome：

```css
.stepper i {
    font-size: ...
}
```

控制：

* icon 大小
* 對齊方式

---

## (4) Number Input 樣式

設定：

```css
input[type="number"] {
    width: ...;
    height: ...;
    text-align: center;
    font-size: ...;
}
```

目的：

讓數字：

```
[-]   2   [+]
```

保持置中。

---

# 4. 移除 Number Input 預設箭頭

瀏覽器預設：

```
  ▲
  2
  ▼
```

會干擾 Stepper UI。

---

## Chrome / Safari

```css
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
    appearance: none;
}
```

---

## Firefox

```css
input[type=number] {
    appearance: textfield;
}
```

結果：

由：

```
[-] 2 ▲▼ [+]
```

變成：

```
[-] 2 [+]
```

更符合自訂 Stepper。

---

# 5. Responsive Layout 設計

需要考慮：

## 小螢幕

例如手機：

```
Adults

[-] 1 [+]

Children

[-] 0 [+]


Travel Class
[ Economy ▼ ]
```

元件垂直排列。

---

## 大螢幕

例如 Desktop：

```
Adults     Children       Travel Class

[-]1[+]    [-]0[+]        [Economy ▼]
```

旅行艙等移到右側。

使用：

```css
@media screen and (...) {
    
}
```

調整：

* display
* width
* flex 排列

---

# 6. JavaScript / jQuery 功能

Stepper 本身只是 UI，需要加入互動。

---

## 增加數量

監聽：

```javascript
$(".plus").click(function(){
    
});
```

邏輯：

```
目前值 + 1
```

例如：

```
0 → 1 → 2 → 3
```

---

## 減少數量

監聽：

```javascript
$(".minus").click(function(){

});
```

邏輯：

```
目前值 - 1
```

但限制：

不能小於 0。

例如：

```
2 → 1 → 0 → 停止
```

---

## 防止 Button 預設行為

使用：

```javascript
return false;
```

避免：

* 表單 submit
* 頁面重新整理

---

# 7. Stepper 適用情境

適合：

| 情境   | 範例               |
| ---- | ---------------- |
| 數量調整 | 商品購買數量           |
| 人數選擇 | 成人 / 兒童          |
| 房間數  | Hotel booking    |
| 設備數量 | IoT device count |

不適合：

* 大量選項
* 需要快速跳選數字

例如：

```
選擇年份 1990~2026
```

使用 dropdown 比較好。

---

# 8. 本課核心觀念

## UI 設計不是只有「能用」

原本：

```
Dropdown
```

沒有錯。

但是：

```
Stepper
```

可能提供：

* 更好的 UX
* 更適合手機
* 更少操作步驟

因此設計 UI 時：

> 同一個功能，可以有不同互動模式，需要根據使用情境選擇最佳方案。

---

## 這堂課帶走的 Frontend 重點

1. **Component 不只是功能，也包含互動體驗**
2. **數量型輸入優先考慮 Stepper**
3. **CSS 可以重新塑造原生 HTML 控制項**
4. **Responsive Design 必須考慮不同螢幕排列**
5. **UI 元件設計應該抽象化，方便重複使用**

如果以 Angular / NG-ZORRO 的角度來看，這堂課其實對應到 `nz-input-number` 元件的設計理念。你在 Angular SaaS Starter Kit 或 Pattern Library 中，可以把 Stepper 視為一個可重用的 **Quantity Selector Pattern**。
