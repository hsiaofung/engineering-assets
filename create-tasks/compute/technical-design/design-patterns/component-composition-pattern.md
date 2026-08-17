對，**可以算是一種 design pattern，但我會更精確地說：這是一個「架構層級的 component composition pattern」**，而不是 GoF 那種正式 Design Pattern。

你這次其實形成了一個很清楚的 pattern：

```text
Feature Page
     │
     ├── Layout / Coordination
     │       └── Container
     │
     ├── Feature Component
     │       └── Domain logic
     │
     └── Shared UI Component
             └── Generic rendering
```

套到你的 Compute：

```text
ComputePage
    │
    └── TreeViewV1Container
          │
          ├── ComputeTree
          │      └── TreeViewV1
          │
          └── ComputeNavigation
```

### 這個 pattern 的核心

可以把它叫做：

**Feature-Oriented Component Composition**

或者更具體：

**Container–Feature–UI Pattern**

三層責任：

| Layer     | Responsibility        |
| --------- | --------------------- |
| Container | Layout / coordination |
| Feature   | Domain behavior       |
| Shared UI | Generic rendering     |

例如：

```text
TreeViewV1Container
→ 不知道 Compute 是什麼

ComputeTree
→ 知道 Pod / Pool / Rack / System

TreeViewV1
→ 只知道 TreeNode 怎麼 render
```

這個 boundary 很漂亮。

---

### 而且它解決了一個很常見的問題

最容易走成：

```text
ComputePage
    ↓
TreeView
    ↓
一堆 Compute-specific if/else
```

最後 shared component 變成：

```ts
if (compute) ...
if (storage) ...
if (pdu) ...
```

這就是你現在刻意避免的。

你的設計則是：

```text
              Shared
                │
       TreeViewV1Container
                │
        ┌───────┴───────┐
        │               │
   ComputeTree     ComputeNavigation
        │               │
   Compute domain   Compute domain
```

**domain logic 向下靠 feature encapsulation，而不是污染 shared component。**

---

所以如果你要在 Technical Design 裡寫，我不會直接寫：

> We use the Container Design Pattern.

因為這容易讓人以為是某個正式、既定的 Design Pattern。

我會寫：

> **Component Composition Pattern**
> Shared layout components provide generic composition and interaction behavior, while feature components encapsulate domain-specific logic and UI mapping.

然後用 Compute 當例子。

這樣比較精準，也比較像真正的 technical design。
