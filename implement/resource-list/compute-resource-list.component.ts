import { HttpClient, HttpParams } from '@angular/common/http'
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core'
import { Router } from '@angular/router'
import { DataLoaderPollDirective } from '@app/shared/design-system/global-component/data-loader-poll/data-loader-poll.directive'
import { DataLoaderComponent } from '@app/shared/design-system/global-component/data-loader/data-loader.component'
import { createDataTableState } from '@app/shared/design-system/global-component/data-table-state/create-data-table-state'
import {
  CONNECTION_STATE_STATUS_MAP,
  HEALTH_STATUS_MAP,
  POWER_STATE_STATUS_MAP,
  SelectionChangeEvent,
  TableColumnDirective,
  TablePaginationComponent,
} from '@app/shared/design-system/global-component/data-table-v1'
import { DataTableV1Component } from '@app/shared/design-system/global-component/data-table-v1/data-table-v1.component'
import { InfoTooltipComponent } from '@app/shared/design-system/global-component/tooltip/info-tooltip/info-tooltip.component'
import { environment } from '@environment/environment'
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip'
import { Observable } from 'rxjs'
import { appendFilterParams } from '../../api/append-filter-params'
import { computeApiURL } from '../../api/compute-api-url'
import { FILTER_OPERATOR } from '../../api/filter-operator'
import { toUI } from '../../mapper/compute-system-mapper'
import {
  ComputeSystemsResponse,
  ComputeSystemsUiResponse,
  ComputeSystemUiItem,
} from '../../model/compute-systems-model'
import { ComputeSelectionContext } from '../../selection/compute-selection-context.model'
import { ComputeSelectionService } from '../../selection/compute-selection.service'

/**
 *
 */
@Component({
  selector: 'app-compute-resource-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataLoaderComponent,
    DataLoaderPollDirective,
    DataTableV1Component,
    TableColumnDirective,
    TablePaginationComponent,
    InfoTooltipComponent,
    NzTooltipDirective,
  ],
  templateUrl: './compute-resource-list.component.html',
  styleUrl: './compute-resource-list.component.scss',
})
export class ComputeResourceListComponent {
  protected readonly selectionService = inject(ComputeSelectionService)
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)

  readonly selectionChange = output<SelectionChangeEvent<unknown>>()

  readonly HEALTH_STATUS_MAP = HEALTH_STATUS_MAP
  readonly POWER_STATE_STATUS_MAP = POWER_STATE_STATUS_MAP
  readonly CONNECTION_STATE_STATUS_MAP = CONNECTION_STATE_STATUS_MAP

  readonly tableState = createDataTableState({
    sort: { column: 'location', direction: 'asc' },
  })
  readonly filterState = this.tableState.filterState
  readonly sortState = this.tableState.sortState
  readonly page = this.tableState.page
  readonly pageSize = this.tableState.pageSize

  protected readonly fetchIntervalMs = environment.API_V1_FETCH_INTERVAL

  hasApiError = signal<boolean>(false)

  /**
   * Invoked by DataLoader.loadEffect in a reactive context.
   * Reads of selected() / sortState / page / filterState are tracked,
   * so those changes refetch without refresh().
   * Returns a function that fetches systems using the current tree selection.
   * @returns {() => Observable<ComputeSystemsUiResponse>} A function that fetches systems.
   */
  readonly getSystems: () => Observable<ComputeSystemsUiResponse> = () => {
    const selection = this.selectionService.selected()

    if (!selection) {
      throw new Error('Compute selection is not ready')
    }

    return this.http
      .get<ComputeSystemsResponse>(computeApiURL.systems, {
        params: this.buildQueryParams(selection),
      })
      .pipe(toUI())
  }

  /**
   * Builds the system API query parameters based on the selected tree context.
   * @param {ComputeSelectionContext} selection - The selected tree context.
   * @returns {HttpParams} The constructed HTTP query parameters.
   */
  private buildQueryParams(selection: ComputeSelectionContext): HttpParams {
    let params = new HttpParams()
      .set('sort', this.sortState().column ?? 'location')
      .set('direction', this.sortState().direction ?? 'asc')
      .set('page', this.page().toString())
      .set('perPage', this.pageSize().toString())

    params = appendFilterParams(this.filterState(), params)

    switch (selection.kind) {
      case 'virtual-pool':
        return params.set('unassigned', 'true')
      case 'physical-pool':
        return params.set('unassigned', 'false')
      case 'row':
        return params.set('row', `${FILTER_OPERATOR.ILIKE}.${selection.name}`)
      case 'rack':
        return params.set('rack', `${FILTER_OPERATOR.EQ}.${selection.name}`)
      case 'drawer':
        return params.set('drawer', `${FILTER_OPERATOR.EQ}.${selection.parentName}:${selection.name}`)
      default:
        return params
    }
  }

  /**
   * Handles selection change events from the data table.
   * Updates the currently selected items.
   * @param {SelectionChangeEvent} _event - The selection change event containing the selected items.
   */
  onSelectionChange(_event: SelectionChangeEvent<unknown>): void {
    this.selectionChange.emit(_event)
  }

  onIpAddressClick = ({ id: systemId }: ComputeSystemUiItem): void => {
    this.router.navigate(['/compute/resource', systemId])
  }

  onTaskClick = ({ taskExecutionId }: ComputeSystemUiItem): void => {
    this.router.navigate(['/task', taskExecutionId, 'execution-history'])
  }
}
