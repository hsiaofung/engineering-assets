# Data Loader（解法）

## Problem（問題）

在很多 Angular 頁面中，我們常常需要：

- 從 API 取得資料
- 處理 loading state
- 處理 error state
- 將資料暴露給 template
- 支援 HttpClient URL 或 custom function

這些邏輯在不同 component 中會重複出現。

---

## Solution（解法）

`DataLoaderComponent` 把資料載入邏輯封裝成一個 reusable container component，並使用 Angular signals 管理狀態。

它支援：

- URL-based fetching
- Custom function（Observable / Promise）
- loading state
- error state
- template 直接存取 data（exportAs）

---

## When to use（適用場景）

當你遇到以下情境時使用：

- 某個 UI 區塊需要 async data
- 想統一 loading / error 行為
- 避免每個 component 重寫 subscription
- template 需要直接 access data state

---

## When NOT to use
- complex caching layer
- global state management

---


