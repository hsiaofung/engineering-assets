import { HttpClient } from '@angular/common/http'
import { Component, inject, ViewChild } from '@angular/core'
import { DataLoaderComponent } from '@app/shared/components/data-loader/data-loader.component'
import {
  DataTableV1Component,
  PageChangeEvent,
  SortChangeEvent,
  TableColumnDirective,
  TablePaginationComponent,
} from '@app/shared/design-system/global-component/data-table-v1'
import { SEVERITY_STATUS_MAP } from '@app/shared/design-system/global-component/data-table-v1/models/status-tag-presets'
import { NzCardComponent } from 'ng-zorro-antd/card'
import { mapEventTimeToDateRange, skipNull } from './adapters/audit-log-filter.adapter'
import {
  AuditLogResponse,
  CATEGORY_OPTIONS,
  DEFAULT_AUDIT_LOG_PARAMS,
  FilterParams,
  SEVERITY_OPTIONS,
  TableParams,
} from './models/audit-log.model'
import { toUI } from './services/audit-log.mapper'
import { getMockAuditLogData } from './services/mock-data.service'

/**
 *
 */
@Component({
  selector: 'app-audit-log-page',
  imports: [NzCardComponent, DataTableV1Component, DataLoaderComponent, TableColumnDirective, TablePaginationComponent],
  template: `
    <nz-card class="datatable-card">
      <app-data-loader #loader="dataLoader" [getFn]="getDataFn">
        <app-data-table-v1
          #dataTable
          [data]="loader.data()?.items ?? []"
          [loading]="loader.isLoading()"
          [showFilter]="true"
          [showReload]="true"
          (sortChange)="onSortChange($event)"
          [defaultSort]="{ column: 'eventTime', direction: 'desc' }"
          (reload)="onReload()"
          (filterChange)="onFilterChange($event)"
        >
          <app-table-column
            key="severity"
            label="Severity"
            cellType="statusTag"
            [statusMap]="severityStatusMap"
            [filterable]="true"
            filterType="select"
            [filterOptions]="severityStatusOptions"
            [width]="108"
          />
          <app-table-column
            key="eventTime"
            label="Timestamp"
            cellType="timestamp"
            [sortable]="true"
            [filterable]="true"
            filterType="dateRange"
            [width]="160"
          />
          <app-table-column key="username" label="User" [filterable]="true" filterType="text" [width]="165" />
          <app-table-column key="id" label="ID" [filterable]="true" filterType="text" [width]="80" />
          <app-table-column key="ipAddress" label="Source IP" [filterable]="true" filterType="text" [width]="132" />
          <app-table-column
            key="category"
            label="Category"
            [filterable]="true"
            filterType="select"
            [filterOptions]="categoryOptions"
            [width]="140"
          />
          <app-table-column key="subcategory" label="Subcategory" [filterable]="true" filterType="text" [width]="140" />
          <app-table-column key="deviceType" label="Device Type" [filterable]="true" filterType="text" [width]="140" />
          <app-table-column key="errorCode" label="Error Code" [filterable]="true" filterType="text" [width]="124" />
          <app-table-column key="message" label="Message" [filterable]="true" filterType="text" [width]="329" />
          <app-table-pagination
            mode="server"
            [pageSize]="loader.data()?.perPage ?? 10"
            [totalItems]="loader.data()?.totalCount ?? 0"
            [currentPage]="loader.data()?.page ?? 1"
            (pageChange)="onPageChange($event)"
          />
        </app-data-table-v1>
      </app-data-loader>
    </nz-card>
  `,
})
export class AuditLogPageComponent {
  http = inject(HttpClient)
  getMockData = () => getMockAuditLogData()
  severityStatusMap = SEVERITY_STATUS_MAP
  severityStatusOptions = SEVERITY_OPTIONS
  categoryOptions = CATEGORY_OPTIONS
  queryParams: TableParams = { ...DEFAULT_AUDIT_LOG_PARAMS }

  @ViewChild('loader') loader!: DataLoaderComponent<AuditLogResponse>
  getDataFn = () =>
    this.http
      .get<AuditLogResponse>('/log-service/v1/audit_log', {
        params: { ...this.queryParams },
      })
      .pipe(toUI())

  // ==================== Event Handlers ====================
  onReload = (): void => {
    this.queryParams = { ...DEFAULT_AUDIT_LOG_PARAMS }
    this.loader?.refresh()
  }

  onSortChange = ({ column, direction }: SortChangeEvent): void => {
    this.queryParams = {
      ...this.queryParams,
      page: 1,
      sort: column || 'eventTime',
      direction: direction || 'desc',
    }

    this.loader?.refresh()
  }

  onPageChange = ({ currentPage, pageSize }: PageChangeEvent): void => {
    this.queryParams = {
      ...this.queryParams,
      page: currentPage,
      perPage: pageSize,
    }
    this.loader?.refresh()
  }

  onFilterChange = ({ filters }: FilterParams): void => {
    const nextParams: TableParams = {
      ...this.queryParams,
      page: 1, // reset to first page on filter change
      ...filters, // merge new filters into table params
    }
    const cleanParams: TableParams = mapEventTimeToDateRange(skipNull(nextParams)) //呼叫 adapter to map eventTime to startTime and endTime
    this.queryParams = cleanParams // update table params
    this.loader?.refresh() // refresh table with new filters
  }
}
