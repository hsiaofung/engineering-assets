這段是在講 如何用 CSS Counter（CSS 計數器）實作 Stepper 的自動編號，這是做 多步驟表單（Checkout / Wizard / Stepper） 很實用的技巧。

我幫你整理成「原理 → 程式碼 → 運作流程 → Angular 實務」四個部分。

### 付款步驟指示器（Payment Stepper）— 重點整理

### 1. 為什麼要用 CSS Counter？

### ❌ 傳統寫法（手動編號）

HTML

```
<li data-step="1">Cart</li>
<li data-step="2">Details</li>
<li data-step="3">Shipping</li>
<li data-step="4">Payment</li>
```

問題：

* 新增步驟時要全部重改

* 刪除步驟容易漏掉

* 維護成本高

### ✅ CSS Counter（自動編號）

HTML

```
<li>Cart</li>
<li>Details</li>
<li>Shipping</li>
<li>Payment</li>
```

優點：

* 不需要手動寫數字

* 新增 / 刪除步驟會自動重新編號

* HTML 更乾淨

### 2. 核心 CSS

### (1) 在父元素重設計數器

CSS

```
.checkout-stepper ul {
  counter-reset: step;
}
```

### 意思

建立一個名為 `step` 的計數器，初始值為 0。

你可以把它想成：

```
step = 0
```

### 3. 在每個 li 前面顯示數字

CSS

```
.checkout-stepper li::before {
  content: counter(step);
  counter-increment: step;
}
```

這兩行是整個功能的關鍵。

### `content: counter(step)`

代表：

把目前 step 的值顯示出來

例如：

* 第一個 li → 顯示 1

* 第二個 li → 顯示 2

* 第三個 li → 顯示 3

### `counter-increment: step`

代表：

每渲染一個 li，就讓 step +1

### 4. 完整範例

HTML

```
<nav class="checkout-stepper">
  <ul>
    <li class="active">Cart</li>
    <li>Details</li>
    <li>Shipping</li>
    <li>Payment</li>
  </ul>
</nav>
```

CSS

```
.checkout-stepper ul {
  counter-reset: step;
  display: flex;
  list-style: none;
  padding: 0;
}

.checkout-stepper li {
  position: relative;
  flex: 1;
  text-align: center;
}

.checkout-stepper li::before {
  content: counter(step);
  counter-increment: step;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 8px;
  border-radius: 50%;

  background: #e5e7eb;
  color: #111827;
  font-weight: bold;
}

.checkout-stepper li.active::before {
  background: #2563eb;
  color: white;
}
```

### 效果

