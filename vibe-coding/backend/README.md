- 餵 AI architecture-design.md 以便產生 Web App 的架構。
- review architecture-design.md
- 你需要外部的API嗎?
   - 評估外部API
   - 每天免費幾點?
   - 多快 1 request/s，表示1秒一個request
   - 同時可以有多少個人可以提出請求。
   - 查看文檔，看看提供那些功能。
   - 檢查服務條款(快取規則)
   - 檢查評論
   - 確認品質和API提供的資料大小
   - 建立3款API的比較表

## 我們的長照機構資料應該從哪裡來?
  - external API (花錢買資料，我們並不擁有資料)
  - database-only (DIY 倉庫: 標註資料，自己放上架)
  - hybrid(API + cache in DB)
  - 請 AI 生成 (貴，且品質不穩定)
  - 社群生成(依賴客戶填補倉庫，耗時，要花時間整理)

## 如果使用者在一天之中產生數百個API的呼叫? 
  - 外部API需要付錢，是否帳單過高?