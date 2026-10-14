# ActionsResponseModalV1 Usage Guide

> The shared 4.0 modal that reports the per-item result of an action — "Execution Result of …".
> Replaces the 3.x `actions-response-modal`.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [When to Use It](#2-when-to-use-it)
3. [API](#3-api)
4. [Columns](#4-columns)
5. [The Result Column](#5-the-result-column)
6. [Opening and Closing](#6-opening-and-closing)
7. [Building the Rows from a Batch Call](#7-building-the-rows-from-a-batch-call)
8. [Limitations](#8-limitations)
9. [Testing](#9-testing)

---

## 1. Quick Start

### Import

```ts
import {
  ACTION_RESULT_STATUS_MAP,
  ActionsResponseModalV1Component,
} from '@shared/design-system/global-component/actions-response-modal-v1/actions-response-modal-v1.component'
import type { SimpleTableColumn } from '@shared/design-system/global-component/data-table-v1'
```

### Minimal Example

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

## 2. When to Use It

Use it after an action that runs on **one or more items** and reports **each item's outcome**: power on selected systems, delete selected users, enable schedules.

Do **not** use it for:

- **A single error message** — use the Error modal (`scc-warning-modal`).
- **Asking before an action** — use `scc-confirm-modal`.
- **A list the user works with** (select, filter, page) — use `app-data-table-v1` on the page.

---

## 3. API

Selector: `app-actions-response-modal-v1`

### Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | **required** | Modal title, e.g. `Execution Result of Add User`. |
| `columns` | `SimpleTableColumn<T>[]` | **required** | The table's columns. See [Columns](#4-columns). |
| `data` | `T[]` | `[]` | One row per item the action touched. |
| `visible` | `boolean` | `false` | Whether the modal is open. The caller owns it. |
| `size` | `'extremely-small' \| 'extra-small' \| 'small' \| 'medium' \| 'large' \| 'extra-large'` | `'small'` | `scc-modal` size preset. Use a wider one when there are many columns. |

### Outputs

| Output | Payload | Description |
| --- | --- | --- |
| `closed` | `void` | The user closed the modal (X button or Esc). Set `visible` back to `false`. |

### Exports

| Name | Description |
| --- | --- |
| `ACTION_RESULT_STATUS_MAP` | `statusMap` for the usual Result column: `Success` green, `Failed` red. |

The component is generic: `ActionsResponseModalV1Component<T>`. Typing the columns as `SimpleTableColumn<YourRow>[]` makes a mistyped `key` a compile error.

---

## 4. Columns

`columns` takes the same `SimpleTableColumn` objects as data-table-v1's `app-simple-table` — see `DATA-TABLE-V1-GUIDE.en.md` §4 for every field. The ones a result table usually needs:

| Field | Use |
| --- | --- |
| `key` | Property of the row to show. |
| `label` | Header text. |
| `width` | A **relative weight**, not px: `app-simple-table` turns it into `Wfr`, so the columns share the modal's width in proportion. A column without `width` counts as `1fr` and is squeezed next to columns weighted 100+ — **give every column a width**. |
| `cellType` | How the cell renders. Default is plain text. |
| `statusMap` | Value → label and colour, for `statusTag` / `tag` / `tagList`. |

### Cell types supported by `app-simple-table`

| `cellType` | Renders |
| --- | --- |
| *(none)* / `text` | Plain text; `null` / `undefined` shows `-`. |
| `statusTag` | Coloured status tag from `statusMap`. Use for Result. |
| `tag` | Tag from `statusMap`. |
| `tagList` | A `string[]` as tags. Tags that do not fit the column collapse into a "+N More" badge; hovering it lists the rest. **Pass a `statusMap`** — a value missing from it renders as uncoloured text, not a tag. |
| `timestamp` | Date, `yyyy-MM-dd HH:mm:ss` unless `dateFormat` is set. |
| `ip` | IP address. |
| `number` | Number; `null` shows `-`. |
| `taskStatus`, `progress` | As in data-table-v1. |

`link`, `redirect`, `icon` and `switch` are **not** rendered by `app-simple-table`; they fall back to plain text. A result table has no use for them.

---

## 5. The Result Column

Most result tables have a Result column whose value the backend answers per item. When it answers `Success` / `Failed`, use the shared map:

```ts
{ key: 'result', label: 'Result', cellType: 'statusTag', statusMap: ACTION_RESULT_STATUS_MAP }
```

When the API uses other words, pass your own map on that column. Do not change the shared one:

```ts
const TASK_RESULT_MAP: Record<string, StatusDef> = {
  Completed: { label: 'Completed', colorType: 'green' },
  Error: { label: 'Error', colorType: 'red' },
}
```

A Reason column next to it usually shows the error message for failed items and `-` for the rest.

---

## 6. Opening and Closing

**The caller owns `visible`.** The modal never closes itself: it emits `closed`, and the page sets its own signal back to `false`.

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

If the page needs to do something after the user has seen the result (reload the list, clear the selection), do it in the same `(closed)` handler.

Clicking outside the modal does not close it: results are something the user should read before moving on.

---

## 7. Building the Rows from a Batch Call

When the action is one request per item, collect every outcome — success or failure — before opening the modal. Catch each request's error so one failure does not cancel the rest:

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

When the backend answers the batch in one response with a result per item, map that response to rows instead.

---

## 8. Limitations

- **No paging, filter, sort or selection.** A result list is read once. If it needs any of these, it is not a result list.
- **No action buttons inside the modal.** Actions that follow the result belong on the page.
- **The table grows with the rows** and the modal scrolls. There is no fixed table height.
- **No `link` / `redirect` cells.** `app-simple-table` has no click handling.

### When you need more

Do **not** grow this component into a wrapper around `app-data-table-v1`. Its API would have to pass through every table option, and it would stop being the simple title + columns + rows it is.

- **One or two pages need an interaction** (link / redirect, sort, paging): build that modal on the page with `scc-modal` + `scc-card-title` + `app-data-table-v1`. Admin's Edit Role result modal is an example.
  It is not much code, and every data-table-v1 feature (link / redirect via `linkHandler`, sort, paging, custom cell templates) is available. Turn the table's toolbar off so it still reads as a result list, and give the table 20px padding under the title like the other modals:

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
  // An arrow function, so `this` still points at the page when the table calls it.
  protected readonly openSystem = (row: PowerOnResult): void => { /* navigate to the system */ }
  ```

- **Most result modals need the same small feature**: add it to `app-simple-table`, as was done for `tagList`, and this modal gets it for free. **Talk to Clover (@CloverH) before changing `app-simple-table`** — it is a shared design-system component, used outside this modal too (e.g. PDU).

---

## 9. Testing

`scc-modal` renders into the CDK overlay, **outside the fixture**, so read `document.body`, not `fixture.nativeElement`. The modal's close icon needs `angular-svg-icon`:

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

To test that the page reacts to closing, emit `scOnCancel` on the inner `SCCModalComponent` (found with `By.directive`) rather than clicking the close icon.

Storybook: **Design System / Global Component / Actions Response Modal V1**.
