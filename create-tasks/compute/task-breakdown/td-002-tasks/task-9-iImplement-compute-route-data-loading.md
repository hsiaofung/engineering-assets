
# Task 7 — 實作 Compute 路由頁面的資料載入

先從最簡單的開始：

```text
Physical Pool
    ↓
/compute/pod/physical-pool/physical-assets
    ↓
GET /compute-service/v1/systems?unassigned=false
```

接著：

```text
Row
 ↓
/compute/pod/physical-pool/row/:rowId/physical-assets
 ↓
GET /compute-service/v1/systems?row={rowLocation}
```
```text
Rack
 ↓
/compute/pod/physical-pool/rack/:rackId/physical-assets
 ↓
GET /compute-service/v1/systems?rack={rackLocation}
```
Drawer 則是特殊的：
```text
Drawer
 ↓
/compute/pod/physical-pool/drawer/:drawerId
 ↓
Drawer Physical Assets page
```
System：
```text
System
 ↓
/compute/pod/physical-pool/appliance/:applianceId/physical-assets
 ↓
GET /compute-service/v1/systems/{id}
```

# flow
```text
              Compute
                 │
        ┌────────┴────────┐
        │                 │
   Compute Tree       RouterOutlet
        │                 │
        │                 ▼
        └──────→ Routed Pages
                       │
                       ▼
                 Compute API
```                 