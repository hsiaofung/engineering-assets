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

| Module | Responsibility |
| --- | --- |
| `createDataTableState` | Holds current sort, page, and filters. Default sort is configured here. |
| `toTableQueryParams` | Reads that state and builds `HttpParams`. Optional column config maps UI keys to API sort and filter keys. |
| `appendFilterParams` | Encodes filters. String filters default to `ilike`. |
| `data-loader` / poll | Calls `getFn` and exposes data, loading, and error. |

## File location

```
@app/shared/design-system/global-component/data-table-params/append-filter-params.ts
@app/shared/design-system/global-component/data-table-params/data-table-params.ts

```

```ts
import { toTableQueryParams } from '@app/shared/design-system/global-component/data-table-params/data-table-params'
```

Keep this helper next to `append-filter-params`.  

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
    .get<ComputeDrivesApiResponse>(computeApiURL.drives(systemId), {
      params: toTableQueryParams(this.tableState, driveColumns),
    })
    .pipe(toLocalStorageUiModel())
}
```

For processors, change the URL and use `{ sort: { column: 'socket', direction: 'asc' } }`.

## Column query overrides

Pass a column map when Swagger does not use the default string filter or sort key. Unlisted columns stay `ilike`.

| Setting | Effect |
| --- | --- |
| `filterOperator: 'eq'` | Sends `eq.{value}` |
| `filterOperator: 'raw'` | Sends the value with no operator |
| `filterOperator: 'ilike'` | Default. Sends `ilike.{value}` |
| `filterable: false` | Omits that filter from the query |
| `sortKey` | Renames the sort field only |

| Page | Column | Setting |
| --- | --- | --- |
| processor | `core` | `{ filterOperator: 'eq' }` |
| gpu | `lanes` | `{ filterOperator: 'eq' }` |
| drives | `source` | `{ filterOperator: 'raw' }` — `RAID`, `HBA`, or `NVME` |
| drives | `capacity` | `{ filterable: false, sortKey: 'capacityGib' }` |
| drives | `capableSpeed` | `{ filterable: false }` |
| memory | `size` | `{ filterable: false }` |

```ts
const driveColumns = {
  source: { filterOperator: 'raw' as const },
  capacity: { filterable: false, sortKey: 'capacityGib' },
  capableSpeed: { filterable: false },
}

params: toTableQueryParams(this.tableState, driveColumns)
```

Enum filters use a select, not a text input. Columns marked `filterable: false` also set `[filterable]="false"` on the table column.

Sorting Capacity sends `sort=capacityGib`, not `sort=capacity`.

## Inventory list (tree selection)

`toTableQueryParams` only builds sort, page, and filter params.
`unassigned`, `row`, `rack`, and `drawer` stay on the list page. Do not put them in `toTableQueryParams`.

## Wiring loader and table

- Sort, filter, and page events update `tableState` only.
- `getFn` reads the latest state and calls `toTableQueryParams`.
- Use `(reload)="dataLoader.refresh()"`.
- Do not build query strings in the template.

Example query:

```
?sort=capacityGib&direction=asc&page=1&perPage=10&source=RAID
```

Date ranges still become `gte` / `lte`. Other non-string filters are sent with `String(value)`.

## Do not

- Hand-write `.set('sort')` / `.set('page')` inside each `getFn`
- Put `unassigned` / `row` / `rack` / `drawer` in `toTableQueryParams`
- Place this file under shared `data-table-state`
- Add `withSort` helpers; default columns belong in `createDataTableState({ sort })`
- Send `ilike` for enum fields, or `capacity` as the drives sort key
