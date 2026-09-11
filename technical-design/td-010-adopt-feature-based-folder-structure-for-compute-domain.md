# Title:
Adopt Feature-Based Folder Structure for Compute Domain

# Decision:
- 採用以 Feature / Responsibility 為核心的目錄結構，而不是以 Component / Page / Service 等技術類型分類。

# 原因:
主要有三個：

1. High Cohesion
    - 同一個 domain responsibility 的 code 放在一起。
    - 例如 selection/ 裡就是 Selection 相關邏輯。
2. Better Discoverability
    - 開發者可以從目錄直接理解 Compute architecture。
    - 不需要先知道某個東西是 Component 還是 Service 才知道去哪找。
3. Easier Maintenance
    - 修改一個 feature 時，相關程式碼集中。
    - 未來 Tree Search、Resource Routing 等功能增加時，不容易讓 services/ 變成一個大雜物間。

# Technical Design Decisions

1. Feature-Based Folder Structure
2. Tree Selection Navigation
3. URL Selection Restoration
4. Resource-Based Routing
5. Tree Search → Selection → Navigation