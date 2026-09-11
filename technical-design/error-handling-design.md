對。**如果 Technical Design 是拿來指導實作的，那 error handling 應該設計進去。**

但不用把每一個可能的錯誤都寫到非常細。

你可以把 Technical Design 的責任分成：

```text
Technical Design
├── Happy Path
│   └── 正常流程怎麼走
│
├── API / Data
│   └── API contract、資料結構
│
├── Error Handling
│   ├── API failure
│   ├── empty / missing data
│   └── invalid state
│
└── UI Behavior
    ├── loading
    ├── error message
    └── retry / fallback
```

### 對你現在 Compute Phase 1，我會建議至少寫這些

例如：

| 情況                    | UI 行為                   |
| --------------------- | ----------------------- |
| API loading           | 顯示 loading state        |
| API 失敗                | 顯示 error / notification |
| API 回傳 empty          | 顯示 empty state          |
| Tree 選取的 resource 不存在 | fallback / redirect     |
| Detail API 失敗         | 顯示錯誤狀態，可 retry          |
| 使用者操作失敗               | 保留目前狀態並提示原因             |

這樣你實作時就不是：

> 「API error 到底要怎麼辦？」

而是：

> **「Technical Design 已經定義好了，我照設計實作。」**

---

而且這跟你剛剛建立的 **Phase 1 Done Criteria** 是連在一起的：

**Technical Design 有定義 → FE 實作 → Happy Path 跑通 → Error handling 基本處理 → Test → MR → Merge。**

所以 Technical Design 不只是描述：

> 「成功的時候怎麼做。」

而應該至少回答：

> **「成功怎麼做；失敗時系統要怎麼反應。」**

這樣才比較像真正可以拿來開發的 Technical Design。
