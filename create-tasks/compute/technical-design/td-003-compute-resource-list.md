### Technical Design


```text
Compute Resource List
│
├─ System Summary
│  └─ Display system resource summary
│
├─ IP Address Navigation
│  └─ Click IP Address
│      → Navigate to System Detail
│
└─ Task Navigation
   └─ Click Task
       → Navigate to Task History
```

#### 1. System Summary

負責顯示 Compute System 的 summary information。

```text id="9zv6da"
Compute System List (Pod/Pool/Row/Rack/)
└─ System Summary
   ├─ IP Address
   ├─ Task
   └─ ...
```

#### 2. IP Address → System Detail

使用者點擊 row 裡的 `IP Address`：

```text id="1f4brb"
User clicks IP Address
        ↓
Get system resource ID
        ↓
Canonical Route Builder
        ↓
System Detail
```

這裡我會特別建議 **不要用 IP address 當 routing key**。

應該使用：

```text id="j3t0q5"
systemId
```

因為你現在 SCC 4.0 已經採用 resource-based routing。

也就是：

```text
IP Address = UI display / clickable label
System ID  = navigation identity
```

#### 3. Task → Task History

使用者點擊 Task：

```text id="5j5f5b"
User clicks Task
        ↓
Get task / system context
        ↓
Task History route
```

這裡需要確認 **Task History 的 canonical route 需要什麼 ID**：

* `taskId`？
* `systemId`？
* 或兩者？

這個我會列成 API / routing dependency，而不是先假設。

---

### 我會把 Technical Design 的 Architecture 寫成

```text id="2sx9sa"
Compute Resource List
        │
        ├── System Summary
        │
        ├── IP Address
        │      ↓
        │   System Detail
        │
        └── Task
               ↓
          Task History
```

核心原則：

> **Compute Resource List provides entry points to related resource views. Each clickable field uses the resource identity required by the target route rather than using its display value as the navigation key.**

這個原則尤其適合你現在的 SCC 4.0 **resource-based routing**，因為 `IP address` 是 display data，真正的 identity 應該還是 `systemId`。
