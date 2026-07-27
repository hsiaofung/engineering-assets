# Title

Implement Compute canonical route builder

# Purpose

集中管理 route 產生邏輯。

不要散落：
```ts
router.navigate([
 '/compute/pod',
 'physical-pool',
 'appliance',
 id
])
```
# Scope

建立：
```ts
ComputeRouteBuilder
```

例如：
```ts
buildPhysicalSystemRoute(id)

buildVirtualSystemRoute(id)
```
# Acceptance Criteria
- All resolver redirects use route builder
- No hard-coded route strings in guards