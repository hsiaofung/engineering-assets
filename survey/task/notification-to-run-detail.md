# Question:
@TimChou 不好意思, 想額外確認一下


如果是重導向到 "Task / Execution History / Run detail" 這一層, UI 重導向就還要能自動開啟 modal --> 前端行為會差很多嗎?

---

# Environment:
- SCC 4.0

---

# Technical feasibility:

會有一些差異，但不是很大的技術障礙。除了頁面重導向之外，還需要額外處理自動開啟 Run Detail modal 的邏輯，因此會比單純導頁多一些實作。

另外，如果要自動開啟對應的 Run Detail，前端需要知道目前 notification 對應的是哪一個 Run（例如 task_id、execution_id），這部分需要notification API提供對應的資訊。

