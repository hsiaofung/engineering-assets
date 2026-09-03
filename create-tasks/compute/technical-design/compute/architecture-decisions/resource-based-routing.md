# Resource-based routing

- 從 hierarchy-based routing 改成 resource-based routing
- resolveGuard → ancestor API → canonical route
- URL 不依賴 ancestor information

--- 

可以。這份是四個核心架構裡比較底層的一個，我會把它和 `tree-selection-navigation`、`url-selection-restoration` 清楚切開：**前兩個描述 navigation flow，這份描述 URL 如何由 resource identity 建立與解析。**

# Resource-Based Routing

## Status

Accepted

## Context

The Compute domain contains a hierarchical resource structure:

```text
Pod
└── Physical Pool
    └── Row
        └── Rack
            └── Drawer
                └── System
```

The resource hierarchy is useful for displaying and navigating the Compute Tree, but it should not determine the canonical URL structure.

A resource may also be reached through different entry points, such as:

* Compute Tree selection
* Direct URL access
* Tree Search
* Links from a System List
* Links from other Compute features

If routing depends directly on the currently displayed hierarchy, navigation logic becomes tightly coupled to the Tree structure.

For example, a Tree-based implementation may construct URLs by concatenating the currently known ancestors:

```text id="m9k7qf"
Pod
 ↓
Physical Pool
 ↓
Row
 ↓
Rack
 ↓
System
```

This creates unnecessary coupling between the Tree and routing.

## Decision

Adopt **Resource-Based Routing** for Compute resources.

URLs are constructed and resolved based on the target resource rather than the UI Tree hierarchy.

The resource ID is treated as the primary identity of the target resource.

```text id="b0p8ne"
Resource ID
    │
    ▼
Ancestor Resolution
    │
    ▼
Resource Context
    │
    ▼
Route Builder
    │
    ▼
Canonical URL
```

The Tree is therefore not responsible for constructing canonical URLs.

## Resource-Based Routing Flow

The routing architecture is divided into three responsibilities:

```text id="f8z4wy"
Resource
   │
   ▼
ComputeAncestorService
   │
   ▼
ComputeResourceContext
   │
   ▼
ComputeRouteBuilder
   │
   ▼
Canonical URL
```

### ComputeAncestorService

`ComputeAncestorService` resolves the resource's location and ancestry.

For example, given a System ID:

```text id="3h0t7m"
SYS-001
```

the service may resolve information such as:

```text id="j0f8ra"
{
  rowId,
  rackId,
  drawerId,
  rowLocation,
  rackLocation,
  drawerType,
  unassigned
}
```

The routing layer can then determine the appropriate resource context.

The ancestor service hides backend-specific hierarchy resolution from the rest of the application.

### ComputeResourceContext

`ComputeResourceContext` represents the routing context required to build a canonical URL.

It separates backend hierarchy information from URL construction.

Conceptually:

```text id="0u2x3a"
Resource
   ↓
Resource Context
   ↓
Route Builder
```

The route builder does not need to call the backend directly.

### ComputeRouteBuilder

`ComputeRouteBuilder` is responsible for constructing canonical application URLs from a resolved resource context.

For example:

```text id="7n8x2h"
Resource Context
      ↓
ComputeRouteBuilder
      ↓
/compute/pod/physical-pool/row/:rowId/physical-assets
```

The route builder becomes the single place that defines canonical Compute URLs.

## Resource Routing vs Tree Routing

The following approach is avoided:

```text id="x4c8r2"
Tree
 ↓
Read parent nodes
 ↓
Construct URL
```

Instead:

```text id="y8n2qa"
Resource
 ↓
Resolve context
 ↓
Build canonical URL
```

This distinction is important because the Tree is a UI representation of the resource hierarchy, not the source of truth for routing.

## Example: System Resource

Suppose the user clicks a System IP address in the System List.

The navigation flow should not require the System List to know the complete hierarchy.

Instead:

```text id="2n7w6a"
System ID
   ↓
ComputeAncestorService
   ↓
Resource Context
   ↓
ComputeRouteBuilder
   ↓
System Detail URL
```

This allows System List, Tree Search, Tree Selection, and other features to reuse the same resource routing mechanism.

## Relationship with Tree Selection Navigation

Tree Selection Navigation handles:

> What should happen when the user selects a Tree node?

Its flow is:

```text id="9e4q3c"
Tree
 ↓
Selection
 ↓
Navigation
```

Resource-Based Routing handles:

