可以，而且我會說：**它已經具備 Design Pattern 的雛形，但目前不要急著把它命名成一個全新的 pattern。**

你現在這個設計比較準確的定位是：

> **Selection Context Pattern**
> 以「選擇上下文」隔離 UI Tree Selection、Resource Routing 與 Page Data Query。

它的核心不是某一支 service，而是**一套可重複套用的責任分離方式**。

### Pattern 可以抽象成

```text id="7m3n5b"
                 Tree / Navigation UI
                         │
                         │ select(resource)
                         ▼
                ┌──────────────────┐
                │ Selection Context│
                │                  │
                │ id               │
                │ kind             │
                │ name / location  │
                └────────┬─────────┘
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
      Navigation Service         Page Component
             │                       │
             ▼                       ▼
           URL                  API Query
```

這裡有三個明確責任：

| Layer              | 負責什麼                     |
| ------------------ | ------------------------ |
| Tree               | 使用者選了什麼                  |
| Selection Context  | 保存選擇的 resource context   |
| Navigation Service | resource → URL           |
| Page               | context → API query + UI |

---

### 它跟單純 State Service 不太一樣

如果只是：

```ts id="f8s2k"
selectedNode = signal(...)
```

那比較像一般的 state management。

你現在比較特別的是：

```text id="0v4x6n"
Selection Context
       │
       ├── Navigation
       │
       └── Data Query
```

**同一個 selection context 被兩條不同的責任鏈消費。**

這就是這個設計真正有價值的地方。

---

### 而且可以泛化

現在是：

```text id="j2k5m"
Compute Tree
    ↓
ComputeSelectionContext
```

未來其他 hierarchical resource 也可以：

```text id="n7p3q"
Cluster Tree
    ↓
ClusterSelectionContext
```

或者：

```text id="r4t8y"
Storage Tree
    ↓
StorageSelectionContext
```

共同原則都是：

```text id="s6u9w"
UI Selection
      ↓
Selection Context
      ├── Navigation
      └── Data Loading
```

所以它確實可以成為團隊裡的一個**設計模式**。

---

### 但我會注意命名

我不太建議直接叫：

> `Selection Context Pattern`

然後宣稱這是一個業界既有的 Design Pattern。

因為這個名稱不是像 **Strategy / Adapter / Observer / Repository** 那種公認 pattern。

比較準確的說法是：

> **Project-specific Design Pattern: Selection Context Pattern**

或者：

> **Resource Selection Context Pattern**

這樣很好，因為你是在**建立你們 Compute module 的 architecture pattern**，而不是硬把它套成 GoF pattern。

---

而且我覺得你現在這個決策很值得留下來，因為它其實解決了你這幾天一直遇到的問題：

```text
id="k5m8q"
「Page 要不要自己解析 route？」
「Ancestor API 要不要打？」
「Row / Rack location 從哪裡來？」
「URL 要不要帶 location？」
「同一個 Page route 改變怎麼重新取資料？」
```

最後被一個模式統一掉：

> **Tree 負責選擇，Context 負責傳遞選擇，Navigation 負責 URL，Page 負責資料。**

這已經不是單純「這次怎麼寫比較方便」，而是**可以拿來約束後續 Compute 功能開發的 architecture rule**。
