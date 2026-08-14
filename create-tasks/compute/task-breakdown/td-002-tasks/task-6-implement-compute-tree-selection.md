# Task 5 — 實作 ComputeTree 節點選取
## 目標

實作 ComputeTreeComponent 的節點選取功能，讓使用者點擊 Tree Node 後，可以正確更新目前選取的 Compute Resource，並提供給父層頁面使用。

## 工作範圍
1. 管理選取狀態
    - 使用 selectedKey 儲存目前選取的 Tree Node。
    - 與 TreeViewV1Component 的 selectedKey 保持同步。
2. 處理節點選取
    - 接收 TreeViewV1Component 的 nodeClick event。
    - 使用被點擊節點的 id 更新 selectedKey。
    - Disabled node 不應被選取。
3. 提供選取結果給父層
    - 當 Compute Tree Node 被選取時，提供 ComputeTreeNode 給父層元件。
    - ComputeTreeComponent 只負責「選取」，不負責決定選取後的 routing 或頁面行為。
4. 維持選取與展開的責任分離
    - 點擊 Node 不應觸發 children loading。
    - Expand Node 才負責 lazy loading。
    - Selection 與 Expansion 應維持獨立。

## 驗收條件
- 點擊 Compute Tree Node 後，可以正確選取該 Node。
- selectedKey 正確反映目前選取的 Node ID。
- 點擊另一個 Node 後，選取狀態會更新。
- 點擊 Node 不會觸發 API request。
- Expand Node 不會改變目前的 selected node。
- 父層頁面可以取得目前選取的 ComputeTreeNode。
- 不影響既有的 Expand / Lazy Loading 行為。
- 補上 Selection 相關 unit tests。