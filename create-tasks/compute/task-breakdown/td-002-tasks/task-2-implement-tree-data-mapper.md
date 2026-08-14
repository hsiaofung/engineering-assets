# Title
Implement ComputeTreeMapper for API-to-domain mapping

# Purpose
- Convert the Backend Tree API response into the ComputeTreeNode model required by the Tree Component.
- 建立 API Response → Domain Model 的轉換層。

# Scope

例如：
```text
Backend API Response
        ↓
Compute Tree Mapper
        ↓
ComputeTreeNode[]
        ↓
Tree Component
```

```ts
mapDrawers(response: ComputeRackResponse): ComputeTreeNode[]
mapSystems(response: ComputeDrawerResponse): ComputeTreeNode[]
```

# 內容
- mapPoolResponse()
- mapRows()
- mapRacks()
- mapDrawers()
- mapSystems()
- API response → ComputeTreeNode

# Acceptance Criteria
- Backend Tree API responses can be converted into ComputeTreeNode
- API-specific field names are normalized by the mapper
- UI does not directly depend on the Backend API schema
- Physical Pool hierarchy is supported
- Virtual Pool hierarchy is supported
- Lazy-loaded child responses can be converted independently
- 每個 API response 都能正確轉換
- kind / id / name / parentId / isLeaf 正確
- Mapper unit tests pass