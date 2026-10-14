以下是依你提供的 `createDataTableState` 原始碼與單元測試整理的中文使用手冊。

---

# Data Table State 使用手冊

`createDataTableState` 是一個以 Angular `signal` 實作的資料表格狀態工廠函式，用來集中管理分頁、排序、篩選，並提供對應的事件處理函式。當排序或篩選改變時，會自動把頁碼重設為第 1 頁，避免使用者停留在已不存在的頁面。

適用情境：與 `@app/shared/design-system/global-component/data-table-v1` 搭配，把表格 UI 事件轉成可被查詢／載入資料邏輯消費的反應式狀態。

---

## 1. 匯入

```ts
import { createDataTableState, type DataTableState } from './create-data-table-state'

import {
  FilterChangeEvent,
  FilterState,
  PageChangeEvent,
  SortChangeEvent,
  SortState,
} from '@app/shared/design-system/global-component/data-table-v1'
```

實際路徑請依專案結構調整。

---

## 2. 設計概念

| 項目 | 說明 |
|------|------|
| 狀態來源 | 全部用 `signal`，可直接綁定模板或 `effect` / `computed` / `resource` |
| 預設值 | `page = 1`、`pageSize = 10`、排序欄位為 `null`、方向為 `'asc'`、篩選為空物件 |
| 頁碼重設 | 排序或篩選變更時呼叫 `resetPage()`，將 `page` 設為 `1` |
| 分頁變更 | 只更新 `page` 與 `pageSize`，不重設排序或篩選 |
| 資料載入 | 本函式**不負責打 API**；請在元件中監聽上述 signal，再觸發 loader / query |

註解中提到的「bound loader refresh」是建議的使用方式：把回傳的 handlers 綁到表格元件，再在 `effect` 裡依 `page`、`pageSize`、`sortState`、`filterState` 重新載入資料。

---

## 3. API

### 3.1 選項 `DataTableStateOptions`

```ts
export interface DataTableStateOptions {
  page?: number
  pageSize?: number
  sort?: SortState
  filters?: FilterState
}
```

| 欄位 | 預設值 | 說明 |
|------|--------|------|
| `page` | `1` | 初始頁碼（通常從 1 開始） |
| `pageSize` | `10` | 每頁筆數 |
| `sort` | `{ column: null, direction: 'asc' }` | 初始排序 |
| `filters` | `{}` | 初始篩選條件 |

### 3.2 工廠函式

```ts
function createDataTableState(options?: DataTableStateOptions): DataTableState
```

可傳入空物件或不傳參數，使用全部預設值。

### 3.3 回傳值 `DataTableState`

| 成員 | 型別 | 說明 |
|------|------|------|
| `page` | `WritableSignal<number>` | 目前頁碼 |
| `pageSize` | `WritableSignal<number>` | 每頁筆數 |
| `sortState` | `WritableSignal<SortState>` | 目前排序 |
| `filterState` | `WritableSignal<FilterState>` | 目前篩選 |
| `resetPage` | `() => void` | 將頁碼設為 `1` |
| `onPageChange` | `(event: PageChangeEvent) => void` | 分頁事件處理 |
| `onSortChange` | `(event: SortChangeEvent) => void` | 排序事件處理（會重設頁碼） |
| `onFilterChange` | `(event: FilterChangeEvent) => void` | 篩選事件處理（會重設頁碼） |

事件物件形狀（依測試與命名推斷，實際以 `data-table-v1` 型別為準）：

```ts
// PageChangeEvent
{ currentPage: number; pageSize: number }

// SortChangeEvent / SortState
{ column: string | null; direction: 'asc' | 'desc' }

// FilterChangeEvent
{ filters: FilterState; changedColumn: string }

// FilterState
// 通常為 Record<string, unknown>，例如 { ipv4: '10.184.24.5' }
```

---

## 4. 基本用法

### 4.1 使用預設值

```ts
const table = createDataTableState()

table.page()      // 1
table.pageSize()  // 10
table.sortState() // { column: null, direction: 'asc' }
table.filterState() // {}
```

### 4.2 指定初始排序／分頁

```ts
const table = createDataTableState({
  page: 1,
  pageSize: 20,
  sort: { column: 'location', direction: 'asc' },
  filters: { status: 'active' },
})
```

### 4.3 在元件中建立並綁定表格

```ts
import { Component, effect } from '@angular/core'
import { createDataTableState } from './create-data-table-state'

@Component({
  // ...
  template: `
    <app-data-table-v1
      [sortState]="table.sortState()"
      [filterState]="table.filterState()"
      [page]="table.page()"
      [pageSize]="table.pageSize()"
      (pageChange)="table.onPageChange($event)"
      (sortChange)="table.onSortChange($event)"
      (filterChange)="table.onFilterChange($event)"
    />
  `,
})
export class ExampleListComponent {
  readonly table = createDataTableState({
    pageSize: 20,
    sort: { column: 'createdAt', direction: 'desc' },
  })

  constructor() {
    effect(() => {
      const query = {
        page: this.table.page(),
        pageSize: this.table.pageSize(),
        sort: this.table.sortState(),
        filters: this.table.filterState(),
      }
      // 在此呼叫 API / resource / store
      void this.loadItems(query)
    })
  }

  private async loadItems(_query: unknown) {
    // 實作資料載入
  }
}
```

模板上的輸入／輸出名稱請改成你們 `data-table-v1` 實際提供的 API。重點是：**狀態用 signal 讀取，事件用回傳的 `onXxxChange` 處理。**

---

## 5. 事件行為

### 5.1 分頁 `onPageChange`

- 寫入 `event.currentPage` → `page`
- 寫入 `event.pageSize` → `pageSize`
- **不會**重設排序或篩選

