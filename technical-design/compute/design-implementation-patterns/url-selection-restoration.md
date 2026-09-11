# URL Selection Restoration

## Status

Accepted

## Context

The Compute page contains a hierarchical Tree that represents the current Compute resource hierarchy.

Users can reach a Compute page through more than just Tree navigation. For example, a user may:

* Paste a URL directly into the browser
* Refresh the current page
* Use browser Back / Forward navigation
* Open a bookmarked Compute URL
* Navigate to a Compute page from another application entry point

In these cases, the URL represents the desired Compute resource, but the Tree is initially loaded independently.

For example:

```text
/compute/pod/physical-pool/row/ROW-001/physical-assets
```

The Tree initially contains only the root hierarchy:

```text
Pod
├── Virtual Pool
└── Physical Pool
```

The Row node is not loaded yet because the Tree uses lazy loading.

Therefore, simply setting the Tree's selected key is insufficient. The application must restore the required hierarchy and select the resource represented by the URL.

## Decision

Adopt a **URL → Selection Target → Tree Restoration** flow.

The current URL is interpreted by `ComputeComponent`, which creates a `ComputeSelectionContext`.

The context is passed to `ComputeTreeComponent` as a selection target.

The Tree then progressively expands and loads the required hierarchy until the target node is available.

```text
URL
 │
 ▼
ComputeComponent
 │
 │ buildSelectionContext()
 ▼
ComputeSelectionContext
 │
 ▼
ComputeTreeComponent
 │
 ├── Expand required parent
 │
 ├── Load children
 │
 └── Select target node
       │
       ▼
ComputeSelectionService
```

## Selection Context

The URL should not be passed directly to the Tree.

Instead, the URL is converted into a domain-level selection context:

```ts id="uf1s4n"
export interface ComputeSelectionContext {
  kind: ComputeTreeNodeKind
  id: string
  name: string
}
```

For example:

```text id="t6h8gj"
URL:

/compute/pod/physical-pool/row/ROW-001/physical-assets
```

becomes:

```text id="g3n5hp"
{
  kind: 'row',
  id: 'ROW-001',
  name: ''
}
```

The Tree does not need to understand the URL structure.

## Responsibility of ComputeComponent

`ComputeComponent` observes router navigation events and derives the selection target from the current URL.

Conceptually:

```ts id="3ljc7p"
this.router.events
  .pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.buildSelectionContext()),
  )
  .subscribe((context) => {
    this.selectionTarget = context
  })
```

The component therefore acts as the boundary between:

```text id="kdrk17"
URL representation
        ↓
Domain selection context
```

This keeps URL parsing out of the Tree component.

## Responsibility of ComputeTreeComponent

`ComputeTreeComponent` receives the selection target:

```ts id="mkr4q8"
readonly selectionTarget = input<ComputeSelectionContext | null>(null)
```

When the target changes, the Tree attempts to synchronize its state.

The synchronization process is:

```text id="m1eqi8"
selectionTarget
      │
      ▼
Is target already loaded?
      │
   ┌──┴──┐
  Yes    No
   │      │
   ▼      ▼
Select   Find parent
          │
          ▼
       Expand parent
          │
          ▼
       Load children
          │
          ▼
       Find target
          │
          ▼
        Select
```

## Lazy Tree Restoration

Because the Compute Tree uses lazy loading, the target node may not exist in the current tree data.

For example:

```text id="x0zv3n"
URL target:

ROW-001

Current tree:

Pod
├── Virtual Pool
└── Physical Pool
```

The Tree must first load:

```text id="ub4y7m"
Physical Pool
└── Row
    └── ROW-001
```

Only after `ROW-001` has been loaded can it be selected.

The restoration mechanism therefore controls both:

* `expandedKeys`
* `selectedKey`

## Example: Row Restoration

For:

```text id="ryb2bl"
/compute/pod/physical-pool/row/ROW-001/physical-assets
```

the restoration flow is:

```text id="6xqz8j"
URL
 │
 ▼
selectionTarget
 │
 │ kind = row
 │ id = ROW-001
 ▼
ComputeTreeComponent
 │
 ▼
Find Physical Pool
 │
 ▼
Expand Physical Pool
 │
 ▼
Load Physical Pool children
 │
 ▼
Find ROW-001
 │
 ▼
Select ROW-001
```

