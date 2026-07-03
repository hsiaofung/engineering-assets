# Question:
需求: 當發送並成功創建 task --> 會顯示 toast & Task Notification --> 點擊紅框部分(task notification or toast), 前端須能重導向至 "該特定 Task/Execution History" 頁面.


4.x 的 Task page 結構, Execution History 位在第二層 --> 3.x 沒有這種頁面結構, 前端需 survey 重導向行為是否可行.

---

# Environment:
- SCC 4.0

---

# Technical feasibility:

✅ Technically feasible.

Frontend can support this navigation.    

Implementation depends on:   
- Backend providing `taskId` in the notification payload.
- Availability of the Task Execution History route.