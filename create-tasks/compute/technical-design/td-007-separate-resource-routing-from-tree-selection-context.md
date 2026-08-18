對，我認為**完全可以，而且值得記成一個 Technical Design Decision（TDD）**。

這不是單純的 coding implementation，而是我們對 **Routing、Tree Selection、Page Data Context 三者責任邊界**做了一個明確決策。

### 我會這樣定義

**Decision: Separate Resource Routing from Tree Selection Context**

核心決策：

> **URL 只負責描述 resource navigation；Tree selection context 負責保存由 Compute Tree 選出的 node 資訊。**

也就是：

```text
ComputeTreeNode
├── id    → Resource identity / URL
├── kind  → Resource type
└── name  → API location
```

然後：

```text
Tree Selection
      ↓
ComputeSelectionService
      ↓
Compute Page
```

而：

```text
Tree Selection
      ↓
ComputeNavigationService
      ↓
Resource-based URL
```

### 為什麼值得記錄？

因為它解決了一個很具體的架構問題：

**原本的做法**

```text
URL
 ↓
ComputeSystemsPage
 ↓
解析 route
 ↓
取得 rowId / rackId
 ↓
再想辦法取得 location
```

導致 Page 必須知道很多 routing 細節。

**現在的做法**

```text
Tree
 ↓
Selection Context
 ↓
Page
```

Page 不需要知道 Tree node 是怎麼被選出來的。

同時：

```text
Tree
 ↓
Navigation Service
 ↓
URL
```

Navigation 也不需要知道 API query 的細節。

---

### 我甚至會把這個 Decision 的原則寫成三句

```text id="0q5n8c"
1. URL represents resource identity and navigation state.

2. Tree selection context represents the user's selected resource
   and its display/API context.

3. Page components consume selection context and should not
   infer business context by parsing URLs.
```

這三句其實很有價值。

尤其第三句可以避免未來有人又寫：

```ts
if (this.router.url.includes('/row/')) {
  ...
}
```

然後整個架構又慢慢退回去。

所以這個我會正式記成一個 **Technical Design Decision**，而且它可以跟你之前的 **Resource-based Routing** Decision 放在一起，兩者其實是互相配合的。
