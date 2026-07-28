- 要完成哪些工作？(What)    
- 可執行的工程工作、驗收條件、依賴關係   
- 依照這個設計(Technical Design)，需要完成哪些工作？
- 依據Technical Design 要完成的tasks，可以分類為: 資料流、行為、架構、測試。

# 資料流
1. 建立 UI data model
2. 建立 Atapter, 銜接BE API 
   - 處理response to UI data model
   - UI query parameters to BE
   - payload to BE
3. 如果有需要建立resolver或builder，根據不同的的條件生成所需的資料。   

# 行為
- 點擊行為
- 同步行為

# 架構
- Tree 的架構
- 路由的架構