```ts
table.onPageChange({ currentPage: 2, pageSize: 20 })
// page === 2, pageSize === 20
```

切換每頁筆數時，建議由表格元件一併帶上合理的 `currentPage`（例如回到第 1 頁）。本函式本身不會在 `pageSize` 改變時自動重設頁碼。

### 5.2 排序 `onSortChange`

- 以整個 `event` 覆寫 `sortState`
- 接著 `resetPage()`，`page` 變為 `1`

```ts
table.page.set(3)
table.onSortChange({ column: 'location', direction: 'desc' })
// sortState === { column: 'location', direction: 'desc' }
// page === 1
```

### 5.3 篩選 `onFilterChange`

- 以 `event.filters` 覆寫整個 `filterState`（不是合併單一欄位）
- 接著 `resetPage()`，`page` 變為 `1`

```ts
table.page.set(3)
table.onFilterChange({
  filters: { ipv4: '10.184.24.5' },
  changedColumn: 'ipv4',
})
// filterState === { ipv4: '10.184.24.5' }
// page === 1
```

注意：`changedColumn` 目前**未被狀態函式使用**，僅方便表格或日誌標示「哪一欄剛變」。實際條件以完整的 `filters` 為準。

### 5.4 手動重設頁碼

```ts
table.resetPage() // page = 1
```

排序／篩選 handler 內部已會呼叫，一般不需再手動呼叫，除非你有額外條件（例如外部清空關鍵字）。

---

## 6. 與資料載入的搭配建議

狀態變更後要重新查詢時，請讓 loader 同時讀取四個 signal，避免漏掉依賴：

```ts
effect(() => {
  const page = table.page()
  const pageSize = table.pageSize()
  const sort = table.sortState()
  const filters = table.filterState()

  load({ page, pageSize, sort, filters })
})
```

若使用 Angular `resource` / `httpResource`，把上述值放進 `params` 或 `request` 即可。

建議查詢參數對應方式：

| 前端狀態 | 常見後端參數 |
|----------|----------------|
| `page` | `page` 或 `offset = (page - 1) * pageSize` |
| `pageSize` | `pageSize` / `limit` |
| `sort.column` + `sort.direction` | `sortBy` + `order` |
| `filterState` | query string 或 request body 的 filter 物件 |

---

## 7. 常見使用模式

### 7.1 在列表頁只建立一份狀態

同一個列表只呼叫一次 `createDataTableState()`，不要在每次 CD 週期重建，否則頁碼與篩選會被重設。

放在欄位初始化即可：

```ts
readonly table = createDataTableState({ pageSize: 25 })
```

### 7.2 從 URL 還原狀態

若要支援可分享連結，可在建立時把 query string 轉成 options：

```ts
const table = createDataTableState({
  page: Number(params['page'] ?? 1),
  pageSize: Number(params['pageSize'] ?? 10),
  sort: {
    column: params['sort'] ?? null,
    direction: (params['dir'] as 'asc' | 'desc') ?? 'asc',
  },
  filters: parseFilters(params),
})
```

寫回 URL 時同樣監聽這四個 signal。

### 7.3 清空篩選

因為 `onFilterChange` 是整份覆寫，清空時請傳空物件（或表格組件產出的空 filters）：

```ts
table.onFilterChange({ filters: {}, changedColumn: '' })
```

不要期望它會自動把單一欄位設回 `undefined` 卻保留其他欄；合併邏輯應由表格元件或呼叫端完成。

### 7.4 直接改 signal

`page`、`pageSize`、`sortState`、`filterState` 都是可寫 signal，測試或程式也可直接 `set`：

```ts
table.page.set(3)
```

正式流程仍建議走 `onPageChange` / `onSortChange` / `onFilterChange`，才能保有「排序／篩選會回到第一頁」的約定。

---

## 8. 行為對照（與測試一致）

| 操作 | 預期結果 |
|------|----------|
| 不傳 options | `page = 1`，`pageSize = 10` |
| 傳入 `sort` | `sortState` 等於傳入值 |
| `onFilterChange` | 更新 `filterState`，`page` 變 `1` |
| `onSortChange` | 更新 `sortState`，`page` 變 `1` |
| `onPageChange` | 更新 `page` 與 `pageSize` |

---

## 9. 注意事項

1. **型別來源在 design system**：`SortState`、`FilterState` 與事件型別以 `data-table-v1` 為準，本檔只組裝狀態。
2. **沒有 total / data**：總筆數、列資料、loading、error 應由呼叫端的 loader 管理。
3. **沒有 debounce**：若篩選是即時輸入，請在表格或呼叫端做 debounce，再呼叫 `onFilterChange`。
4. **篩選是整份替換**：傳入的 `event.filters` 會成為新的 `filterState`。
5. **頁碼慣例**：預設從 `1` 開始；若後端用 0-based，轉換放在 loader，不要改這個工廠的語意。
6. **泛型註解**：JSDoc 有 `@template T`，但實作未使用 `T`。列資料型別請在元件或 loader 自行標註。

---

## 10. 最小完整範例（查詢參數組裝）

```ts
import { computed } from '@angular/core'
import { createDataTableState } from './create-data-table-state'

const table = createDataTableState({
  pageSize: 10,
  sort: { column: 'location', direction: 'asc' },
})

const queryParams = computed(() => ({
  page: table.page(),
  pageSize: table.pageSize(),
  sortColumn: table.sortState().column,
  sortDirection: table.sortState().direction,
  ...table.filterState(),
}))
```

把 `queryParams()` 交給 HTTP client 即可與表格操作同步。

---

若需要，我可以再依你們實際的 `data-table-v1` 模板 selector／Input／Output 名稱，改成可直接貼進專案的元件範例，或匯出成 Word / Markdown 檔。