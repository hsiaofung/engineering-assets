# Epic / Milestone
Implement ComputeTreeComponent

# 目標：

建立 Compute Tree 的 domain integration，將 ComputeTreeService 提供的資料接到共用的 TreeViewV1Component，完成 lazy loading、selection，以及後續 search / routing integration。

# 拆法
- ComputeTreeComponent 不負責「怎麼取得 Backend 資料」
- TreeService 不負責「怎麼畫 Tree」
- Mapper 不負責 business flow。

# Tasks
Implement ComputeTreeComponent
Status: Core implementation completed

Model       ✓
Mapper      ✓
Service     ✓
Component   ✓
Lazy Load   ✓
Expand      ✓
UI          ✓

Next:
Page Integration
Routing Integration
Selection → Resource Navigation

# 順序
```text
1. ComputeTreeComponent
   ├─ Load tree
   ├─ Expand
   └─ Selection                         ✅

2. Compute Tree → Router Navigation     ← 下一步
   ├─ Virtual Pool → System List
   ├─ Physical Pool → System List
   ├─ Row → System List
   ├─ Rack → System List
   ├─ Drawer → Drawer Page
   └─ System → System Detail

3. Routed Content
   ├─ System List
   ├─ Drawer Page
   └─ System Detail

4. Tree Search
```