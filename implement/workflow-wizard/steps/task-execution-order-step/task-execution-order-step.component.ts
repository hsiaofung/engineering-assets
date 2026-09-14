import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { getErrorMessageFromControl, isInvalidControl } from '@app/core-modules-scc4/task/work-flow/utils/form-utils'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { TaskService } from './task.service'

/**
 * Task Execution Order Step Component
 *
 * Allows users to select a task and define its execution order
 * within the workflow wizard.
 */
@Component({
  selector: 'app-task-execution-order-step',
  imports: [FormsModule, ReactiveFormsModule, NzSelectModule, CommonModule],
  styleUrls: ['./task-execution-order-step.component.scss'],
  templateUrl: './task-execution-order-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskExecutionOrderStepComponent {
  /**
   * Reactive form provided by the wizard.
   */
  readonly form = input.required<FormGroup>()

  availableTasks$ = inject(TaskService).getTasks()

  private readonly VALIDATION_MESSAGES: Record<string, Record<string, string>> = {
    tasks: {
      required: 'The field is required.',
    },
  }

  /**
   * Returns the FormArray containing selected tasks.
   * @returns {FormArray<FormControl<number | null>>} The FormArray of selected tasks
   */
  get tasks(): FormArray<FormControl<number | null>> {
    return this.form().get('tasks') as FormArray<FormControl<number | null>>
  }

  /**
   * Adds a new task selection row.
   */
  addTask(): void {
    this.tasks.push(new FormControl<number | null>(null, Validators.required))
  }

  /**
   * Removes a task selection row.
   * @param {number} index Index of the task to remove
   */
  removeTask(index: number): void {
    this.tasks.removeAt(index)
  }

  /**
   *
   * @param {number} i - The index of the task control to check for validity
   * @returns {boolean} True if the control is invalid, false otherwise
   */
  isInvalid(i: number): boolean {
    return isInvalidControl(this.tasks.at(i))
  }
  /**
   *
   * @param {number} i - The index of the task control to check for errors
   * @returns {string} Error message or empty string
   */
  getErrorMessage(i: number): string {
    return getErrorMessageFromControl(this.tasks.at(i), this.VALIDATION_MESSAGES['tasks'])
  }
}
