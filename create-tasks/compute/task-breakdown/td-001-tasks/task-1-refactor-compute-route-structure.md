# Title

Migrate cloudComputeV1Routes to SCC 4.0 resource-based routing

# Purpose

將目前 SCC 3.X hierarchy routing：

```json
/compute/{pod}/{group}/{rack}/{drawer}/{system}
```

改成 SCC 4.0 resource routing：
```json
/compute/resource/{resourceId}
```
---

# Scope
- Update cloudComputeV1Routes
- Remove old hierarchy route dependency
- Add resource entry route
- Add physical / virtual pool routes
- Add appliance routes

---

# Acceptance Criteria
 - /compute/resource/{resourceId} can be matched
 - Static routes do not conflict with resource routes
 - Physical and virtual routes are supported
 - Legacy hierarchy routes are removed