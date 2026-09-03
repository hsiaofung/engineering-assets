# Resource-Based Routing with Tree Selection Synchronization

## Problem

When a hierarchical tree is used for navigation, putting the
entire hierarchy into the URL can make routing tightly coupled
to the current tree structure.

## Approach

Use the selected resource as the routing source of truth.

Resource URL
    ↓
Ancestor API
    ↓
Routing Context
    ↓
Canonical Route

Tree selection
    ↓
Resource ID / type
    ↓
Canonical Route

## Principles

- URL represents the resource, not its ancestors.
- Ancestor information is resolved when necessary.
- Route generation is centralized in a Route Builder.
- Tree selection and URL must be bidirectionally synchronized.
- Invalid resource IDs fall back to the Compute root.
- Leaving Compute should not preserve stale list filters.

## Example

/compute/pod/physical-assets
/compute/pod/virtual-pool
/compute/row/:id
/compute/rack/:id
/compute/resource/:id

## Testing

### Unit
- route builder
- resource resolve guard
- ancestor resolution
- tree adapter
- tree navigation
- tree selection synchronization

### E2E
- URL → correct tree selection
- Tree selection → correct URL
- invalid resource → fallback
- Compute entry → default resource list