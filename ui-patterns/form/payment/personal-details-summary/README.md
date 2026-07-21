這堂課是在建立 Checkout 的「個人資料（Personal Details）」頁面，重點是 Stepper、響應式布局、浮動標籤、自訂核取方塊、語意化表單結構與小螢幕體驗優化。

我幫你整理成「UX → HTML 結構 → CSS 技術 → JavaScript 行為 → 實務設計原則」五個面向。

### 個人資料頁面 — 重點整理

### 1. 頁面目標

這一頁是結帳流程中的 「聯絡資訊 + 運送資訊」輸入頁。

![Learn More About The Create Checkout | Create.net](https://images.openai.com/static-rsc-4/FOv3WftJTM7naabw5v0JEjx5b3iz-J8AhxgmEdxasu8915uElGVCH35OI7yoqQiCorHcDJbMqVyxjewCGKNkuNXCTQoSpXqb8wZJRQYjEm3UVkpWRGfUzv90s1410K0nhbO4XDv5zgWNiJYAL9Us9gDLTlkkoL_UKnrlrS6pwKzJsIiww_nA9LlkhF5nZY5V?purpose=fullsize)

### 主要內容

* Email

* 姓名

* 電話

* 地址

* 城市 / 郵遞區號

* 自訂核取方塊（例如訂閱通知）

* 訂單摘要（Order Summary）

### 2. Stepper（步驟指示器）

![⏲ Progress indicator | The Component Gallery](https://images.openai.com/static-rsc-4/atbCMvO88RLNybqwt34ch1AZ2c9qCpnDQAoLdjycJtCwfZJyFqefI194BV1eUAFY2ge2N8eh8QHBqP4HqQFqbAhqwxGouxZ-m7IC2bmzsMFbGyzuMdGNh0lDeyOCnrBXb0GOXgY-cU5eVxWJEyt9HtxCyTn5T_QHKcoVmUj9YfWr1CKrKZxGQMvSEZQpQGsw?purpose=fullsize)

### 功能

* 顯示目前所在步驟

* 顯示總步驟數

* 降低長表單帶來的壓力

* 可作為導航元件，允許跳轉步驟

### UX 重點

### ❌ 沒有 Stepper

使用者會覺得：

這份表單到底還要填多久？

### ✅ 有 Stepper

使用者會知道：

* 我現在在第 2 步

* 總共有 4 步

* 還剩下哪些步驟

這能有效降低放棄率（abandonment rate）。

### 3. 響應式布局（Desktop vs Mobile）

### Desktop：雙欄布局

![Bootstrap eCommerce blocks - checkout](https://images.openai.com/static-rsc-4/PUL7XWKJUGeu1BmGRvAnTwRQM9bVhYnvcEib1C1terk3dQiehC7YlvB9JCpeTfAeVsI54basjJ_zg1ACM0uPYHNOwgEWJUgH1qqpFHIISR9QOplN3gEAuyJ-aptb5EPA83jvbCJqteX93SwXqZQcpRiuxt8OHVpNhoz8ECj1fvQYwUsjIXapTSSbcrHeUASZ?purpose=fullsize)

左側：個人資料表單

右側：訂單摘要

### Mobile：隱藏訂單摘要

![Designing Sticky Menus: UX Guidelines – Smart Interface Design Patterns](https://images.openai.com/static-rsc-4/N27Vy8MwzKwdjKNcK_rox-XAT3XgSQ1RPtqhLNLnSsgmAfQgZyO-z0zTRtwbZ6e5xK2RC5s1pQRmtQn4TqZnfAcEA8hx8htPfP-oHhXa50nExGaEfdjEbIqnoiUwxG3G1Rcb6RTsccQlE7tjAYXNLU4bPoQPs6eTaHdAH9SOR1259yvLmD2rCMSnAlYSQCpS?purpose=fullsize)

### 為什麼？

小螢幕空間有限，若同時顯示：

* 商品資訊

* 價格

* 表單欄位

會讓使用者分心。

### 解決方案：可展開/收合（Accordion）

| 狀態 | 顯示文字                 |
| -- | -------------------- |
| 收合 | Show order summary ▼ |
| 展開 | Hide order summary ▲ |

這是一個很典型的 mobile-first UX。

### 4. 浮動標籤（Floating Labels）

![Form Input Fields](https://images.openai.com/static-rsc-4/0Zw8IxUve9mhAMC2AfejdxxkojAJzt6XDw_TKkw_fasRjMvnYsxerpvbOmk0JLTlxRpFIDMEgu5H1veeOetCan0G0UJN9qGYKXTu4HuOhktep8rXQVMPtxD-hmzk3bwFEXWWDW9wFIbv2lyytaw2OwymrmIXhVY0XSwBVLhy9lPy5-MR4gyeObKOIEdixL4f?purpose=fullsize)

### HTML 結構（重要）

HTML

```
<div class="field">
  <input id="email" type="email" required>
  <label for="email">Email address</label>
</div>
```

### 關鍵：input 在前，label 在後

這是因為 CSS 會用：

CSS

```
.field input:focus + label,
.field input:not(:placeholder-shown) + label {
  transform: translateY(-1.5rem);
  font-size: 0.75rem;
}
```

### 優點

| Placeholder | Floating Label |
| ----------- | -------------- |
| 輸入後消失       | 永遠可見           |
| 容易忘記欄位用途    | 可隨時確認          |
| 較省開發時間      | 更好的 UX         |

講師也明確表示：

大多數情況下，Floating Label 比單純 placeholder 更好。

### 5. 自訂核取方塊（Custom Checkbox）

![Checkbox Variants by Janine Robi Makorre on Dribbble](https://images.openai.com/static-rsc-4/WRFmtrXEjIGrwc82TdACHRmZnWnd2HNEFcYAuValY5WlkOU-eBOjhczvScVMJI5dd29M_dl61sgiFeNEkrL_3s31B167tdVraJ34cMjLfrtOX20sXH4_sPBp6ByG6PgkNTkovOlrmvNLIvW6Vf2boCZZs-K_DbSe4EBzQcaxtayYJBiZhfIRJ5VB-dlrySV0?purpose=fullsize)

### 目的

* 增加可點擊區域

* 更符合品牌風格

* 改善手機操作體驗

### 實作概念

HTML

```
<label class="checkbox">
  <input type="checkbox">
  <span class="checkmark">
    <i class="fa fa-check"></i>
  </span>
  Email me with news and offers
</label>
```

### 技術點

* 隱藏原生 checkbox

* 用 `span` 畫出方框

* 用 Font Awesome 顯示勾勾圖示

### 6. 語意化表單結構（Accessibility）

這是這堂課很值得學的地方。

### 使用 fieldset + legend

HTML

```
<fieldset>
  <legend>Contact information</legend>

  <input type="email">
</fieldset>

<fieldset>
  <legend>Shipping address</legend>

  <input type="text">
</fieldset>
```

### 即使邊框被隱藏也沒關係

CSS

```
fieldset {
  border: 0;
}
```

### 為什麼還要保留？

因為螢幕閱讀器會知道：

* 這是一組相關欄位

* 組別名稱是什麼

* 使用者正在填寫哪個區塊

這是 WCAG / 無障礙最佳實務。

### 7. HTML 整體架構

### 主結構

HTML

```
<main>
  <header>Brand</header>

  <nav class="stepper">...</nav>

  <div class="content-wrapper">
    <button class="toggle-summary">
      Show order summary
    </button>

    <aside class="order-summary">
      ...
    </aside>

    <section id="info">
      <form>
        <fieldset>...</fieldset>
        <fieldset class="shipping">...</fieldset>
      </form>
    </section>
  </div>

  <footer>...</footer>
</main>
```

### 8. 欄位寬度控制技巧

### 使用 utility class

HTML

```
<div class="field half">...</div>
<div class="field half">...</div>

<div class="field third">...</div>
<div class="field third">...</div>
<div class="field third">...</div>
```

### 對應 CSS

CSS

```
.half  { width: 50%; }
.third { width: 33.333%; }
```

在 Angular 中你可能會改成：

* CSS Grid

* Tailwind `grid-cols-2`

* 或 NG-ZORRO 的 `nz-row / nz-col`

但概念是一樣的：欄位不要全部等寬。

### 9. jQuery：展開 / 收合功能

### 行為

當點擊按鈕時：

* 切換訂單摘要顯示狀態

* 更新按鈕文字

* 切換箭頭方向

### 範例

JavaScript

```
$('.toggle-summary').on('click', function () {
  $('.order-summary').slideToggle();

  const expanded = $(this).hasClass('expanded');

  $(this).toggleClass('expanded');

  $(this).text(
    expanded
      ? 'Show order summary ▼'
      : 'Hide order summary ▲'
  );
});
```

### Angular 寫法（你會這樣做）

HTML

```
<button (click)="showSummary = !showSummary">
  {{ showSummary ? 'Hide' : 'Show' }} order summary
</button>

<app-order-summary *ngIf="showSummary"></app-order-summary>
```

用 Angular state 會比 jQuery 更乾淨。

### 10. CSS 檔案分層

### main.css（共用）

包含：

* 字型

* Header / Footer

* Grid 系統

* 顏色變數

* 通用按鈕

* 表單基礎樣式

### personal-details.css（頁面專屬）

包含：

* Stepper

* Floating labels

* 自訂 checkbox

* Order summary accordion

* 欄位排列方式

### 這種分層的好處

* 共用規則集中管理

* 頁面樣式不互相污染

* 容易拆成元件

* 後續維護成本較低

這跟你在 Angular 提倡的：

feature-based architecture + shared UI patterns

其實是同一個思想。

### 11. 這堂課真正的核心觀念

### 小螢幕要「減少干擾」

不是把所有資訊硬塞進手機畫面。

### 講師的設計原則

資訊仍然可取得，但預設不要干擾目前任務。

也就是：

* 訂單摘要：可展開

* 表單：優先顯示

* 使用者需要時才查看價格明細

這是一個非常實務的 UX 決策。

### 12. 未來優化方向（講師預告）

後續會加入：

* 地址自動完成（Autocomplete）

* 城市 / 州別自動帶入

* 郵遞區號驗證

* 減少手動輸入

* 更智慧的預設值

### 目標

讓使用者用更少的操作完成表單。

這句話非常重要，等於是在說：

減少點擊

減少輸入

提高完成率

### 一句話總結

這堂課的重點是：用 Stepper 拆解長流程、用 Accordion 優化手機體驗、用 Floating Labels 節省空間、用 fieldset/legend 提升無障礙性，並透過可展開的訂單摘要讓使用者在小螢幕上能專注完成當前任務，同時保留查看資訊的能力。

### 你可以直接記住的 5 個實務技巧

* Stepper = 進度 + 導航，不是純裝飾。

* 手機版先隱藏次要資訊，必要時再展開。

* Floating Label 的關鍵是「input 在前、label 在後」。

* fieldset + legend 即使不顯示邊框也應保留。

* 任何能減少使用者輸入的設計，都是高價值優化。