![Intro to Progress Trackers in UI course lesson | Uxcel](https://images.openai.com/static-rsc-4/r8mmR6yvMvDataYCqt_JWit-w0ljSrDjzvxsEqfP6M_wH9fgYivKVWnuoTzUMXizr1Yrx2K0lSBAYYH5UFNVLxSsIriGXbnkmwk3mCyYbuf0QqvmxTNqcchStMP5cLNp_OhXdDxYOTCKZZeP7SpwC_WnT7hb2BCFH5RLtNxcZFTQ-2o606JdJGBn56H9yrfY?purpose=fullsize)

### 5. 計數器運作流程（很重要）

初始狀態

```
step = 0
```

第一個 li

```
顯示 counter(step) → 1
step++
```

第二個 li

```
顯示 counter(step) → 2
step++
```

第三個 li

```
顯示 counter(step) → 3
step++
```

### 6. 講師示範的錯誤情境

### 靜態內容

CSS

```
.checkout-stepper li::before {
  content: "1";
}
```

結果：

![Создание шагового компонента на CSS](https://images.openai.com/static-rsc-4/L1SDkAgui0ZG-6VVUcLNorsCtsFlKvtkYVjCRiLwOGqh-ejWTd_YQ8DfRdjyJ1dp9UrLfKejycktyfrsX6viCt-2sJXf41H667YD7zXIwLd3o_Z3mH0QHJy-FpeFNO3y5SoYu7oHLYk9dQn4mnWuTBSLjjLiwVexv__xmLnrDdp-LMI3plWNSGkcMB3DY1yG?purpose=fullsize)

所有步驟都顯示 1。

### 改成 "3"

CSS

```
.checkout-stepper li::before {
  content: "3";
}
```

結果：

![Aplicación de la Accesibilidad en Diseño UX | by Alicia Parras | Medium](https://images.openai.com/static-rsc-4/G7yW5Lljqq0j0y1_RX3fVQYgiwyIWZpxy6_mj2UK6NCUaL9yl4mJDZpJSP8MSDse9FkkE0x0ong59sPFWqZUIYhQ46zj5SMrPSyLpajrJvPL11xKFoD0UzF-JkBNg9i6KPsGiTnpNLlNYJ33Ua0Z-jxWIHImMbnaTO4wtJQFsG4_YHr3TTQ6SeCiiHOW1ref?purpose=fullsize)

所有步驟都變成 3。

這證明：

content: '1' 只是字串，不會自動計數

### 7. 自動更新的威力

假設你新增一個步驟：

HTML

```
<li>Review</li>
```

瀏覽器會自動變成：

| 步驟       | 編號 |
| -------- | -- |
| Cart     | 1  |
| Details  | 2  |
| Shipping | 3  |
| Payment  | 4  |
| Review   | 5  |

完全不需要修改 CSS 或 HTML 中的數字。

### 8. 這其實是 CSS 的「變數系統」

講師提到：

CSS Counter 本質上是 CSS 維護的變數。

你可以這樣理解：

CSS

```
counter-reset: step;      /* step = 0 */
counter-increment: step;  /* step++ */
counter(step)             /* 讀取 step */
```

是不是很像程式語言？

JavaScript

```
let step = 0;
console.log(step); // 1
step++;
console.log(step); // 2
```

### 9. Angular 實務會怎麼做？

你有兩種選擇。

### 方案 A：純 CSS（推薦）

### HTML

HTML

```
<ul class="checkout-stepper">
  <li *ngFor="let step of steps"
      [class.active]="step.id === currentStep">
    {{ step.label }}
  </li>
</ul>
```

### CSS

CSS

```
.checkout-stepper {
  counter-reset: step;
}

.checkout-stepper li::before {
  content: counter(step);
  counter-increment: step;
}
```

### 優點

* HTML 不需要 index

* CSS 自動處理編號

* 結構最乾淨

### 方案 B：Angular index（更常見）

HTML

```
<li *ngFor="let step of steps; let i = index">
  <span class="step-number">{{ i + 1 }}</span>
  {{ step.label }}
</li>
```

### 優點

* 數字可以拿來做邏輯判斷

* 比較直觀

* 不依賴 CSS

### 缺點

* HTML 稍微冗長

### 10. 什麼時候適合用 CSS Counter？

### 很適合

* Checkout Stepper

* 註冊流程

* 問卷步驟

* 教學導覽

* 文章章節編號

* FAQ 自動編號

### 不適合

* 編號需要參與商業邏輯

* 要傳給 API

* 要做條件判斷

* 要支援拖曳排序並同步資料

因為 CSS Counter 只是視覺效果，JavaScript 拿不到它的值。

### 11. 你可以學到的前端觀念

這段其實反映一個很好的原則：

純視覺問題

交給 CSS

不要增加 JS 邏輯

### 為什麼這很重要？

如果只是顯示 1、2、3、4：

* 不需要 component state

* 不需要 signal

* 不需要 RxJS

* 不需要額外 DOM

CSS 就能完成。

這就是你常說的：

能用 CSS 解決，就不要用 JavaScript。

### 一句話總結

CSS Counter 透過 `counter-reset` 建立計數器、`counter-increment` 自動遞增、`counter()` 讀取數值，讓 Stepper 能隨著 list item 的增減自動重新編號，完全不需要手動維護數字，是實作多步驟表單最輕量且優雅的方式之一。

### 最後幫你濃縮成面試版答案（30 秒）

如果面試官問你 「如何實作多步驟表單的自動編號？」，你可以回答：

我會優先使用 CSS Counter。先在 stepper 的父層用 `counter-reset: step` 初始化計數器，再在每個 `li::before` 中用 `content: counter(step)` 顯示數字，並透過 `counter-increment: step` 自動遞增。這樣新增或刪除步驟時，編號會自動更新，不需要手動維護 HTML 中的數字，結構也會更乾淨。對於純視覺編號，我會避免用 JavaScript 或 Angular state，讓邏輯保持最小化。
