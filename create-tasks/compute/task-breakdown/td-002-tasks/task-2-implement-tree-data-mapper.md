# Purpose

Convert the Backend Tree API response into the ComputeTreeNode model required by the Tree Component.

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
# Acceptance Criteria
- Backend Tree API responses can be converted into ComputeTreeNode
- API-specific field names are normalized by the mapper
- UI does not directly depend on the Backend API schema
- Physical Pool hierarchy is supported
- Virtual Pool hierarchy is supported
- Lazy-loaded child responses can be converted independently