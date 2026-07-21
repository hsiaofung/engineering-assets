以下是這堂課 「訂單摘要總覽（Order Summary Overview）」 的重點整理，我幫你濃縮成「流程、UX、技術實作、架構設計」四個面向，方便之後複習。

### 訂單摘要總覽 — 重點整理

### 1. 結帳流程全貌（Checkout Flow）

這堂課不是只做一頁，而是建立 完整付款流程的骨架。

Step 1

訂單摘要（Cart / Order Summary）

Step 2

個人資料

Step 3

運送方式

Step 4

付款資訊

完成

完成訂單

### 各步驟功能

* 訂單摘要頁：檢查商品、調整數量、決定是否結帳

* 個人資料頁：輸入姓名、地址、聯絡方式

* 運送頁：選擇運送方式，價格會更新

* 付款頁：輸入信用卡或其他付款資訊

* 完成頁：顯示訂單成立結果

### 2. 訂單摘要頁的核心功能

### 商品數量調整

* 提供 `+ / -` 按鈕

* 使用 JavaScript 控制數量

* 避免數量變成負數

* 課程中尚未實作「價格即時更新」，但可自行擴充

### Save for Later（稍後再買）

這是電商很常見、但容易被忽略的功能：

* 使用者暫時不想購買

* 商品可從購物車移到收藏區

* 降低使用者流失率

### Proceed to Checkout（前往結帳）

* 這是頁面最重要的 CTA（Call To Action）

* 點擊後正式進入結帳流程

### 3. UX / 使用者體驗重點

### 流程設計要有彈性

講師特別強調：不要只設計一條固定路徑。

### 使用者可能的行為

* 增加商品數量

* 編輯購物車

* 刪除商品

* 稍後再買

* 繼續購物

* 立即結帳

### 設計目標

讓體驗符合使用者的預期（Meet user expectations）

也就是：

* 不要強迫立即購買

* 保留返回修改的能力

* 提供清楚的導航與狀態提示

### 4. Stepper（步驟指示器）

