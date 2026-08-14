# Technical Design (怎麼設計How)
- architecture(架構)
- data flow(資料流)
- component responsibility(元件責任)
- API interaction
- routing design 
- error handling
- testing strategy
- decision
- Trade-off

## 原則
- 為什麼這樣設計?
- Technical Design 不應該按照頁面數量寫，而應該按照**系統變化的邊界（design boundary）**寫。
- Compute 其實不是 20 個頁面的問題，而是幾個核心能力：
- Technical Design 記錄的是「設計決策（Decision）」
- Task 記錄的是「工程工作（Work Item）」
- 至於用 data-table-v1、data-loader、Observable 或 Signal 等實作細節，通常留在程式碼即可，除非它們本身就是這次專案的重要設計決策。
- 是不是一個需要團隊共同遵守的工程決策? 
    - 如果團隊決定統一 Pattern，則Technical Design 和 Task 都需寫入（建立/導入 Pattern）

```json  
Compute Feature
│
├── Routing Architecture
│
├── Navigation / Tree Structure
│
├── Resource Context Resolution
│
├── Page Framework
│
├── API Data Flow
│
└── Common UI Pattern
```

## 什麼才是好的 Technical Design？

好的 TD 應該描述設計決策（Design Decisions），而不是實作細節。

例如 TD-001 可以包含：

- 為什麼改成 resource-based routing，而不是 hierarchy-based routing。
- 為什麼所有入口都只傳 resourceId。
- 為什麼由 routing guard 負責解析資源，而不是每個 Component 自己呼叫 API。
- 為什麼需要 canonical URL，而不是讓不同頁面組不同格式的網址。
- 各個模組（Route、Guard、API Adapter）的責任邊界。

這些都是幾個月後甚至一年後仍然有價值的資訊；相反地，switchMap、UrlTree、class 名稱等實作細節，通常應該留在程式碼本身或 code review 中，而不是 Technical Design。

## Technical Design 分成三種層級
```json
Architecture Design
│
├── Routing Design
├── Navigation Design
└── State Management Design

Feature Design
│
├── System Detail
├── Compute List
└── Physical Assets

Reusable Pattern Design
│
├── List Page Pattern
├── Detail Page Pattern
├── Form Pattern
└── Wizard Pattern
```
這樣分類有幾個好處：   
- Architecture Design：描述跨功能的架構決策（例如 Routing、Navigation）。
- Feature Design：描述某個功能模組（例如 System Detail）的組成與責任，再拆成 Processor、Memory 等開發工作。
- Reusable Pattern Design：描述跨功能共用的 UI 或資料處理模式（例如 List Page Pattern）。

以你的 Compute 專案來說：
- TD-001：Routing Design（架構）   
- TD-002：Navigation Design（架構）
- TD-003：System Detail Feature Design（功能）

這樣每一份 Technical Design 都有明確的層次，也比較容易一路拆解到 GitLab 的 Epic 與 Task。

# 情況二：你要建立整個 SCC4 的共用 Pattern（值得 TD-005）

例如你決定：

SCC4 所有 Table 頁面都必須遵循同一套 Pattern。

包括：

Compute
Task
Log
Admin
PDU Console

全部都要使用：

data-loader
data-table-v1
統一 Loading
統一 Empty State
統一 Error Handling
統一 Search
統一 Reload
統一 Display Setting

這就是一個架構決策，值得獨立成：

TD-005 Common Page Pattern Design

# 兩層模型
## Level 1：Technical Design

回答：

系統要有哪些東西？

例如：
```text
Compute Tree
│
├── ComputeTreeNode Model
├── ComputeTreeMapper
├── ComputeTreeService
└── ComputeTreeComponent
```
這是架構視角。

## Level 2：GitLab Tasks

回答：

我要交付哪些東西？

例如：

```text
Task 1 — Implement ComputeTreeMapper

Task 2 — Implement ComputeTreeService

Task 3 — Implement ComputeTreeComponent

Task 4 — Implement ComputeTree Expand / Lazy Loading

Task 5 — Implement ComputeTree Selection

Task 6 — Integrate ComputeTree with Compute Page
```

這已經比 Technical Design 細一點，但還是保持可讀性。

## Level 3：Implementation

真正寫 code 時才出現：
```text
ComputeTreeComponent
├── toTreeNode()
├── updateChildren()
├── addLoadingKey()
├── removeLoadingKey()
├── loadRoot()
└── onNodeExpand()
```
這些是implementation details。

不需要全部變成 GitLab Task。

# 更重要的是：Technical Design 應該允許「回饋」
你這次其實發現一個很好的工程循環：
```text
Technical Design
       ↓
   Implementation
       ↓
發現未知細節 / Design Gap
       ↓
Update Technical Design
       ↓
Implementation
       ↓
完成
```

而不是：

```text
Technical Design
       ↓
Implementation
       ↓
發現問題
       ↓
怪自己當初 Design 做不好
```

Technical Design 本來就不可能在 implementation 前知道所有細節。

尤其像你這次：

Drawer 沒有 API，Rack API 一次把 Drawer + System 回傳。

這種資訊通常就是做到 API integration 才真正確定。

# 所以你現在可以把這次經驗變成一個很好的工作方法

以後做 Technical Design 時，不需要刻意把它做到「非常細」。

做到：

足以讓人理解系統結構、責任邊界、主要資料流。

然後 Implementation 時：

把未知的細節逐步發現出來。

最後再把「真正影響架構的發現」回寫 Technical Design。

例如這次真正值得回寫 Design 的可能是：

```text
Rack API
  ↓
Drawer
  ↓
System
```
以及：
```text
Drawer node
  ├── isLeaf = false
  └── systems are preloaded but not rendered
```
但：
```text
toTreeNode()
updateChildren()
addLoadingKey()
```
這些就不需要回寫 Technical Design。

- 從 Technical Design 推 Task，最適合當正式的 GitLab 任務結構；從 Implementation 倒推 Task，則比較適合拿來檢查「Technical Design 是否漏掉了重要的工作」。這兩個不是互相取代，而是互相校正。
- 實作最大的價值之一：把 implementation 中發現的事實，沉澱成新的設計資產。
- 下一次遇到類似 Tree：
```text
Rack
 └── Drawer
      └── System
```
你就不需要重新探索一次，而可以直接從既有設計開始。      