# Task 1 Implement Common Table Interaction Service

## Purpose:
- Create a reusable table interaction service (TableInteractionService)
- Handle common table (data-table-v1) operations across Compute table pages.
  - sortChange
  - pageChange
  - searchChange
  - reload
- Transform table events into updated table parameters 
- Integrate table interaction handling into table pages
- Trigger DataLoader.refresh() after parameter changes

## Scope:

1. Define Table Interaction Service    

    Implement reusable handlers:    

    - Sorting
    - Pagination
    - Searching
    - Reload 

    Example:
    ```ts
    handleSortChange(
    tableParams: TableParams,
    event: SortChangeEvent
    ): TableParams
    ```

2. Define Parameter Transformation Rules    
    Examples:

    Sort:

    Input:
    ```ts
    {
      column: 'eventTime',
      direction: 'desc'
    }
    ```
    Output:
    ```ts
    {
      page: 1,
      sort: 'eventTime',
      direction: 'desc'
    }
    ```
    Pagination:

    Input:
    ```ts
    {
      pageIndex: 2,
      pageSize: 50
    }
    ```
    Output:
    ```ts
    {
      page: 2,
      pageSize: 50
    }
    ```
3. Integrate with Page Component

    Each table page should:
    ```ts
    onSortChange(event) {

    this.tableParams =
        this.tableInteraction.handleSortChange(
        this.tableParams,
        event
        );

    this.loader.refresh();
    }
    ```
---    

## Out of Scope

這個要寫清楚，避免誤解：

- Data loading implementation
- API request handling
- DataLoader modification
- Table UI component modification

## Acceptance Criteria
- Common table interaction logic is reusable across Compute pages.
- Page components no longer duplicate sorting/pagination/search parameter transformation.
- DataLoader remains responsible only for data loading lifecycle.
- TableInteractionService does not own API calls or loader lifecycle.

## 流程：

```json
data-table-v1 event

        ↓

TableInteractionService

        ↓

new TableParams

        ↓

Component 更新 tableParams

        ↓

loader.refresh()

        ↓

getDataFn 使用最新 tableParams
```
---

## 先確認 data-table-v1 提供哪些事件: 
這個屬於 contract。
```ts
export type TableEvent<T = Record<string, unknown>> =
  | { type: 'sort'; column: string; direction: 'asc' | 'desc' | null }
  | { type: 'filter'; filters: Record<string, unknown> }
  | { type: 'pageChange'; page: number; pageSize: number }
  | { type: 'selectionChange'; selected: T[]; allSelected: boolean }
  | { type: 'rowExpand'; row: T; expanded: boolean }
  | { type: 'rowClick'; row: T }
  | { type: 'cellAction'; row: T; column: string; action: string }
  | { type: 'reload' }
  | { type: 'resize'; column: string; previousWidth: number; width: number }
  | { type: 'columnVisibilityChange'; columns: Record<string, boolean> }
```

## 建立 Table Interaction Service

例如：

```ts
@Injectable()
export class TableInteractionService {

  handleSortChange(
    tableParams: TableParams,
    event: SortChangeEvent
  ): TableParams {

    return {
      ...tableParams,
      page: 1,
      sort: event.column || 'eventTime',
      direction: event.direction || 'desc',
    };
  }


  handlePageChange(
    tableParams: TableParams,
    event: PageChangeEvent
  ): TableParams {

    return {
      ...tableParams,
      page: event.page,
      pageSize: event.pageSize,
    };
  }
}
```


## Event 轉 Query State   
例如：

Pagination

data-table：
```ts
{
 pageIndex: 2,
 pageSize: 50
}
```
轉：
```ts
{
 page: 2,
 limit: 50s84
}
```

## 觸發 Data Loader
```ts
this.queryState.set(newState);

this.dataLoader.reload({
  query: this.queryState()
});
```

## Page Layer Usage
```ts
onSortChange = ({ column, direction }: SortChangeEvent): void => {

  this.tableParams = this.tableInteraction.handleSortChange(
    this.tableParams,
    { column, direction }
  );

  this.loader?.refresh();
};
```

