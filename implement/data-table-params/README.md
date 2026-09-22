# data-table-params

Turns `data-table-state` into HTTP query parameters for compute list APIs.

It does not load data, poll, or apply tree-selection filters.

## Responsibilities

```

table interaction
→ data-table-state sort / page / filter
→ toTableQueryParams HttpParams
→ data-loader getFn http.get(url, { params })
→ data-loader-poll optional refresh

```

| Module                  | Responsibility                                                          |
| ----------------------- | ----------------------------------------------------------------------- |
| `createDataTableState`  | Holds current sort, page, and filters. Default sort is configured here. |
| `toTableQueryParams`    | Reads that state and builds `HttpParams`.                               |
| `appendSelectionParams` | Adds tree-selection filters. Use only on the compute inventory list.    |
| `data-loader` / poll    | Calls `getFn` and exposes data, loading, and error.                     |

## File location

```

compute/api/append-filter-params.ts
compute/api/data-table-params.ts
compute/api/append-selection-params.ts

```

```ts
import { toTableQueryParams } from '@app/core-modules-scc4/compute/api/data-table-params'
```

Keep this helper next to `append-filter-params`. Do not move it into shared `data-table-state`; it depends on compute filter encoding.

## Resource pages (processor, memory, local-storage)

Set the default sort in `createDataTableState`. Delete per-page `buildQueryParams()` methods.

```ts
readonly tableState = createDataTableState({
  sort: { column: 'controllerId', direction: 'asc' },
})

readonly getDrives = (): Observable<ComputeLocalStorageUiModel> => {
  const systemId = this.selectionService.selected()?.id
  if (!systemId) {
    throw new Error('System selection is not ready')
  }

  return this.http
    .get<ComputeDrivesApiResponse>(computeApiURL.drives(`eq.${systemId}`), {
      params: toTableQueryParams(this.tableState),
    })
    .pipe(toLocalStorageUiModel())
}
```

For processors, change the URL and use `{ sort: { column: 'socket', direction: 'asc' } }`.

## Inventory list (tree selection)

Compose table params first, then selection params:

```ts
params: appendSelectionParams(selection, toTableQueryParams(this.tableState))
```

`appendSelectionParams` owns `virtual-pool`, `physical-pool`, `row`, `rack`, and `drawer`. Do not fold those cases into `toTableQueryParams`.

## Wiring loader and table

- Sort, filter, and page events update `tableState` only.
- `getFn` reads the latest state and calls `toTableQueryParams`.
- Use `(reload)="dataLoader.refresh()"`.
- Do not build query strings in the template.

Example query:

```
?sort=controllerId&direction=asc&page=1&perPage=10&health=eq.OK
```

Filter key encoding follows `appendFilterParams`.

## Do not

- Hand-write `.set('sort')` / `.set('page')` inside each `getFn`
- Put `unassigned` / `row` / `rack` / `drawer` in `toTableQueryParams`
- Place this file under shared `data-table-state`
- Add `withSort` helpers; default columns belong in `createDataTableState({ sort })`
