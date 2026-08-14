# Task 6 — 實作 Compute Tree 選取後的頁面資料導覽

## 流程：

```text
User clicks Tree Node
        ↓
ComputeTreeComponent
        ↓
nodeSelect
        ↓
Compute Page
        ↓
依 node.kind 決定 API query
        ↓
Compute Systems API
        ↓
更新 Systems List
```

例如：

| Tree Node     | API                                                       |
| ------------- | --------------------------------------------------------- |
| Physical Pool | `GET /compute-service/v1/systems?unassigned=false`        |
| Virtual Pool  | `GET /compute-service/v1/systems?unassigned=true`         |
| Row           | `GET /compute-service/v1/systems?row={rowLocation}`       |
| Rack          | `GET /compute-service/v1/systems?rack={rackLocation}`     |
| Drawer        | `GET /compute-service/v1/systems?drawer={drawerLocation}` |
| System        | `GET /compute-service/v1/systems/{id}` |

```text
Tree
 ↓
Selection
 ↓
ComputeComponent
 ↓
ComputeNavigationService
 ↓
Router
 ↓
Routed Page
 ↓
API
 ↓
顯示資料
```