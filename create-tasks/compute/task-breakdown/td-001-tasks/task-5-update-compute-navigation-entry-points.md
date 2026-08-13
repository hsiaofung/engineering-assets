# Title

Update Compute navigation to use resource-based routing

# Purpose

所有入口只傳 resourceId。

Before:
```ts
navigate([
 '/compute',
 pod,
 group,
 rack,
 drawer,
 system
])
```
After:
```ts
navigate([
 '/compute/resource',
 systemId
])
```
# Scope

Update:

- Compute List Location link
- Tree View click
- Other Compute internal links

# Acceptance Criteria
- Components no longer construct hierarchy URL
- Components do not call ancestor API
- Navigation uses resourceId only