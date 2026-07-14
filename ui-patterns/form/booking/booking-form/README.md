## 預訂表單（Booking Form）重點整理

### 1. 預訂表單的核心目的

預訂表單（Booking Form）的主要目的是**一次收集完成預訂所需的所有資訊**，減少來回確認的時間，提升使用者體驗與作業效率。

常見應用包括：

* ✈️ 航班預訂
* 🏨 飯店訂房
* 🎬 電影訂票
* 🎫 活動報名
* 🚗 租車服務
* 📅 線上預約（診所、美容、餐廳等）

> **重點：** 雖然案例是航班預訂，但設計模式可套用到各種預約系統。

---

## 2. Booking Form 的典型流程

預訂通常不是單一步驟，而是一個多階段（Multi-step）的流程：

1. **收集需求**

   * 出發地
   * 目的地
   * 日期
   * 人數
   * 旅遊類型

2. **顯示符合條件的選項**

   * 可選航班
   * 房型
   * 場次
   * 活動時段

3. **選擇細節**

   * 座位
   * 房間
   * 票種
   * 附加服務

4. **填寫個人資料**

   * 姓名
   * 聯絡方式
   * 付款資訊（本課暫不討論）

---

## 3. 常見的表單元件

預訂表單通常會搭配多種輸入元件：

| 元件            | 用途            |
| ------------- | ------------- |
| Text Input    | 地點、姓名等文字資料    |
| Radio Button  | 單選項目（例如單程/來回） |
| Select        | 人數、旅遊類型       |
| Date Picker   | 出發日期、入住日期     |
| Submit Button | 查詢可預訂項目       |

其中日期欄位先使用：

```html
<input type="date">
```

之後再改善成更一致的日期選擇器，避免不同瀏覽器呈現差異。

---

## 4. HTML 結構設計

整體結構相當清楚：

```
main
└── section#booking
    ├── article
    │   └── Hero / CTA
    └── article.form-section
        └── form
            ├── form-group
            ├── form-group
            ├── form-group
            └── Submit Button
```

設計重點：

* `<main>`：包住整個頁面
* `<section>`：代表預訂區塊
* `<article>`：區分不同內容（介紹區、表單區）
* `.form-group`：管理每個欄位，提高可維護性

---

## 5. Button 文案設計

不要使用：

```
Submit
```

而改用具有行動意圖的文字，例如：

* Show Flights
* Search
* Find Hotels
* Book Now
* Continue

> **原則：** 按鈕文字應清楚描述點擊後的結果，而非技術性的「Submit」。

---

## 6. CSS 設計重點

版面與視覺設計包含：

* 漸層背景（Gradient）
* 背景圖片
* Focus 樣式
* Label 美化
* Button 樣式
* CSS Grid 排版
* Media Query 響應式設計

這些共同提升整體可讀性與使用體驗。

---

## 7. 可重複使用的設計模式（Reusable Pattern）

本章最重要的觀念不是航班，而是**建立可重複使用的 Booking Pattern**。

未來可直接套用到：

* 飯店預訂
* 診所掛號
* 美容預約
* 餐廳訂位
* 活動報名
* 租車
* 課程報名

換句話說，只要是需要**收集預約資訊 → 查詢可用資源 → 完成預訂**的流程，都能沿用相同的設計模式。

---

## 8. 對前端開發的啟發（Angular）

這種 Booking Form 很適合使用 **Reactive Forms** 搭配元件化設計。

可將每個區塊拆成獨立元件，例如：

```
Booking Form
├── Trip Type
├── Location Selector
├── Date Picker
├── Passenger Selector
├── Flight Results
├── Seat Selector
└── Passenger Information
```

這樣能提升：

* 元件重用性（Reusable）
* 維護性（Maintainable）
* 擴充性（Scalable）

也方便後續加入多步驟（Stepper/Wizard）、表單驗證與 API 串接。

---

## 本章重點總結

* **Booking Form** 的目標是一次收集完整的預約資訊，提高效率。
* 預訂流程通常包含 **收集需求 → 顯示選項 → 選擇細節 → 填寫資料** 四個階段。
* 常用元件包括 **文字輸入、單選按鈕、下拉選單、日期選擇器**。
* HTML 應採用語意化結構（`main`、`section`、`article`、`form-group`），方便維護。
* 按鈕應使用具體行動文字（如 **Show Flights**），提升可用性。
* 善用 **CSS Grid**、響應式設計與 Focus 樣式，打造良好的使用體驗。
* **最重要的收穫**：建立可重複使用的 **Booking Pattern**，可廣泛應用於各種預約、訂位與報名系統。
