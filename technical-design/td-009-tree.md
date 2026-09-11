對，那就變成 **4 個互補的 navigation / selection patterns**。而且 Tree Search 跟前面三個不太一樣，它是「使用者如何找到 Tree resource」。

我會整理成這樣：

| Pattern                       | Direction      | Trigger                    | Purpose               |
| ----------------------------- | -------------- | -------------------------- | --------------------- |
| **Tree Selection Navigation** | Tree → URL     | 點擊 Tree node               | 從 Tree 導航到對應頁面        |
| **URL Selection Restoration** | URL → Tree     | 貼 URL / Browser navigation | 從 URL 恢復 Tree 狀態      |
| **Resource-Based Routing**    | Resource → URL | 點擊 Table resource          | 導航到 resource detail   |
| **Tree Search**               | Search → Tree  | 搜尋 Tree node               | 快速找到並定位 Tree resource |

### 1. Tree Selection Navigation

```text
Tree Node
   ↓
Selection
   ↓
Navigation
   ↓
Page URL
```

例如點 Row：

```text
Row 1
 ↓
/compute/pod/physical-pool/row/ROW-001/physical-assets
```

---

### 2. URL Selection Restoration

```text
Page URL
   ↓
Selection Target
   ↓
Tree
   ↓
Expand hierarchy
   ↓
Select Node
```

例如：

```text
/compute/pod/physical-pool/row/ROW-001/physical-assets
```

→

```text
Pod
 └─ Physical Pool
     └─ Row 1 ← selected
```

---

### 3. Resource-Based Routing

```text
Table Resource
   ↓
Resource ID
   ↓
Route Builder
   ↓
Canonical Resource URL
   ↓
Detail Page
```

例如：

```text
System IP
 ↓
System ID
 ↓
/compute/system/SYS-001
 ↓
System Detail
```

---

### 4. Tree Search

這個跟前三個最大的差別是：

**它不一定需要改 URL。**

例如：

```text
Search: ROW-b98cf4b2
          ↓
      Tree Search
          ↓
      Find Row
          ↓
    Expand parents
          ↓
      Select Row
```

也就是：

> **Search → Tree**

如果你未來希望搜尋結果也能同步 URL，那可以再串：

```text
Search
  ↓
Tree Selection
  ↓
Navigation
  ↓
URL
```

這樣 Tree Search 就可以和前面的 **Tree Selection Navigation** 重用，而不是另外建立一套 navigation 邏輯。

---

## 最後可以看成四個層次

```text
                         Compute Navigation
                                │
        ┌───────────────┬───────┴────────┬──────────────┐
        │               │                │              │
        ▼               ▼                ▼              ▼
 Tree Selection    URL Selection    Resource-Based   Tree Search
  Navigation        Restoration       Routing
        │               │                │              │
     Tree → URL      URL → Tree     Resource → URL   Search → Tree
```

我會建議你把 **Tree Search 放在 Selection 的上一層概念**：

```text
Tree Search
    ↓
找到 Node
    ↓
Tree Selection
    ↓
Tree Selection Navigation
    ↓
URL
```

這樣未來實作 Tree Search 時，**不要再做一套自己的 navigation / selection state**，而是找到 node 後直接走你現在已經建立好的 Selection Service。

這樣四個功能會真正串成一個一致的架構。
