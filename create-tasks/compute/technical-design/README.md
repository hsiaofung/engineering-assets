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


