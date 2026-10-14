# ActionsResponseModalV1 使用指南

> 4.0 共用的「執行結果」modal，逐筆顯示一個動作的結果（Execution Result of …）。
> 取代 3.x 的 `actions-response-modal`。

---

## 目錄

1. [快速開始](#1-快速開始)
2. [什麼時候用](#2-什麼時候用)
3. [API](#3-api)
4. [欄位（Columns）](#4-欄位columns)
5. [Result 欄](#5-result-欄)
6. [開啟與關閉](#6-開啟與關閉)
7. [從批次呼叫組出資料列](#7-從批次呼叫組出資料列)
8. [限制](#8-限制)
9. [測試](#9-測試)

---

## 1. 快速開始

### Import

```ts
import {
  ACTION_RESULT_STATUS_MAP,
  ActionsResponseModalV1Component,
} from '@shared/design-system/global-component/actions-response-modal-v1/actions-response-modal-v1.component'
import type { SimpleTableColumn } from '@shared/design-system/global-component/data-table-v1'
```

### 最小範例

```ts
interface PowerOnResult {
  name: string
  result: string
  reason: string
}

@Component({
  imports: [ActionsResponseModalV1Component],
  template: `
    <app-actions-response-modal-v1
      title="Execution Result of Power On"
      [columns]="resultColumns"
      [data]="results()"
      [visible]="showResult()"
      (closed)="showResult.set(false)"
    />
  `,
})
export class ExamplePage {
  protected readonly resultColumns: SimpleTableColumn<PowerOnResult>[] = [
    { key: 'name', label: 'Name', width: 160 },
    { key: 'result', label: 'Result', width: 110, cellType: 'statusTag', statusMap: ACTION_RESULT_STATUS_MAP },
    { key: 'reason', label: 'Reason', width: 200 },
  ]
  protected readonly results = signal<PowerOnResult[]>([])
  protected readonly showResult = signal(false)
}
```

---

## 2. 什麼時候用

一個動作作用在**一筆或多筆項目**上，而且要**逐筆回報結果**時使用，例如：對勾選的 system 開機、刪除勾選的使用者、啟用排程。

以下情況**不要**用它：

- **只有一則錯誤訊息**：用 Error modal（`scc-warning-modal`）。
- **執行前的確認**：用 `scc-confirm-modal`。
- **使用者要操作的清單**（勾選、篩選、分頁）：在頁面上用 `app-data-table-v1`。

---

## 3. API

Selector：`app-actions-response-modal-v1`

### Inputs

| Input | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `title` | `string` | **必填** | modal 標題，例如 `Execution Result of Add User`。 |
| `columns` | `SimpleTableColumn<T>[]` | **必填** | 表格欄位，見[欄位](#4-欄位columns)。 |
| `data` | `T[]` | `[]` | 每個被操作的項目一列。 |
| `visible` | `boolean` | `false` | modal 是否開啟，由呼叫端控制。 |
| `size` | `'extremely-small' \| 'extra-small' \| 'small' \| 'medium' \| 'large' \| 'extra-large'` | `'small'` | `scc-modal` 的尺寸。欄位多時改用較寬的尺寸。 |

### Outputs

| Output | Payload | 說明 |
| --- | --- | --- |
| `closed` | `void` | 使用者關閉了 modal（按 X 或 Esc）。呼叫端要把 `visible` 設回 `false`。 |

### 匯出

| 名稱 | 說明 |
| --- | --- |
| `ACTION_RESULT_STATUS_MAP` | 常見 Result 欄用的 `statusMap`：`Success` 綠色、`Failed` 紅色。 |

元件是泛型的：`ActionsResponseModalV1Component<T>`。把欄位宣告成 `SimpleTableColumn<你的資料列型別>[]`，`key` 打錯就會在編譯時報錯。

---

## 4. 欄位（Columns）

`columns` 用的是和 data-table-v1 的 `app-simple-table` 相同的 `SimpleTableColumn` 物件，完整欄位見 `DATA-TABLE-V1-GUIDE.zh.md` 第 4 節。結果表格通常只需要這幾個：

| 欄位 | 用途 |
| --- | --- |
| `key` | 要顯示資料列的哪個屬性。 |
| `label` | 表頭文字。 |
| `width` | **相對比例**，不是 px：`app-simple-table` 會把它轉成 `Wfr`，各欄依比例分配 modal 的寬度。沒設 `width` 的欄位只算 `1fr`，旁邊的欄位設 100 以上時會被擠扁，所以**每一欄都要設 width**。 |
| `cellType` | cell 的呈現方式，預設是純文字。 |
| `statusMap` | 值 → 顯示文字與顏色，給 `statusTag` / `tag` / `tagList` 用。 |

### `app-simple-table` 支援的 cell 類型

| `cellType` | 呈現 |
| --- | --- |
| *（不設）* / `text` | 純文字；`null` / `undefined` 顯示 `-`。 |
| `statusTag` | 依 `statusMap` 顯示彩色狀態標籤，Result 欄用這個。 |
| `tag` | 依 `statusMap` 顯示標籤。 |
| `tagList` | 把 `string[]` 顯示成多個標籤。欄寬放不下的會收成「+N More」標籤，滑過去列出其餘的。**要傳 `statusMap`**：對照表裡沒有的值會顯示成沒有底色的文字，看起來不像標籤。 |
| `timestamp` | 日期，預設格式 `yyyy-MM-dd HH:mm:ss`，可用 `dateFormat` 改。 |
| `ip` | IP 位址。 |
| `number` | 數字；`null` 顯示 `-`。 |
| `taskStatus`、`progress` | 與 data-table-v1 相同。 |

`link`、`redirect`、`icon`、`switch` **不會**被 `app-simple-table` 渲染，會退回純文字；結果表格也用不到它們。

---

## 5. Result 欄

大部分結果表格都有一個 Result 欄，值由後端逐筆回傳。後端回的是 `Success` / `Failed` 時，用共用的對照表：

```ts
{ key: 'result', label: 'Result', cellType: 'statusTag', statusMap: ACTION_RESULT_STATUS_MAP }
```

API 用的是其他字眼時，在那個欄位傳自己的對照表，不要去改共用的那份：

```ts
const TASK_RESULT_MAP: Record<string, StatusDef> = {
  Completed: { label: 'Completed', colorType: 'green' },
  Error: { label: 'Error', colorType: 'red' },
}
```

旁邊的 Reason 欄通常在失敗的項目顯示錯誤訊息，成功的顯示 `-`。

---

## 6. 開啟與關閉

**`visible` 由呼叫端控制。** modal 不會自己關閉：它送出 `closed`，由頁面把自己的 signal 設回 `false`。

```ts
protected readonly showResult = signal(false)

onPowerOnDone(results: PowerOnResult[]): void {
  this.results.set(results)
  this.showResult.set(true)
}
```

```html
<app-actions-response-modal-v1 ... [visible]="showResult()" (closed)="showResult.set(false)" />
```

使用者看完結果後，頁面如果要做事（重新載入清單、清除勾選），寫在同一個 `(closed)` handler 裡。

點 modal 外面不會關閉它：執行結果是使用者應該看完再繼續的內容。

---

## 7. 從批次呼叫組出資料列

如果動作是每個項目各打一次 API，要先收齊每一筆的結果（成功或失敗）再開 modal。每個請求各自 catch 錯誤，一筆失敗才不會中斷其他筆：

```ts
runPowerOn(systems: System[]): void {
  const calls = systems.map((system) =>
    this.api.powerOn(system.id).pipe(
      map(() => ({ name: system.name, result: 'Success', reason: '-' })),
      catchError((err: HttpErrorResponse) =>
        of({ name: system.name, result: 'Failed', reason: err.error?.error?.message ?? 'Unknown error' }),
      ),
    ),
  )

  forkJoin(calls).subscribe((results) => {
    this.results.set(results)
    this.showResult.set(true)
  })
}
```

如果後端一次回傳整批、每個項目各有結果，就直接把那個 response 轉成資料列。

---

## 8. 限制

- **沒有分頁、篩選、排序、勾選。** 結果清單看一次就結束；需要這些功能的就不是結果清單。
- **modal 裡沒有操作按鈕。** 看完結果後要做的動作放在頁面上。
- **表格高度隨資料列增加**，由 modal 捲動，沒有固定的表格高度。
- **沒有 `link`／`redirect` 儲存格。** `app-simple-table` 沒有點擊處理。

### 需要更多功能時

**不要**把這個元件擴充成包住 `app-data-table-v1` 的外殼。那樣它的 API 得把 data table 的所有設定都開放出去，就不再是「標題 + 欄位 + 資料」這麼簡單的元件。

- **只有一兩個頁面需要互動**（link／redirect、排序、分頁）：在頁面上用 `scc-modal` + `scc-card-title` + `app-data-table-v1` 自己組，可參考 Admin 的 Edit Role 結果 modal。
  程式碼不多，而且 data-table-v1 的所有功能都用得到（用 `linkHandler` 做 link／redirect、排序、分頁、自訂 cell 模板）。把表格的工具列關掉，讓它看起來仍是結果清單；表格在標題下方留 20px 的 padding，跟其他 modal 一致：

  ```html
  <scc-modal scSize="small" [scVisible]="showResult()" [scMaskClosable]="false" (scOnCancel)="showResult.set(false)">
    <scc-card-title scLabel="Execution Result of Power On" />
    <div class="result-table">
      <app-data-table-v1
        [data]="results()"
        [showToolbar]="false"
        [showFilter]="false"
        [showReload]="false"
        [showDisplay]="false"
      >
        <app-table-column key="name" label="Name" [width]="160" cellType="link" [linkHandler]="openSystem" />
        <app-table-column key="result" label="Result" [width]="110" cellType="statusTag" [statusMap]="resultStatusMap" />
        <app-table-column key="reason" label="Reason" [width]="200" />
      </app-data-table-v1>
    </div>
  </scc-modal>
  ```

  ```ts
  protected readonly resultStatusMap = ACTION_RESULT_STATUS_MAP
  // 用箭頭函式，表格呼叫時 `this` 才會指向頁面。
  protected readonly openSystem = (row: PowerOnResult): void => { /* navigate to the system */ }
  ```

- **多數結果 modal 都需要同一個小功能**：把它補進 `app-simple-table`（像 `tagList` 那樣），這個 modal 就自動具備。**修改 `app-simple-table` 前請先通知 Clover（@CloverH）**，因為它是共用的 design system 元件，這個 modal 以外也有頁面在用（例如 PDU）。

---

## 9. 測試

`scc-modal` 渲染在 CDK overlay 裡，**在 fixture 之外**，所以要讀 `document.body`，不是 `fixture.nativeElement`。modal 的關閉圖示需要 `angular-svg-icon`：

```ts
await TestBed.configureTestingModule({
  imports: [ActionsResponseModalV1Component],
  providers: [
    provideNoopAnimations(),
    SvgIconRegistryService,
    { provide: SvgLoader, useValue: { getSvg: () => of('<svg></svg>') } },
  ],
}).compileComponents()

fixture.componentRef.setInput('visible', true)
await fixture.whenStable()
expect(document.body.textContent).toContain('Execution Result of Power On')
```

要測試頁面對關閉的反應時，用 `By.directive` 找到裡面的 `SCCModalComponent`，對它的 `scOnCancel` 呼叫 `emit()`，不要去點關閉圖示。

Storybook：**Design System / Global Component / Actions Response Modal V1**。
