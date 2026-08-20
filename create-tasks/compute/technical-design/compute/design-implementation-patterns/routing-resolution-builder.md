# Resolve → Context → Build Pattern

- Resource-based Routing uses a Resolve → Context → Build flow to generate canonical URLs from a resource ID.

我反而會把你的 Compute routing 設計整理成：

```text
Resource
   │
   ▼
Resolve
   │
   ▼
Routing Context
   │
   ▼
Route Builder
   │
   ▼
Canonical URL
```
也就是：

Resolve → Context → Build

這是一個很清楚的 Routing Architecture Pattern。

而且它跟你之前決定的 Resource-based Routing 是配套的。

---

# Resolve Service

它的目的就是：

在建立 route 前，先解析 resource 所需要的 routing context。

這個比較特別。

Angular 本身有 Route Resolver 的概念，但你現在的 ComputeAncestorService 並不是 Angular ResolveFn。

你的設計是：
```text
System ID
   ↓
ComputeAncestorService
   ↓
Ancestor API
   ↓
Ancestor Context
```
所以我會叫：

Routing Resolution Pattern

--- 

# Route Builder

這個也很合理。

你的：
```text
ComputeRouteBuilder
```
負責：
```text
resource + ancestor context
        ↓
canonical route
```
```text
例如：

resourceId
    +
ancestorContext
    ↓
ComputeRouteBuilder
    ↓
/compute/.../system/xxx
```
這其實就是 Builder Pattern 的一種應用。

--- 

# 描述

你現在的 `Context` 不是單純「放資料的 object」，它是 **Resolve 與 Build 之間的契約（contract）**。

你的流程：

```text
Resource ID
    │
    ▼
  Resolve
    │
    ▼
 Routing Context
    │
    ▼
  Build
    │
    ▼
 Canonical URL
```

### 1. Resolve：回答「這個 Resource 在哪裡？」

例如使用者從 System Detail 點進來：

```text
System ID
SYS-001
```

`ComputeAncestorService` 去呼叫 ancestor API：

```text
/rackconfig-service/.../systems/SYS-001/redirection
```

API 回傳：

```typescript
{
  unassigned: false,
  rowId: 'ROW-001',
  rowLocation: 'row1',
  rackId: 'RACK-001',
  rackLocationId: 'test1'
}
```

這一步就是：

> **Resolve：把 Resource ID 解析成它所在的 hierarchy context。**

---

### 2. Context：保存「Routing 所需要的資訊」

這個就是你問的 Context。

例如：

```typescript
interface ComputeRouteContext {
  unassigned: boolean
  rowId?: string
  rowLocation?: string
  rackId?: string
  rackLocationId?: string
}
```

它的角色不是自己去查 API，也不是自己產生 URL。

它只是把：

> **Resolve 得到的 routing information**

交給下一階段。

所以 Context 可以理解成：

> **Resolved routing state**

也就是：

```text
Resource
   ↓
「你在哪裡？」
   ↓
Context
```

---

### 3. Build：回答「URL 應該長什麼樣？」

`ComputeRouteBuilder` 拿 Context：

```text
resourceId
+
ComputeRouteContext
```

產生 canonical URL：

```text
/compute/pod/physical-pool/row/ROW-001/...
```

所以 Build 不需要知道：

* ancestor API 是什麼
* 怎麼查 Row
* 怎麼查 Rack
* Resource 在哪裡找到的

它只需要：

> **給我 Resource + Routing Context，我幫你產生正確 URL。**

---

## 所以三者的責任非常清楚

| Stage       | 責任                        | 問題            |
| ----------- | ------------------------- | ------------- |
| **Resolve** | 找出 routing information    | Resource 在哪裡？ |
| **Context** | 保存 resolved routing state | 找到的資訊是什麼？     |
| **Build**   | 產生 canonical URL          | URL 應該長什麼樣？   |

所以我會把你的 Pattern 定義成：

> **Resolve → Context → Build**

而不是：

> ❌ Resolve → Service → Build

因為 `Service` 是「誰來做」，而 `Context` 是「Resolve 和 Build 之間傳遞什麼」。

這也是為什麼這個設計**容易維護**：將來 ancestor API 改了，你主要改 `Resolve`；URL 規則改了，改 `Build`；中間 routing 資訊的定義改了，改 `Context`。三個責任不會互相污染。
