
# 核心設計原則

- Survey 的目的是建立 UX 問題的技術可行性（Technical Feasibility）知識庫，用於未來快速查詢與重用。
- 不要 optimize for structure
- 要 optimize for recall speed

---

# 為什麼需要這三個欄位

因為它剛好對應三件事：

- UX 問題 → 可不可做（feasible or not）    
- FE 回答 → yes / no / with constraints    
- PM 決策 → 是否進入 backlog / scope   

---

# 為什麼 Question 必須直接使用 UX 原文

- UX 原文是唯一「語意不失真的來源」
- 避免重新描述導致搜尋關鍵字失真
- 未來 UX 重複提問時可直接命中歷史記錄

---

# 為什麼 Technical Feasibility 要加上 Implementation depends on 
Feasibility 是「在前提條件成立下的結論」，而非絕對結果。

因此需要明確標示依賴條件，例如：

- Backend 是否提供必要資料
- Route 是否存在
- UX 是否定義行為

如果前提條件不成立，則 Feasibility 結論可能改變。