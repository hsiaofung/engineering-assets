import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { SCCCardTitleComponent } from '../card-title/card-title.component'
import { SimpleTableComponent, type SimpleTableColumn, type StatusDef } from '../data-table-v1'
import { SCCModalComponent } from '../modal/modal.component'
import { SCModalSizeEnum } from '../modal/modal.interface'

/**
 * The `statusMap` for the usual Result column: the backend answers `Success` or `Failed` per item.
 * Callers whose API uses other words pass their own map on that column instead. Read-only: it is
 * shared by every caller, so a change here would recolour every result modal.
 */
export const ACTION_RESULT_STATUS_MAP: Readonly<Record<string, StatusDef>> = {
  Success: { label: 'Success', colorType: 'green' },
  Failed: { label: 'Failed', colorType: 'red' },
}

/**
 * The modal that reports the per-item result of an action — "Execution Result of …".
 *
 * A title and a read-only table, nothing else. The caller decides everything about the rows: which
 * columns, which status map, what a row is. The component knows no module, which is what lets
 * Compute, Admin and Task share it. It replaces the 3.x `actions-response-modal`, whose registry of
 * 3.x response types (allocate, composed nodes, password CSV) is gone with it.
 *
 * The table is data-table-v1's `app-simple-table`: a result list needs no toolbar, filter or paging.
 */
@Component({
  selector: 'app-actions-response-modal-v1',
  imports: [SCCModalComponent, SCCCardTitleComponent, SimpleTableComponent],
  template: `
    <scc-modal [scSize]="size()" [scVisible]="visible()" [scMaskClosable]="false" (scOnCancel)="closed.emit()">
      <div class="arm-v1">
        <scc-card-title [scLabel]="title()" />
        <div class="arm-v1__table">
          <app-simple-table [data]="data()" [columns]="columns()" />
        </div>
      </div>
    </scc-modal>
  `,
  styles: `
    // 20px under the title, matching the other design-system modals.
    .arm-v1__table {
      padding: 20px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsResponseModalV1Component<T extends object = Record<string, unknown>> {
  /** Modal title, e.g. "Execution Result of Add User". */
  readonly title = input.required<string>()
  /** One row per item the action touched. */
  readonly data = input<T[]>([])
  /** The table's columns; see `ACTION_RESULT_STATUS_MAP` for the usual Result column. */
  readonly columns = input.required<SimpleTableColumn<T>[]>()
  readonly visible = input<boolean>(false)
  readonly size = input<keyof typeof SCModalSizeEnum>('small')

  /** The user closed the modal. The caller owns `visible` and sets it back to `false`. */
  readonly closed = output<void>()
}
