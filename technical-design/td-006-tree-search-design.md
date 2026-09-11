Tree Search Technical Design

## Goal

Allow users to search Compute Tree resources and locate the
corresponding node in the Tree.

## Architecture

TreeSearchComponent
    ↓
TreeSearchService
    ↓
Tree Search API
    ↓
TreeSearchResult[]
    ↓
TreeComponent

## TreeSearchComponent

Responsibilities:
- Provide search type selection.
- Accept search input.
- Trigger search.
- Display search results.
- Notify Tree when a search result is selected.

## TreeSearchService

Responsibilities:
- Call the Tree Search API.
- Map API response to TreeSearchResult.
- Manage search request state.

## Search Result

The search result follows the backend API response.

Example:

{
  "id": "ROW-xxx",
  "location": "row1",
  "isLeaf": false
}

## Tree Integration

When a search result is selected:

1. Pass the selected TreeSearchResult to TreeComponent.
2. TreeComponent locates the corresponding Tree node.
3. Expand required Tree nodes if necessary.
4. Select / highlight the target node.
5. Continue using the existing Tree navigation behavior.

## Responsibility Boundary

TreeSearchComponent
- Search UI
- Search API interaction
- Search result display

TreeComponent
- Tree state
- Tree node locating
- Tree expansion
- Tree node selection
- Existing Tree navigation

TreeSearch does not maintain a separate Tree state
and does not implement a separate navigation mechanism.

## Dependencies

- Backend Tree Search API contract
- Q-010: Search UI / behavior defined by UX