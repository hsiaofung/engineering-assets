# Feature-Based Folder Structure

## Status

Accepted

## Context

The Compute domain contains multiple responsibilities that are closely related but have different purposes, including:

- Compute Tree
- Tree Selection
- Navigation
- Resource Routing
- User-facing Pages
- Technical Documentation

As the Compute feature grows, organizing files by technical type such as `components`, `services`, `pages`, and `models` would distribute related code across multiple directories.

For example, implementing Tree Selection may require changes to a component, service, routing logic, and models located in different technical folders. This makes the domain structure harder to discover and increases the effort required to understand and maintain the feature.

## Decision

The Compute domain adopts a **feature/responsibility-based folder structure**.

The directory structure is organized around domain responsibilities rather than technical types.

```text
compute/
├── doc/
├── navigation/
├── pages/
├── routing/
├── selection/
└── tree/
```

### Responsibilities

| Directory     | Responsibility                                                      |
| ------------- | ------------------------------------------------------------------- |
| `doc/`        | Technical documentation and design decisions                        |
| `navigation/` | Navigation coordination and navigation-related logic                |
| `pages/`      | User-facing Compute pages                                           |
| `routing/`    | Resource routing, URL construction, guards, and ancestor resolution |
| `selection/`  | Compute tree selection state and selection context                  |
| `tree/`       | Compute tree UI, data loading, and tree-specific models             |

## Rationale

### 1. High Cohesion

Code that belongs to the same responsibility is kept together.

For example:

```text
selection/
├── compute-selection.service.ts
└── compute-selection-context.model.ts
```

The selection state and its related model can be understood and maintained together.

### 2. Better Discoverability

The directory structure represents the Compute domain architecture.

A developer can determine where to look based on the responsibility:

- Tree behavior → `tree/`
- Selection state → `selection/`
- Navigation → `navigation/`
- Resource URL behavior → `routing/`
- User-facing page → `pages/`

This reduces the need to understand the technical type of a file before locating it.

### 3. Easier Maintenance

Related changes are more likely to remain within the same feature area.

For example, changes to Tree Selection can primarily remain within:

```text
selection/
```

rather than being distributed across:

```text
components/
services/
models/
routing/
```

### 4. Supports Feature Growth

The structure allows new Compute responsibilities to be added without creating large generic folders.

For example, when Tree Search is implemented:

```text
compute/
└── search/
```

can be added as an independent responsibility.

## Alternatives Considered

### Technical-Type-Based Structure

```text
compute/
├── components/
├── pages/
├── services/
└── models/
```

This structure was rejected for the Compute domain because related domain logic would be distributed across multiple directories.

For example:

```text
components/
services/
models/
routing/
```

may all need to be inspected to understand one feature such as Tree Selection.

### Feature/Responsibility-Based Structure

```text
compute/
├── navigation/
├── pages/
├── routing/
├── selection/
└── tree/
```

This structure was selected because it provides stronger cohesion and better represents the domain architecture.

## Architectural Guidelines

### Keep Responsibilities Focused

Each directory should represent a clear Compute responsibility.

Avoid creating directories only because a file belongs to a particular technical type.

For example, do not create:

```text
services/
```

only to collect all services.

Instead, place a service with the responsibility it implements:

```text
selection/
└── compute-selection.service.ts
```

or:

```text
tree/
└── compute-tree.service.ts
```

### Avoid Premature Directories

Create a new responsibility directory only when the responsibility actually exists.

For example, `search/` should be introduced when Tree Search is implemented rather than creating an empty directory in advance.

### Keep Related Tests Close to Their Implementation

Tests should remain with the responsibility they belong to.

For example:

```text
selection/
├── compute-selection.service.ts
└── compute-selection.service.spec.ts
```

and:

```text
tree/
├── compute-tree.component.ts
└── compute-tree.component.spec.ts
```

## Consequences

### Positive

- Higher cohesion between related code
- Easier code discovery
- Clearer domain boundaries
- Easier maintenance as Compute grows
- Directory structure communicates architectural intent
- New responsibilities can be introduced independently

### Negative

- Developers must understand the responsibility of a file rather than simply its technical type
- Some files may not fit perfectly into a single responsibility
- The structure requires discipline to prevent responsibilities from becoming mixed

## Decision Summary

The Compute domain uses a **feature/responsibility-based folder structure** because the Compute feature contains multiple interacting domain responsibilities.

The goal is to make the folder structure reflect the architecture of the Compute domain rather than the implementation technology of individual files.
