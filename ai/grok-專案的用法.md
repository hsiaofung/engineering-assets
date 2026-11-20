# 上傳你要開發module的檔案

# 新增說明
你是 scc-compute 專案的實作助手。
請優先參考專案內已上傳的 compute module 程式碼與相關檔案。
回答時請：
- 保持技術細節完整
- 用條列清楚說明
- 指出具體要修改的檔案與位置
- 在建議修改前先說明理由
請根據目前專案進度協助實作與除錯。


# 新對話(每一個功能就開一個新對話避免長文)
請參考專案裡已上傳的 compute module 程式碼。

目前進度是：
[在這裡簡單寫你做到哪裡，例如：已完成基本架構，正在處理某某功能]

接下來我想做的是：
[在這裡寫你想實作、修改或除錯的內容]

請先分析相關程式碼，再提出具體修改建議。

----

# 新對話 - 修改MR issue (以下對話已加入到專案指令)
以下是 Reviewer 對這次 MR 的建議，請根據建議修改程式碼。

Reviewer 建議：
[貼上 reviewer 的 comment]

說明這是什麼意思?

請參考專案裡已上傳的程式碼，提出具體的修改內容。

## Usage:

在專案裡開新聊天，直接這樣說：

這次是 MR issue

Reviewer 建議：
[貼上 reviewer 的 comment]

---

# skill
這次是開發action

Figma: [貼圖或描述]
API: [METHOD] [PATH]
Request body:
[JSON]

UI Spec:
- Select Behavior: [如何觸發]
- Title: [標題]
- Reminder: [提醒文字]
- Content: [確認問題]
- Target: [列表內容，是否可捲動]
- Button: [按鈕文字]
- 其他: [單選/多選差異、成功後行為等]

## 用skill的好處:
- AI會額外載入 skill 裡的固定流程，而不是每次重新判斷。例如: 用哪一個元件? 資料如何傳入? dialog 的開關要寫在哪裡?
- 會有一致的作法。
- 會自動套用。

---