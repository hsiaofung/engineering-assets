# Technical Design
- architecture
- data flow
- component responsibility
- API interaction
- routing design 
- error handling
- testing strategy

## 原則
- Technical Design 不應該按照頁面數量寫，而應該按照**系統變化的邊界（design boundary）**寫。
- Compute 其實不是 20 個頁面的問題，而是幾個核心能力：

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