The resulting Tree state is:

```text id="by7l7r"
Pod
├── Virtual Pool
└── Physical Pool  ← expanded
    ├── Row 1
    └── ROW-001    ← selected
```

## URL and Tree Are Kept in Sync

There are two complementary directions in the Compute architecture.

### Tree → URL

Handled by Tree Selection Navigation:

```text id="eobx1u"
Tree
 ↓
Selection
 ↓
Navigation
 ↓
URL
```

### URL → Tree

Handled by URL Selection Restoration:

```text id="6b5z1s"
URL
 ↓
Selection Target
 ↓
Tree Restoration
 ↓
Selection
```

Together:

```text id="h3w6z9"
             URL
           ↙     ↘
          ↙       ↘
       Tree       Tree
    Selection   Restoration
          ↘       ↙
           Selection
```

The URL therefore becomes a stable representation of the current navigational state.

## Browser Navigation

The restoration mechanism also handles browser navigation.

For example:

```text id="7y4n6h"
Page A
  ↓
Page B
  ↓
Page C
```

When the user presses Back:

```text id="5i5v0v"
Page C
  ↓
Browser Back
  ↓
NavigationEnd
  ↓
buildSelectionContext()
  ↓
selectionTarget
  ↓
Tree restoration
```

The Tree can therefore restore its selection based on the URL without requiring the user to click the Tree again.

## Selection Service Integration

After the target node has been found, the restored node should update the shared selection state.

Conceptually:

```ts id="q1v3kf"
this.selectionService.select(targetNode.data)
this.selectedKey.set(targetNode.key)
```

This ensures that both user-driven selection and URL-driven selection eventually produce the same application state.

Therefore, downstream consumers such as `ComputeSystemsPageComponent` do not need to know whether the selection originated from:

* Tree click
* Direct URL
* Browser navigation
* Tree Search

They only consume:

```ts id="2o8u0a"
selectionService.selected()
```

## Avoid Direct Router Coupling in the Tree

The Tree should not inspect URLs directly.

Avoid:

```ts id="s8jj8s"
ComputeTreeComponent
  → Router
  → parse URL
  → load nodes
```

Instead:

```text id="f8x7wq"
Router
  ↓
ComputeComponent
  ↓
ComputeSelectionContext
  ↓
ComputeTreeComponent
```

This keeps the Tree reusable and prevents URL structure from leaking into the Tree implementation.

## Relationship with Resource-Based Routing

URL Selection Restoration and Resource-Based Routing solve different problems.

### URL Selection Restoration

Answers:

> Given this URL, which Tree node should be selected?

```text id="3x8q2a"
URL
 ↓
Tree Selection
```

### Resource-Based Routing

Answers:

> Given a resource ID, how do we resolve and construct its canonical URL?

```text id="p3d4c1"
Resource ID
 ↓
Ancestor Resolution
 ↓
Route Builder
 ↓
Canonical URL
```

They should remain separate responsibilities.

## Consequences

### Positive

* Direct URLs restore the correct Tree selection
* Browser Back / Forward works naturally
* Page refresh does not lose Tree context
* Lazy-loaded Tree nodes can still be restored
* Tree remains independent from URL parsing
* Downstream pages consume a consistent Selection state
* URL-driven and Tree-driven navigation converge on the same application state

### Negative

* URL changes require synchronization between Router and Tree
* Lazy restoration introduces asynchronous loading complexity
* URL parsing must remain synchronized with the application's routing structure

## Decision Summary

The Compute application treats the URL as a source of navigational state and restores the corresponding Tree selection through a `ComputeSelectionContext`.

The restoration flow is:

```text id="2q8z5x"
URL
 ↓
ComputeComponent
 ↓
ComputeSelectionContext
 ↓
ComputeTreeComponent
 ↓
Expand / Load
 ↓
Select Node
 ↓
ComputeSelectionService
```

This provides a consistent **URL → Tree** restoration mechanism while keeping URL parsing, Tree behavior, and selection state as separate responsibilities.