> How should the target resource be represented by the canonical URL?

Its flow is:

```text id="6g3h5b"
Resource
 ↓
Resource Context
 ↓
Route Builder
 ↓
URL
```

Therefore:

```text id="q8r4s1"
Tree Selection
      │
      ▼
Navigation Service
      │
      ▼
Resource Routing
      │
      ▼
Canonical URL
```

The Navigation Service coordinates the navigation, while the Routing layer owns URL construction and resource resolution.

## Relationship with URL Selection Restoration

URL Selection Restoration works in the opposite direction.

Resource-Based Routing:

```text id="1n4v7c"
Resource
 ↓
Canonical URL
```

URL Selection Restoration:

```text id="6b8k2x"
URL
 ↓
Selection Context
 ↓
Tree Selection
```

Together they establish a bidirectional relationship:

```text id="0g3m9p"
       Resource
          │
          ▼
   Resource Routing
          │
          ▼
       URL
          │
          ▼
 URL Selection Restoration
          │
          ▼
     Tree Selection
```

This allows the URL to remain the stable navigational representation while the Tree remains a UI representation of the Compute hierarchy.

## Canonical URLs

Compute resources should have a canonical URL representation.

For example:

```text id="8v5q1m"
/compute/pod/physical-pool/row/:rowId/physical-assets
```

The canonical URL should be generated by the routing layer rather than assembled independently by individual components.

This prevents different features from generating inconsistent URLs for the same resource.

## Resource Routing and Query Parameters

Resource identity and list filtering are separate concerns.

For example:

```text id="3z7n1k"
/compute/pod/physical-pool/row/ROW-001/physical-assets
```

identifies the selected Compute resource.

The Systems Page may then derive its API query:

```text id="q6f4m2"
row=ROW-001
sort=location
direction=asc
page=1
perPage=10
```

The page should not reconstruct the application's resource URL from these API parameters.

The responsibilities remain:

```text id="1c7v9p"
Application URL
      ↓
Selection Context
      ↓
Systems Page
      ↓
API Query Parameters
```

## Resource-Based Routing for Other Entry Points

The same routing architecture can be reused by different entry points.

### Tree Selection

```text id="6u4m1b"
Tree Node
 ↓
Navigation Service
 ↓
Resource Routing
 ↓
URL
```

### Tree Search

```text id="8p3r6v"
Search Result
 ↓
Resource
 ↓
Resource Routing
 ↓
URL
```

### System List Resource Link

```text id="5j1x8c"
System Resource
 ↓
Resource Routing
 ↓
System Detail URL
```

### Direct URL

```text id="7q2n4d"
URL
 ↓
Route Guard / Resolver
 ↓
Resource Context
 ↓
Resource
```

All entry points therefore share the same resource-oriented routing model.

## Why Ancestor Resolution Belongs in Routing

A resource may not contain enough information to construct the complete canonical URL by itself.

For example, a System ID may require ancestor information to determine whether the resource belongs to:

```text id="w4c8z0"
Physical Pool
└── Row
    └── Rack
        └── Drawer
            └── System
```

The application therefore resolves the resource's ancestors inside the routing layer.

This keeps backend-specific hierarchy resolution out of:

* Tree components
* System List pages
* Search components
* Navigation components

## Consequences

### Positive

* Routing is independent of Tree UI structure
* Resource identity becomes the central routing concept
* URL construction is centralized
* Different entry points can reuse the same routing mechanism
* Backend hierarchy resolution is isolated
* Canonical URLs are easier to maintain
* Changes to the Tree hierarchy do not necessarily require changes to navigation consumers

### Negative

* Resource navigation may require an additional ancestor-resolution request
* Routing becomes more sophisticated than simple static route construction
* Resource context and route-building abstractions must be maintained
* Developers need to understand the distinction between resource identity and UI hierarchy

## Decision Summary

The Compute application uses **Resource-Based Routing** as the foundation for canonical resource navigation.

The routing layer is responsible for:

1. Resolving resource ancestry when necessary
2. Building a `ComputeResourceContext`
3. Constructing canonical URLs through `ComputeRouteBuilder`
4. Resolving resources from URL parameters when required

The Tree, Search, System List, and other UI features should provide or consume resource identity rather than independently constructing Compute URLs.

The architectural principle is:

```text id="p2v7k5"
UI Feature
    ↓
Resource
    ↓
Resource Routing
    ↓
Canonical URL
```

This keeps resource navigation independent from any particular UI representation of the Compute hierarchy.
