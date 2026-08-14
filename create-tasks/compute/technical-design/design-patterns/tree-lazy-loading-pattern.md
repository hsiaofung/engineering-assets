# Problem
Tree hierarchy has Drawer → System,
but Drawer has no independent API.

```text
Tree Lazy Loading Pattern

Rack expansion
    ↓
GET Rack API
    ↓
Drawer[]
    └── systems[]
```

--- 

# Pattern
```text
Load children from the nearest API boundary.

Example
-------
Rack API returns:
Rack
 ├── Drawer
 │    └── System
 └── Drawer
      └── System
```

---

## 定義：
```text
1. Rack 是 lazy-loading boundary
2. Expand Rack → fetch Rack API
3. API 同時取得 Drawer + System
4. Drawer 先建立 Tree Node
5. System 暫存在 drawerSystems
6. Expand Drawer → 從已取得資料建立 System nodes
7. 不再呼叫 Drawer API
```

這樣下一次你看到：

「Drawer 有 children，但 API 沒有 Drawer endpoint」

你馬上就知道：

這不是特殊 case，而是一種既有 Tree data-loading pattern。