![Allow Step content to be placed in between stepper UI in vertical mode · mantinedev · Discussion #1060 · GitHub](https://images.openai.com/static-rsc-4/AcDFiRRfWHmpDdaw4KXFo2hFN3rud1E6nLr8wpSuoHe833ZCWhD0fJpqLFvCKlTwCTHgG94TFiLTNcwyonjVt7uQFOLkDxVofqAdNi83jxZliJc5KLyzqRZRvRbl9uH8OkKFEKKZAxT9YnTFlANTG_1eA-QwggrG35ZqF6nE7WhV86XRNr5OE3HCX77CZM2o?purpose=fullsize)

### 功能

* 顯示目前位於哪個步驟

* 可回到前一步修改資料

* 降低使用者對流程長度的焦慮

### 典型步驟

| 步驟       | 狀態  |
| -------- | --- |
| Cart     | 完成  |
| Shipping | 目前  |
| Payment  | 待處理 |
| Review   | 待處理 |

這個概念和你前面學到的 Stepper Component 是一致的。

### 5. 表單設計技巧（會在後續頁面用到）

講師提到會套用之前課程學過的技巧：

### 浮動標籤（Floating Labels）

![Best Practices for Styling UI Inputs | Uxcel Lesson](https://images.openai.com/static-rsc-4/TP7Eosm0fUy68nJjJSN4rkpJ9kCl0FyrMAiZQdcSG1cZxEI26RsgeVpTbzyZmrDMnRFZInmFHrG42A8KgeERFY8bXJIn6vlMr5-XFbRDQvu5m_BoisdHQ7k0PdMD6j4P72Whbmj-y0wpYHcHpVGO5Q-8lObunEnEUROWBsd4P0wzmWbF8FYY0JllCMVRxPFJ?purpose=fullsize)

優點：

* 節省空間

* 標籤不會消失

* 使用者仍能知道欄位用途

### 自訂 Checkbox 圖示

![Checkbox UI Design: A Step-by-Step Tutorial for Modern Apps by Roman Kamushken for Setproduct on Dribbble](https://images.openai.com/static-rsc-4/MiQ7uXLKcmH6mqQgK7KWx0tGxO9HrHAnI7hDG2Fkb9ISx0-HpWem6fKHoxPVLl7S8hUMpZjClulGZ-_UntulAextCOEZtjwtxZ5fmUHJIYqKzkQxgfk9-R2rZ2oE8y10UxxPbewNN-mhiuK1S8336SBSzgncF-nLRNngV6sx3o8hQZ14Uh4vhSUWsdM4_rxb?purpose=fullsize)

優點：

* 視覺一致性更高

* 可符合品牌風格

* 提升互動回饋感

### 6. HTML 架構重點

### 使用 HTML5 語意化元素

HTML

```
<header>
<main>
  <section class="cart">...</section>
  <aside class="summary">...</aside>
</main>
<footer>...</footer>
```

### 為什麼重要？

* SEO 較好

* 無障礙（Accessibility）較好

* 程式碼更容易維護

* 結構更清楚

這跟你在 Angular 中強調的 semantic HTML 是同樣概念。

### 7. CSS 架構設計

### main.css 作為共用樣式

### 共用內容

* Logo

* Header

* Footer

* 字型設定

* 基本排版

* 通用元件樣式

### 頁面專屬 CSS

```
main.css          # 全站共用
order-summary.css # 訂單摘要頁
shipping.css      # 運送頁
payment.css       # 付款頁
```

### 這樣拆分的好處

* 教學更容易閱讀

* 樣式責任清楚

* 日後可模組化管理

講師也提到：

實務上可能會合併成一個檔案，但教學時拆開比較容易理解。

### 8. 版面配置技術

### 大量使用 CSS Grid

![Demoblaze Redesign: 3-Step Checkout Flow by Ahmed Shawky on Dribbble](https://images.openai.com/static-rsc-4/mN5GxAHh8tMGX8tQs9OJpMdNH-pzwJYpLLYQbr2lsQkKd9qJsEBiwfJUl48sHEHqGK12B9BX5FAUv5YhuWBnYTDjit3kUgIH2bX2l7kStDcpdVBrpGsyuho47GnIcqemsrAnO21jwYSUZa2g19uzAw5RJwm29WuuThtmzmY9cla8GqRFom7O5_ZyE33ySOQT?purpose=fullsize)

### 適合的原因

* 左側商品列表

* 右側訂單摘要

* 響應式調整方便

* 不需要太多巢狀容器

### 響應式設計（Responsive）

### 小螢幕

* 單欄排列

* 訂單摘要移到下方

### 大螢幕

* 兩欄布局

* 商品列表 + 側邊摘要

### Media Queries

CSS

```
@media (min-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 2fr 1fr;
  }
}
```

這是典型的 mobile-first 做法。

### 9. JavaScript 功能

### 數量控制腳本

JavaScript

```
increaseBtn.addEventListener('click', () => {
  quantity++;
});

decreaseBtn.addEventListener('click', () => {
  if (quantity > 1) quantity--;
});
```

### 重點

* 綁定加減按鈕事件

* 更新畫面數值

* 防呆：最小值為 1

### 使用 jQuery

講師在頁面底部引入：

HTML

```
<script src="jquery.js"></script>
```

原因：

* 教學快速

* DOM 操作簡單

* 後續頁面會用到

不過以你現在的 Angular 背景來看，實務上會改用：

* Angular template binding

* `(click)` 事件

* `signal` 或 `FormControl`

* RxJS / state management

### 10. 最重要的觀念：先畫流程圖

講師強調：

在寫程式之前，先把使用者流程畫出來。

### 建議思考

加入購物車後，使用者要往哪裡走？

* 繼續購物

* 修改數量

* 刪除商品

* 稍後再買

* 立即結帳

* 返回上一頁

這其實就是你常講的：

* User Flow

* State Transition

* Edge Cases

* UX Discovery

在電商中尤其重要。

### 一句話總結

這堂課的核心不是做出一個購物車頁面，而是學會從『使用者流程』出發，建立一個可返回、可修改、具彈性且響應式的完整結帳架構，並以 semantic HTML + CSS Grid + 模組化樣式 + 基本 JavaScript 互動作為實作基礎。

### 你可以特別記住的 5 個考點

* 購物車不只有「結帳」，還要支援「稍後再買」與「繼續購物」。

* Stepper 能降低流程焦慮，並允許返回修改。

* CSS Grid 很適合做電商版面（商品區 + 摘要區）。

* main.css + page.css 是典型樣式分層方式。

* 先畫流程圖再寫程式，這是最重要的實務觀念。
