# Tree Selection Navigation

## Status

Accepted

## Context

The Compute page provides a hierarchical tree for navigating between different Compute resources, including:

* Pod
* Virtual Pool
* Physical Pool
* Row
* Rack
* Drawer
* System

When a user selects a node in the Compute Tree, two different concerns need to be handled:

1. The application needs to remember which Compute resource is currently selected.
2. The application needs to navigate to the page represented by that resource.

These concerns are related but should not be implemented in the same service.

If Tree selection directly performs routing, the Tree component becomes responsible for navigation behavior. This makes the Tree tightly coupled to the URL structure and makes the selection state harder to reuse.

## Decision

Adopt a **Tree Selection → Selection State → Navigation** flow.

The Compute Tree emits the selected node to `ComputeComponent`.

`ComputeComponent` coordinates the two operations:

```text
Tree
 │
 │ nodeSelect
 ▼
ComputeComponent
 │
 ├───────────────┐
 │               │
 ▼               ▼
Selection      Navigation
Service        Service
 │               │
 ▼               ▼
Selection       URL
State
```

The Tree itself does not perform application navigation.

## Responsibilities

### ComputeTreeComponent

`ComputeTreeComponent` is responsible for:

* Rendering the Compute Tree
* Loading tree data
* Managing tree expansion
* Managing visual selection
* Emitting the selected `ComputeTreeNode`

It does not decide which URL should be used.

Example:

```ts
protected onNodeClick(treeNode: TreeNode<ComputeTreeNode>): void {
  const node = treeNode.data

  if (!node) {
    return
  }

  this.selectedKey.set(node.id)
  this.nodeSelect.emit(node)
}
```

The Tree only reports:

> "The user selected this node."

### ComputeSelectionService

`ComputeSelectionService` is responsible for maintaining the current Compute selection.

Its responsibility is state management, not navigation.

Conceptually:

```ts
selectionService.select(node)
```

stores:

```ts
{
  kind,
  id,
  name
}
```

Consumers can access the current selection through:

```ts
selectionService.selected()
```

The Selection Service must not depend on Angular Router.

### ComputeNavigationService

`ComputeNavigationService` is responsible for navigating to the page represented by a Compute tree node.

Conceptually:

```ts
navigationService.navigate(node)
```

The Navigation Service determines the appropriate navigation flow and delegates URL construction to the routing layer where necessary.

The Navigation Service must not become the source of truth for selection state.

### ComputeComponent

`ComputeComponent` acts as the coordinator between Tree Selection and Navigation.

The normal Tree selection flow is:

```ts
protected onTreeNodeSelect(node: ComputeTreeNode): void {
  this.computeSelectionService.select(node)
  this.computeNavigation.navigate(node)
}
```

This keeps the Tree component independent from application navigation.

## Selection and Navigation Are Separate Concerns

The following two operations must remain conceptually independent:

```text
Selection
    ↓
Who is currently selected?

Navigation
    ↓
Which page should be displayed?
```

For example, a Tree node can be selected without necessarily requiring navigation in every future use case.

Similarly, navigation can occur through mechanisms other than Tree selection, such as:

* Direct URL access
* Resource links
* Application actions

Therefore, Selection and Navigation should not be merged into a single service.

## Interaction Flow

The standard Tree selection flow is:

```text
User clicks Tree node
        │
        ▼
ComputeTreeComponent
        │
        │ nodeSelect
        ▼
ComputeComponent
        │
        ├──────────────────────┐
        │                      │
        ▼                      ▼
ComputeSelectionService   ComputeNavigationService
        │                      │
        ▼                      ▼
selected()                    URL
```

The Systems Page can then consume the current selection:

```text
ComputeSelectionService
        │
        ▼
ComputeSystemsPage
        │
        ▼
Build API Query
```

For example:

```text
Physical Pool
      ↓
unassigned=false

Virtual Pool
      ↓
unassigned=true

Row
      ↓
row=<row name>

Rack
      ↓
rack=<rack name>
```

## Why the Tree Does Not Navigate Directly

The following approach is intentionally avoided:

```text
ComputeTreeComponent
        │
        ▼
Router.navigate(...)
```

This would make the Tree aware of:

* URL structure
* route segments
* resource routing rules
* page destinations

As a result, changes to routing would require changes to the Tree component.

Instead:

```text
ComputeTreeComponent
        │
        ▼
nodeSelect
        │
        ▼
ComputeComponent
        │
        ▼
ComputeNavigationService
```

This keeps the Tree focused on Tree behavior.

## Relationship with URL Selection Restoration

Tree Selection Navigation handles the direction:

```text
Tree → Selection → Navigation → URL
```

URL Selection Restoration handles the opposite direction:

```text
URL → Selection → Tree
```

These are complementary flows and should not be implemented as the same mechanism.

```text
             ┌──────────────────────┐
             │   Compute Selection  │
             │       Service        │
             └──────────┬───────────┘
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
       Tree → URL              URL → Tree
       Navigation             Restoration
```

The Selection Service therefore acts as the shared selection state between the two directions.

## Relationship with Resource-Based Routing

Resource-Based Routing is a separate concern.

Tree selection navigation answers:

> Which Compute page should the selected tree node open?

Resource-Based Routing answers:

> How should a resource be represented and resolved in the application URL?

For example:

```text
Tree Node
   ↓
Navigation Service
   ↓
Route Builder
   ↓
Canonical Resource URL
```

Resource resolution, ancestor lookup, and route guards remain within the `routing/` responsibility.

## Consequences

### Positive

* Tree component remains independent from routing
* Selection state has a single source of truth
* Navigation logic is centralized
* URL structure can change without modifying the Tree
* Selection can be reused by Systems Page and other consumers
* Tree Search can reuse the same selection and navigation flow

### Negative

* The flow contains additional coordination through `ComputeComponent`
* Developers must understand the distinction between Selection and Navigation
* A simple Tree click involves multiple responsibilities instead of one direct Router call

## Future Tree Search

Tree Search should reuse the same architecture.

A search result should be converted into a `ComputeTreeNode` and then follow the existing flow:

```text
Tree Search
    │
    ▼
ComputeTreeNode
    │
    ▼
ComputeSelectionService
    │
    ▼
ComputeNavigationService
    │
    ▼
URL
```

Tree Search should not introduce an independent navigation mechanism.

## Decision Summary

The Compute application separates **Tree Selection** from **Navigation**.

`ComputeTreeComponent` is responsible for tree behavior and emits the selected node.

`ComputeSelectionService` owns the current selection state.

`ComputeNavigationService` owns application navigation.

`ComputeComponent` coordinates the Tree selection flow.

This separation keeps responsibilities focused and allows Tree Selection, URL Restoration, and Tree Search to share the same selection state without coupling the Tree directly to routing.
