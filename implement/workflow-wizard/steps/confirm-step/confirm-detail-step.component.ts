import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BorderBoxComponent } from '@app/shared/design-system/global-component/border-box/border-box.component'
import { DataTableV1Component, StatusDef } from '@app/shared/design-system/global-component/data-table-v1'
import { TableColumnDirective } from '@app/shared/design-system/global-component/data-table-v1/column/table-column.directive'
import { WizardService } from '../../workflow-wizard.service'

import { stateStatusMap } from '@app/core-modules-scc4/task/work-flow/config/work-flow.config'
import { StatusType } from '@app/core-modules-scc4/task/work-flow/directives/status-map-directive/status-def'
import { StatusMapDirective } from '@app/core-modules-scc4/task/work-flow/directives/status-map-directive/status-map.directive'
import { TaskService } from '../task-execution-order-step/task.service'
import { TaskTableData } from './confirm-detail.model'

export interface WorkflowWizardData {
  general: {
    workflowName: string
    description: string
  }
  taskExecutionOrder: {
    tasks: string
  }
  schedule: {
    scheduleType: 'now' | 'future'
    state: string
    scheduleTime: Date | null
  }
}

export const scheduleTypeStatusMap: Record<string, StatusDef> = {
  now: { label: 'Now', colorType: StatusType.Purple },
  future: { label: 'Future', colorType: StatusType.Orange },
}

/**
 * Component for the confirm detail step in the workflow wizard, displaying a summary of all user inputs from previous steps for final confirmation before submission.
 * It retrieves the data from the wizard service and displays it in a read-only format, including a table for the selected tasks with their execution order.
 */
@Component({
  selector: 'app-confirm-detail-step',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BorderBoxComponent,
    DatePipe,
    DataTableV1Component,
    TableColumnDirective,
    StatusMapDirective,
  ],
  styleUrls: ['./confirm-detail-step.component.scss'],
  template: `
    <scc-border-box [title]="'General'">
      <div class="form-row">
        <div class="form-item">
          <label class="confirm-label">Workflow Name</label>
          <p class="confirm-value">{{ wizardData.general.workflowName }}</p>
        </div>
        <div class="form-item">
          <label class="confirm-label">Description</label>
          <p class="confirm-value">{{ wizardData.general.description }}</p>
        </div>
      </div>
    </scc-border-box>

    <scc-border-box [title]="'Task Execution Order'">
      <app-data-table-v1
        #dataTable
        [data]="tableData()"
        [showFilter]="false"
        [showReload]="false"
        [showDisplay]="false"
      >
        <app-table-column key="executionOrder" label="Execution Order" />
        <app-table-column key="name" label="Name" />
        <app-table-column key="jobTemplateId" label="Task Template" />
        <app-table-column key="description" label="Description" />
      </app-data-table-v1>
    </scc-border-box>

    <scc-border-box [title]="'Schedule'">
      <div class="form-row">
        <div class="form-item">
          <label class="confirm-label">Execution Type</label>
          <p class="confirm-value w-fit text-center" [sccStatusMap]="scheduleTypeStatusMap">
            {{ wizardData.schedule.scheduleType }}
          </p>
        </div>
        <div class="form-item">
          <label class="confirm-label">State</label>
          <p class="confirm-value w-fit" [sccStatusMap]="stateStatusMap">{{ wizardData.schedule.state }}</p>
        </div>
        <div class="form-item">
          <label class="confirm-label">Schedule Time</label>
          <p class="confirm-value">{{ (wizardData.schedule.scheduleTime | date: 'yyyy/MM/dd HH:mm') || 'Now' }}</p>
        </div>
      </div>
    </scc-border-box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDetailStepComponent implements OnInit {
  @Input() form!: FormGroup
  tableData = signal<TaskTableData[]>([])

  private wizardService = inject(WizardService)
  wizardData!: WorkflowWizardData
  selectedTasks: TaskTableData[] = []

  private taskService = inject(TaskService)
  scheduleTypeStatusMap = scheduleTypeStatusMap
  stateStatusMap = stateStatusMap

  /**
   *
   */
  ngOnInit(): void {
    this.wizardData = this.wizardService.getAllFormData()

    const taskIds: number[] = this.wizardService.getForm('taskExecutionOrder').get('tasks')?.value ?? []

    this.taskService.getTasks().subscribe((tasks) => {
      const taskMap = new Map(tasks.map((t) => [t.id, t]))

      this.selectedTasks = taskIds
        .map((id, index) => {
          const task = taskMap.get(id)
          return task ? { ...task, executionOrder: index + 1 } : null
        })
        .filter((t): t is TaskTableData => t !== null)
      this.tableData.set(this.selectedTasks)
    })
  }
}
