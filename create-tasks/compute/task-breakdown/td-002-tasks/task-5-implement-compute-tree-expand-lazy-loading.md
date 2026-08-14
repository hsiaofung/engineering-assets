內容：

- 處理 nodeExpand
- 根據 node kind 呼叫 ComputeTreeService.loadChildren()
- 顯示 loadingKeys
- children 載入完成後更新 tree
- 支援：
    - Pod → Virtual/Physical Pool
    - Physical Pool → Row
    - Row → Rack
    - Rack → Drawer
    - Drawer → System
- 處理 API error
- 避免已載入 children 重複 request

這個 Task 的核心其實就是：
```text
User expands node
       ↓
       
ComputeTreeComponent
       ↓
ComputeTreeService.loadChildren()
       ↓
API
       ↓
Mapper
       ↓
Update Tree
```