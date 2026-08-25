# Tree Responsibility Boundaries

- **Models** → Define the data structures used by the tree.
- **Mapper** → Responsible for transforming data between different formats.
- **Services**
  - **API** → Responsible for communicating with the backend API.
  - **Loader** → Responsible for loading tree data.
  - **Node Operations** → Responsible for operating on tree nodes.
  - **Selection Resolver** → Responsible for resolving the selection context into the tree hierarchy.
