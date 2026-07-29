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
