# Purpose

修改 Tree 點擊行為。

由：
```json
Tree

↓

Hierarchy URL
```
改成：
```json
Tree

↓

resourceId

↓

Router
```
# Acceptance Criteria
- 點擊任何 Node 都使用：
```json
router.navigate([
  '/compute/pod',
  node.id
])
```
Tree 不自行組 hierarchy URL