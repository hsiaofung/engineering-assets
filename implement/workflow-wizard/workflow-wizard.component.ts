import { NgClass, NgComponentOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core'
import { FormGroup, FormsModule } from '@angular/forms'
import { WizardItemComponent } from '@app/shared/design-system/global-component/wizard/wizard-item/wizard-item.component'
import { DSWizardItemStatus } from '@app/shared/design-system/global-component/wizard/wizard-item/wizard-item.interface'
import { WizardComponent } from '@app/shared/design-system/global-component/wizard/wizard.component'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzStepsModule } from 'ng-zorro-antd/steps'
import { WizardState } from '../../models/work-flow.model'
import { WizardConfig, WizardStep } from './workflow-wizard.model'
import { WizardService } from './workflow-wizard.service'

/**
 *
 */
@Component({
  selector: 'app-workflow-wizard',
  imports: [
    NzModalModule,
    FormsModule,
    NzStepsModule,
    WizardComponent,
    WizardItemComponent,
    NgComponentOutlet,
    NgClass,
  ],
  templateUrl: './workflow-wizard.component.html',
  styleUrl: './workflow-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowWizardComponent implements OnInit {
  readonly wizardService = inject(WizardService)
  readonly closeWizard = output<void>()
  readonly config = input.required<WizardConfig>()
  readonly submitRequested = output<WizardState>()

  /** Signals, not plain fields: both are template-bound and both are written from handlers. */
  readonly isVisible = signal(false)
  readonly currentStep = signal(0)
  DSWizardItemStatus = DSWizardItemStatus

  workflowName = ''
  description = ''
  selectedTasks: string[] = []
  scheduleType = ''
  scheduleTime = ''

  /**
   * Initializes the component and sets up the wizard service with the provided config.
   */
  ngOnInit(): void {
    this.wizardService.init(this.config())
  }

  /**
   * Wizard steps configuration list.
   * @returns {WizardStep[]} Array of wizard step definitions
   */
  get steps(): WizardStep[] {
    return this.wizardService.getSteps()
  }

  /**
   * Get the status of a step based on its index.
   * @param {number} index The step index
   * @returns {DSWizardItemStatus} The status of the step (finish, process, or wait)
   */
  getStatus(index: number): DSWizardItemStatus {
    if (index < this.currentStep()) {
      return DSWizardItemStatus.finish
    }
    if (index === this.currentStep()) {
      return DSWizardItemStatus.process
    }
    return DSWizardItemStatus.wait
  }

  /**
   * Opens the workflow wizard and resets it to the first step.
   * @returns {void}
   */
  openWizard() {
    this.isVisible.set(true)
    this.currentStep.set(0)
  }

  /**
   * Closes the wizard modal and emits the close event.
   * @returns {void}
   */
  closeWizardModal() {
    this.isVisible.set(false)
    this.closeWizard.emit()
  }

  /**
   * Advances to the next step in the wizard if not at the last step.
   * @returns {void}
   */
  next() {
    if (this.currentStep() < 3) {
      this.currentStep.update((step) => step + 1)
    }
  }

  /**
   * Goes back to the previous step in the wizard if not at the first step.
   * @returns {void}
   */
  prev() {
    if (this.currentStep() > 0) {
      this.currentStep.update((step) => step - 1)
    }
  }

  /**
   * Submits the wizard data and logs the result.
   * @returns {void}
   */
  submit(): void {
    this.submitRequested.emit(this.wizardService.getAllFormData())
    this.isVisible.set(false)
  }

  /**
   * Updates the selected tasks list based on checkbox state.
   * @param {string} taskId The task identifier
   * @param {boolean} checked Whether the task is selected
   * @returns {void}
   */
  onTaskChange(taskId: string, checked: boolean) {
    if (checked) {
      this.selectedTasks.push(taskId)
    } else {
      this.selectedTasks = this.selectedTasks.filter((id) => id !== taskId)
    }
  }

  /**
   * Gets the current form group.
   * @returns {FormGroup} The current form group
   */
  get currentForm(): FormGroup {
    return this.wizardService.getForm(this.steps[this.currentStep()].id)
  }
}
