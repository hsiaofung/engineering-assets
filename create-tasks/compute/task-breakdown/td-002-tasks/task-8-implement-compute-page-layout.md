可以，這個任務的核心不是「改 CSS」，而是 **重構 Compute Page layout，導入 `TreeViewV1Container`，並整理語意化的 layout 結構**。

### Task Title

**Refactor Compute Page Layout with TreeViewV1Container**

### Description

Refactor the Compute page layout to use the shared `TreeViewV1ContainerComponent` and establish a clear semantic page structure.

**Scope:**

* Use `TreeViewV1ContainerComponent` as the container for the Compute tree and navigation view.
* Keep `ComputeTreeComponent` responsible for Compute-specific tree data, loading, lazy loading, and node selection.
* Keep navigation view as a sibling slot of the tree because navigation content varies by selected Compute resource level.
* Replace generic utility classes such as `flex`, `column`, `grow`, `w-100`, and `padding-24` with semantic Compute page layout classes.
* Remove unused CSS selectors and redundant layout wrappers.
* Override the container height at the Compute page level from `100vh` to `100%` to prevent unnecessary page-level scrolling, without modifying the shared `TreeViewV1ContainerComponent`.

### Target Structure

```text
ComputePage
├── sidebar
│   └── TreeViewV1Container
│       ├── ComputeTree
│       └── ComputeNavigation
│
└── main
    ├── Breadcrumbs
    ├── Content
    │   └── RouterOutlet
    └── Footer
```

### Acceptance Criteria

* [ ] Compute page uses `TreeViewV1ContainerComponent`.
* [ ] Compute tree is projected through `appTv1ContainerTree`.
* [ ] Navigation view is projected through `appTv1ContainerNav`.
* [ ] `ComputeTreeComponent` remains responsible for Compute tree logic.
* [ ] Tree and navigation remain siblings under the same container.
* [ ] Page layout uses semantic CSS class names.
* [ ] Redundant utility classes and unused selectors are removed.
* [ ] `TreeViewV1ContainerComponent` itself is not modified.
* [ ] Compute page overrides the container height to `100%`.
* [ ] No unnecessary vertical scrollbar is introduced by the tree container.
* [ ] Existing tree selection and routing behavior remain unchanged.
